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

async function callAI(apiKey: string, prompt: string, model = "google/gemini-3-flash-preview") {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  const corsHeaders = getCorsHeaders(req);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

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

    // 3. STEP 1 - Identify trending Google search topics and connect to legal themes
    const trendingPrompt = `Você é um analista de tendências de busca do Google especializado no mercado brasileiro.

TAREFA: Identifique 5 assuntos que estão em alta no Google Trends Brasil AGORA (notícias recentes, mudanças em leis, eventos atuais, virais nas redes sociais, decisões judiciais, mudanças econômicas, novas regulamentações).

Pense em:
- Notícias recentes do Brasil que geram dúvidas jurídicas
- Mudanças em legislação ou decisões do STF/TST/STJ recentes
- Temas virais nas redes sociais que envolvem questões legais
- Problemas econômicos atuais (inflação, desemprego, crédito)
- Eventos sazonais (IRPF, 13º salário, férias coletivas, volta às aulas)
- Tendências de comportamento (trabalho remoto, apps de transporte, compras online)

DATA ATUAL: ${new Date().toLocaleDateString("pt-BR")}

Para cada assunto trending, conecte-o a uma questão jurídica prática na área de ${chosenArea.name}.
Subtemas da área: ${chosenArea.topics.join(", ")}

Responda APENAS com JSON válido (sem markdown, sem code blocks):
{
  "trending_topics": [
    {
      "trend": "assunto em alta no Google",
      "legal_angle": "como isso se conecta a ${chosenArea.name}",
      "search_query": "pergunta real que as pessoas fariam no Google sobre isso"
    }
  ]
}`;

    const trendingRaw = await callAI(LOVABLE_API_KEY, trendingPrompt);
    const cleanedTrending = trendingRaw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    let trendingData;
    try {
      trendingData = JSON.parse(cleanedTrending);
    } catch {
      console.error("Failed to parse trending data, using fallback");
      trendingData = { trending_topics: [] };
    }

    const trendingContext = trendingData.trending_topics
      ?.map((t: any) => `- Trend: "${t.trend}" → Ângulo jurídico: "${t.legal_angle}" → Busca: "${t.search_query}"`)
      .join("\n") || "Sem dados de tendências disponíveis";

    // 4. STEP 2 - Generate topic based on trends + legal expertise
    const topicPrompt = `Você é um estrategista de conteúdo jurídico brasileiro que combina tendências do Google Trends com expertise em ${chosenArea.name}.

TENDÊNCIAS ATUAIS IDENTIFICADAS:
${trendingContext}

ÁREA DO DIREITO: ${chosenArea.name}
SUBTEMAS: ${chosenArea.topics.join(", ")}

TEMAS JÁ USADOS (NÃO REPITA nenhum destes nem temas muito similares):
${usedKeywords.length > 0 ? usedKeywords.join("\n") : "(nenhum ainda)"}

TAREFA: Com base nas tendências acima, escolha 1 tema NOVO que:
1. Aproveite uma tendência real de busca do Google Trends
2. Conecte essa tendência a uma questão prática de ${chosenArea.name}
3. Use linguagem de busca real (como as pessoas pesquisam no Google)
4. Tenha alto potencial de cliques e engajamento
5. Seja relevante e atual

EXEMPLO: Se "Pix" está trending e a área é Consumidor → "Golpe do Pix: Seus Direitos e Como Recuperar o Dinheiro"
EXEMPLO: Se "demissão em massa" está trending e a área é Trabalhista → "Demissão em Massa: Quais São Seus Direitos Trabalhistas?"

Responda APENAS com JSON válido (sem markdown, sem code blocks):
{
  "trend_used": "qual tendência do Google inspirou este tema",
  "keyword": "palavra-chave principal (frase de busca real do Google)",
  "secondary_keywords": ["kw2", "kw3", "kw4"],
  "title_seo": "Título SEO até 60 caracteres com a keyword",
  "meta_description": "Meta descrição até 160 caracteres, persuasiva e com keyword",
  "slug": "slug-otimizado-sem-acentos"
}`;

    const topicRaw = await callAI(LOVABLE_API_KEY, topicPrompt);
    const cleanedTopic = topicRaw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let topic;
    try {
      topic = JSON.parse(cleanedTopic);
    } catch {
      // Retry once with explicit JSON-only instruction
      console.warn("First topic parse failed, retrying with stricter prompt...");
      const retryRaw = await callAI(LOVABLE_API_KEY, topicPrompt + "\n\nIMPORTANT: Respond with ONLY raw JSON. No markdown. No backticks. No explanation. Start with { and end with }");
      const retryClean = retryRaw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      try {
        topic = JSON.parse(retryClean);
      } catch {
        // Final fallback: generate a safe default topic from the area
        console.error("Both topic parses failed, using area-based fallback");
        const safeSlug = `${chosenArea.id}-direitos-${Date.now()}`;
        topic = {
          trend_used: "Busca recorrente no Google Brasil",
          keyword: `${chosenArea.name.toLowerCase()} direitos`,
          secondary_keywords: chosenArea.topics[0].split(", ").slice(0, 3),
          title_seo: `Seus Direitos em ${chosenArea.name}: Guia Prático`,
          meta_description: `Entenda seus direitos em ${chosenArea.name}. Tire suas dúvidas e saiba como agir.`,
          slug: safeSlug,
        };
      }
    }

    console.log(`📊 Trend used: "${topic.trend_used}" → Topic: "${topic.keyword}"`);

    // 5. Generate the full article
    const articlePrompt = `Você é um redator jurídico brasileiro especializado em conteúdo informativo para blog.

ÁREA: ${chosenArea.name}
TENDÊNCIA DO GOOGLE TRENDS: ${topic.trend_used}
PALAVRA-CHAVE PRINCIPAL: ${topic.keyword}
PALAVRAS-CHAVE SECUNDÁRIAS: ${topic.secondary_keywords.join(", ")}
TÍTULO SEO: ${topic.title_seo}

REGRAS OBRIGATÓRIAS:
- Conteúdo EXCLUSIVAMENTE informativo (Provimento 205/2021 da OAB)
- Sem promessa de ganho de causa ou resultado
- Sem linguagem sensacionalista
- Linguagem clara, acessível e profissional
- Entre 900 e 1200 palavras
- A palavra-chave principal DEVE aparecer no primeiro parágrafo
- Conecte o tema trending com a questão jurídica de forma natural e relevante
- Comece o artigo contextualizando a tendência atual antes de entrar nos aspectos jurídicos

ESTRUTURA OBRIGATÓRIA DO ARTIGO (use tags HTML):

1. <h1>${topic.title_seo}</h1> (use exatamente este título)

2. Introdução (2-3 parágrafos) - contextualize a tendência atual e conecte à questão jurídica. A palavra-chave deve estar no primeiro parágrafo.

3. Desenvolvimento com 3-4 subtítulos <h2> estratégicos
   - Cada seção com 2-3 parágrafos
   - Use <h3> quando necessário para subdivisões
   - Insira naturalmente palavras-chave secundárias

4. Seção FAQ com exatamente 4 perguntas reais de busca:
   <h2>Perguntas Frequentes</h2>
   Formate cada FAQ assim:
   <h3>Pergunta aqui?</h3>
   <p>Resposta objetiva em 2-3 frases.</p>

5. Conclusão com CTA informativo:
   <h2>Conclusão</h2>
   <p>Resumo + orientação para buscar assistência profissional. Inclua: "Se você tem dúvidas sobre ${topic.keyword}, consulte um advogado especializado para orientação personalizada."</p>

6. Insira UM link interno estratégico no texto:
   <a href="${BASE_URL}/#servicos">conheça nossos serviços</a>

IMPORTANTE: Escreva APENAS o HTML do artigo, sem markdown, sem code blocks, sem explicações extras. Comece direto com <h1>.`;

    const content_raw = await callAI(LOVABLE_API_KEY, articlePrompt);
    const content = content_raw.replace(/```html\s*/g, "").replace(/```\s*/g, "").trim();

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
