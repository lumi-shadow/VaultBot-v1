# Tachyon frontend handoff — 2026-05-06

The Tachyon prover server already runs on devnet. This bundle is everything
your dev needs to build the user-facing UI on top of it without depending on
a GPU box for local development.

## What's inside

```
.
├── README.md                     ← you are here
├── API.md                        ← the HTTP contract (stable)
├── agent-dashboard/              ← working Next.js + Tailwind dashboard
│   ├── app/                      ← App Router pages
│   ├── components/               ← shared React components
│   ├── lib/proverClient.ts       ← typed client for the prover server
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── mock-prover.mjs               ← single-file Node mock so you can dev
                                    without the real prover box
```

## Five-minute local setup

```bash
# 1. Install deps
cd agent-dashboard
npm install            # or: pnpm install / bun install

# 2. Start the mock prover (terminal 1)
cd ..
node mock-prover.mjs
# → listens on http://127.0.0.1:7878
# → seeds 4 historical jobs + animates a fresh in-flight job every ~30s

# 3. Start the dashboard (terminal 2)
cd agent-dashboard
NEXT_PUBLIC_PROVER_URL=http://127.0.0.1:7878 \
NEXT_PUBLIC_SOLSCAN_CLUSTER=devnet \
  npm run dev
# → open http://localhost:3000
```

You'll see the action feed update live. Click any card → audit detail page.
Click the layer dots → real Solscan links (mock signatures resolve to
404s, that's expected for the mock).

## When you're ready to point at the real devnet prover

Set:

```
NEXT_PUBLIC_PROVER_URL=https://prover.lmns.fi   # or whatever the real host is
NEXT_PUBLIC_SOLSCAN_CLUSTER=devnet
```

Same JSON contract, same SSE feed, same component code. The dashboard
will just receive real jobs from real BitNet inferences.

## What you're free to change

The dashboard you have here is a working baseline. Treat it as a
starting point, not a finished product. Your dev should:

- Re-skin / re-brand to match the company's visual identity
- Add the marketing landing page (the "what is verifiable AI?" explainer)
- Add the per-agent profile pages
- Add wallet-connect (Phantom/Solflare) for users adopting agents into
  their own treasuries
- Add the live "trigger an inference" button for demo flows
- Integrate with whichever auth / waitlist / mailing-list the company
  is using

Anything in [`API.md`](./API.md) is stable contract — your dev can build
against it confidently. Anything in `agent-dashboard/components/` is
reference UI you can rewrite however you want.

## Production checklist (before going live)

- [ ] Replace `localhost:7878` with the real prover URL
- [ ] Add HTTPS (the SSE feed especially needs TLS in browsers)
- [ ] Add CSP headers (Next.js middleware)
- [ ] Add error boundaries around the SSE stream (currently logs to console)
- [ ] Add analytics (Vercel Analytics or whatever)
- [ ] Add rate limiting on the prover server side (out of frontend scope)
- [ ] Add a status page that pings `/healthz` every 60s

## Questions / blockers

If the contract isn't clear or your dev needs a field that isn't in
[`API.md`](./API.md), reach out — the prover server is owned by the
backend team and we can extend `JobStatus` or add new endpoints
quickly. Anything new will be additive.
