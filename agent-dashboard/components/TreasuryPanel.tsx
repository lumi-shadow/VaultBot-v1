"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coins, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { AGENT_CONFIG } from "@/lib/agentConfig";
import { fetchTreasurySnapshot, type TreasurySnapshot } from "@/lib/solana";
import { solscanAccount } from "@/lib/proverClient";

const HISTORY_KEY = "tachyon-treasury-history";
const HISTORY_MAX_POINTS = 60;
/** Refresh treasury balances every 30 s (cheap; one getBalance + one
 *  getTokenAccountsByOwner per refresh). */
const REFRESH_MS = 30_000;

interface HistoryPoint {
  ts: number;
  totalUsd: number; // SOL × 200 + USDC, demo-only proxy (no live price feed)
}

const SOL_PRICE_USD = 200; // demo placeholder; replace with Pyth fetch in prod

function loadHistory(): HistoryPoint[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryPoint[];
  } catch {
    return [];
  }
}

function saveHistory(points: HistoryPoint[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(points));
  } catch {
    // localStorage full / disabled — fail silent
  }
}

/**
 * Live treasury panel — SOL + USDC balances plus a 30-min sparkline
 * of total notional (SOL@$200 + USDC, hardcoded ratio for the demo
 * since we don't ship a live Pyth read here). Polls every 30 s and
 * persists history to localStorage so the chart survives a refresh.
 */
export function TreasuryPanel() {
  const [snap, setSnap] = useState<TreasurySnapshot | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>(loadHistory);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const s = await fetchTreasurySnapshot(AGENT_CONFIG.agentPubkey);
        if (cancelled) return;
        setSnap(s);
        setError(null);
        if (s.sol !== null || s.usdc !== null) {
          const totalUsd = (s.sol ?? 0) * SOL_PRICE_USD + (s.usdc ?? 0);
          setHistory((prev) => {
            const next = [...prev, { ts: s.ts, totalUsd }].slice(
              -HISTORY_MAX_POINTS,
            );
            saveHistory(next);
            return next;
          });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    };
    tick();
    const id = setInterval(tick, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const sol = snap?.sol;
  const usdc = snap?.usdc;
  const totalUsd =
    sol !== null && sol !== undefined
      ? sol * SOL_PRICE_USD + (usdc ?? 0)
      : null;
  const firstTotal = history.length > 0 ? history[0]?.totalUsd : undefined;
  const pnl =
    firstTotal !== undefined && totalUsd !== null
      ? totalUsd - firstTotal
      : null;
  const pnlPct =
    pnl !== null && firstTotal && firstTotal !== 0
      ? (pnl / firstTotal) * 100
      : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-panel p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Treasury</h3>
            <a
              href={solscanAccount(AGENT_CONFIG.agentPubkey)}
              target="_blank"
              rel="noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 text-xs text-accent hover:underline"
            >
              live on Solana <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        {pnl !== null && (
          <PnlPill pnlUsd={pnl} pnlPct={pnlPct ?? 0} />
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <Balance label="SOL" value={sol} unit="SOL" decimals={3} />
        <Balance label="USDC" value={usdc} unit="USDC" decimals={2} />
        <Balance
          label="Total notional"
          value={totalUsd}
          unit="USD"
          decimals={2}
          dim
        />
      </div>

      <Sparkline points={history} />

      {error && (
        <p className="mt-3 text-xs text-danger/80">
          balance fetch error: {error}
        </p>
      )}
      <p className="mt-3 text-[10px] uppercase tracking-wider text-muted/60">
        Refreshes every {REFRESH_MS / 1000}s · Total notional uses a
        placeholder SOL=$200 (no live price feed in this build)
      </p>
    </motion.section>
  );
}

function Balance({
  label,
  value,
  unit,
  decimals,
  dim,
}: {
  label: string;
  value: number | null | undefined;
  unit: string;
  decimals: number;
  dim?: boolean;
}) {
  const display =
    value === null || value === undefined
      ? "—"
      : value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p
        className={`mt-1 font-mono text-2xl tracking-tight ${
          dim ? "text-muted" : ""
        }`}
      >
        {display}{" "}
        <span className="text-xs text-muted">{unit}</span>
      </p>
    </div>
  );
}

function PnlPill({ pnlUsd, pnlPct }: { pnlUsd: number; pnlPct: number }) {
  const sign = pnlUsd > 0 ? "up" : pnlUsd < 0 ? "down" : "flat";
  const colour =
    sign === "up"
      ? "text-success border-success/30 bg-success/5"
      : sign === "down"
        ? "text-danger border-danger/30 bg-danger/5"
        : "text-muted border-border bg-panel";
  const Icon = sign === "up" ? TrendingUp : sign === "down" ? TrendingDown : Minus;
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-sm ${colour}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>
        {pnlUsd >= 0 ? "+" : ""}
        {pnlUsd.toFixed(2)} USD
      </span>
      <span className="text-xs opacity-70">
        ({pnlPct >= 0 ? "+" : ""}
        {pnlPct.toFixed(2)}%)
      </span>
    </div>
  );
}

/**
 * Inline SVG sparkline. No chart-lib dep. Renders a simple polyline
 * over the recorded history; auto-scales to min/max with 5% padding.
 */
function Sparkline({ points }: { points: HistoryPoint[] }) {
  if (points.length < 2) {
    return (
      <div className="mt-6 flex h-12 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted">
        collecting balance history…
      </div>
    );
  }
  const W = 600;
  const H = 48;
  const ys = points.map((p) => p.totalUsd);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const pad = (max - min) * 0.05 || 1;
  const lo = min - pad;
  const hi = max + pad;
  const span = hi - lo || 1;
  const stepX = W / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = H - ((p.totalUsd - lo) / span) * H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const lastY = ys[ys.length - 1] ?? min;
  const firstY = ys[0] ?? min;
  const trendUp = lastY >= firstY;
  return (
    <div className="mt-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-12 w-full"
      >
        <path
          d={path}
          fill="none"
          stroke={trendUp ? "rgb(34 197 94)" : "rgb(239 68 68)"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
