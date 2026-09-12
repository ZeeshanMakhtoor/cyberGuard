import { ReactNode, useState } from "react";
import type { CgPage } from "../App";
import { supabase } from "@/lib/supabaseClient";

const NAV = [
  { id: "dashboard",       icon: "⬛", label: "Dashboard",           svg: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "assets",          icon: "⬛", label: "Assets",               svg: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" },
  { id: "vulnerabilities", icon: "⬛", label: "Vulnerabilities",      svg: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
  { id: "risk",            icon: "⬛", label: "Risk Analysis",        svg: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "threats",         icon: "⬛", label: "Threat Intelligence",  svg: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
  { id: "controls",        icon: "⬛", label: "Security Controls",    svg: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { id: "ai",              icon: "⬛", label: "AI Recommendations",   svg: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "whatif",          icon: "⬛", label: "What-if Scenarios",    svg: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "investment",      icon: "⬛", label: "Investment Optimization", svg: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "compliance",      icon: "⬛", label: "Compliance",           svg: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  { id: "reports",         icon: "⬛", label: "Reports",              svg: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "settings",        icon: "⬛", label: "Settings",             svg: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
] as const;

interface Props {
  page: CgPage;
  navigate: (p: CgPage) => void;
  children: ReactNode;
  userEmail?: string;
}

export default function CyberLayout({ page, navigate, children, userEmail }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "RP";
  const displayName = userEmail ?? "Rahul Pandey";
  const displaySub = userEmail ? "CyberGuard AI" : "CISO · HDFC Bank";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col w-60 flex-shrink-0 border-r transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ background: "#0d1b26", borderColor: "var(--border)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--accent)", boxShadow: "0 0 12px rgba(156,223,240,0.35)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#10202C" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-sm leading-tight" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--accent)" }}>CyberGuard AI</div>
            <div className="text-xs leading-tight" style={{ color: "var(--muted)" }}>Risk Intelligence</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV.map(item => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { navigate(item.id as CgPage); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-medium transition-all"
                style={active
                  ? { background: "var(--panel)", color: "var(--accent)", borderLeft: "2px solid var(--accent)" }
                  : { color: "var(--muted)", borderLeft: "2px solid transparent" }
                }
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  {item.svg.split("M").filter(Boolean).map((d, i) => (
                    <path key={i} d={`M${d}`} />
                  ))}
                </svg>
                <span>{item.label}</span>
                {item.id === "vulnerabilities" && (
                  <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(248,113,113,0.2)", color: "#F87171" }}>86</span>
                )}
                {item.id === "ai" && (
                  <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(156,223,240,0.15)", color: "var(--accent)" }}>23</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Org / user footer */}
        <div className="px-3 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg" style={{ background: "var(--panel)" }}>
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--accent)", color: "var(--bg)" }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{displayName}</div>
              <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{displaySub}</div>
            </div>
            {userEmail && supabase && (
              <button
                title="Sign out"
                onClick={() => supabase?.auth.signOut()}
                className="p-1.5 rounded-md flex-shrink-0"
                style={{ color: "var(--muted)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              </button>
            )}
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center gap-3 px-5 h-13 flex-shrink-0 border-b"
          style={{ background: "#0d1b26", borderColor: "var(--border)", minHeight: 52 }}
        >
          <button className="lg:hidden p-1.5 rounded-md" style={{ color: "var(--muted)" }} onClick={() => setMobileOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              type="text"
              placeholder="Search assets, risks, CVEs..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-xs focus:outline-none"
              style={{ background: "var(--panel)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Org badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--ok)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--accent2)" }}>HDFC Bank Ltd.</span>
            </div>

            {/* Icons */}
            {[
              { title: "Help", path: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", badge: null },
              { title: "Notifications", path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", badge: "4" },
            ].map(icon => (
              <button key={icon.title} title={icon.title} className="relative p-2 rounded-lg hover:bg-white/5 transition">
                <svg className="w-4 h-4" style={{ color: "var(--muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon.path}/>
                </svg>
                {icon.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: "#F87171", color: "#fff", fontSize: 9 }}>{icon.badge}</span>
                )}
              </button>
            ))}

            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer" style={{ background: "var(--accent)", color: "var(--bg)" }}>{initials}</div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
