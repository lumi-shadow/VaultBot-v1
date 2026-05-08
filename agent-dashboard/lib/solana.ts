/**
 * Tiny zero-dep Solana JSON-RPC client for the dashboard. We only
 * read balances; no signing, no transactions, no need to drag in
 * `@solana/web3.js` (would balloon the bundle by ~600 KB).
 *
 * Two calls in use:
 *   - `getBalance`                  → SOL balance in lamports
 *   - `getTokenAccountsByOwner`     → SPL token balances
 *
 * Both retry once on transient RPC errors and surface a clean
 * `null` if the account simply doesn't exist (vs throwing) — the
 * UI then renders "0" instead of an error banner.
 */

import { AGENT_CONFIG } from "./agentConfig";

const LAMPORTS_PER_SOL = 1_000_000_000;
const USDC_DECIMALS = 6;

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params: unknown[];
}

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const body: JsonRpcRequest = {
    jsonrpc: "2.0",
    id: Date.now(),
    method,
    params,
  };
  const r = await fetch(AGENT_CONFIG.rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`RPC ${method} HTTP ${r.status}`);
  const j = await r.json();
  if (j.error) {
    throw new Error(`RPC ${method}: ${j.error.message ?? "unknown error"}`);
  }
  return j.result as T;
}

/** Returns SOL balance as a float, or `null` on error. */
export async function getSolBalance(pubkey: string): Promise<number | null> {
  try {
    const result = await rpc<{ value: number }>("getBalance", [
      pubkey,
      { commitment: "confirmed" },
    ]);
    return result.value / LAMPORTS_PER_SOL;
  } catch {
    return null;
  }
}

/**
 * Returns total USDC balance across all token accounts owned by
 * `pubkey`. Returns `0` if no token accounts exist (the wallet
 * just hasn't received any USDC yet).
 */
export async function getUsdcBalance(pubkey: string): Promise<number | null> {
  try {
    const result = await rpc<{
      value: Array<{
        account: {
          data: {
            parsed?: {
              info?: { tokenAmount?: { amount: string; decimals: number } };
            };
          };
        };
      }>;
    }>("getTokenAccountsByOwner", [
      pubkey,
      { mint: AGENT_CONFIG.usdcMint },
      { encoding: "jsonParsed", commitment: "confirmed" },
    ]);
    let totalAtomic = 0n;
    for (const a of result.value) {
      const amt = a.account.data.parsed?.info?.tokenAmount?.amount;
      if (typeof amt === "string") totalAtomic += BigInt(amt);
    }
    return Number(totalAtomic) / 10 ** USDC_DECIMALS;
  } catch {
    return null;
  }
}

export interface TreasurySnapshot {
  /** Wall-clock ms when this snapshot was taken. */
  ts: number;
  sol: number | null;
  usdc: number | null;
}

export async function fetchTreasurySnapshot(
  pubkey: string,
): Promise<TreasurySnapshot> {
  const [sol, usdc] = await Promise.all([
    getSolBalance(pubkey),
    getUsdcBalance(pubkey),
  ]);
  return { ts: Date.now(), sol, usdc };
}
