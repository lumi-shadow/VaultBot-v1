"use client";

import { motion } from "framer-motion";
import { Bot, ExternalLink } from "lucide-react";

import { AGENT_CONFIG } from "@/lib/agentConfig";
import { VAULTBOT_PERSONA } from "@/lib/character";
import { shortSig, solscanAccount } from "@/lib/proverClient";

/**
 * "Who is this agent?" card. Identity, mandate, model, and a
 * Solscan-clickable agent wallet pubkey. Sits at the top of the
 * dashboard so a first-time visitor immediately knows what they're
 * looking at.
 */
export function AgentIdentity() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-panel p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
          <Bot className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-2xl font-medium">{VAULTBOT_PERSONA.name}</h2>
            <span className="text-sm text-muted">{VAULTBOT_PERSONA.tagline}</span>
          </div>
          <p className="mt-2 text-sm text-muted">
            {VAULTBOT_PERSONA.bioLong}
          </p>
          <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
            <div>
              <p className="text-muted/70">Model</p>
              <p className="mt-1 font-mono text-ink">
                {VAULTBOT_PERSONA.modelLabel}
              </p>
            </div>
            <div>
              <p className="text-muted/70">Agent wallet</p>
              <a
                href={solscanAccount(AGENT_CONFIG.agentPubkey)}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-mono text-accent hover:underline"
              >
                {shortSig(AGENT_CONFIG.agentPubkey)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted/70">System prompt</p>
              <p className="mt-1 font-mono text-ink">
                "{VAULTBOT_PERSONA.systemPromptExcerpt}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
