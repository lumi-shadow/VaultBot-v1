/**
 * Clean, minimal layer progress display
 */

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { solscanTx } from "@/lib/proverClient";

export function LayerProgress({
  layersVerified,
  totalLayers,
  layerSignatures,
  finalizeTx,
}: {
  layersVerified: number;
  totalLayers: number;
  layerSignatures: string[];
  finalizeTx: string | null;
}) {
  const cells = Array.from({ length: totalLayers }, (_, i) => i);
  const progress = (layersVerified / totalLayers) * 100;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">Layer verification</span>
        <span className="font-mono text-ink">
          {layersVerified} / {totalLayers}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 overflow-hidden rounded-full bg-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-success"
        />
      </div>

      {/* Micro Grid */}
      <div className="grid grid-cols-10 gap-1">
        {cells.map((i) => {
          const sig = layerSignatures[i];
          const verified = i < layersVerified;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
            >
              {verified && sig ? (
                <a
                  href={solscanTx(sig)}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block"
                  title={`Layer ${i}`}
                >
                  <div className="aspect-square rounded-sm bg-success/20 transition-colors hover:bg-success/40" />
                </a>
              ) : verified ? (
                <div className="aspect-square rounded-sm bg-success/10" />
              ) : (
                <div className="aspect-square rounded-sm bg-border" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      {finalizeTx && (
        <a
          href={solscanTx(finalizeTx)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-success transition-colors hover:text-success/80"
        >
          <span>View finalization</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
