interface Props {
  label: string;
  compact?: boolean;
}

/**
 * Flags an original (pre-competitor-analysis) feature so the app reads as
 * versioned end to end — v1 for the initial build, v2 for the
 * competitor-inspired additions layered on top. Same shape as V2Pill but
 * a neutral/muted color so it doesn't compete visually with the v2 accent.
 */
export default function V1Pill({ label, compact = false }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
      style={{ background: "rgba(148,163,184,0.12)", color: "var(--neutral)", border: "1px solid rgba(148,163,184,0.25)" }}
      title={label}
    >
      v1 {!compact && <span className="font-medium opacity-80">· {label}</span>}
    </span>
  );
}
