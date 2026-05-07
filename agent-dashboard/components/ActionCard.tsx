"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import {
  formatRelative,
  shortHex,
  shortSig,
  type JobStatus,
} from "@/lib/proverClient";

import { LayerProgress } from "./LayerProgress";
import { StatusBadge } from "./StatusBadge";

export function ActionCard({ job }: { job: JobStatus }) {
  const isSwap = job.decision && !job.decision.startsWith("HOLD");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group rounded-2xl border border-border bg-panel p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              isSwap
                ? "border-success/30 bg-success/5 text-success"
                : "border-border bg-muted/5 text-muted"
            }`}
          >
            {job.decision || "—"}
          </div>
          <StatusBadge phase={job.phase} />
        </div>
        <Link
          href={`/actions/${job.job_id}`}
          className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <span>Details</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Metadata */}
      <div className="mt-4 text-xs text-muted">
        <span>{formatRelative(job.created_at_unix_ms)}</span>
        <span className="mx-2">·</span>
        <span className="font-mono">{shortSig(job.job_id)}</span>
      </div>

      {/* Hash Grid */}
      <div className="mt-6 space-y-2">
        <DataRow label="Input hash" value={shortHex(job.input_hash)} />
        <DataRow label="Output hash" value={shortHex(job.output_hash)} />
        <DataRow label="Session ID" value={shortHex(job.session_id)} />
      </div>

      {/* Layer Progress */}
      <div className="mt-6">
        <LayerProgress
          layersVerified={job.layers_verified}
          totalLayers={job.total_layers}
          layerSignatures={job.layer_tx_signatures}
          finalizeTx={job.finalize_tx}
        />
      </div>

      {/* Error Message */}
      {job.phase === "failed" && job.error_message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 rounded-lg border border-danger/20 bg-danger/5 p-3"
        >
          <p className="text-xs text-danger">
            <span className="font-medium">Error:</span> {job.error_message}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted">{label}</span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  );
}
