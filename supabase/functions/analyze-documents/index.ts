import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { submission_id } = await req.json();
    if (!submission_id) {
      return new Response(JSON.stringify({ error: "submission_id is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Use service role for full access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify user is authenticated and has admin/staff role
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check user has admin or staff role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .in("role", ["admin", "staff"])
      .limit(1);

    if (!roleData || roleData.length === 0) {
      return new Response(JSON.stringify({ error: "Forbidden: insufficient permissions" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Update submission status to analyzing
    await supabaseAdmin.from("document_submissions").update({ status: "analyzing" }).eq("id", submission_id);

    // Get submission details
    const { data: submission } = await supabaseAdmin
      .from("document_submissions")
      .select("*, clients(full_name, email, phone, cpf)")
      .eq("id", submission_id)
      .single();

    if (!submission) {
      return new Response(JSON.stringify({ error: "Submission not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get attached documents
    const { data: documents } = await supabaseAdmin
      .from("submission_documents")
      .select("*")
      .eq("submission_id", submission_id);

    const legalAreaMap: Record<string, string> = {
      bancario: "Direito Bancário",
      trabalhista: "Direito Trabalhista",
      empresarial: "Direito Empresarial",
      consumidor: "Direito do Consumidor",
      familia: "Direito de Família",
      imobiliario: "Direito Imobiliário",
      tributario: "Direito Tributário",
      outro: "Outro",
    };

    const areaLabel = legalAreaMap[submission.legal_area] || submission.legal_area;

    // Build prompt for AI analysis
    const prompt = `Você é um assistente jurídico especializado em ${areaLabel} no Brasil.

Analise o seguinte caso jurídico e forneça uma análise técnica estruturada.

**Dados do Cliente:**
- Nome: ${submission.clients?.full_name || "Não informado"}
- CPF: ${submission.clients?.cpf || "Não informado"}

**Área Jurídica:** ${areaLabel}

**Descrição do Problema:**
${submission.description}

**Documentos anexados:** ${documents?.length || 0} arquivo(s): ${documents?.map(d => d.file_name).join(", ") || "Nenhum"}

Por favor, forneça a análise usando EXATAMENTE a ferramenta fornecida.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você é um assistente jurídico especializado em direito brasileiro. Sempre responda usando a ferramenta fornecida." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "legal_analysis",
              description: "Retorna análise jurídica estruturada do caso",
              parameters: {
                type: "object",
                properties: {
                  extracted_data: {
                    type: "object",
                    properties: {
                      parties: { type: "array", items: { type: "string" }, description: "Partes envolvidas" },
                      values: { type: "array", items: { type: "string" }, description: "Valores monetários identificados" },
                      dates: { type: "array", items: { type: "string" }, description: "Datas relevantes" },
                      clauses: { type: "array", items: { type: "string" }, description: "Cláusulas ou artigos relevantes" },
                    },
                    required: ["parties", "values", "dates", "clauses"],
                    additionalProperties: false,
                  },
                  technical_summary: { type: "string", description: "Resumo técnico do caso em 3-5 parágrafos" },
                  suggested_thesis: { type: "string", description: "Tese jurídica sugerida" },
                  suggested_action_type: { type: "string", description: "Tipo de ação judicial sugerida" },
                  draft_document: { type: "string", description: "Minuta inicial da petição ou documento jurídico, em formato estruturado com cabeçalho, qualificação, fatos, direito e pedidos" },
                  viability_score: { type: "string", enum: ["low", "medium", "high"], description: "Score de viabilidade da ação" },
                },
                required: ["extracted_data", "technical_summary", "suggested_thesis", "suggested_action_type", "draft_document", "viability_score"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "legal_analysis" } },
      }),
    });

    if (!aiResponse.ok) {
      console.error("AI gateway error:", aiResponse.status, await aiResponse.text());
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente mais tarde." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI processing failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return structured analysis");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    // Save analysis
    const { error: insertError } = await supabaseAdmin.from("ai_analyses").insert({
      submission_id,
      extracted_data: analysis.extracted_data,
      technical_summary: analysis.technical_summary,
      suggested_thesis: analysis.suggested_thesis,
      suggested_action_type: analysis.suggested_action_type,
      draft_document: analysis.draft_document,
      viability_score: analysis.viability_score,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save analysis");
    }

    // Update submission status
    await supabaseAdmin.from("document_submissions").update({ status: "in_review" }).eq("id", submission_id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-documents error:", e);
    return new Response(JSON.stringify({ error: "Não foi possível processar a análise. Tente novamente." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
