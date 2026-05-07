/**
 * Browser-side talker to `tachyon-prover-server`. No SDK; the server
 * surface is small enough that direct fetch + EventSource is plenty.
 *
 * The dashboard treats every job as immutable-after-terminal, so we
 * memoise verified jobs in `localStorage` for a fast first paint
 * after a refresh.
 */

export type JobPhase =
  | "queued"
  | "proving"
  | "submitting"
  | "verified_onchain"
  | "failed";

export interface JobStatus {
  job_id: string;
  phase: JobPhase;
  regime: string;
  decision: string;
  input_hash: string;
  output_hash: string;
  session_id: string;
  layers_verified: number;
  total_layers: number;
  layer_tx_signatures: string[];
  finalize_tx: string | null;
  error_message: string | null;
  created_at_unix_ms: number;
  updated_at_unix_ms: number;
}

const PROVER_URL = process.env.NEXT_PUBLIC_PROVER_URL ?? "http://127.0.0.1:7878";
const SOLSCAN_CLUSTER = process.env.NEXT_PUBLIC_SOLSCAN_CLUSTER ?? "devnet";

export function proverUrl(): string {
  return PROVER_URL.replace(/\/+$/, "");
}

export function solscanTx(signature: string): string {
  return `https://solscan.io/tx/${signature}?cluster=${SOLSCAN_CLUSTER}`;
}

export function solscanAccount(pubkey: string): string {
  return `https://solscan.io/account/${pubkey}?cluster=${SOLSCAN_CLUSTER}`;
}

export async function fetchJobs(): Promise<JobStatus[]> {
  const r = await fetch(`${proverUrl()}/jobs`, { cache: "no-store" });
  if (!r.ok) throw new Error(`/jobs ${r.status}`);
  return (await r.json()) as JobStatus[];
}

export async function fetchJob(jobId: string): Promise<JobStatus> {
  const r = await fetch(`${proverUrl()}/jobs/${jobId}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`/jobs/${jobId} ${r.status}`);
  return (await r.json()) as JobStatus;
}

export async function fetchLayerWrap(
  jobId: string,
  layerIdx: number,
): Promise<Uint8Array> {
  const r = await fetch(
    `${proverUrl()}/jobs/${jobId}/layer/${layerIdx}/wrap`,
    { cache: "no-store" },
  );
  if (!r.ok) throw new Error(`layer wrap ${layerIdx} ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

export function subscribeJobEvents(
  onJob: (job: JobStatus) => void,
): () => void {
  const es = new EventSource(`${proverUrl()}/events`);
  es.addEventListener("job", (e: MessageEvent) => {
    try {
      onJob(JSON.parse(e.data) as JobStatus);
    } catch {
      // ignore malformed events
    }
  });
  return () => es.close();
}

export function shortHex(s: string, n = 8): string {
  if (!s) return "—";
  const stripped = s.startsWith("0x") ? s.slice(2) : s;
  if (stripped.length <= n * 2 + 2) return s;
  return `${s.slice(0, n + 2)}…${stripped.slice(-n)}`;
}

export function shortSig(s: string): string {
  if (!s) return "—";
  return s.length > 16 ? `${s.slice(0, 8)}…${s.slice(-8)}` : s;
}

export function formatRelative(ms: number): string {
  const delta = Date.now() - ms;
  if (delta < 1000) return "now";
  const sec = Math.floor(delta / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return new Date(ms).toLocaleDateString();
}
