import { LayoutDashboard, ShieldAlert, Radar, ClipboardCheck, FileText, Settings, Search, Bell } from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, active: true },
  { icon: ShieldAlert, active: false },
  { icon: Radar, active: false },
  { icon: ClipboardCheck, active: false },
  { icon: FileText, active: false },
  { icon: Settings, active: false },
];

const BARS = [42, 58, 51, 66, 60, 74, 69, 80, 72, 62, 55, 48];

/**
 * A static, stylized recreation of the CyberGuard AI dashboard — used as
 * the hero "product screenshot" the way FinRise/WeEats-style landing pages
 * frame a browser mockup of the real app, without shipping an actual
 * screenshot image (which would need updating every time the UI changes).
 */
export default function DashboardMockup() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}>
      <div className="flex" style={{ minHeight: 340 }}>
        <aside className="hidden sm:flex flex-col items-center gap-3 py-5 px-3" style={{ background: "#0F2530", width: 56 }}>
          <div className="w-7 h-7 rounded-md mb-2" style={{ background: "var(--lp-accent)" }} />
          {NAV_ITEMS.map((item, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: item.active ? "rgba(14,122,152,0.35)" : "transparent" }}
            >
              <item.icon className="w-4 h-4" style={{ color: item.active ? "#fff" : "rgba(255,255,255,0.45)" }} strokeWidth={2} />
            </div>
          ))}
        </aside>

        <div className="flex-1 p-4 sm:p-5" style={{ background: "#F8FAFB" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold" style={{ color: "#0F2530", fontFamily: "'Outfit',sans-serif" }}>Security Risk Dashboard</p>
              <p className="text-xs" style={{ color: "#5B7280" }}>HDFC Bank Ltd. · Live</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#fff", border: "1px solid #E1E7EC" }}>
                <Search className="w-3.5 h-3.5" style={{ color: "#5B7280" }} />
              </div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#fff", border: "1px solid #E1E7EC" }}>
                <Bell className="w-3.5 h-3.5" style={{ color: "#5B7280" }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5 mb-4">
            {[
              { label: "Risk Score", value: "49/100", color: "#0E7A98" },
              { label: "Critical Vulns", value: "7", color: "#DC2626" },
              { label: "Annual Loss", value: "₹2.45Cr", color: "#B45309" },
              { label: "Compliance", value: "84%", color: "#15803D" },
            ].map(k => (
              <div key={k.label} className="rounded-lg p-2.5" style={{ background: "#fff", border: "1px solid #E1E7EC" }}>
                <p className="text-[10px] leading-tight" style={{ color: "#5B7280" }}>{k.label}</p>
                <p className="text-sm font-extrabold mt-1" style={{ color: k.color, fontFamily: "'Outfit',sans-serif" }}>{k.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2 rounded-lg p-3" style={{ background: "#fff", border: "1px solid #E1E7EC" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#5B7280" }}>Expected Annual Loss</p>
              <svg viewBox="0 0 220 60" className="w-full" style={{ height: 60 }}>
                <polyline
                  fill="none"
                  stroke="#0E7A98"
                  strokeWidth="2"
                  points="0,42 20,38 40,45 60,30 80,35 100,20 120,28 140,15 160,22 180,10 200,18 220,8"
                />
                <polygon
                  fill="rgba(14,122,152,0.12)"
                  points="0,42 20,38 40,45 60,30 80,35 100,20 120,28 140,15 160,22 180,10 200,18 220,8 220,60 0,60"
                />
              </svg>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#fff", border: "1px solid #E1E7EC" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#5B7280" }}>Vulns by Severity</p>
              <div className="flex items-end gap-1.5" style={{ height: 60 }}>
                {BARS.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{ height: `${h}%`, background: i % 3 === 0 ? "#DC2626" : i % 3 === 1 ? "#B45309" : "#0E7A98" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
