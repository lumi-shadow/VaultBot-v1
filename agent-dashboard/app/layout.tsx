import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "VaultBot — verifiable Solana treasury agent",
  description:
    "Live feed of mathematically attested treasury actions. Every swap below is gated on a 30-layer Groth16 proof of a real BitNet b1.58 2B4T forward pass, finalised on Solana before the swap was allowed to fire.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <ThemeProvider>
          <Navigation />
          
          {/* Main Content */}
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8">
              <p className="text-sm text-muted">
                Verifiable Solana treasury agent · BitNet b1.58 2B4T · ZK-attested via Tachyon
              </p>
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
