import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LEGAL_AREAS = [
  { id: "trabalhista", name: "Direito do Trabalho" },
  { id: "familia", name: "Direito de Família" },
  { id: "bancario", name: "Direito Bancário" },
  { id: "consumidor", name: "Direito do Consumidor" },
];

const BASE_URL = "https://lawflow-studio.lovable.app";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
    // Pick area with fewest posts
    const sortedAreas = LEGAL_AREAS.sort(
      (a, b) => (areaCounts[a.id] || 0) - (areaCounts[b.id] || 0)
    );
    const chosenArea = sortedAreas[0];

    // 3. Generate topic + article via AI
    const topicPrompt = `Você é um estrategista de conteúdo jurídico brasileiro especializado em SEO.

ÁREA DO DIREITO: ${chosenArea.name}

TEMAS JÁ USADOS (NÃO REPITA nenhum destes nem temas muito similares):
${usedKeywords.length > 0 ? usedKeywords.join("\n") : "(nenhum ainda)"}

TAREFA: Escolha 1 tema NOVO com alta intenção de busca real (pergunta que pessoas fazem no Google) sobre ${chosenArea.name}.

Responda APENAS com um JSON válido (sem markdown, sem code blocks):
{
  "keyword": "palavra-chave principal (frase de busca real)",
  "secondary_keywords": ["kw2", "kw3", "kw4"],
  "title_seo": "Título SEO até 60 caracteres com a keyword",
  "meta_description": "Meta descrição até 160 caracteres",
  "slug": "slug-otimizado-sem-acentos"
}`;

    const topicResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: topicPrompt }],
        }),
      }
    );

    if (!topicResponse.ok) {
      const errText = await topicResponse.text();
      throw new Error(`AI topic error ${topicResponse.status}: ${errText}`);
    }

    const topicData = await topicResponse.json();
    const topicRaw = topicData.choices?.[0]?.message?.content || "";
    
    // Clean markdown code blocks if present
    const cleanedTopic = topicRaw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const topic = JSON.parse(cleanedTopic);

    // 4. Generate the full article
    const articlePrompt = `Você é um redator jurídico brasileiro especializado em conteúdo informativo para blog.

ÁREA: ${chosenArea.name}
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

ESTRUTURA OBRIGATÓRIA DO ARTIGO (use tags HTML):

1. <h1>${topic.title_seo}</h1> (use exatamente este título)

2. Introdução (2-3 parágrafos) - com a palavra-chave no primeiro parágrafo

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

    const articleResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: articlePrompt }],
        }),
      }
    );

    if (!articleResponse.ok) {
      const errText = await articleResponse.text();
      throw new Error(`AI article error ${articleResponse.status}: ${errText}`);
    }

    const articleData = await articleResponse.json();
    let content = articleData.choices?.[0]?.message?.content || "";
    // Clean any markdown wrappers
    content = content.replace(/```html\s*/g, "").replace(/```\s*/g, "").trim();

    // 5. Get admin user for author_id
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (!adminRole) throw new Error("No admin user found for author_id");

    // 6. Get or create a category for the legal area
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

    // 7. Build excerpt from content (first paragraph text)
    const excerptMatch = content.match(/<p>(.*?)<\/p>/);
    const excerpt = excerptMatch
      ? excerptMatch[1].replace(/<[^>]+>/g, "").substring(0, 250)
      : topic.meta_description;

    // 8. Insert the blog post
    const { data: post, error: postErr } = await supabase
      .from("blog_posts")
      .insert({
        title: topic.title_seo,
        slug: topic.slug,
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

    // 9. Record used topic
    await supabase.from("blog_topics_used").insert({
      keyword: topic.keyword,
      secondary_keywords: topic.secondary_keywords,
      legal_area: chosenArea.id,
      post_id: post.id,
    });

    console.log(`✅ Published: "${topic.title_seo}" [${chosenArea.name}]`);

    return new Response(
      JSON.stringify({
        success: true,
        post_id: post.id,
        title: topic.title_seo,
        keyword: topic.keyword,
        legal_area: chosenArea.name,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-blog-post error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
