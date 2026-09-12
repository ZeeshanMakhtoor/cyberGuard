// Auto-generated from the live Supabase project (xfakrnxddgdxlrzoxabe) via
// mcp__Supabase__generate_typescript_types. Regenerate after schema changes:
//   npx supabase gen types typescript --project-id xfakrnxddgdxlrzoxabe > src/lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          business_unit: string
          created_at: string
          criticality: string
          environment: string | null
          financial_exposure_inr: number
          id: string
          internet_facing: boolean
          ip: string | null
          name: string
          owner: string
          protection_status: string
          risk_score: number
          type: string
        }
        Insert: {
          business_unit: string
          created_at?: string
          criticality: string
          environment?: string | null
          financial_exposure_inr?: number
          id?: string
          internet_facing?: boolean
          ip?: string | null
          name: string
          owner: string
          protection_status: string
          risk_score: number
          type: string
        }
        Update: {
          business_unit?: string
          created_at?: string
          criticality?: string
          environment?: string | null
          financial_exposure_inr?: number
          id?: string
          internet_facing?: boolean
          ip?: string | null
          name?: string
          owner?: string
          protection_status?: string
          risk_score?: number
          type?: string
        }
        Relationships: []
      }
      compliance_frameworks: {
        Row: {
          compliance_pct: number
          description: string
          evidence_status: string
          id: string
          last_assessed: string
          mapped_pct: number
          missing_pct: number
          name: string
        }
        Insert: {
          compliance_pct: number
          description: string
          evidence_status: string
          id?: string
          last_assessed?: string
          mapped_pct: number
          missing_pct: number
          name: string
        }
        Update: {
          compliance_pct?: number
          description?: string
          evidence_status?: string
          id?: string
          last_assessed?: string
          mapped_pct?: number
          missing_pct?: number
          name?: string
        }
        Relationships: []
      }
      controls: {
        Row: {
          coverage_pct: number
          effectiveness_pct: number
          id: string
          name: string
          risk_reduction_pct: number
          updated_at: string
        }
        Insert: {
          coverage_pct: number
          effectiveness_pct: number
          id?: string
          name: string
          risk_reduction_pct: number
          updated_at?: string
        }
        Update: {
          coverage_pct?: number
          effectiveness_pct?: number
          id?: string
          name?: string
          risk_reduction_pct?: number
          updated_at?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string
          estimated_cost_inr: number
          financial_risk_reduced_inr: number
          id: string
          risk_reduction_pct: number
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          estimated_cost_inr: number
          financial_risk_reduced_inr: number
          id?: string
          risk_reduction_pct: number
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          estimated_cost_inr?: number
          financial_risk_reduced_inr?: number
          id?: string
          risk_reduction_pct?: number
          status?: string
          title?: string
        }
        Relationships: []
      }
      risk_snapshots: {
        Row: {
          business_unit: string | null
          captured_at: string
          expected_annual_loss_inr: number
          financial_impact_inr: number
          id: string
          likelihood: number
          risk_score: number
          value_at_risk_inr: number
        }
        Insert: {
          business_unit?: string | null
          captured_at?: string
          expected_annual_loss_inr: number
          financial_impact_inr: number
          id?: string
          likelihood: number
          risk_score: number
          value_at_risk_inr: number
        }
        Update: {
          business_unit?: string | null
          captured_at?: string
          expected_annual_loss_inr?: number
          financial_impact_inr?: number
          id?: string
          likelihood?: number
          risk_score?: number
          value_at_risk_inr?: number
        }
        Relationships: []
      }
      threats: {
        Row: {
          description: string
          id: string
          ioc_count: number
          last_seen: string
          name: string
          relevance: string
          sector: string
          severity: string
          type: string
        }
        Insert: {
          description: string
          id?: string
          ioc_count?: number
          last_seen?: string
          name: string
          relevance: string
          sector: string
          severity: string
          type: string
        }
        Update: {
          description?: string
          id?: string
          ioc_count?: number
          last_seen?: string
          name?: string
          relevance?: string
          sector?: string
          severity?: string
          type?: string
        }
        Relationships: []
      }
      vulnerabilities: {
        Row: {
          asset_id: string | null
          business_criticality: string
          created_at: string
          cve: string
          cvss: number | null
          estimated_financial_impact_inr: number
          exploitability: string
          id: string
          recommended_action: string
          severity: string
          status: string
        }
        Insert: {
          asset_id?: string | null
          business_criticality: string
          created_at?: string
          cve: string
          cvss?: number | null
          estimated_financial_impact_inr?: number
          exploitability: string
          id?: string
          recommended_action: string
          severity: string
          status: string
        }
        Update: {
          asset_id?: string | null
          business_criticality?: string
          created_at?: string
          cve?: string
          cvss?: number | null
          estimated_financial_impact_inr?: number
          exploitability?: string
          id?: string
          recommended_action?: string
          severity?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "vulnerabilities_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
