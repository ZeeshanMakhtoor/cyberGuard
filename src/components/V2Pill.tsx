interface Props {
  label: string;
  compact?: boolean;
}

/**
 * Flags a competitor-inspired feature added in the v2 pass (e.g. "Inspired
 * by Bitsight") so it reads as a deliberate upgrade rather than blending
 * into the original UI. `compact` shows just the "v2" badge (full context
 * in the tooltip) for tight spaces; the default spells out the label inline.
 */
export default function V2Pill({ label, compact = false }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
      style={{ background: "rgba(156,223,240,0.15)", color: "var(--accent)", border: "1px solid rgba(156,223,240,0.3)" }}
      title={label}
    >
      v2 {!compact && <span className="font-medium opacity-80">· {label}</span>}
    </span>
  );
}
