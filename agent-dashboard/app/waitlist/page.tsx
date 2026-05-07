"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Sparkles } from "lucide-react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-2xl pb-32 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-2 text-sm text-muted">
          <Sparkles className="h-4 w-4 text-success" />
          <span>Early access program</span>
        </div>

        <h1 className="text-5xl font-normal">Join the waitlist.</h1>
        <p className="mt-4 text-lg text-muted">
          Be among the first to deploy your own verifiable AI treasury agent on Solana.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-12 rounded-2xl border border-border bg-panel p-8"
      >
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-canvas py-3 pl-11 pr-4 text-sm transition-colors focus:border-success focus:outline-none focus:ring-1 focus:ring-success"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>

            <p className="text-center text-xs text-muted">
              We'll notify you when early access opens. No spam, ever.
            </p>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="mt-6 text-2xl font-medium">You're on the list!</h2>
            <p className="mt-2 text-muted">
              We'll send you an email at <span className="font-medium text-ink">{email}</span> when early access opens.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Benefits */}
      <div className="mt-12 space-y-6">
        <h2 className="text-center text-xl font-medium">What you'll get</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <BenefitCard
            title="Early Access"
            description="Be first to deploy your own verifiable AI agent"
          />
          <BenefitCard
            title="Priority Support"
            description="Direct line to our engineering team"
          />
          <BenefitCard
            title="Discounted Pricing"
            description="Special rates for early adopters"
          />
          <BenefitCard
            title="Feature Input"
            description="Help shape the product roadmap"
          />
        </div>
      </div>

      {/* Social Proof */}
      <div className="mt-16 rounded-2xl border border-border bg-panel p-8 text-center">
        <p className="text-sm text-muted">
          Join <span className="font-medium text-ink">500+</span> developers and DAOs already on the waitlist
        </p>
      </div>
    </main>
  );
}

function BenefitCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}
