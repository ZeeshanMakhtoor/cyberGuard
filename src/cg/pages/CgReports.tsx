import type { CgPage } from "../../App";

interface Props { navigate: (p: CgPage) => void; }

const reports = [
  { name: "Monthly Risk Executive Summary",  date: "01 Sep 2026", type: "Executive", status: "Ready",     size: "2.4 MB" },
  { name: "Vulnerability Assessment Report", date: "28 Aug 2026", type: "Technical", status: "Ready",     size: "8.1 MB" },
  { name: "RBI CSF Compliance Report Q2",    date: "15 Aug 2026", type: "Compliance",status: "Ready",     size: "3.7 MB" },
  { name: "FAIR Risk Quantification Report", date: "10 Aug 2026", type: "Risk",       status: "Ready",     size: "5.2 MB" },
  { name: "SEBI Cyber Resilience Report",    date: "05 Aug 2026", type: "Compliance",status: "Ready",     size: "2.9 MB" },
  { name: "Threat Intelligence Digest",      date: "01 Aug 2026", type: "Intel",      status: "Ready",     size: "1.8 MB" },
  { name: "Quarterly Board Risk Report",     date: "Generating…", type: "Executive", status: "Generating",size: "—" },
];

export default function CgReports({ navigate }: Props) {
  const typeColors: Record<string, string> = {
    Executive: "#9CDFF0", Technical: "#60B8CF", Compliance: "#FBBF24", Risk: "#F87171", Intel: "#34D399",
  };

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Reports</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Auto-generated, board-ready security and compliance reports</p>
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--accent)", color: "var(--bg)" }}>
          + Generate Report
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#1a2f3c", borderBottom: "1px solid var(--border)" }}>
                {["Report Name", "Date", "Type", "Status", "Size", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="border-b hover:bg-white/[0.02] transition" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>{r.name}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: "var(--muted)" }}>{r.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ color: typeColors[r.type], background: `${typeColors[r.type]}18` }}>{r.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "Generating" ? (
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "#FBBF24" }}>
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Generating…
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(52,211,153,0.12)", color: "#34D399" }}>Ready</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono" style={{ color: "var(--muted)" }}>{r.size}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button className="text-xs font-semibold" style={{ color: "var(--accent)" }}>Download</button>
                      <button className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Share</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled reports */}
      <div className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>SCHEDULED REPORTS</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { name: "Weekly Vuln Digest", schedule: "Every Monday, 08:00 IST", next: "08 Sep 2026" },
            { name: "Monthly Exec Summary", schedule: "1st of every month", next: "01 Oct 2026" },
            { name: "RBI Quarterly Compliance", schedule: "Every quarter-end", next: "30 Sep 2026" },
          ].map(s => (
            <div key={s.name} className="rounded-lg border p-3" style={{ background: "#1a2f3c", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>{s.name}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{s.schedule}</p>
              <p className="text-xs mt-1 font-mono" style={{ color: "var(--accent2)" }}>Next: {s.next}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
