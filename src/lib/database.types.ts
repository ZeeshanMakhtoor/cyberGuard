/**
 * Hand-written starter types for the Supabase schema in supabase/schema.sql.
 * Replace with the generated types once the project is live:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
 */
export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          name: string;
          owner: string;
          business_unit: string;
          type: string;
          criticality: "Critical" | "High" | "Medium" | "Low";
          risk_score: number;
          protection_status: "Protected" | "Partial" | "Unprotected";
          internet_facing: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["assets"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["assets"]["Insert"]>;
      };
      vulnerabilities: {
        Row: {
          id: string;
          cve: string;
          asset_id: string;
          severity: "Critical" | "High" | "Medium" | "Low";
          exploitability: string;
          business_criticality: string;
          estimated_financial_impact_inr: number;
          recommended_action: string;
          status: "Open" | "In Progress" | "Remediated" | "Accepted";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["vulnerabilities"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["vulnerabilities"]["Insert"]>;
      };
      risk_snapshots: {
        Row: {
          id: string;
          business_unit: string | null;
          risk_score: number;
          expected_annual_loss_inr: number;
          value_at_risk_inr: number;
          likelihood: number;
          financial_impact_inr: number;
          captured_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["risk_snapshots"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["risk_snapshots"]["Insert"]>;
      };
      controls: {
        Row: {
          id: string;
          name: string;
          effectiveness_pct: number;
          coverage_pct: number;
          risk_reduction_pct: number;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["controls"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["controls"]["Insert"]>;
      };
      recommendations: {
        Row: {
          id: string;
          title: string;
          estimated_cost_inr: number;
          risk_reduction_pct: number;
          financial_risk_reduced_inr: number;
          status: "Suggested" | "Accepted" | "Dismissed" | "Implemented";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["recommendations"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["recommendations"]["Insert"]>;
      };
      threats: {
        Row: {
          id: string;
          name: string;
          type: string;
          severity: "Critical" | "High" | "Medium" | "Low";
          relevance: "High" | "Medium" | "Low";
          sector: string;
          ioc_count: number;
          description: string;
          last_seen: string;
        };
        Insert: Omit<Database["public"]["Tables"]["threats"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["threats"]["Insert"]>;
      };
      compliance_frameworks: {
        Row: {
          id: string;
          name: string;
          description: string;
          compliance_pct: number;
          mapped_pct: number;
          missing_pct: number;
          evidence_status: "Current" | "Refresh due";
          last_assessed: string;
        };
        Insert: Omit<Database["public"]["Tables"]["compliance_frameworks"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["compliance_frameworks"]["Insert"]>;
      };
    };
  };
}
