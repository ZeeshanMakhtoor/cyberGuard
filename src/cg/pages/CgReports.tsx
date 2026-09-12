import { useState } from "react";
import type { CgPage } from "../../App";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { exportGeneratedReportExcel } from "@/lib/exportExcel";
import V1Pill from "@/components/V1Pill";

interface Props { navigate: (p: CgPage) => void; }

const REPORT_TYPES = ["Executive", "Technical", "Compliance", "Risk", "Intel"] as const;

interface ReportRow { name: string; date: string; type: string; status: "Ready" | "Generating"; size: string }

const INITIAL_REPORTS: ReportRow[] = [
  { name: "Monthly Risk Executive Summary",  date: "01 Sep 2026", type: "Executive", status: "Ready",     size: "2.4 MB" },
  { name: "Vulnerability Assessment Report", date: "28 Aug 2026", type: "Technical", status: "Ready",     size: "8.1 MB" },
  { name: "RBI CSF Compliance Report Q2",    date: "15 Aug 2026", type: "Compliance",status: "Ready",     size: "3.7 MB" },
  { name: "FAIR Risk Quantification Report", date: "10 Aug 2026", type: "Risk",       status: "Ready",     size: "5.2 MB" },
  { name: "SEBI Cyber Resilience Report",    date: "05 Aug 2026", type: "Compliance",status: "Ready",     size: "2.9 MB" },
  { name: "Threat Intelligence Digest",      date: "01 Aug 2026", type: "Intel",      status: "Ready",     size: "1.8 MB" },
];

function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CgReports({ navigate }: Props) {
  const typeColors: Record<string, string> = {
    Executive: "#9CDFF0", Technical: "#60B8CF", Compliance: "#FBBF24", Risk: "#F87171", Intel: "#34D399",
  };
  const [reports, setReports] = useState<ReportRow[]>(INITIAL_REPORTS);
  const [previewing, setPreviewing] = useState<ReportRow | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<(typeof REPORT_TYPES)[number]>("Executive");
  const [downloadedName, setDownloadedName] = useState<string | null>(null);
  const [sharedName, setSharedName] = useState<string | null>(null);

  async function handleShare(r: ReportRow) {
    const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const link = `${window.location.origin}/reports/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // clipboard access denied — link is still shown via the confirmation state below
    }
    setSharedName(r.name);
    setTimeout(() => setSharedName(cur => (cur === r.name ? null : cur)), 2500);
  }

  function handleDownload(r: ReportRow) {
    exportGeneratedReportExcel({ name: r.name, type: r.type, date: r.date });
    setDownloadedName(r.name);
    setTimeout(() => setDownloadedName(cur => (cur === r.name ? null : cur)), 2000);
  }

  function handleGenerate() {
    const name = newName.trim() || `${newType} Report`;
    const row: ReportRow = { name, date: todayLabel(), type: newType, status: "Generating", size: "—" };
    setReports(prev => [row, ...prev]);
    setShowGenerateDialog(false);
    setNewName("");

    setTimeout(() => {
      setReports(prev => prev.map(r =>
        r === row ? { ...r, status: "Ready", size: `${(0.5 + Math.random() * 7).toFixed(1)} MB` } : r
      ));
    }, 2200);
  }

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Reports</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Auto-generated, board-ready security and compliance reports</p>
        </div>
        <button
          className="text-xs px-3 py-1.5 rounded-lg font-semibold"
          style={{ background: "var(--accent)", color: "var(--bg)" }}
          onClick={() => setShowGenerateDialog(true)}
        >
          + Generate Report
        </button>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Generated Reports</p>
        <V1Pill label="Generate, View, Download (Excel) and Share" compact />
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
                      <button className="text-xs font-semibold" style={{ color: "var(--accent)" }} onClick={() => setPreviewing(r)}>View Report</button>
                      <button
                        className="text-xs font-semibold disabled:opacity-40"
                        style={downloadedName === r.name ? { color: "#34D399" } : { color: "var(--muted)" }}
                        disabled={r.status !== "Ready"}
                        onClick={() => handleDownload(r)}
                      >
                        {downloadedName === r.name ? "Downloaded ✓" : "Download"}
                      </button>
                      <button
                        className="text-xs font-semibold"
                        style={sharedName === r.name ? { color: "#34D399" } : { color: "var(--muted)" }}
                        onClick={() => handleShare(r)}
                      >
                        {sharedName === r.name ? "Link copied ✓" : "Share"}
                      </button>
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
        <div className="flex items-center gap-1.5 mb-3">
          <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>SCHEDULED REPORTS</p>
          <V1Pill label="Illustrative recurring schedule" compact />
        </div>
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

      <Dialog open={!!previewing} onOpenChange={open => !open && setPreviewing(null)}>
        <DialogContent>
          {previewing && (
            <>
              <DialogHeader>
                <DialogTitle>{previewing.name}</DialogTitle>
                <DialogDescription>{previewing.type} report · {previewing.date} · {previewing.size}</DialogDescription>
              </DialogHeader>
              <div className="mt-4 rounded-lg border p-4 text-xs space-y-2" style={{ borderColor: "var(--border)", background: "#1a2f3c", color: "var(--muted)" }}>
                <p>This is a demo preview. In production this report would render its actual content here (charts, tables, narrative) pulled from the same risk data as the dashboard.</p>
                <p style={{ color: "var(--text)" }}>Report type: <span style={{ color: typeColors[previewing.type] }}>{previewing.type}</span></p>
              </div>
              <button
                className="w-full py-2 rounded-lg text-xs font-semibold mt-4 disabled:opacity-40"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
                disabled={previewing.status !== "Ready"}
                onClick={() => handleDownload(previewing)}
              >
                {downloadedName === previewing.name ? "Downloaded ✓" : "Download Report"}
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>Creates a new report from the current risk data.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Report name</label>
              <Input
                placeholder={`${newType} Report`}
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Type</label>
              <Select value={newType} onValueChange={v => setNewType(v as typeof newType)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <button
              className="w-full py-2 rounded-lg text-xs font-semibold mt-2"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
              onClick={handleGenerate}
            >
              Generate
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
