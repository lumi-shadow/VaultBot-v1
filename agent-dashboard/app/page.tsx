"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  Eye,
  CheckCircle2,
  Sparkles,
  Lock,
  TrendingUp
} from "lucide-react";

import { fetchJobs, type JobStatus } from "@/lib/proverClient";

export default function LandingPage() {
  return (
    <main className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-2 text-sm text-muted">
            <Sparkles className="h-4 w-4 text-success" />
            <span>First verifiable AI agent on Solana</span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-6xl font-normal leading-tight tracking-tight">
            Mathematically provable
            <br />
            <span className="text-muted">treasury decisions.</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            VaultBot is an autonomous Solana treasury agent powered by Microsoft
            BitNet b1.58 2B4T. Every decision is proved layer-by-layer with the
            Tachyon Binius zkSNARK stack, wrapped to a 256-byte BN254 Groth16
            proof, and verified on Solana before any action is allowed to fire.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-canvas transition-opacity hover:opacity-90"
            >
              <span>View Live Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 rounded-full border border-border bg-panel px-6 py-3 font-medium transition-colors hover:bg-muted/5"
            >
              <span>Read Documentation</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-4 gap-6">
            <StatItem value="2.4B" label="Model Parameters" />
            <StatItem value="~17s" label="Base Prove (4× B200)" />
            <StatItem value="256B" label="Per-Layer Proof Size" />
            <StatItem value="30" label="On-Chain Layer Proofs" />
          </div>
        </motion.div>
      </section>

      {/* Key Value Props */}
      <section>
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">— Why VaultBot</p>
          <h2 className="mt-2 text-4xl font-normal">Built for trust.</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <ValuePropCard
            icon={<Shield className="h-6 w-6" />}
            title="Mathematically Verifiable AI"
            items={[
              "Every decision is backed by a cryptographic proof",
              "30-layer Groth16 ZK proofs verified on Solana",
              "Microsoft BitNet b1.58 2B4T (2.4 B params, ternary weights)"
            ]}
          />
          <ValuePropCard
            icon={<Eye className="h-6 w-6" />}
            title="Complete Transparency"
            items={[
              "Real-time proof verification dashboard",
              "Every layer traceable on Solana blockchain",
              "Immutable audit trail via Solscan"
            ]}
          />
          <ValuePropCard
            icon={<Lock className="h-6 w-6" />}
            title="Trustless Execution"
            items={[
              "No black-box AI decisions",
              "Proof-first architecture: verify THEN execute",
              "On-chain SessionLedger finalization"
            ]}
          />
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">— Process</p>
          <h2 className="mt-2 text-4xl font-normal">How it works.</h2>
        </div>

        <div className="space-y-8">
          <ProcessStep
            number="01"
            title="AI Inference"
            description="VaultBot analyzes market conditions (SOL/USD price, portfolio balance)"
            items={[
              "Generates decision: SWAP_TO_SOL, SWAP_TO_USDC, or HOLD",
              "Computes cryptographic hash of input and output"
            ]}
          />
          <ProcessStep
            number="02"
            title="Zero-Knowledge Proof"
            description="Generates 30-layer Groth16 proof of the inference"
            items={[
              "Each layer submitted to Solana blockchain",
              "Real-time verification progress visible in dashboard"
            ]}
          />
          <ProcessStep
            number="03"
            title="On-Chain Execution"
            description="SessionLedger finalized on Solana"
            items={[
              "Only after full verification, swap executes",
              "Complete audit trail preserved forever"
            ]}
          />
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">— Applications</p>
          <h2 className="mt-2 text-4xl font-normal">Built for the future.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <UseCaseCard
            title="Automated Treasury Management"
            items={[
              "DAOs managing SOL/USDC portfolios",
              "Protocols with treasury diversification needs",
              "Automated rebalancing based on market conditions"
            ]}
          />
          <UseCaseCard
            title="Verifiable AI Agents"
            items={[
              "Proof-of-concept for trustless AI decision-making",
              "Research into ZK-ML applications",
              "Demonstrating verifiable compute on Solana"
            ]}
          />
          <UseCaseCard
            title="Transparent Governance"
            items={[
              "Community-auditable treasury decisions",
              "No trust required in centralized operators",
              "Mathematical proof of correct execution"
            ]}
          />
        </div>
      </section>

      {/* Technical Specs */}
      <section>
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">— Specifications</p>
          <h2 className="mt-2 text-4xl font-normal">Technical excellence.</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <SpecCard
            title="AI Model"
            specs={[
              { label: "Architecture", value: "Microsoft BitNet b1.58 2B4T" },
              { label: "Parameters", value: "2.4 billion (1.58-bit ternary)" },
              { label: "Pretraining", value: "4 T tokens (generic web text)" },
              { label: "Inference profile", value: "instruction-tuned chat template" }
            ]}
          />
          <SpecCard
            title="Proof System"
            specs={[
              { label: "Base prover", value: "Tachyon Binius (binary tower fields, FRI)" },
              { label: "Wrap", value: "dGKR + Phase 14 → BN254 Groth16" },
              { label: "Per-layer proof size", value: "256 bytes" },
              { label: "Quantum-resistant base", value: "Yes (hash-based commitments)" }
            ]}
          />
          <SpecCard
            title="Blockchain"
            specs={[
              { label: "Network", value: "Solana devnet" },
              { label: "Verifier program", value: "6FkUvt…m4bcc" },
              { label: "VK account (frozen)", value: "8qgSUq…c9ag" },
              { label: "Agent gate program", value: "2M4KyG…2GB2" }
            ]}
          />
        </div>
      </section>

      {/* Competitive Context */}
      <section>
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">— Comparison</p>
          <h2 className="mt-2 text-4xl font-normal">Why Tachyon.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted">
            Other ZK-LLM stacks either prove at scale (zkLLM, zkGPT) or wrap to
            on-chain-friendly Groth16 (RISC Zero, SP1 zkVMs) — but never both.
            Tachyon is the only published system that proves a billion-parameter
            LLM AND lands a 256-byte proof on a public blockchain in one
            workflow.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-panel">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3">System</th>
                <th className="px-4 py-3">LLM-scale prove</th>
                <th className="px-4 py-3">256-B Groth16</th>
                <th className="px-4 py-3">On-chain settlement</th>
                <th className="px-4 py-3">Quantum-resistant base</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-success/5">
                <td className="px-4 py-3 font-medium">Tachyon (this stack)</td>
                <td className="px-4 py-3 text-success">Yes (2.4 B in ~17 s)</td>
                <td className="px-4 py-3 text-success">Yes</td>
                <td className="px-4 py-3 text-success">Yes (Solana)</td>
                <td className="px-4 py-3 text-success">Yes (Binius FRI)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">zkLLM (CCS 2024)</td>
                <td className="px-4 py-3 text-muted">Yes (13 B in ~15 min)</td>
                <td className="px-4 py-3 text-danger">No (~200 KB)</td>
                <td className="px-4 py-3 text-danger">No</td>
                <td className="px-4 py-3 text-danger">No (BLS12-381)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">zkGPT</td>
                <td className="px-4 py-3 text-muted">Partial (attention-only)</td>
                <td className="px-4 py-3 text-danger">No</td>
                <td className="px-4 py-3 text-danger">No</td>
                <td className="px-4 py-3 text-danger">No</td>
              </tr>
              <tr>
                <td className="px-4 py-3">RISC Zero / SP1 zkVMs</td>
                <td className="px-4 py-3 text-danger">No (RISC-V emulation cap)</td>
                <td className="px-4 py-3 text-success">Yes</td>
                <td className="px-4 py-3 text-success">Partial (ETH)</td>
                <td className="px-4 py-3 text-success">Yes (STARK)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Modulus Labs / EZKL (Halo2)</td>
                <td className="px-4 py-3 text-muted">Toy LLMs only</td>
                <td className="px-4 py-3 text-danger">No (KZG)</td>
                <td className="px-4 py-3 text-success">Partial (ETH verifier)</td>
                <td className="px-4 py-3 text-danger">No</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted">
          Headline numbers are from each project's own published benchmarks.
          Tachyon's 17 s base-prove number is for the engineering_smoke profile
          (~50-bit security, demo). The frontier100 profile (~100-bit) lands at
          ~3× the prove time and is still ~3× faster per parameter than the
          published SOTA.
        </p>
      </section>

      {/* Dashboard Features */}
      <section>
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">— Dashboard</p>
          <h2 className="mt-2 text-4xl font-normal">Real-time visibility.</h2>
        </div>

        <div className="rounded-2xl border border-border bg-panel p-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-medium">Live metrics</h3>
              <p className="mt-2 text-xs text-muted">
                Pulled live from the prover server every page load.
              </p>
              <LiveMetrics />
            </div>

            <div>
              <h3 className="text-xl font-medium">Action Cards</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Decision type (SWAP/HOLD)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Verification status with live progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>30-layer micro-grid visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Direct Solscan links for every layer</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium">Audit Trail</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Complete proof history</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Input/output hash verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>SessionLedger PDA inspection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Downloadable proof bytes (256 bytes per layer)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-panel p-16">
          <h2 className="text-4xl font-normal">Ready to get started?</h2>
          <p className="mt-4 text-lg text-muted">
            View live proofs, explore the dashboard, or join the waitlist for early access.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-canvas transition-opacity hover:opacity-90"
            >
              <span>View Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="rounded-full border border-border bg-panel px-6 py-3 font-medium transition-colors hover:bg-muted/5"
            >
              Documentation
            </Link>
            <Link
              href="/waitlist"
              className="rounded-full border border-border bg-panel px-6 py-3 font-medium transition-colors hover:bg-muted/5"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section>
        <div className="grid gap-6 md:grid-cols-4">
          <ProofBadge text="First verifiable AI agent on Solana" />
          <ProofBadge text="Powered by Tachyon ZK infrastructure" />
          <ProofBadge text="30-layer cryptographic proof system" />
          <ProofBadge text="100% transparent, 100% auditable" />
        </div>
      </section>
    </main>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-mono text-4xl font-normal">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

function ValuePropCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-panel p-8"
    >
      <div className="mb-4 inline-flex rounded-lg bg-success/10 p-3 text-success">
        {icon}
      </div>
      <h3 className="text-xl font-medium">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ProcessStep({
  number,
  title,
  description,
  items,
}: {
  number: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex gap-8"
    >
      <div className="shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-panel font-mono text-sm text-muted">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-medium">{title}</h3>
        <p className="mt-2 text-muted">{description}</p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function UseCaseCard({ title, items }: { title: string; items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-panel p-6"
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function SpecCard({
  title,
  specs,
}: {
  title: string;
  specs: { label: string; value: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-panel p-6"
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="mt-6 space-y-4">
        {specs.map((spec, i) => (
          <div key={i}>
            <p className="text-xs text-muted">{spec.label}</p>
            <p className="mt-1 font-mono text-sm">{spec.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProofBadge({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4 text-center text-sm text-muted">
      {text}
    </div>
  );
}

/**
 * Live snapshot of the prover-server's job feed. Replaces the
 * previously hardcoded "Total proofs verified on-chain / Active /
 * Success rate" bullets with real counters. Renders zeroes if the
 * prover is unreachable (typically: the user is hitting the deployed
 * site without a tunnel to a private prover).
 */
function LiveMetrics() {
  const [jobs, setJobs] = useState<JobStatus[] | null>(null);
  const [reachable, setReachable] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchJobs()
      .then((list) => {
        if (!cancelled) setJobs(list);
      })
      .catch(() => {
        if (!cancelled) setReachable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const verified = jobs?.filter((j) => j.phase === "verified_onchain").length ?? 0;
  const inFlight =
    jobs?.filter(
      (j) =>
        j.phase === "queued" || j.phase === "proving" || j.phase === "submitting",
    ).length ?? 0;
  const failed = jobs?.filter((j) => j.phase === "failed").length ?? 0;
  const total = (jobs?.length ?? 0) || 1;
  const successPct = ((verified / total) * 100).toFixed(1);

  return (
    <ul className="mt-4 space-y-3 text-sm text-muted">
      <li className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          Verified on-chain
        </span>
        <span className="font-mono text-ink">{verified}</span>
      </li>
      <li className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          In flight
        </span>
        <span className="font-mono text-ink">{inFlight}</span>
      </li>
      <li className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          Success rate
        </span>
        <span className="font-mono text-ink">{successPct}%</span>
      </li>
      <li className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          Failed
        </span>
        <span className="font-mono text-ink">{failed}</span>
      </li>
      {!reachable && (
        <li className="text-xs text-muted/60">
          (prover unreachable from this browser; counters show 0)
        </li>
      )}
    </ul>
  );
}
