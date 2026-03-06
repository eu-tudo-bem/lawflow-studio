import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_URL = "https://fernandezefernandes.adv.br";

const LEGAL_AREAS_TO_MONITOR = [
  { id: "familia", name: "Direito de Família", keywords: ["pensão alimentícia", "divórcio", "guarda", "adoção", "alimentos", "inventário"] },
  { id: "civil", name: "Direito Civil", keywords: ["contratos", "responsabilidade civil", "posse", "propriedade", "danos", "indenização"] },
  { id: "imobiliario", name: "Direito Imobiliário", keywords: ["locação", "compra e venda imóvel", "usucapião", "FGTS habitação", "financiamento imobiliário"] },
  { id: "agrario", name: "Direito Agrário", keywords: ["reforma agrária", "posse rural", "ITR", "assentamento", "arrendamento rural"] },
  { id: "trabalhista", name: "Direito do Trabalho", keywords: ["rescisão", "horas extras", "FGTS", "reforma trabalhista", "teletrabalho"] },
  { id: "consumidor", name: "Direito do Consumidor", keywords: ["superendividamento", "CDC", "fraude PIX", "cancelamento contrato", "cobrança indevida"] },
];

async function callAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI error ${response.status}: ${err}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function cleanJSON(raw: string): string {
  return raw
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Auth check - allow cron or authenticated staff/admin
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "").trim() || "";
    const isCron = token === SUPABASE_ANON_KEY.trim() || token === "";

    let requestedAreas: string[] | null = null;

    if (!isCron) {
      const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader || "" } },
      });
      const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
      if (userError || !userData?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .in("role", ["admin", "staff"])
        .limit(1);
      if (!roleData || roleData.length === 0) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Manual call can specify areas
      if (req.headers.get("Content-Type")?.includes("application/json")) {
        try {
          const body = await req.json();
          if (body.areas) requestedAreas = body.areas;
        } catch { /* no body */ }
      }
    }

    const areasToScan = requestedAreas
      ? LEGAL_AREAS_TO_MONITOR.filter((a) => requestedAreas!.includes(a.id))
      : LEGAL_AREAS_TO_MONITOR;

    // Get already-known changes to avoid duplicates
    const { data: knownChanges } = await supabase
      .from("legal_changes")
      .select("titulo, norma_referencia")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const knownTitles = (knownChanges || []).map((c: any) => c.titulo?.toLowerCase());

    // Get admin user for blog post author
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1)
      .single();

    // Get the "Atualizações da Lei" category
    const { data: updateCategory } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", "atualizacoes-da-lei")
      .single();

    let totalChanges = 0;
    let totalPosts = 0;
    const results: any[] = [];

    // ─── STEP 1: Detect legal changes per area ───────────────────────────────
    for (const area of areasToScan) {
      try {
        const detectPrompt = `Você é um especialista em legislação brasileira e monitora diariamente mudanças legais.

DATA ATUAL: ${new Date().toLocaleDateString("pt-BR")}
ÁREA JURÍDICA: ${area.name}
PALAVRAS-CHAVE DA ÁREA: ${area.keywords.join(", ")}

TAREFA: Identifique 2 mudanças legislativas, decisões judiciais ou novas normas RECENTES (últimas semanas/meses) que sejam relevantes para a área de ${area.name} no Brasil.

Considere:
- Novas leis ou alterações sancionadas
- Decisões importantes do STF, STJ ou TST
- Resoluções do CNJ com impacto prático
- Medidas provisórias em vigor
- Atualizações no Código Civil, CLT, CDC
- Mudanças de entendimento jurisprudencial relevantes

MUDANÇAS JÁ REGISTRADAS (NÃO REPITA): ${knownTitles.length > 0 ? knownTitles.join("; ") : "(nenhuma)"}

Responda APENAS com JSON válido:
{
  "mudancas": [
    {
      "titulo": "Título claro descrevendo a mudança",
      "resumo": "Resumo em 2-3 frases do que mudou",
      "area_direito": "${area.id}",
      "tipo_impacto": "ex: revisão de pensão, cobrança de alimentos, rescisão contratual",
      "fonte": "ex: STF, STJ, Congresso Nacional, CNJ, Presidência da República",
      "norma_referencia": "ex: Lei 14.xxx/2024, Súmula 123 STJ",
      "palavras_chave": ["kw1", "kw2", "kw3"],
      "servico_juridico": "tipo de serviço advocatício relacionado"
    }
  ]
}`;

        const detectRaw = await callAI(LOVABLE_API_KEY, detectPrompt);
        let detectData: any;
        try {
          detectData = JSON.parse(cleanJSON(detectRaw));
        } catch {
          console.warn(`Parse error for area ${area.id}, skipping`);
          continue;
        }

        const mudancas: any[] = detectData.mudancas || [];

        for (const mudanca of mudancas) {
          if (!mudanca.titulo) continue;
          // Skip if already known
          if (knownTitles.some((t: string) => t.includes(mudanca.titulo.toLowerCase().substring(0, 30)))) continue;

          // Insert into legal_changes table
          const { data: changeRecord, error: changeErr } = await supabase
            .from("legal_changes")
            .insert({
              titulo: mudanca.titulo,
              resumo: mudanca.resumo,
              area_direito: mudanca.area_direito || area.id,
              tipo_impacto: mudanca.tipo_impacto,
              fonte: mudanca.fonte,
              norma_referencia: mudanca.norma_referencia,
              palavras_chave: mudanca.palavras_chave || [],
              status: "detected",
            })
            .select("id")
            .single();

          if (changeErr) {
            console.error("Error inserting change:", changeErr);
            continue;
          }

          totalChanges++;

          // ─── STEP 2: Generate SEO page for this change ─────────────────────
          if (!adminRole || !updateCategory) {
            console.warn("No admin or category found, skipping post generation");
            continue;
          }

          const pagePrompt = `Você é um redator jurídico especializado em conteúdo SEO para escritórios de advocacia.

MUDANÇA JURÍDICA DETECTADA:
Título: ${mudanca.titulo}
Resumo: ${mudanca.resumo}
Área: ${area.name}
Fonte: ${mudanca.fonte}
Norma: ${mudanca.norma_referencia}
Tipo de impacto: ${mudanca.tipo_impacto}
Palavras-chave: ${(mudanca.palavras_chave || []).join(", ")}

TAREFA: Crie uma página SEO completa sobre esta mudança jurídica.

REGRAS OBRIGATÓRIAS:
- Conteúdo EXCLUSIVAMENTE informativo (Provimento 205/2021 OAB)
- Sem promessa de resultado ou garantia de sucesso
- Sem linguagem sensacionalista ou alarmista
- Linguagem acessível para cidadão comum
- Entre 1000 e 1400 palavras
- Use HTML semântico

ESTRUTURA DA PÁGINA (HTML):

1. <h1>Título SEO otimizado (máx 65 chars, inclua a mudança + impacto prático)</h1>

2. Introdução (2-3 parágrafos):
   - O que mudou exatamente
   - Quando entra/entrou em vigor
   - Por que isso é importante para os cidadãos

3. Seções com H2:
   <h2>O Que Mudou na Lei</h2>
   <h2>Quem Será Afetado</h2>
   <h2>Como Funciona Agora</h2>
   <h2>O Que Fazer Nessa Situação</h2>
   <h2>Quando Procurar um Advogado</h2>

4. FAQ com 5 perguntas reais de busca do Google:
   <h2>Perguntas Frequentes</h2>
   <h3>Pergunta?</h3>
   <p>Resposta objetiva.</p>

5. Conclusão:
   <h2>Conclusão</h2>
   <p>Resumo + "Se você tem dúvidas sobre [tema], consulte um advogado especializado em ${area.name} para orientação personalizada."</p>
   <p>📞 <a href="${BASE_URL}/#contato">Entre em contato com nossa equipe</a> — atendemos em todo o Paraná.</p>

6. Um link interno: <a href="${BASE_URL}/#servicos">Conheça nossos serviços jurídicos</a>

Ao final do HTML, adicione uma linha separada com os metadados SEO no formato JSON (fora do HTML):
{"meta_title":"...","meta_description":"...","slug":"slug-sem-acentos-max-60-chars","excerpt":"..."}

IMPORTANTE: Escreva APENAS o HTML + linha de JSON no final. Comece com <h1>.`;

          const pageRaw = await callAI(LOVABLE_API_KEY, pagePrompt);

          // Split HTML from JSON metadata line
          const jsonMatch = pageRaw.match(/\{[^{]*"meta_title"[^}]*\}/);
          const htmlContent = jsonMatch
            ? pageRaw.substring(0, pageRaw.lastIndexOf(jsonMatch[0])).trim()
            : pageRaw.replace(/```html\s*/g, "").replace(/```\s*/g, "").trim();

          let pageMeta: any = {};
          if (jsonMatch) {
            try {
              pageMeta = JSON.parse(jsonMatch[0]);
            } catch { /* use defaults */ }
          }

          // Extract title from H1
          const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
          const postTitle = h1Match
            ? h1Match[1].replace(/<[^>]+>/g, "").trim()
            : pageMeta.meta_title || mudanca.titulo;

          // Generate slug
          let slug = (pageMeta.slug || mudanca.titulo)
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .substring(0, 70);

          // Ensure unique slug
          const { data: existingSlug } = await supabase
            .from("blog_posts")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();
          if (existingSlug) slug = `${slug}-${Date.now()}`;

          const excerptText = (pageMeta.excerpt || mudanca.resumo || "").substring(0, 255);

          const { data: post, error: postErr } = await supabase
            .from("blog_posts")
            .insert({
              title: postTitle,
              slug,
              content: htmlContent,
              excerpt: excerptText,
              meta_title: pageMeta.meta_title || postTitle,
              meta_description: pageMeta.meta_description || mudanca.resumo,
              status: "published",
              published_at: new Date().toISOString(),
              author_id: adminRole.user_id,
              category_id: updateCategory.id,
              tags: [area.id, ...(mudanca.palavras_chave || []).slice(0, 4), "atualizacoes-da-lei"],
            })
            .select("id")
            .single();

          if (postErr) {
            console.error("Post insert error:", postErr);
            continue;
          }

          // Update legal_changes record with blog_post_id and published status
          await supabase
            .from("legal_changes")
            .update({ status: "published", blog_post_id: post.id })
            .eq("id", changeRecord.id);

          totalPosts++;
          results.push({ titulo: mudanca.titulo, area: area.id, slug, post_id: post.id });
          console.log(`✅ Published: "${postTitle}" [${area.name}]`);
        }
      } catch (areaErr) {
        console.error(`Error processing area ${area.id}:`, areaErr);
      }
    }

    // ─── STEP 3: Log the execution ────────────────────────────────────────────
    const duration = Date.now() - startTime;
    await supabase.from("legal_monitor_logs").insert({
      status: totalChanges > 0 ? "success" : "no_changes",
      changes_found: totalChanges,
      posts_generated: totalPosts,
      duration_ms: duration,
      areas_scanned: areasToScan.map((a) => a.id),
    });

    return new Response(
      JSON.stringify({
        success: true,
        changes_found: totalChanges,
        posts_generated: totalPosts,
        duration_ms: duration,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const duration = Date.now() - startTime;
    console.error("legal-monitor error:", e);

    // Try to log the error
    try {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from("legal_monitor_logs").insert({
        status: "error",
        changes_found: 0,
        posts_generated: 0,
        duration_ms: duration,
        error_message: e instanceof Error ? e.message : String(e),
        areas_scanned: [],
      });
    } catch { /* ignore logging error */ }

    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
