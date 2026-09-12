import { useState, type FormEvent } from "react";
import type { CgPage } from "../../App";
import { useAssets } from "@/hooks/useAssets";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import V1Pill from "@/components/V1Pill";

interface Props { navigate: (p: CgPage) => void; }

const CRITICALITY_OPTIONS = ["All", "Critical", "High", "Medium", "Low"] as const;
const NEW_ASSET_CRITICALITY = ["Critical", "High", "Medium", "Low"] as const;
const PROTECTION_OPTIONS = ["Protected", "Partial", "Unprotected"] as const;
const ASSET_TYPES = ["Server", "Web App", "Cloud", "Network", "Database", "Endpoint"] as const;

export default function CgAssets({ navigate }: Props) {
  const { data: ASSETS, loading, addAsset } = useAssets();
  const [search, setSearch] = useState("");
  const [criticality, setCriticality] = useState<(typeof CRITICALITY_OPTIONS)[number]>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<(typeof ASSETS)[number] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", type: ASSET_TYPES[0] as string, criticality: "Medium" as (typeof NEW_ASSET_CRITICALITY)[number],
    owner: "", businessUnit: "", environment: "", riskScore: "50", exposureLakh: "10",
    protectionStatus: "Partial" as (typeof PROTECTION_OPTIONS)[number], internetFacing: false,
  });

  async function handleAddAsset(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.owner.trim()) {
      setFormError("Name and owner are required.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      await addAsset({
        name: form.name.trim(),
        type: form.type,
        criticality: form.criticality,
        owner: form.owner.trim(),
        businessUnit: form.businessUnit.trim() || "Unassigned",
        environment: form.environment.trim() || "On-prem",
        riskScore: Math.max(0, Math.min(100, Number(form.riskScore) || 0)),
        financialExposureInr: Math.max(0, Number(form.exposureLakh) || 0) * 100_000,
        protectionStatus: form.protectionStatus,
        internetFacing: form.internetFacing,
      });
      setAddOpen(false);
      setForm({ name: "", type: ASSET_TYPES[0], criticality: "Medium", owner: "", businessUnit: "", environment: "", riskScore: "50", exposureLakh: "10", protectionStatus: "Partial", internetFacing: false });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not add asset.");
    } finally {
      setSubmitting(false);
    }
  }
  const filtered = ASSETS
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()))
    .filter(a => criticality === "All" || a.criticality === criticality);

  const colorMap: Record<string, string> = {
    Critical: "#F87171", High: "#FBBF24", Medium: "var(--accent2)", Low: "#34D399",
  };

  if (loading) {
    return (
      <div className="p-5 max-w-screen-xl mx-auto space-y-5">
        <div className="h-16 rounded-xl animate-pulse" style={{ background: "var(--panel)" }} />
        <div className="h-96 rounded-xl animate-pulse" style={{ background: "var(--panel)" }} />
      </div>
    );
  }

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Asset Inventory</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{ASSETS.length} assets discovered · Last scan: 01 Sep 2026</p>
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--accent)", color: "var(--bg)" }} onClick={() => setAddOpen(true)}>
          + Add Asset
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Asset Summary</p>
        <V1Pill label="Live counts from Asset Inventory" compact />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Assets",    value: String(ASSETS.length), color: "var(--accent)" },
          { label: "Critical Assets", value: String(ASSETS.filter(a => a.criticality === "Critical").length), color: "#F87171" },
          { label: "Cloud Assets",    value: String(ASSETS.filter(a => a.type === "Cloud").length), color: "var(--accent2)" },
          { label: "High Risk (≥80)", value: String(ASSETS.filter(a => a.riskScore >= 80).length), color: "#FBBF24" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-xs focus:outline-none"
            style={{ background: "var(--panel)", color: "var(--text)", border: "1px solid var(--border)" }}
          />
        </div>
        <Select value={criticality} onValueChange={v => setCriticality(v as typeof criticality)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CRITICALITY_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt === "All" ? "All criticalities" : opt}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Asset Table</p>
        <V1Pill label="Full inventory with per-asset View + Add Asset" compact />
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--panel2)", borderBottom: "1px solid var(--border)" }}>
                {["Asset ID", "Name", "Type", "Criticality", "Vulnerabilities", "Risk Score", "Financial Exposure", "Owner", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} className="border-b cg-hover-soft transition cursor-pointer" style={{ borderColor: "var(--overlay-1)" }}>
                  <td className="px-4 py-3 font-mono" style={{ color: "var(--muted)" }}>{a.id}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>{a.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(81,150,167,0.15)", color: "var(--accent2)" }}>{a.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: colorMap[a.criticality] }}>{a.criticality}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold" style={{ color: a.vulns > 4 ? "#F87171" : a.vulns > 2 ? "#FBBF24" : "#34D399" }}>{a.vulns}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold" style={{ color: a.riskScore >= 80 ? "#F87171" : a.riskScore >= 65 ? "#FBBF24" : "var(--accent)" }}>{a.riskScore}</span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#FBBF24" }}>{a.exposure}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted)" }}>{a.owner}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs font-semibold" style={{ color: "var(--accent)" }} onClick={() => setViewingAsset(a)}>View</button>
                      <button className="text-xs font-semibold" style={{ color: "var(--muted)" }} onClick={() => navigate("vulnerabilities")}>Vulns</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Asset</DialogTitle>
            <DialogDescription>Register a new asset into the inventory and risk model.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAsset} className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Asset Name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Payment Gateway"
                className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                style={{ background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Type</label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Criticality</label>
                <Select value={form.criticality} onValueChange={v => setForm(f => ({ ...f, criticality: v as typeof form.criticality }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {NEW_ASSET_CRITICALITY.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Owner</label>
                <input
                  value={form.owner}
                  onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                  placeholder="e.g. IT Ops"
                  className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                  style={{ background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Business Unit</label>
                <input
                  value={form.businessUnit}
                  onChange={e => setForm(f => ({ ...f, businessUnit: e.target.value }))}
                  placeholder="e.g. Finance"
                  className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                  style={{ background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Environment</label>
                <input
                  value={form.environment}
                  onChange={e => setForm(f => ({ ...f, environment: e.target.value }))}
                  placeholder="e.g. AWS, On-prem"
                  className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                  style={{ background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Protection Status</label>
                <Select value={form.protectionStatus} onValueChange={v => setForm(f => ({ ...f, protectionStatus: v as typeof form.protectionStatus }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROTECTION_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Risk Score (0–100)</label>
                <input
                  type="number" min={0} max={100}
                  value={form.riskScore}
                  onChange={e => setForm(f => ({ ...f, riskScore: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                  style={{ background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Financial Exposure (₹ Lakh)</label>
                <input
                  type="number" min={0}
                  value={form.exposureLakh}
                  onChange={e => setForm(f => ({ ...f, exposureLakh: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                  style={{ background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs" style={{ color: "var(--text)" }}>
              <input type="checkbox" checked={form.internetFacing} onChange={e => setForm(f => ({ ...f, internetFacing: e.target.checked }))} />
              Internet-facing
            </label>

            {formError && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171" }}>{formError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full text-xs px-3 py-2.5 rounded-lg font-semibold disabled:opacity-60"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              {submitting ? "Adding…" : "Add Asset"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingAsset} onOpenChange={open => !open && setViewingAsset(null)}>
        <DialogContent>
          {viewingAsset && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingAsset.name}</DialogTitle>
                <DialogDescription>{viewingAsset.id} · {viewingAsset.type}</DialogDescription>
              </DialogHeader>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg p-3" style={{ background: "var(--panel2)", border: "1px solid var(--border)" }}>
                  <p style={{ color: "var(--muted)" }}>Criticality</p>
                  <p className="font-bold mt-0.5" style={{ color: colorMap[viewingAsset.criticality] }}>{viewingAsset.criticality}</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: "var(--panel2)", border: "1px solid var(--border)" }}>
                  <p style={{ color: "var(--muted)" }}>Risk Score</p>
                  <p className="font-bold font-mono mt-0.5" style={{ color: viewingAsset.riskScore >= 80 ? "#F87171" : viewingAsset.riskScore >= 65 ? "#FBBF24" : "var(--accent)" }}>{viewingAsset.riskScore}</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: "var(--panel2)", border: "1px solid var(--border)" }}>
                  <p style={{ color: "var(--muted)" }}>Vulnerabilities</p>
                  <p className="font-bold font-mono mt-0.5" style={{ color: viewingAsset.vulns > 4 ? "#F87171" : viewingAsset.vulns > 2 ? "#FBBF24" : "#34D399" }}>{viewingAsset.vulns}</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: "var(--panel2)", border: "1px solid var(--border)" }}>
                  <p style={{ color: "var(--muted)" }}>Financial Exposure</p>
                  <p className="font-bold font-mono mt-0.5" style={{ color: "#FBBF24" }}>{viewingAsset.exposure}</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: "var(--panel2)", border: "1px solid var(--border)" }}>
                  <p style={{ color: "var(--muted)" }}>IP Address</p>
                  <p className="font-bold font-mono mt-0.5" style={{ color: "var(--text)" }}>{viewingAsset.ip}</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: "var(--panel2)", border: "1px solid var(--border)" }}>
                  <p style={{ color: "var(--muted)" }}>Environment</p>
                  <p className="font-bold mt-0.5" style={{ color: "var(--text)" }}>{viewingAsset.env}</p>
                </div>
                <div className="rounded-lg p-3 col-span-2" style={{ background: "var(--panel2)", border: "1px solid var(--border)" }}>
                  <p style={{ color: "var(--muted)" }}>Owner</p>
                  <p className="font-bold mt-0.5" style={{ color: "var(--text)" }}>{viewingAsset.owner}</p>
                </div>
              </div>
              <button
                className="w-full py-2 rounded-lg text-xs font-semibold mt-4"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
                onClick={() => { setViewingAsset(null); navigate("vulnerabilities"); }}
              >
                View Vulnerabilities →
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
