import { useState } from "react";
import CyberLayout from "./cg/CyberLayout";
import CgDashboard from "./cg/pages/CgDashboard";
import CgRiskAnalysis from "./cg/pages/CgRiskAnalysis";
import CgRecommendations from "./cg/pages/CgRecommendations";
import CgWhatIf from "./cg/pages/CgWhatIf";
import CgAssets from "./cg/pages/CgAssets";
import CgVulnerabilities from "./cg/pages/CgVulnerabilities";
import CgReports from "./cg/pages/CgReports";
import CgThreatIntel from "./cg/pages/CgThreatIntel";

export type CgPage = "dashboard" | "assets" | "vulnerabilities" | "risk" | "threats" | "controls" | "ai" | "whatif" | "reports" | "settings";

export default function App() {
  const [page, setPage] = useState<CgPage>("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":       return <CgDashboard navigate={setPage} />;
      case "risk":            return <CgRiskAnalysis navigate={setPage} />;
      case "ai":              return <CgRecommendations navigate={setPage} />;
      case "whatif":          return <CgWhatIf navigate={setPage} />;
      case "assets":          return <CgAssets navigate={setPage} />;
      case "vulnerabilities": return <CgVulnerabilities navigate={setPage} />;
      case "threats":         return <CgThreatIntel navigate={setPage} />;
      case "reports":         return <CgReports navigate={setPage} />;
      default:                return <CgDashboard navigate={setPage} />;
    }
  };

  return (
    <CyberLayout page={page} navigate={setPage}>
      {renderPage()}
    </CyberLayout>
  );
}
