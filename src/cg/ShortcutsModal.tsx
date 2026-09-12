interface Props {
  onClose: () => void;
}

function Key({ children }: { children: string }) {
  return (
    <kbd
      className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-xs font-semibold"
      style={{ background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)" }}
    >
      {children}
    </kbd>
  );
}

interface Shortcut { keys: string[]; desc: string }
interface Group { title: string; shortcuts: Shortcut[] }

const GROUPS: Group[] = [
  {
    title: "Global",
    shortcuts: [
      { keys: ["/"], desc: "Focus the search bar" },
      { keys: ["?"], desc: "Open this shortcuts reference" },
      { keys: ["Esc"], desc: "Close a menu, modal, or clear the search" },
    ],
  },
  {
    title: "Search",
    shortcuts: [
      { keys: ["Enter"], desc: "Jump to the top search result" },
      { keys: ["Esc"], desc: "Clear the search box" },
    ],
  },
  {
    title: "Jump to a tab (press g, then a letter)",
    shortcuts: [
      { keys: ["g", "d"], desc: "Dashboard" },
      { keys: ["g", "a"], desc: "Assets" },
      { keys: ["g", "v"], desc: "Vulnerabilities" },
      { keys: ["g", "r"], desc: "Risk Analysis" },
      { keys: ["g", "t"], desc: "Threat Intelligence" },
      { keys: ["g", "c"], desc: "Security Controls" },
      { keys: ["g", "i"], desc: "AI Recommendations" },
      { keys: ["g", "w"], desc: "What-if Scenarios" },
      { keys: ["g", "n"], desc: "Investment Optimization" },
      { keys: ["g", "o"], desc: "Compliance" },
      { keys: ["g", "p"], desc: "Reports" },
      { keys: ["g", "s"], desc: "Settings" },
    ],
  },
];

export default function ShortcutsModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />

      <div
        className="relative w-full max-w-lg max-h-[85vh] rounded-xl border flex flex-col overflow-hidden"
        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="text-sm font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>Keyboard Shortcuts</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Speed up navigation around CyberGuard AI</p>
          </div>
          <button className="p-1.5 rounded-md cg-hover transition" onClick={onClose} aria-label="Close shortcuts">
            <svg className="w-4 h-4" style={{ color: "var(--muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-6">
          {GROUPS.map(group => (
            <div key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "var(--accent)" }}>{group.title}</h3>
              <div className="space-y-2">
                {group.shortcuts.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-1">
                    <span className="text-sm" style={{ color: "var(--text)" }}>{s.desc}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {s.keys.map((k, j) => (
                        <span key={j} className="flex items-center gap-1">
                          {j > 0 && <span className="text-xs" style={{ color: "var(--muted)" }}>then</span>}
                          <Key>{k}</Key>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <p className="text-xs pt-2 border-t" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
            Shortcuts are disabled while typing in a text field.
          </p>
        </div>
      </div>
    </div>
  );
}
