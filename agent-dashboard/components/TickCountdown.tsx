"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

import { AGENT_CONFIG } from "@/lib/agentConfig";
import type { JobStatus } from "@/lib/proverClient";

interface Props {
  jobs: JobStatus[];
}

/**
 * Shows the time-until-next autonomous tick the prover-server's
 * VaultBot loop is configured for. We anchor the countdown on the
 * most recent job's `created_at_unix_ms` and add `tickSeconds`.
 *
 * If the next tick is in the past (i.e. a tick is overdue or the
 * agent is currently running an inference), we render "ticking…"
 * with a pulse instead of a negative timer.
 */
export function TickCountdown({ jobs }: Props) {
  const tickMs = AGENT_CONFIG.tickSeconds * 1000;
  const lastTickAt =
    jobs.length > 0
      ? jobs.reduce((acc, j) => Math.max(acc, j.created_at_unix_ms), 0)
      : 0;
  const nextTickAt = lastTickAt > 0 ? lastTickAt + tickMs : Date.now() + tickMs;

  const [remaining, setRemaining] = useState(nextTickAt - Date.now());
  useEffect(() => {
    const id = setInterval(() => setRemaining(nextTickAt - Date.now()), 1000);
    return () => clearInterval(id);
  }, [nextTickAt]);

  const overdue = remaining <= 0;
  const sec = Math.max(0, Math.floor(remaining / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-panel p-4"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
        <Timer className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted">Next autonomous tick</p>
        {overdue ? (
          <div className="mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="font-mono text-lg text-success">ticking…</span>
          </div>
        ) : (
          <p className="mt-1 font-mono text-lg">
            {m}:{s.toString().padStart(2, "0")}
          </p>
        )}
      </div>
      <div className="text-right text-xs text-muted">
        every {AGENT_CONFIG.tickSeconds}s
      </div>
    </motion.div>
  );
}
