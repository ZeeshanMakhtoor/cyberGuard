import { useState } from "react";
import CyberLayout from "./cg/CyberLayout";
import Login from "./cg/Login";
import { useAuth } from "@/hooks/useAuth";
import CgDashboard from "./cg/pages/CgDashboard";
import CgRiskAnalysis from "./cg/pages/CgRiskAnalysis";
import CgRecommendations from "./cg/pages/CgRecommendations";
import CgWhatIf from "./cg/pages/CgWhatIf";
import CgAssets from "./cg/pages/CgAssets";
import CgVulnerabilities from "./cg/pages/CgVulnerabilities";
import CgReports from "./cg/pages/CgReports";
import CgThreatIntel from "./cg/pages/CgThreatIntel";
import CgControls from "./cg/pages/CgControls";
import CgInvestment from "./cg/pages/CgInvestment";
import CgCompliance from "./cg/pages/CgCompliance";
import CgSettings from "./cg/pages/CgSettings";

export type CgPage =
  | "dashboard" | "assets" | "vulnerabilities" | "risk" | "threats"
  | "controls" | "ai" | "whatif" | "investment" | "compliance"
  | "reports" | "settings";

export default function App() {
  const [page, setPage] = useState<CgPage>("dashboard");
  const { session, ready, authRequired } = useAuth();

  if (authRequired && !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }
  if (authRequired && !session) {
    return <Login />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":       return <CgDashboard navigate={setPage} />;
      case "risk":            return <CgRiskAnalysis navigate={setPage} />;
      case "ai":              return <CgRecommendations navigate={setPage} />;
      case "whatif":          return <CgWhatIf navigate={setPage} />;
      case "investment":      return <CgInvestment navigate={setPage} />;
      case "assets":          return <CgAssets navigate={setPage} />;
      case "vulnerabilities": return <CgVulnerabilities navigate={setPage} />;
      case "threats":         return <CgThreatIntel navigate={setPage} />;
      case "controls":        return <CgControls navigate={setPage} />;
      case "compliance":      return <CgCompliance navigate={setPage} />;
      case "reports":         return <CgReports navigate={setPage} />;
      case "settings":        return <CgSettings navigate={setPage} />;
      default:                return <CgDashboard navigate={setPage} />;
    }
  };

  return (
    <CyberLayout page={page} navigate={setPage} userEmail={session?.user.email}>
      {renderPage()}
    </CyberLayout>
  );
}
