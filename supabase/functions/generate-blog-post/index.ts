import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";

const LEGAL_AREAS = [
  { id: "trabalhista", name: "Direito do Trabalho", topics: ["rescisão, FGTS, horas extras, férias, assédio moral, demissão, carteira assinada, salário atrasado, acidente de trabalho, estabilidade"] },
  { id: "familia", name: "Direito de Família", topics: ["divórcio, pensão alimentícia, guarda de filhos, inventário, testamento, união estável, partilha de bens, alienação parental"] },
  { id: "bancario", name: "Direito Bancário", topics: ["juros abusivos, empréstimo, financiamento, negativação indevida, renegociação de dívida, cartão de crédito, consignado, superendividamento"] },
  { id: "consumidor", name: "Direito do Consumidor", topics: ["produto defeituoso, propaganda enganosa, cobrança indevida, cancelamento de contrato, dano moral, recall, garantia, compra online"] },
];

const BASE_URL = "https://fernandezefernandes.adv.br";

async function callAI(apiKey: string, prompt: string) {
  // gemini-1.5-flash-latest: free tier 1.500 req/dia, 15 RPM, sem billing
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  const corsHeaders = getCorsHeaders(req);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Allow cron (anon key bearer) or authenticated staff/admin
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "").trim() || "";
    const isCronCall = token === SUPABASE_ANON_KEY.trim() || token === "";

    console.log("Auth check - isCronCall:", isCronCall, "token length:", token.length, "anon key length:", SUPABASE_ANON_KEY.length);

    if (!isCronCall) {
      // Verify user identity for manual calls
      const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader || "" } },
      });
      const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
      if (userError || !userData?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .in("role", ["admin", "staff"])
        .limit(1);
      if (!roleData || roleData.length === 0) {
        return new Response(JSON.stringify({ error: "Forbidden: insufficient permissions" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // 1. Get used topics to avoid repetition
    const { data: usedTopics } = await supabase
      .from("blog_topics_used")
      .select("keyword, legal_area");

    const usedKeywords = (usedTopics || []).map((t: any) => t.keyword);

    // 2. Count posts per legal area to balance distribution
    const areaCounts: Record<string, number> = {};
    for (const area of LEGAL_AREAS) {
      areaCounts[area.id] = (usedTopics || []).filter(
        (t: any) => t.legal_area === area.id
      ).length;
    }
    const sortedAreas = [...LEGAL_AREAS].sort(
      (a, b) => (areaCounts[a.id] || 0) - (areaCounts[b.id] || 0)
    );
    const chosenArea = sortedAreas[0];

    // 3. SINGLE AI CALL — gera trend, tópico e artigo completo de uma vez (economiza cota free tier)
    const unifiedPrompt = `Você é um especialista em SEO jurídico brasileiro e redator de conteúdo informativo.

DATA ATUAL: ${new Date().toLocaleDateString("pt-BR")}
ÁREA DO DIREITO: ${chosenArea.name}
SUBTEMAS: ${chosenArea.topics.join(", ")}
TEMAS JÁ USADOS (NÃO REPITA): ${usedKeywords.length > 0 ? usedKeywords.join(", ") : "(nenhum ainda)"}

TAREFA EM 2 PARTES — responda APENAS com JSON válido (sem markdown, sem code blocks):

PARTE 1 — Metadados SEO:
Identifique 1 tendência atual do Google Trends Brasil relacionada a ${chosenArea.name} e defina os metadados do artigo.

PARTE 2 — Artigo HTML completo:
Escreva um artigo de 900 a 1200 palavras seguindo o Provimento 205/2021 da OAB (informativo, sem promessa de resultado, sem sensacionalismo).

ESTRUTURA DO ARTIGO:
- <h1> com o título SEO exato
- Introdução (2-3 parágrafos) contextualizando a tendência e conectando à questão jurídica. Keyword no 1º parágrafo.
- 3-4 subtítulos <h2> com conteúdo rico (2-3 parágrafos cada)
- <h2>Perguntas Frequentes</h2> com 4 perguntas no formato <h3>Pergunta?</h3><p>Resposta.</p>
- <h2>Conclusão</h2> com CTA informativo
- UM link interno: <a href="${BASE_URL}/#servicos">conheça nossos serviços</a>

RESPONDA APENAS com este JSON (sem texto extra, sem markdown):
{
  "trend_used": "tendência identificada no Google Trends Brasil",
  "keyword": "palavra-chave principal (frase real de busca)",
  "secondary_keywords": ["kw2", "kw3", "kw4"],
  "title_seo": "Título SEO até 60 chars com a keyword",
  "meta_description": "Meta descrição até 160 chars persuasiva",
  "slug": "slug-otimizado-sem-acentos",
  "content_html": "<h1>...</h1><p>...artigo completo em HTML...</p>"
}`;

    const unifiedRaw = await callAI(LOVABLE_API_KEY, unifiedPrompt);
    const cleanedUnified = unifiedRaw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let topic: any;
    let content: string;

    try {
      const parsed = JSON.parse(cleanedUnified);
      topic = {
        trend_used: parsed.trend_used || "Tendência jurídica atual",
        keyword: parsed.keyword,
        secondary_keywords: parsed.secondary_keywords || [],
        title_seo: parsed.title_seo,
        meta_description: parsed.meta_description,
        slug: parsed.slug,
      };
      content = (parsed.content_html || "").replace(/```html\s*/g, "").replace(/```\s*/g, "").trim();
    } catch {
      console.error("Unified parse failed, using fallback");
      const safeSlug = `${chosenArea.id}-direitos-${Date.now()}`;
      topic = {
        trend_used: "Busca recorrente no Google Brasil",
        keyword: `${chosenArea.name.toLowerCase()} direitos`,
        secondary_keywords: chosenArea.topics[0].split(", ").slice(0, 3),
        title_seo: `Seus Direitos em ${chosenArea.name}: Guia Prático`,
        meta_description: `Entenda seus direitos em ${chosenArea.name}. Tire suas dúvidas e saiba como agir.`,
        slug: safeSlug,
      };
      content = `<h1>${topic.title_seo}</h1><p>Consulte nossa equipe para orientação em ${chosenArea.name}.</p>`;
    }

    console.log(`📊 Trend: "${topic.trend_used}" → Topic: "${topic.keyword}"`);


    // 6. Get admin user for author_id
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (!adminRole) throw new Error("No admin user found for author_id");

    // 7. Get or create a category for the legal area
    const { data: existingCat } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", chosenArea.id)
      .single();

    let categoryId: string;
    if (existingCat) {
      categoryId = existingCat.id;
    } else {
      const { data: newCat, error: catErr } = await supabase
        .from("blog_categories")
        .insert({ name: chosenArea.name, slug: chosenArea.id })
        .select("id")
        .single();
      if (catErr) throw new Error(`Category error: ${catErr.message}`);
      categoryId = newCat.id;
    }

    // 8. Build excerpt from content
    const excerptMatch = content.match(/<p>(.*?)<\/p>/);
    const excerpt = excerptMatch
      ? excerptMatch[1].replace(/<[^>]+>/g, "").substring(0, 250)
      : topic.meta_description;

    // 9. Insert the blog post — ensure unique slug
    let finalSlug = topic.slug;
    const { data: existingSlug } = await supabase.from("blog_posts").select("id").eq("slug", finalSlug).maybeSingle();
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const { data: post, error: postErr } = await supabase
      .from("blog_posts")
      .insert({
        title: topic.title_seo,
        slug: finalSlug,
        content,
        excerpt,
        meta_title: topic.title_seo,
        meta_description: topic.meta_description,
        status: "published",
        published_at: new Date().toISOString(),
        author_id: adminRole.user_id,
        category_id: categoryId,
        tags: [chosenArea.id, ...topic.secondary_keywords.slice(0, 3)],
      })
      .select("id")
      .single();

    if (postErr) throw new Error(`Post insert error: ${postErr.message}`);

    // 10. Record used topic (including trend reference)
    await supabase.from("blog_topics_used").insert({
      keyword: topic.keyword,
      secondary_keywords: [topic.trend_used, ...topic.secondary_keywords],
      legal_area: chosenArea.id,
      post_id: post.id,
    });

    // 11. Regenerate and upload sitemap.xml to storage
    try {
      const { data: allPosts } = await supabase
        .from("blog_posts")
        .select("slug, updated_at, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      const staticPages = [
        { loc: "/", changefreq: "weekly", priority: "1.0" },
        { loc: "/blog", changefreq: "daily", priority: "0.9" },
        { loc: "/calculadora", changefreq: "monthly", priority: "0.7" },
        { loc: "/simulador-pensao", changefreq: "monthly", priority: "0.7" },
        { loc: "/simulador-juros", changefreq: "monthly", priority: "0.7" },
        { loc: "/simulador-aposentadoria", changefreq: "monthly", priority: "0.7" },
        { loc: "/simulador-horas-extras", changefreq: "monthly", priority: "0.7" },
        { loc: "/pensao-alimenticia", changefreq: "monthly", priority: "0.8" },
        { loc: "/divorcio-consensual", changefreq: "monthly", priority: "0.8" },
        { loc: "/cobranca-aluguel", changefreq: "monthly", priority: "0.8" },
        { loc: "/direito-agrario", changefreq: "monthly", priority: "0.8" },
        { loc: "/transferencia-veiculos", changefreq: "monthly", priority: "0.8" },
      ];

      const today = new Date().toISOString().split("T")[0];
      let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const page of staticPages) {
        sitemapXml += `  <url>\n    <loc>${BASE_URL}${page.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
      }

      if (allPosts) {
        for (const p of allPosts) {
          const lastmod = (p.updated_at || p.published_at || "").split("T")[0];
          sitemapXml += `  <url>\n    <loc>${BASE_URL}/blog/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        }
      }

      sitemapXml += `</urlset>`;

      const sitemapBlob = new Blob([sitemapXml], { type: "application/xml" });
      await supabase.storage
        .from("sitemap")
        .upload("sitemap.xml", sitemapBlob, {
          contentType: "application/xml",
          upsert: true,
        });

      console.log("✅ Sitemap updated in storage");
    } catch (sitemapErr) {
      console.error("Sitemap update error (non-fatal):", sitemapErr);
    }

    console.log(`✅ Published: "${topic.title_seo}" [${chosenArea.name}] | Trend: "${topic.trend_used}"`);

    return new Response(
      JSON.stringify({
        success: true,
        post_id: post.id,
        title: topic.title_seo,
        keyword: topic.keyword,
        trend_used: topic.trend_used,
        legal_area: chosenArea.name,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-blog-post error:", e);
    return new Response(
      JSON.stringify({ error: "Não foi possível gerar o artigo. Tente novamente mais tarde." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
