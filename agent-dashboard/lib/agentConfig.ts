/**
 * Single source of truth for the visible agent's on-chain identity
 * + cadence. All values default to the public devnet demo wallet so
 * the dashboard works out of the box; override via NEXT_PUBLIC_*
 * to point at any other deployed VaultBot instance.
 */

export interface AgentConfig {
  /** Pubkey of the agent wallet (the payer the prover-server signs from). */
  agentPubkey: string;
  /** Solana RPC the dashboard hits for balance reads. */
  rpcUrl: string;
  /** USDC mint on the configured cluster. */
  usdcMint: string;
  /** Tick interval the autonomous loop ticks at, in seconds. */
  tickSeconds: number;
  /** Solscan cluster query-string suffix. */
  solscanCluster: string;
}

export const AGENT_CONFIG: AgentConfig = {
  agentPubkey:
    process.env.NEXT_PUBLIC_AGENT_PUBKEY ??
    "5aL9VAVCvC8KkXW6nH7uLqGGBY5qPRNe8F9zb9kFLR6n",
  // RPC URL is intentionally NOT defaulted to a private endpoint —
  // operators must supply their own NEXT_PUBLIC_AGENT_RPC_URL (Helius,
  // QuickNode, Alchemy, or the public devnet endpoint). The public
  // Solana devnet RPC is the safe fallback so the dashboard never
  // ships with someone else's API key baked in.
  rpcUrl:
    process.env.NEXT_PUBLIC_AGENT_RPC_URL ??
    "https://api.devnet.solana.com",
  // Devnet USDC mint published by Circle.
  usdcMint:
    process.env.NEXT_PUBLIC_USDC_MINT ??
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  tickSeconds: parseInt(
    process.env.NEXT_PUBLIC_TICK_SECONDS ?? "300",
    10,
  ),
  solscanCluster: process.env.NEXT_PUBLIC_SOLSCAN_CLUSTER ?? "devnet",
};
