"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Code, Users } from "lucide-react";

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-16 pb-32">
      {/* Header */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-wider text-muted">— Documentation</p>
          <h1 className="mt-2 text-5xl font-normal">Technical deep dive.</h1>
          <p className="mt-4 text-lg text-muted">
            Everything you need to understand how VaultBot works under the hood.
          </p>
        </motion.div>
      </section>

      {/* Technical Architecture */}
      <section>
        <h2 className="text-3xl font-normal">Technical Architecture</h2>
        <div className="mt-6 rounded-2xl border border-border bg-panel p-8">
          <div className="space-y-4 font-mono text-sm">
            <ArchitectureStep text="User request" />
            <ArchitectureArrow />
            <ArchitectureStep text="BitNet inference (2.4 B params)" />
            <ArchitectureArrow />
            <ArchitectureStep text="Tachyon proves all 30 layers" />
            <ArchitectureArrow />
            <ArchitectureStep text="30 Groth16 proofs land on Solana" />
            <ArchitectureArrow />
            <ArchitectureStep text="SessionLedger finalised on-chain" />
            <ArchitectureArrow />
            <ArchitectureStep text="Gated CPI fires (Jupiter swap planned)" />
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section>
        <h2 className="text-3xl font-normal">Security &amp; Trust</h2>

        <div className="mt-8 space-y-8">
          <SecurityCard
            icon={<Shield className="h-5 w-5" />}
            title="Cryptographically proven"
            items={[
              "Every inference is proven layer-by-layer using zero-knowledge proofs",
              "30 proofs verified on Solana; chain-of-custody enforced on-chain",
              "Base prover is quantum-resistant — built on hash-based commitments"
            ]}
          />

          <SecurityCard
            icon={<Lock className="h-5 w-5" />}
            title="Verify, then execute"
            items={[
              "Agent action only fires after on-chain proof finalisation",
              "Gate program rejects any mismatch between intent and proof",
              "Anyone can audit the full proof chain on Solana"
            ]}
          />

          <SecurityCard
            icon={<Code className="h-5 w-5" />}
            title="Open & honest"
            items={[
              "Apache-2.0 licensed; verifier program live + frozen on devnet",
              "Demo runs at 50-bit security; production target is 100-bit",
              "Active research direction: aggregating all 30 proofs into one"
            ]}
          />
        </div>
      </section>

      {/* Performance Metrics */}
      <section>
        <h2 className="text-3xl font-normal">Performance Metrics</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <MetricCard
            label="Inference"
            value="~150ms"
            description="BitNet on B200"
          />
          <MetricCard
            label="ZK proof"
            value="~40s"
            description="30 layers, 4 GPUs"
          />
          <MetricCard
            label="Solana settle"
            value="~60s"
            description="30 layer txs + finalize"
          />
          <MetricCard
            label="Total"
            value="~120s"
            description="Request → verified"
          />
        </div>
      </section>

      {/* Integration Options */}
      <section>
        <h2 className="text-3xl font-normal">Integration Options</h2>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <IntegrationCard
            icon={<Code className="h-5 w-5" />}
            title="For developers"
            items={[
              "Simple REST API for triggering and tracking inferences",
              "Real-time updates via Server-Sent Events",
              "TypeScript plugins for Solana Agent Kit and elizaOS",
              "Reference Rust prover server, fully open source"
            ]}
          />

          <IntegrationCard
            icon={<Users className="h-5 w-5" />}
            title="For agent operators"
            items={[
              "Drop-in headless agent template",
              "Configurable tick loop for autonomous behaviour",
              "Web dashboard for live audit trail",
              "Run on your own GPUs or via the hosted prover (planned)"
            ]}
          />
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="text-3xl font-normal">Roadmap</h2>

        <div className="mt-8 space-y-8">
          <RoadmapSection
            title="Live today"
            icon="✅"
            items={[
              "BitNet b1.58 2B4T inference",
              "30-layer ZK proof on Solana devnet",
              "Verify-then-execute gate program",
              "Real-time dashboard with full audit trail"
            ]}
          />

          <RoadmapSection
            title="Next"
            icon="🔄"
            items={[
              "Jupiter swap as the gated action",
              "100-bit security as default profile",
              "Mainnet deployment after audit",
              "Aggregated proof: 30 layers into 1"
            ]}
          />

          <RoadmapSection
            title="Exploring"
            icon="📋"
            items={[
              "Convert any pretrained LLM into a ZK-provable BitNet variant",
              "Decentralised prover network",
              "Cross-chain settlement on Ethereum L2s"
            ]}
          />
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="text-3xl font-normal">Pricing</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <PricingCard
            tier="Self-hosted"
            items={[
              "Open source, Apache-2.0",
              "Run your own prover stack",
              "Pay only Solana fees (~$0.005 per verified action)"
            ]}
          />

          <PricingCard
            tier="Hosted (planned)"
            items={[
              "Managed prover infrastructure",
              "No GPU operations on your side",
              "Pricing announced after mainnet audit"
            ]}
            highlighted
          />

          <PricingCard
            tier="Enterprise (planned)"
            items={[
              "Dedicated prover capacity",
              "White-label dashboard",
              "Custom downstream integrations"
            ]}
          />
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-3xl font-normal">Frequently Asked Questions</h2>

        <div className="mt-8 space-y-6">
          <FAQItem
            question="What does VaultBot actually prove?"
            answer="That a specific BitNet model produced a specific decision from a specific input. Not that the decision is correct — that the inference happened as claimed. Math, not promises."
          />

          <FAQItem
            question="What gets executed when a proof verifies?"
            answer="Today: a tiny self-transfer that demonstrates the gate works. The architecture is generic — Jupiter swaps, governance votes, transfers, or any Solana CPI can plug in as the downstream action."
          />

          <FAQItem
            question="What if a proof fails?"
            answer="The downstream action never fires. The gate program rejects any mismatch, atomically."
          />

          <FAQItem
            question="Why BitNet specifically?"
            answer="Ternary weights make the proof ~3× cheaper than a normal floating-point neural network. BitNet is one of the few production LLMs where ZK proving at this scale is even tractable."
          />

          <FAQItem
            question="Why Solana?"
            answer="Solana ships a native BN254 pairing precompile with enough compute budget per transaction to verify a Groth16 proof in one shot. Most chains can't."
          />
        </div>
      </section>
    </main>
  );
}

function ArchitectureStep({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-border bg-canvas px-4 py-3">
      {text}
    </div>
  );
}

function ArchitectureArrow() {
  return (
    <div className="flex justify-center text-muted">
      <span>↓</span>
    </div>
  );
}

function SecurityCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-success/10 p-2 text-success">
          {icon}
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 font-mono text-3xl font-normal">{value}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}

function IntegrationCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-success/10 p-2 text-success">
          {icon}
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoadmapSection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({
  tier,
  items,
  highlighted,
}: {
  tier: string;
  items: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlighted
          ? "border-success/30 bg-success/5"
          : "border-border bg-panel"
      }`}
    >
      <h3 className="text-xl font-medium">{tier}</h3>
      <ul className="mt-6 space-y-3 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6">
      <h3 className="font-medium">{question}</h3>
      <p className="mt-2 text-sm text-muted">{answer}</p>
    </div>
  );
}
