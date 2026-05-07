"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Lock, Code, Users, Rocket } from "lucide-react";

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
            <ArchitectureStep text="User Request" />
            <ArchitectureArrow />
            <ArchitectureStep text="BitNet Inference (2B4T model)" />
            <ArchitectureArrow />
            <ArchitectureStep text="Hash I/O → Derive session_id" />
            <ArchitectureArrow />
            <ArchitectureStep text="Generate 30 Groth16 Proofs" />
            <ArchitectureArrow />
            <ArchitectureStep text="Submit to Solana (layer by layer)" />
            <ArchitectureArrow />
            <ArchitectureStep text="Finalize SessionLedger" />
            <ArchitectureArrow />
            <ArchitectureStep text="Execute Swap (Jupiter CPI)" />
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section>
        <h2 className="text-3xl font-normal">Security & Trust</h2>
        
        <div className="mt-8 space-y-8">
          <SecurityCard
            icon={<Shield className="h-5 w-5" />}
            title="Cryptographic Guarantees"
            items={[
              "BN254 elliptic curve (128-bit security)",
              "Groth16 proof system (industry standard)",
              "Keccak256 hashing for I/O commits"
            ]}
          />
          
          <SecurityCard
            icon={<Lock className="h-5 w-5" />}
            title="On-Chain Verification"
            items={[
              "Every proof verified by Solana validators",
              "No off-chain trust assumptions",
              "Immutable audit trail"
            ]}
          />
          
          <SecurityCard
            icon={<Code className="h-5 w-5" />}
            title="Open Source"
            items={[
              "Dashboard code available on GitHub",
              "Verifier program auditable on-chain",
              "API documentation publicly accessible"
            ]}
          />
        </div>
      </section>

      {/* Performance Metrics */}
      <section>
        <h2 className="text-3xl font-normal">Performance Metrics</h2>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <MetricCard
            label="Inference Time"
            value="~200ms"
            description="BitNet forward pass"
          />
          <MetricCard
            label="Proof Generation"
            value="~60s"
            description="30 layers"
          />
          <MetricCard
            label="On-Chain Submission"
            value="~30s"
            description="Layer by layer"
          />
          <MetricCard
            label="Total Latency"
            value="~90s"
            description="Queued → verified"
          />
        </div>
      </section>

      {/* Integration Options */}
      <section>
        <h2 className="text-3xl font-normal">Integration Options</h2>
        
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <IntegrationCard
            icon={<Code className="h-5 w-5" />}
            title="For Developers"
            items={[
              "REST API for triggering inferences",
              "SSE stream for real-time updates",
              "TypeScript SDK included",
              "Comprehensive API documentation"
            ]}
          />
          
          <IntegrationCard
            icon={<Users className="h-5 w-5" />}
            title="For Users"
            items={[
              "Web dashboard (no wallet required for viewing)",
              "Phantom/Solflare wallet connect (coming soon)",
              "Mobile-responsive design",
              "Real-time notifications"
            ]}
          />
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="text-3xl font-normal">Roadmap</h2>
        
        <div className="mt-8 space-y-8">
          <RoadmapSection
            title="Current (MVP)"
            icon="✅"
            items={[
              "BitNet b1.58 2B4T inference",
              "30-layer Groth16 proofs",
              "Solana devnet deployment",
              "Real-time dashboard"
            ]}
          />
          
          <RoadmapSection
            title="Coming Soon"
            icon="🔄"
            items={[
              "Mainnet deployment",
              "Wallet integration (Phantom/Solflare)",
              "Multi-agent support",
              "Reputation scoring system"
            ]}
          />
          
          <RoadmapSection
            title="Future"
            icon="📋"
            items={[
              "Cumulative proof method (single proof)",
              "Multi-prover network",
              "Custom agent training",
              "Cross-chain support"
            ]}
          />
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="text-3xl font-normal">Pricing</h2>
        
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <PricingCard
            tier="Free"
            items={[
              "View all public proofs",
              "Dashboard access",
              "API read access"
            ]}
          />
          
          <PricingCard
            tier="Pro"
            items={[
              "Deploy your own agent",
              "Custom inference triggers",
              "Priority proof generation",
              "Advanced analytics"
            ]}
            highlighted
          />
          
          <PricingCard
            tier="Enterprise"
            items={[
              "White-label dashboard",
              "Dedicated prover infrastructure",
              "Custom model training",
              "SLA guarantees"
            ]}
          />
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-3xl font-normal">Frequently Asked Questions</h2>
        
        <div className="mt-8 space-y-6">
          <FAQItem
            question="How is this different from regular AI agents?"
            answer="Every decision is cryptographically proven. You can verify the exact neural network computation that led to each action."
          />
          
          <FAQItem
            question="What happens if a proof fails?"
            answer="The swap never executes. VaultBot is proof-first: verify THEN execute."
          />
          
          <FAQItem
            question="Can I audit past decisions?"
            answer="Yes! Every proof is permanently stored on Solana. Click any action to see the full 30-layer verification trail."
          />
          
          <FAQItem
            question="How much does it cost?"
            answer="Viewing is free. Running your own agent requires SOL for transaction fees (~0.01 SOL per action)."
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
