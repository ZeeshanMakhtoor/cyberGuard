import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#F87171",
  warning: "#FBBF24",
  info: "var(--accent2)",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  return (
    <div className="relative">
      <button
        title="Notifications"
        className="relative p-2 rounded-lg cg-hover transition"
        onClick={() => { setOpen(o => !o); if (!open) markAllRead(); }}
      >
        <svg className="w-4 h-4" style={{ color: "var(--muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: "#F87171", color: "#fff", fontSize: 9 }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2.5rem)] rounded-xl border z-50 overflow-hidden"
            style={{ background: "var(--panel)", borderColor: "var(--border)" }}
          >
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>Notifications</p>
              {notifications.length > 0 && (
                <button className="text-xs font-semibold" style={{ color: "var(--muted)" }} onClick={clearAll}>Clear all</button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs px-4 py-6 text-center" style={{ color: "var(--muted)" }}>You're all caught up.</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 border-b" style={{ borderColor: "var(--overlay-1)" }}>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: SEVERITY_COLOR[n.severity] }} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{n.title}</p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted)" }}>{n.detail}</p>
                        <p className="text-xs mt-1 font-mono" style={{ color: "var(--muted)" }}>{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
