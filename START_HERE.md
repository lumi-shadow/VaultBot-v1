# 🚀 START HERE - Quick Setup Guide

## Step-by-Step Instructions

### 1️⃣ Start the Mock Prover Server

**IMPORTANT:** The `mock-prover.mjs` file is in the **ROOT directory**, not inside `agent-dashboard`.

```bash
# Make sure you're in the root directory
# (where you see mock-prover.mjs, README.md, API.md)

node mock-prover.mjs
```

✅ **Success looks like:**
```
[mock-prover] listening on http://127.0.0.1:7878
[mock-prover] seeded 4 jobs; one in-flight job animates over ~90s
```

**Keep this terminal open!** The server needs to stay running.

---

### 2️⃣ Install Dashboard Dependencies

Open a **NEW terminal** and run:

```bash
cd agent-dashboard
npm install
```

This will install all required packages (framer-motion, lucide-react, etc.)

---

### 3️⃣ Start the Dashboard

In the same terminal (still in `agent-dashboard` directory):

```bash
npm run dev
```

✅ **Success looks like:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

---

### 4️⃣ Open Your Browser

Navigate to: **http://localhost:3000**

You should see:
- ✅ Landing page with hero section
- ✅ Navigation bar at the top
- ✅ Dark mode toggle (moon/sun icon)

---

## 🎯 What You'll See

### Landing Page (/)
- Hero section with product overview
- Key features
- How it works
- Use cases
- Technical specs
- CTA buttons

### Dashboard (/dashboard)
- Live metrics (verified proofs, in-flight, success rate)
- Real-time action cards
- 30-layer progress visualization
- Updates every ~2 seconds

### Docs (/docs)
- Technical architecture
- Security details
- Performance metrics
- Integration guide
- Roadmap
- FAQ

### Waitlist (/waitlist)
- Email signup form
- Benefits list

---

## 🌓 Try Dark Mode!

Click the **moon icon** in the navigation bar to switch to dark mode.
Click the **sun icon** to switch back to light mode.

Your preference is saved automatically!

---

## ❌ Common Errors & Solutions

### Error: "Connection Error: Could not reach prover server"

**Problem:** Mock prover isn't running

**Solution:**
```bash
# Open a new terminal
# Navigate to ROOT directory (not agent-dashboard)
cd ..  # if you're in agent-dashboard
node mock-prover.mjs
```

---

### Error: "Cannot find module 'mock-prover.mjs'"

**Problem:** You're in the wrong directory

**Solution:**
```bash
# Check where you are
pwd  # Mac/Linux
cd   # Windows

# You should see mock-prover.mjs in the current directory
ls mock-prover.mjs  # Mac/Linux
dir mock-prover.mjs  # Windows

# If not found, navigate up
cd ..
node mock-prover.mjs
```

---

### Error: "Port 7878 is already in use"

**Problem:** Mock prover is already running somewhere

**Solution:**

**Windows:**
```bash
netstat -ano | findstr :7878
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
lsof -ti:7878 | xargs kill -9
```

Then start the mock prover again.

---

### Error: "Port 3000 is already in use"

**Problem:** Another Next.js app is running

**Solution:**
```bash
# Kill the process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

## 📁 Directory Structure

```
your-project/
├── mock-prover.mjs          ← Run this from here!
├── README.md
├── API.md
├── agent-dashboard/         ← Navigate here for npm commands
│   ├── app/
│   │   ├── page.tsx         ← Landing page
│   │   ├── dashboard/       ← Live dashboard
│   │   ├── docs/            ← Documentation
│   │   └── waitlist/        ← Waitlist
│   ├── components/
│   ├── package.json
│   └── ...
└── ...
```

---

## ✅ Checklist

- [ ] Mock prover running (Terminal 1)
- [ ] Dashboard running (Terminal 2)
- [ ] Browser open to localhost:3000
- [ ] Can see landing page
- [ ] Can navigate to /dashboard
- [ ] Can toggle dark mode
- [ ] Dashboard shows live data

---

## 🎉 You're All Set!

If all checkboxes are ✅, you're ready to explore VaultBot!

### Quick Tour:
1. **Landing Page** - Read about VaultBot
2. **Dashboard** - Watch live proofs verify
3. **Docs** - Learn technical details
4. **Waitlist** - Sign up for early access
5. **Dark Mode** - Toggle the theme

---

## 📞 Need Help?

Check these files:
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `LANDING_PAGE_COMPLETE.md` - Feature overview
- `README.md` - Original project documentation

---

**Happy exploring! 🚀**
