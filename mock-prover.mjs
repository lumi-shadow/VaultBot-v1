#!/usr/bin/env node
/**
 * Tiny mock of `tachyon-prover-server` for previewing the dashboard
 * locally without needing a GPU + BitNet daemon + devnet RPC.
 *
 * Serves the same endpoints the real server exposes:
 *
 *   GET  /healthz                                — "ok"
 *   GET  /jobs                                   — list of canned + live jobs
 *   GET  /jobs/:id                               — single job
 *   GET  /events                                 — SSE stream
 *   GET  /jobs/:id/layer/:idx/wrap               — fake 256-byte proof
 *   GET  /jobs/:id/layer/:idx/public_inputs      — fake public inputs
 *   POST /infer                                  — kicks off a fake inference
 *
 * Spawns one background "in-flight" job that progresses through
 * proving → submitting → verified_onchain over ~90 s, so the dashboard
 * shows the live verification animation in real time.
 *
 * Run:
 *
 *     node scripts/mock-prover.mjs
 *
 * Then start the dashboard:
 *
 *     cd packages/agent-dashboard && npm run dev
 *
 * Open http://localhost:3000.
 */

import { createServer } from "node:http";
import crypto from "node:crypto";

const PORT = parseInt(process.env.MOCK_PORT ?? "7878", 10);

// ---------- canned data + state ----------

/** @typedef {{
 *   job_id: string;
 *   phase: "queued" | "proving" | "submitting" | "verified_onchain" | "failed";
 *   regime: string;
 *   decision: string;
 *   input_hash: string;
 *   output_hash: string;
 *   session_id: string;
 *   layers_verified: number;
 *   total_layers: number;
 *   layer_tx_signatures: string[];
 *   finalize_tx: string | null;
 *   error_message: string | null;
 *   created_at_unix_ms: number;
 *   updated_at_unix_ms: number;
 * }} JobStatus */

/** @type {Map<string, JobStatus>} */
const jobs = new Map();

/** @type {Set<import('node:http').ServerResponse>} */
const sseClients = new Set();

const PROGRAM_PUBKEY_FAKE = "2M4KyGePCjXtcr4jkcwHKJExjQXKdCbMAoziG2Lw2GB2";

function hex32(seed) {
  return "0x" + crypto.createHash("sha256").update(seed).digest("hex");
}
function fakeSig(seed) {
  // 88-char base58-ish (we just want it to LOOK like a Solana signature
  // — clicking will go to Solscan with a 404, fine for local preview).
  return crypto
    .createHash("sha256")
    .update(seed)
    .digest()
    .toString("base64")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 88);
}
function fakeJobId() {
  // UUID v4-ish.
  return crypto.randomUUID();
}

