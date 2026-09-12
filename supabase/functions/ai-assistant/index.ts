// Supabase Edge Function: ai-assistant
//
// Answers natural-language questions about CyberGuard AI's current risk
// posture using the Claude API. Feeds it a compact JSON summary pulled
// from the same tables the dashboard reads, so answers stay grounded in
// this org's actual (demo) data instead of hallucinating numbers.
//
// Requires the ANTHROPIC_API_KEY secret:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Deploy: supabase functions deploy ai-assistant
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CLAUDE_MODEL = "claude-sonnet-5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function buildRiskContext(supabaseUrl: string, serviceKey: string) {
  const client = createClient(supabaseUrl, serviceKey);

  const [{ data: latestRisk }, { data: topVulns }, { data: recs }] = await Promise.all([
    client.from("risk_snapshots").select("risk_score, expected_annual_loss_inr, value_at_risk_inr").order("captured_at", { ascending: false }).limit(1).maybeSingle(),
    client.from("vulnerabilities").select("cve, severity, status, estimated_financial_impact_inr, assets(name)").order("estimated_financial_impact_inr", { ascending: false }).limit(5),
    client.from("recommendations").select("title, estimated_cost_inr, risk_reduction_pct, financial_risk_reduced_inr").order("financial_risk_reduced_inr", { ascending: false }).limit(5),
  ]);

  return {
    latestRisk,
    topVulnerabilities: topVulns,
    recommendations: recs,
  };
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "question is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
        status: 501,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const context = await buildRiskContext(supabaseUrl, serviceKey);

    const systemPrompt = `You are the CyberGuard AI Assistant, embedded in a cyber risk quantification dashboard for a bank's CISO. Answer in 2-4 sentences, in the language of financial risk (₹), not just technical severity. Ground every answer in the data below — never invent numbers. If the data doesn't cover the question, say so plainly.

Current risk data (JSON):
${JSON.stringify(context, null, 2)}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return new Response(JSON.stringify({ error: `Claude API error: ${detail}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const answer = data.content?.[0]?.text ?? "I couldn't generate a response for that.";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
