# Tachyon Prover Server — HTTP API

Stable contract as of 2026-05-06. Anything in this doc is **locked** —
new fields/endpoints may be added (they'll be additive) but existing
shapes won't change incompatibly.

The canonical TypeScript types live in
[`agent-dashboard/lib/proverClient.ts`](./agent-dashboard/lib/proverClient.ts).
Treat that file as the source of truth; this doc is the human reference.

---

## Base URL

- **Local mock:** `http://127.0.0.1:7878`
- **Devnet (TBD):** something like `https://prover.lmns.fi`

All endpoints are JSON in / JSON out, except the binary artefact endpoints
that return `application/octet-stream`.

CORS: `Access-Control-Allow-Origin: *` is set so a frontend on any host
can read the prover.

---

## Endpoints

### `GET /healthz`

Liveness check. Returns `200 ok` (text/plain) if the server is up.

```
curl http://127.0.0.1:7878/healthz
→ ok
```

---

### `POST /infer`

Kick off one verified inference. The server runs BitNet, hashes the
I/O, derives the on-chain `session_id`, spawns the proof job in the
background, and returns immediately. Use the returned `job_id` to poll.

**Request:**

```json
{
  "system_prompt": "You manage a Solana treasury holding USDC and SOL.",
  "user_prompt":   "SOL/USD = 200. Decide.",
  "max_new_tokens": 4,
  "agent_pubkey":   "7cEXSgQE6nqsQme4m9KKeiZxQVqPeHrFxWe7Qqhz9H4N",
  "nonce": 1746549000
}
```

**Response:**

```json
{
  "job_id":            "18836f78-8e3d-41a4-b55d-67b26f8e10a1",
  "input_hash":        "0x69a106e058eb63f4f506a582ce28c7cb031402aab7dec755ce6c10159ae6bf96",
  "output_hash":       "0x4bbde95e524dcbb6cacdcade3d0debe6f39969d22fb029de572fac1cd270438c",
  "session_id":        "0x3d7819d8f05b26b7b20d6d4b477a5e1e93be829882772224883ae87190aff196",
  "decision":          "Should you sell SOL",
  "wall_ms_inference": 189
}
```

`decision` is the raw BitNet output. UI should treat it as a free-form
string and pattern-match for keywords (e.g. `decision.includes("HOLD")`).

---

### `GET /jobs`

List all jobs in the server's rolling buffer (default cap: 500),
newest-first.

```
GET /jobs → JobStatus[]
```

---

### `GET /jobs/:job_id`

Single job lookup.

```
GET /jobs/18836f78-8e3d-41a4-b55d-67b26f8e10a1 → JobStatus
```

Returns 404 if the job has been pruned out of the rolling buffer.

---

### `GET /events`

Server-sent-events stream of `JobStatus` updates. Subscribe once at
page load; every job state change broadcasts a `job` event with the
full `JobStatus` payload.

```js
const es = new EventSource(`${PROVER_URL}/events`);
es.addEventListener("job", (e) => {
  const status = JSON.parse(e.data);
  // Update your UI for status.job_id.
});
```

Server sends a `:ping` keepalive every 15 s so intermediaries don't
drop the connection.

---

### `GET /jobs/:job_id/layer/:layer_idx/wrap`

Returns the **256-byte BN254 Groth16 proof** for layer `layer_idx`
(0..29) as raw `application/octet-stream`. Used by the audit detail
page to let users download the actual proof bytes.

---

### `GET /jobs/:job_id/layer/:layer_idx/public_inputs`

Returns the public-input vector for layer `layer_idx` (~896 bytes
typically). Same `application/octet-stream` content type.

---

## `JobStatus` schema

```ts
type JobPhase =
  | "queued"             // job created, no compute started
  | "proving"            // prove_chain_commit subprocess running
  | "submitting"         // pushing layer proofs to Solana
  | "verified_onchain"   // SessionLedger finalised on-chain
  | "failed";            // any unrecoverable error

interface JobStatus {
  job_id: string;                    // UUID
  phase: JobPhase;
  regime: string;                    // currently always "live"
  decision: string;                  // raw BitNet output
  input_hash: string;                // hex-encoded "0x..." 32 bytes
  output_hash: string;               // hex-encoded "0x..." 32 bytes
  session_id: string;                // hex-encoded "0x..." 32 bytes
  layers_verified: number;           // 0..total_layers
  total_layers: number;              // always 30 for BitNet b1.58 2B4T
  layer_tx_signatures: string[];     // base58 Solana sigs, one per verified layer
  finalize_tx: string | null;        // populated when phase == "verified_onchain"
  error_message: string | null;      // populated when phase == "failed"
  created_at_unix_ms: number;
  updated_at_unix_ms: number;
}
```

### Phase transitions

```
queued ──▶ proving ──▶ submitting ──▶ verified_onchain
                                    └─▶ failed
                       └────────────────▶ failed
            └───────────────────────────▶ failed
```

`failed` is a terminal state — the job won't move out of it. The UI
should keep the failed card visible (don't hide it) so users can read
`error_message`.

---

## Helpful constants

| Field | Value |
|---|---|
| Devnet RPC | `https://api.devnet.solana.com` |
| Solscan cluster param | `?cluster=devnet` |
| Verifier program | `6FkUvtDvUKexia3SUfjAEzkAbRpjMcuYgumWcYvm4bcc` |
| Agent gate program | `2M4KyGePCjXtcr4jkcwHKJExjQXKdCbMAoziG2Lw2GB2` |
| Live VK account | `G4msbwcRniHbKQNWfWCqxMakSfJDFfrAuXt3H3qD6DgK` |

To deep-link a Solana tx into Solscan:

```
https://solscan.io/tx/<signature>?cluster=devnet
```

To deep-link an account:

```
https://solscan.io/account/<pubkey>?cluster=devnet
```

The `proverClient.ts` helpers `solscanTx()` and `solscanAccount()`
already do this for you.

---

## Things that may be added (additive — won't break)

- `chain_proof_method: "per_layer" | "cumulative"` — once a backend
  refactor lands, this will let the UI label which protocol applies.
- `prover_pubkey: string` — for multi-prover networks (post-MVP).
- `gate_executed_tx: string | null` — when the gate's `execute_action`
  fires the downstream CPI (Jupiter swap, vote, etc.).
- `GET /agents/:pubkey/history` — per-agent attestation summary
  aggregated server-side.
- `GET /agents/:pubkey/score` — Tachyon-Verified reputation score
  (planned post-MVP).

If your UI design depends on any of these, ping us — they're easy to
prioritise.
