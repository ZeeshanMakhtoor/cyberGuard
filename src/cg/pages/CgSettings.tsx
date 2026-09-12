import { useState } from "react";
import type { CgPage } from "../../App";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Props { navigate: (p: CgPage) => void; }

const SECTIONS = [
  { id: "org",          label: "Organization" },
  { id: "users",        label: "Users" },
  { id: "integrations", label: "Security Integrations" },
  { id: "notifications",label: "Notification Preferences" },
  { id: "risk",         label: "Risk Calculation Settings" },
  { id: "ai",           label: "AI Settings" },
  { id: "frameworks",   label: "Framework Settings" },
] as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>{label}</label>
      <input
        defaultValue={value}
        className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
        style={{ background: "#1a2f3c", border: "1px solid var(--border)", color: "var(--text)" }}
      />
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs" style={{ color: "var(--text)" }}>{label}</span>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

const ROLES = ["CISO", "Security Analyst", "Compliance Officer", "IT Admin", "Auditor"] as const;

interface UserRow { name: string; role: (typeof ROLES)[number]; email: string }

const INITIAL_USERS: UserRow[] = [
  { name: "Rahul Pandey", role: "CISO", email: "rahul.pandey@hdfcbank.com" },
  { name: "Anita Verma",  role: "Security Analyst", email: "anita.verma@hdfcbank.com" },
  { name: "Vikram Shah",  role: "Compliance Officer", email: "vikram.shah@hdfcbank.com" },
];

interface IntegrationRow { name: string; type: string; status: "Connected" | "Not Connected" }

const INITIAL_INTEGRATIONS: IntegrationRow[] = [
  { name: "Qualys VM",      type: "Vulnerability Mgmt", status: "Connected" },
  { name: "Splunk SIEM",    type: "SIEM",                status: "Connected" },
  { name: "Okta",           type: "IAM",                 status: "Connected" },
  { name: "CrowdStrike EDR",type: "EDR",                 status: "Connected" },
  { name: "Wiz CSPM",       type: "CSPM",                status: "Not Connected" },
];

export default function CgSettings({ navigate }: Props) {
  const [active, setActive] = useState<(typeof SECTIONS)[number]["id"]>("org");

  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<(typeof ROLES)[number]>("Security Analyst");

  function handleInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setUsers(prev => [...prev, { name: inviteName.trim(), email: inviteEmail.trim(), role: inviteRole }]);
    setShowInviteDialog(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Security Analyst");
  }

  function handleRemoveUser(email: string) {
    setUsers(prev => prev.filter(u => u.email !== email));
  }

  const [integrations, setIntegrations] = useState<IntegrationRow[]>(INITIAL_INTEGRATIONS);
  const [connecting, setConnecting] = useState<string | null>(null);

  function toggleIntegration(name: string) {
    setConnecting(name);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i =>
        i.name === name ? { ...i, status: i.status === "Connected" ? "Not Connected" : "Connected" } : i
      ));
      setConnecting(null);
    }, 900);
  }

  return (
    <div className="p-5 max-w-screen-xl mx-auto">
      <h1 className="text-base font-bold mb-0.5" style={{ fontFamily: "'Outfit',sans-serif" }}>Settings</h1>
      <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>Organization, integrations, and platform configuration</p>

      <Tabs value={active} onValueChange={v => setActive(v as typeof active)} className="flex gap-5">
        <TabsList className="w-52 flex-shrink-0">
          {SECTIONS.map(s => (
            <TabsTrigger key={s.id} value={s.id}>{s.label}</TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 rounded-xl border p-5" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          {active === "org" && (
            <div className="space-y-4 max-w-md">
              <Field label="Organization Name" value="HDFC Bank Ltd." />
              <Field label="Industry" value="Banking & Financial Services" />
              <Field label="Regulatory Jurisdiction" value="India (RBI, SEBI)" />
              <Field label="Fiscal Year" value="Apr – Mar" />
            </div>
          )}

          {active === "users" && (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.email} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: "#1a2f3c" }}>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{u.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(156,223,240,0.12)", color: "var(--accent)" }}>{u.role}</span>
                    <button className="text-xs font-semibold" style={{ color: "#F87171" }} onClick={() => handleRemoveUser(u.email)}>Remove</button>
                  </div>
                </div>
              ))}
              <button className="text-xs font-semibold mt-2" style={{ color: "var(--accent)" }} onClick={() => setShowInviteDialog(true)}>+ Invite User</button>
            </div>
          )}

          {active === "integrations" && (
            <div className="space-y-2">
              {integrations.map(i => (
                <div key={i.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: "#1a2f3c" }}>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{i.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{i.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded font-semibold"
                      style={{
                        background: i.status === "Connected" ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
                        color: i.status === "Connected" ? "#34D399" : "var(--muted)",
                      }}
                    >
                      {connecting === i.name ? (i.status === "Connected" ? "Disconnecting…" : "Connecting…") : i.status}
                    </span>
                    <button
                      className="text-xs font-semibold disabled:opacity-50"
                      style={{ color: i.status === "Connected" ? "#F87171" : "var(--accent)" }}
                      disabled={connecting === i.name}
                      onClick={() => toggleIntegration(i.name)}
                    >
                      {i.status === "Connected" ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {active === "notifications" && (
            <div className="max-w-md divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Toggle label="Critical vulnerability alerts" defaultOn />
              <Toggle label="Weekly executive digest" defaultOn />
              <Toggle label="Threat intelligence updates" defaultOn />
              <Toggle label="Compliance evidence expiry reminders" />
              <Toggle label="AI recommendation notifications" defaultOn />
            </div>
          )}

          {active === "risk" && (
            <div className="space-y-4 max-w-md">
              <Field label="Currency" value="INR (₹)" />
              <Field label="Risk Refresh Interval" value="Continuous (real-time)" />
              <Field label="Value-at-Risk Confidence Level" value="95%" />
              <Field label="Asset Criticality Weighting" value="Business-impact weighted" />
            </div>
          )}

          {active === "ai" && (
            <div className="max-w-md divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Toggle label="AI mitigation recommendations" defaultOn />
              <Toggle label="Predictive risk analytics" defaultOn />
              <Toggle label="Natural language query assistant" defaultOn />
              <Toggle label="Auto-run scenario simulations weekly" />
            </div>
          )}

          {active === "frameworks" && (
            <div className="max-w-md divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Toggle label="ISO/IEC 27001" defaultOn />
              <Toggle label="NIST CSF" defaultOn />
              <Toggle label="CIS Controls" defaultOn />
              <Toggle label="RBI Cyber Security Framework" defaultOn />
              <Toggle label="SEBI CSCRF" defaultOn />
              <button className="text-xs font-semibold mt-3" style={{ color: "var(--accent)" }} onClick={() => navigate("compliance")}>
                View Compliance Mapping →
              </button>
            </div>
          )}
        </div>
      </Tabs>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>Send an invite to join this organization's CyberGuard AI workspace.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Full name</label>
              <Input placeholder="Jane Doe" value={inviteName} onChange={e => setInviteName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Email</label>
              <Input type="email" placeholder="jane.doe@hdfcbank.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Role</label>
              <Select value={inviteRole} onValueChange={v => setInviteRole(v as typeof inviteRole)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <button
              className="w-full py-2 rounded-lg text-xs font-semibold mt-2 disabled:opacity-50"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
              disabled={!inviteName.trim() || !inviteEmail.trim()}
              onClick={handleInvite}
            >
              Send Invite
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
