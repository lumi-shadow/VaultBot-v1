/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The dashboard's only env-driven config: where to talk to
  // tachyon-prover-server. Default points at a local devbox.
  env: {
    NEXT_PUBLIC_PROVER_URL:
      process.env.NEXT_PUBLIC_PROVER_URL ?? "http://127.0.0.1:7878",
    NEXT_PUBLIC_SOLSCAN_CLUSTER:
      process.env.NEXT_PUBLIC_SOLSCAN_CLUSTER ?? "devnet",
  },
};

export default nextConfig;
