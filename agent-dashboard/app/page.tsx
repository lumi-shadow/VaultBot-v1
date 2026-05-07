"use client";

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
            VaultBot is a verifiable AI treasury agent for Solana that makes mathematically 
            provable decisions about token swaps. Every action is gated by a 30-layer Groth16 
            zero-knowledge proof, ensuring complete transparency and auditability.
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
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-8">
            <StatItem value="30" label="ZK Proof Layers" />
            <StatItem value="2B" label="Model Parameters" />
            <StatItem value="~90s" label="Verification Time" />
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
              "Every decision is backed by cryptographic proof",
              "30-layer Groth16 ZK proofs verified on-chain",
              "BitNet b1.58 2B4T neural network architecture"
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
              { label: "Architecture", value: "BitNet b1.58 2B4T" },
              { label: "Parameters", value: "2 billion (4-bit)" },
              { label: "Specialization", value: "Treasury management" },
              { label: "Training", value: "Market data & strategies" }
            ]}
          />
          <SpecCard
            title="Proof System"
            specs={[
              { label: "Type", value: "Groth16 on BN254" },
              { label: "Layers", value: "30 proofs" },
              { label: "Size", value: "256 bytes per layer" },
              { label: "Infrastructure", value: "Tachyon ZK" }
            ]}
          />
          <SpecCard
            title="Blockchain"
            specs={[
              { label: "Network", value: "Solana devnet" },
              { label: "Verifier", value: "6FkUvt...6DgK" },
              { label: "Agent Gate", value: "2M4KyG...2GB2" },
              { label: "Finality", value: "On-chain ledger" }
            ]}
          />
        </div>
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
              <h3 className="text-xl font-medium">Live Metrics</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Total proofs verified on-chain</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Active proofs in flight</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Success rate and error tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Real-time SSE updates</span>
                </li>
              </ul>
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
