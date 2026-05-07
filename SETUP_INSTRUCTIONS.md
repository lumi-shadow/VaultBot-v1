# VaultBot Setup Instructions

## 🚀 Quick Start

### 1. Start the Mock Prover Server

The mock prover is located in the **root directory** (not inside agent-dashboard).

```bash
# From the root directory
node mock-prover.mjs
```

You should see:
```
[mock-prover] listening on http://127.0.0.1:7878
[mock-prover] seeded 4 jobs; one in-flight job animates over ~90s
```

### 2. Install Dashboard Dependencies

```bash
cd agent-dashboard
npm install
```

### 3. Start the Dashboard

```bash
# Make sure you're in the agent-dashboard directory
npm run dev
```

The dashboard will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
.
├── mock-prover.mjs           ← Mock server (run from root)
├── agent-dashboard/          ← Next.js dashboard
│   ├── app/
│   │   ├── page.tsx          ← Landing page
│   │   ├── dashboard/        ← Live dashboard
│   │   ├── docs/             ← Documentation
│   │   ├── waitlist/         ← Waitlist signup
│   │   └── actions/[jobId]/  ← Proof detail page
│   ├── components/
│   └── package.json
└── README.md
```

---

## 🎨 Features

### Pages

- **/** - Landing page with product overview
- **/dashboard** - Live proof verification dashboard
- **/docs** - Technical documentation
- **/waitlist** - Early access signup
- **/actions/[jobId]** - Individual proof audit trail

### Dark Mode

Click the moon/sun icon in the navigation to toggle between light and dark modes.

---

## 🔧 Troubleshooting

### "Connection Error: Could not reach prover server"

**Solution:** Make sure the mock prover is running:
```bash
# In the root directory (not agent-dashboard)
node mock-prover.mjs
```

### "Cannot find module 'mock-prover.mjs'"

**Solution:** You're trying to run it from the wrong directory. Navigate to the root:
```bash
cd ..  # Go up one level from agent-dashboard
node mock-prover.mjs
```

### Port 7878 already in use

**Solution:** Kill the existing process:
```bash
# Windows
netstat -ano | findstr :7878
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:7878 | xargs kill -9
```

### Dark mode not working

**Solution:** Clear your browser cache and localStorage:
```javascript
// In browser console
localStorage.clear();
location.reload();
```

---

## 🌐 Environment Variables

Create `.env.local` in the `agent-dashboard` directory (optional):

```env
NEXT_PUBLIC_PROVER_URL=http://127.0.0.1:7878
NEXT_PUBLIC_SOLSCAN_CLUSTER=devnet
```

---

## 📝 Development Workflow

### Terminal 1: Mock Prover
```bash
node mock-prover.mjs
```

### Terminal 2: Dashboard
```bash
cd agent-dashboard
npm run dev
```

### Terminal 3: (Optional) Watch for changes
```bash
cd agent-dashboard
npm run typecheck
```

---

## 🎯 What to Expect

1. **Mock Prover** seeds 4 completed jobs on startup
2. **Live Job** starts automatically and progresses through:
   - Queued → Proving (30s)
   - Submitting → Verified (60s)
   - Layers verify one by one (~2s each)
3. **New Job** spawns every 30s automatically
4. **Dashboard** updates in real-time via SSE

---

## 🚢 Production Deployment

When ready to deploy:

1. Update `NEXT_PUBLIC_PROVER_URL` to point to real prover
2. Build the dashboard:
   ```bash
   cd agent-dashboard
   npm run build
   npm start
   ```
3. Deploy to Vercel/Netlify/your hosting provider

---

## 📚 Additional Resources

- **API Documentation:** See `API.md` in root directory
- **GitHub:** https://github.com/lumi-shadow/binius-gpu
- **Solscan (devnet):** https://solscan.io/?cluster=devnet

---

**Need help?** Check the FAQ in the Docs page or open an issue on GitHub.