/** Insert + broadcast a job. */
function upsert(job) {
  job.updated_at_unix_ms = Date.now();
  jobs.set(job.job_id, job);
  const frame = `event: job\ndata: ${JSON.stringify(job)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(frame);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Seed three completed jobs + one failed so the dashboard isn't empty
// on first paint.
function seed() {
  const baseTs = Date.now() - 1000 * 60 * 30; // 30 min ago

  const completed = [
    {
      regime: "live",
      decision: "SWAP_TO_SOL",
      seed: "swap-1",
      tsOffset: -1000 * 60 * 25,
    },
    {
      regime: "live",
      decision: "HOLD",
      seed: "hold-1",
      tsOffset: -1000 * 60 * 18,
    },
    {
      regime: "live",
      decision: "SWAP_TO_USDC",
      seed: "swap-2",
      tsOffset: -1000 * 60 * 8,
    },
  ];

  for (const c of completed) {
    const job_id = fakeJobId();
    const input_hash = hex32(`${c.seed}:in`);
    const output_hash = hex32(`${c.seed}:out`);
    const session_id = hex32(`${c.seed}:sid`);
    const ts = Date.now() + c.tsOffset;
    upsert({
      job_id,
      phase: "verified_onchain",
      regime: c.regime,
      decision: c.decision,
      input_hash,
      output_hash,
      session_id,
      layers_verified: 30,
      total_layers: 30,
      layer_tx_signatures: Array.from({ length: 30 }, (_, i) =>
        fakeSig(`${c.seed}:layer:${i}`),
      ),
      finalize_tx: fakeSig(`${c.seed}:finalize`),
      error_message: null,
      created_at_unix_ms: ts,
      updated_at_unix_ms: ts + 90_000,
    });
  }

  // One failed job — illustrates the error state.
  const failedId = fakeJobId();
  upsert({
    job_id: failedId,
    phase: "failed",
    regime: "live",
    decision: "SWAP_TO_SOL",
    input_hash: hex32("failed-1:in"),
    output_hash: hex32("failed-1:out"),
    session_id: hex32("failed-1:sid"),
    layers_verified: 18,
    total_layers: 30,
    layer_tx_signatures: Array.from({ length: 18 }, (_, i) =>
      fakeSig(`failed-1:layer:${i}`),
    ),
    finalize_tx: null,
    error_message:
      "submit_layer_proof layer 18 timed out after 45s; RPC reported AccountInUse",
    created_at_unix_ms: Date.now() - 1000 * 60 * 13,
    updated_at_unix_ms: Date.now() - 1000 * 60 * 12,
  });
}

/**
 * Spawn an in-flight job and animate it through the verify pipeline
 * over ~90 seconds. Lets the dashboard demo the live progress UI.
 */
function startLiveJob() {
  const seed = `live-${Date.now()}`;
  const job_id = fakeJobId();
  const job = {
    job_id,
    phase: "proving",
    regime: "live",
    decision: pickOne(["SWAP_TO_SOL", "SWAP_TO_USDC", "HOLD"]),
    input_hash: hex32(`${seed}:in`),
    output_hash: hex32(`${seed}:out`),
    session_id: hex32(`${seed}:sid`),
    layers_verified: 0,
    total_layers: 30,
    layer_tx_signatures: [],
    finalize_tx: null,
    error_message: null,
    created_at_unix_ms: Date.now(),
    updated_at_unix_ms: Date.now(),
  };
  upsert(job);

  // Phase 1: ~30 s of "proving" with no layers landing yet.
  setTimeout(() => {
    job.phase = "submitting";
    upsert(job);
  }, 30_000);

  // Phase 2: 30 layer txs over ~60 s, ~2 s apart.
  let nextLayer = 0;
  const interval = setInterval(() => {
    if (nextLayer >= 30) {
      clearInterval(interval);
      job.finalize_tx = fakeSig(`${seed}:finalize`);
      job.phase = "verified_onchain";
      upsert(job);
      // Schedule another live job in 30 s so the demo never goes stale.
      setTimeout(startLiveJob, 30_000);
      return;
    }
    job.layer_tx_signatures.push(fakeSig(`${seed}:layer:${nextLayer}`));
    job.layers_verified = nextLayer + 1;
    upsert(job);
    nextLayer += 1;
  }, 2000);
}

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- HTTP plumbing ----------

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json",
    ...corsHeaders(),
  });
  res.end(JSON.stringify(body));
}

function sendBytes(res, status, bytes, contentType = "application/octet-stream") {
  res.writeHead(status, {
    "content-type": contentType,
    "content-length": String(bytes.length),
    ...corsHeaders(),
  });
  res.end(bytes);
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method ?? "GET";

  if (method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  if (path === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain", ...corsHeaders() });
    res.end("ok");
    return;
  }

  if (method === "GET" && path === "/jobs") {
    const list = [...jobs.values()].sort(
      (a, b) => b.created_at_unix_ms - a.created_at_unix_ms,
    );
    sendJson(res, 200, list);
    return;
  }

  // /jobs/:id
  const jobMatch = path.match(/^\/jobs\/([^\/]+)$/);
  if (method === "GET" && jobMatch) {
    const job = jobs.get(jobMatch[1]);
    if (!job) {
      sendJson(res, 404, { error: "job not found" });
      return;
    }
    sendJson(res, 200, job);
    return;
  }

  // /jobs/:id/layer/:idx/{wrap,public_inputs}
  const layerMatch = path.match(/^\/jobs\/([^\/]+)\/layer\/(\d+)\/(wrap|public_inputs)$/);
  if (method === "GET" && layerMatch) {
    const [, jobId, idxStr, kind] = layerMatch;
    if (!jobs.has(jobId)) {
      sendJson(res, 404, { error: "job not found" });
      return;
    }
    const seed = `${jobId}:${kind}:${idxStr}`;
    const len = kind === "wrap" ? 256 : 800;
    const bytes = Buffer.alloc(len);
    let off = 0;
    let counter = 0;
    while (off < len) {
      const chunk = crypto
        .createHash("sha256")
        .update(`${seed}:${counter++}`)
        .digest();
      const n = Math.min(chunk.length, len - off);
      chunk.copy(bytes, off, 0, n);
      off += n;
    }
    sendBytes(res, 200, bytes);
    return;
  }

  if (method === "GET" && path === "/events") {
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      "connection": "keep-alive",
      ...corsHeaders(),
    });
    // Send a comment-frame ping every 15 s so the EventSource stays alive.
    const ping = setInterval(() => res.write(":ping\n\n"), 15_000);
    sseClients.add(res);
    req.on("close", () => {
      clearInterval(ping);
      sseClients.delete(res);
    });
    return;
  }

  if (method === "POST" && path === "/infer") {
    // Read + ignore body; just kick off another live job and respond.
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      startLiveJob();
      const seed = `live-${Date.now()}-onhook`;
      sendJson(res, 200, {
        job_id: fakeJobId(),
        input_hash: hex32(`${seed}:in`),
        output_hash: hex32(`${seed}:out`),
        session_id: hex32(`${seed}:sid`),
        decision: "SWAP_TO_SOL",
        wall_ms_inference: 1_820,
      });
    });
    return;
  }

  sendJson(res, 404, { error: "not found" });
});

seed();
startLiveJob();
server.listen(PORT, "127.0.0.1", () => {
  // eslint-disable-next-line no-console
  console.log(`[mock-prover] listening on http://127.0.0.1:${PORT}`);
  console.log(
    `[mock-prover] seeded ${jobs.size} jobs; one in-flight job animates over ~90s`,
  );
  console.log(`[mock-prover] open the dashboard against this server:`);
  console.log(`[mock-prover]   cd packages/agent-dashboard && NEXT_PUBLIC_PROVER_URL=http://127.0.0.1:${PORT} npm run dev`);
});
