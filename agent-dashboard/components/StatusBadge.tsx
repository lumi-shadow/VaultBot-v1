import type { JobPhase } from "@/lib/proverClient";

const PHASE_LABEL: Record<JobPhase, string> = {
  queued: "Queued",
  proving: "Proving",
  submitting: "Submitting",
  verified_onchain: "Verified",
  failed: "Failed",
};

const PHASE_CONFIG: Record<
  JobPhase,
  { bg: string; text: string; border: string; dotColor: string; animate: boolean }
> = {
  queued: {
    bg: "bg-muted/5",
    text: "text-muted",
    border: "border-border",
    dotColor: "bg-muted",
    animate: false,
  },
  proving: {
    bg: "bg-warning/5",
    text: "text-warning",
    border: "border-warning/30",
    dotColor: "bg-warning",
    animate: true,
  },
  submitting: {
    bg: "bg-success/5",
    text: "text-success",
    border: "border-success/30",
    dotColor: "bg-success",
    animate: true,
  },
  verified_onchain: {
    bg: "bg-success/5",
    text: "text-success",
    border: "border-success/30",
    dotColor: "bg-success",
    animate: false,
  },
  failed: {
    bg: "bg-danger/5",
    text: "text-danger",
    border: "border-danger/30",
    dotColor: "bg-danger",
    animate: false,
  },
};

export function StatusBadge({ phase }: { phase: JobPhase }) {
  const config = PHASE_CONFIG[phase];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${config.border} ${config.bg}`}
    >
      <div
        className={`h-1.5 w-1.5 rounded-full ${config.dotColor} ${
          config.animate ? "animate-pulse-dot" : ""
        }`}
      />
      <span className={`text-xs font-medium ${config.text}`}>
        {PHASE_LABEL[phase]}
      </span>
    </div>
  );
}
