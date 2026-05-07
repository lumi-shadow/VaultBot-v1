"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, ExternalLink, Database, Terminal, Shield } from "lucide-react";

import {
  fetchJob,
  fetchLayerWrap,
  formatRelative,
  proverUrl,
  shortHex,
  shortSig,
  solscanAccount,
  solscanTx,
  subscribeJobEvents,
  type JobStatus,
} from "@/lib/proverClient";
import { LayerProgress } from "@/components/LayerProgress";
import { StatusBadge } from "@/components/StatusBadge";

export default function AuditPage({ params }: { params: { jobId: string } }) {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [proofBytes, setProofBytes] = useState<Map<number, Uint8Array>>(new Map());
  const [layerLoading, setLayerLoading] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchJob(params.jobId)
      .then((j) => !cancelled && setJob(j))
      .catch((e: Error) => !cancelled && setError(e.message));
    const unsub = subscribeJobEvents((updated) => {
      if (updated.job_id === params.jobId) setJob(updated);
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, [params.jobId]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-danger/20 bg-danger/5 p-6"
      >
        <p className="text-sm text-danger">Error loading job: {error}</p>
      </motion.div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
          <p className="font-mono text-sm text-muted">loading audit trail…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2 text-sm text-muted transition-all hover:border-white/10 hover:bg-white/[0.04] hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to feed</span>
      </Link>

      {/* Header Card */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-panel to-panel/50 p-8 backdrop-blur-sm"
      >
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-success/5 blur-3xl" />
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                <Database className="h-3.5 w-3.5" />
                Decision Output
              </p>
              <h2 className="mt-2 font-mono text-4xl font-bold tracking-tight">
                {job.decision || "—"}
              </h2>
              <p className="mt-3 text-sm text-muted">
                Tick {formatRelative(job.created_at_unix_ms)} · Job{" "}
                <button
                  onClick={() => copyToClipboard(job.job_id, "job_id")}
                  className="inline-flex items-center gap-1 font-mono text-success transition-colors hover:text-success/80"
                >
                  {job.job_id}
                  <Copy className="h-3 w-3" />
                </button>
              </p>
            </div>
            <StatusBadge phase={job.phase} />
          </div>

          {/* Metadata Grid */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <MetadataCard
              label="input_hash (prompt_commit)"
              value={job.input_hash}
              onCopy={() => copyToClipboard(job.input_hash, "input_hash")}
              copied={copied === "input_hash"}
            />
            <MetadataCard
              label="output_hash (output_commit)"
              value={job.output_hash}
              onCopy={() => copyToClipboard(job.output_hash, "output_hash")}
              copied={copied === "output_hash"}
            />
            <MetadataCard
              label="session_id (PDA seed)"
              value={job.session_id}
              onCopy={() => copyToClipboard(job.session_id, "session_id")}
              copied={copied === "session_id"}
            />
            <MetadataCard
              label="prover server"
              value={proverUrl()}
              mono
            />
          </div>
        </div>
      </motion.header>

      {/* Verification Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/5 bg-gradient-to-br from-panel to-panel/50 p-8 backdrop-blur-sm"
      >
        <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted">
          <Shield className="h-4 w-4" />
          On-Chain Verification
        </h3>
        <div className="mt-6">
          <LayerProgress
            layersVerified={job.layers_verified}
            totalLayers={job.total_layers}
            layerSignatures={job.layer_tx_signatures}
            finalizeTx={job.finalize_tx}
          />
        </div>

        {/* Terminal-Style Table */}
        <div className="mt-8 overflow-hidden rounded-lg border border-white/5 bg-black/40">
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-2">
            <Terminal className="h-3.5 w-3.5 text-success" />
            <span className="font-mono text-xs text-muted">layer_verification.log</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-4 py-3 text-left font-medium text-muted">Layer</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Transaction Signature</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Groth16 Proof</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: job.total_layers }, (_, i) => i).map((i) => {
                  const sig = job.layer_tx_signatures[i];
                  const proof = proofBytes.get(i);
                  const verified = i < job.layers_verified;
                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${
                        verified ? "" : "opacity-40"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              verified ? "bg-success led-glow" : "bg-white/20"
                            }`}
                          />
                          <span className="text-muted">{String(i).padStart(2, "0")}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {sig ? (
                          <a
                            href={solscanTx(sig)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-success transition-colors hover:text-success/80"
                          >
                            {shortSig(sig)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted">pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {proof ? (
                          <code className="text-muted">{bytesPreview(proof, 8)}…</code>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              if (!sig) return;
                              setLayerLoading(i);
                              try {
                                const bytes = await fetchLayerWrap(job.job_id, i);
                                setProofBytes((prev) => {
                                  const next = new Map(prev);
                                  next.set(i, bytes);
                                  return next;
                                });
                              } catch (e) {
                                console.error(e);
                              } finally {
                                setLayerLoading(null);
                              }
                            }}
                            className="text-muted transition-colors hover:text-ink disabled:opacity-50"
                            disabled={!sig || layerLoading === i}
                          >
                            {layerLoading === i ? "loading…" : sig ? "load bytes" : "—"}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* Verification Instructions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/5 bg-gradient-to-br from-panel to-panel/50 p-8 backdrop-blur-sm"
      >
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted">
          How to Verify This Attestation Yourself
        </h3>
        <ol className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 font-mono text-xs font-medium text-success">
              1
            </span>
            <span>
              Fetch the SessionLedger PDA on Solana (
              <a
                href={solscanAccount(deriveSessionLedgerPdaPlaceholder(job))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-success hover:text-success/80"
              >
                Solscan
                <ExternalLink className="h-3 w-3" />
              </a>
              ) and confirm <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">finalized = true</code>,{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">submitted_layers = 30</code>,{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">
                prompt_commit = {shortHex(job.input_hash, 6)}
              </code>
              ,{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">
                output_commit = {shortHex(job.output_hash, 6)}
              </code>
              .
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 font-mono text-xs font-medium text-success">
              2
            </span>
            <span>
              For each layer, click the <em className="text-ink">load bytes</em> button above and verify the 256-byte
              BN254 Groth16 proof against the verifying-key account using arkworks-bn254 or any standard Groth16
              verifier.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 font-mono text-xs font-medium text-success">
              3
            </span>
            <span>
              Hash the public-input bytes of layer 0 and layer 29 and confirm they extend to the chain-commit `H_in` /
              `H_out` recorded in the SessionLedger entries (
              <a
                href="https://github.com/lumi-shadow/binius-gpu/blob/main/solana-program-verifier/src/session.rs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-success hover:text-success/80"
              >
                session.rs
                <ExternalLink className="h-3 w-3" />
              </a>
              ).
            </span>
          </li>
        </ol>
      </motion.section>
    </main>
  );
}

function MetadataCard({
  label,
  value,
  onCopy,
  copied,
  mono = true,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <code className={`break-all text-sm text-ink ${mono ? "font-mono" : ""}`}>{value}</code>
        {onCopy && (
          <button
            onClick={onCopy}
            className="shrink-0 rounded p-1 text-muted transition-colors hover:bg-white/5 hover:text-ink"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {copied && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-success"
        >
          Copied!
        </motion.p>
      )}
    </div>
  );
}

function bytesPreview(bytes: Uint8Array, n: number): string {
  return Array.from(bytes.slice(0, n))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

function deriveSessionLedgerPdaPlaceholder(_job: JobStatus): string {
  return "11111111111111111111111111111111";
}
