import type { CgPage } from "../../App";

interface Props { navigate: (p: CgPage) => void; }

const threats = [
  { id: "TI-001", name: "BlackMatter Ransomware", type: "Ransomware", severity: "Critical", relevance: "High", sector: "Banking", ioc: "37 IOCs", last: "28 Aug 2026", desc: "Actively targeting BFSI sector in South Asia. Exploits CVE-2024-21413 as initial access." },
  { id: "TI-002", name: "APT41 (Double Dragon)", type: "APT",         severity: "Critical", relevance: "High", sector: "Finance",  ioc: "124 IOCs",last: "25 Aug 2026", desc: "Chinese state-sponsored group. Recent campaigns against Indian financial institutions via spear-phishing." },
  { id: "TI-003", name: "Phishing Kit: Bank-Impersonation v3", type: "Phishing", severity: "High", relevance: "High", sector: "Banking", ioc: "8 domains",last: "30 Aug 2026", desc: "Active phishing kit mimicking HDFC/ICICI login pages. Hosted on .xyz domains." },
  { id: "TI-004", name: "Cobalt Strike Beacon C2",type: "C2 Server", severity: "High", relevance: "Medium", sector: "All", ioc: "3 IPs",last: "27 Aug 2026", desc: "Known C2 infrastructure observed in Indian telco ranges. Linked to financial sector campaigns." },
  { id: "TI-005", name: "Clop Ransomware",        type: "Ransomware", severity: "High", relevance: "Medium", sector: "BFSI",     ioc: "19 IOCs",  last: "20 Aug 2026", desc: "Exploiting Accellion / MOVEit vulnerabilities. Data exfiltration before encryption." },
];

export default function CgThreatIntel({ navigate }: Props) {
  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Threat Intelligence</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>OSINT + commercial feeds · Updated hourly · Sector-filtered: Banking / BFSI</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#F87171" }} />
          <span className="text-xs font-semibold" style={{ color: "#F87171" }}>THREAT LEVEL: HIGH</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Threats",     value: "17", color: "#F87171" },
          { label: "Sector-Relevant",    value: "9",  color: "#FBBF24" },
          { label: "Monitored IOCs",     value: "847",color: "var(--accent)" },
          { label: "Feeds Active",       value: "12", color: "var(--accent2)" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Threat cards */}
      <div className="space-y-3">
        {threats.map(t => (
          <div key={t.id} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>{t.id}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: "rgba(96,184,207,0.15)", color: "var(--accent2)" }}>{t.type}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ color: t.severity === "Critical" ? "#F87171" : "#FBBF24", background: t.severity === "Critical" ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.12)" }}>{t.severity}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: "rgba(52,211,153,0.1)", color: "#34D399" }}>Relevance: {t.relevance}</span>
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{t.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{t.desc}</p>
                <div className="flex gap-4 mt-2 text-xs" style={{ color: "var(--muted)" }}>
                  <span>🎯 {t.sector}</span>
                  <span>📍 {t.ioc}</span>
                  <span>📅 Last seen: {t.last}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "var(--accent)", color: "var(--bg)" }}>Block IOCs</button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: "var(--border)", color: "var(--muted)" }} onClick={() => navigate("vulnerabilities")}>Check Exposure</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
