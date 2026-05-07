"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

import { ActionCard } from "@/components/ActionCard";
import {
  fetchJobs,
  subscribeJobEvents,
  type JobStatus,
} from "@/lib/proverClient";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<JobStatus[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchJobs()
      .then((list) => {
        if (cancelled) return;
        list.sort((a, b) => b.created_at_unix_ms - a.created_at_unix_ms);
        setJobs(list);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });

    const unsub = subscribeJobEvents((updated) => {
      setJobs((prev) => {
        const next = prev ? [...prev] : [];
        const idx = next.findIndex((j) => j.job_id === updated.job_id);
        if (idx >= 0) {
          next[idx] = updated;
        } else {
          next.unshift(updated);
        }
        next.sort((a, b) => b.created_at_unix_ms - a.created_at_unix_ms);
        return next;
      });
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-danger/20 bg-danger/5 p-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-danger" />
          <div>
            <h3 className="font-medium text-danger">Connection Error</h3>
            <p className="mt-1 text-sm text-danger/80">
              Could not reach prover server: {error}
            </p>
            <p className="mt-2 text-xs text-muted">
              Make sure the mock prover is running: <code className="rounded bg-muted/10 px-1 py-0.5">node mock-prover.mjs</code>
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!jobs) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-muted" />
          <p className="text-sm text-muted">Loading actions…</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-panel p-12 text-center shadow-sm"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">
          <Clock className="h-8 w-8 text-muted" />
        </div>
        <h2 className="mt-6 text-xl font-medium">No actions yet</h2>
        <p className="mt-2 text-sm text-muted">
          When VaultBot ticks, the verify-then-execute trace will appear here in real time.
        </p>
      </motion.div>
    );
  }

  return (
    <main className="space-y-12">
      <StatsSection jobs={jobs} />
      
      <motion.div layout className="grid gap-6 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {jobs.map((j) => (
            <ActionCard key={j.job_id} job={j} />
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

function StatsSection({ jobs }: { jobs: JobStatus[] }) {
  const verifiedCount = jobs.filter((j) => j.phase === "verified_onchain").length;
  const failedCount = jobs.filter((j) => j.phase === "failed").length;
  const inFlight = jobs.filter(
    (j) => j.phase === "proving" || j.phase === "submitting" || j.phase === "queued",
  ).length;

  return (
    <section>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted">— Live metrics</p>
        <h2 className="mt-2 text-3xl font-normal">
          Performance you can measure.
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <StatCard
          value={verifiedCount.toLocaleString()}
          label="Proofs verified"
          sublabel="on-chain"
          icon={<CheckCircle2 className="h-5 w-5 text-success" />}
        />
        <StatCard
          value={inFlight.toLocaleString()}
          label="In flight"
          sublabel="proving now"
          showPulse={inFlight > 0}
        />
        <StatCard
          value={`${((verifiedCount / Math.max(jobs.length, 1)) * 100).toFixed(1)}%`}
          label="Success rate"
          sublabel={`${failedCount} failed`}
        />
      </div>
    </section>
  );
}

function StatCard({
  value,
  label,
  sublabel,
  icon,
  showPulse,
}: {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  showPulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="flex items-start justify-between">
        <div>
          <motion.p
            key={value}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-5xl font-normal tracking-tight"
          >
            {value}
          </motion.p>
          <p className="mt-2 text-sm text-ink">{label}</p>
          {sublabel && (
            <p className="mt-1 text-xs text-muted">{sublabel}</p>
          )}
        </div>
        {icon && <div className="mt-1">{icon}</div>}
        {showPulse && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse-dot rounded-full bg-success" />
            <span className="text-xs text-success">Live</span>
          </div>
        )}
      </div>
      <div className="mt-6 h-px bg-border" />
    </motion.div>
  );
}
