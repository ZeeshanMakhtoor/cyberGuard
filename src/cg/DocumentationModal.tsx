import { useState } from "react";
import type { CgPage } from "@/App";
import { NAV } from "./CyberLayout";
import { PAGE_DOCS } from "./lib/helpDocsData";

interface Props {
  initialPage: CgPage;
  onClose: () => void;
  onNavigate: (p: CgPage) => void;
}

export default function DocumentationModal({ initialPage, onClose, onNavigate }: Props) {
  const [selected, setSelected] = useState<CgPage>(initialPage);
  const doc = PAGE_DOCS.find(d => d.id === selected) ?? PAGE_DOCS[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />

      <div
        className="relative w-full max-w-4xl h-[85vh] rounded-xl border flex flex-col overflow-hidden"
        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="text-sm font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>Documentation</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>A guide to every module, organized by tab</p>
          </div>
          <button
            className="p-1.5 rounded-md cg-hover transition"
            onClick={onClose}
            aria-label="Close documentation"
          >
            <svg className="w-4 h-4" style={{ color: "var(--muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Tab list */}
          <nav className="w-52 flex-shrink-0 overflow-y-auto border-r py-2 px-2 space-y-0.5" style={{ borderColor: "var(--border)" }}>
            {NAV.map(item => {
              const active = item.id === selected;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.id as CgPage)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-medium transition-all"
                  style={active
                    ? { background: "var(--panel2)", color: "var(--accent)", borderLeft: "2px solid var(--accent)" }
                    : { color: "var(--muted)", borderLeft: "2px solid transparent" }
                  }
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    {item.svg.split("M").filter(Boolean).map((d, i) => (
                      <path key={i} d={`M${d}`} />
                    ))}
                  </svg>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>{doc.tagline}</p>
              <h2 className="mt-1.5 text-xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{doc.label}</h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{doc.overview}</p>

              <div className="mt-6 space-y-6">
                {doc.sections.map(section => (
                  <div key={section.title}>
                    <h3
                      className="text-xs font-bold uppercase tracking-wide pb-2 mb-3 border-b"
                      style={{ color: "var(--text)", borderColor: "var(--border)" }}
                    >
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                          <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: "var(--accent)" }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button
                className="mt-8 mb-2 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg cg-hover transition"
                style={{ color: "var(--accent)", border: "1px solid var(--border)" }}
                onClick={() => { onNavigate(doc.id); onClose(); }}
              >
                Go to {doc.label}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
