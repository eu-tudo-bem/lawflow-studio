import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

async function callAI(prompt: string): Promise<string> {
  // gemini-2.0-flash: gratuito via v1beta — 1.500 req/dia, 15 RPM, sem billing obrigatório
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é um especialista em direito brasileiro e SEO.
Escreva conteúdo jurídico claro, informativo e preciso em português do Brasil.
Siga rigorosamente o Provimento 205/2021 da OAB: caráter informativo, sem promessa de resultados, sem sensacionalismo.
Responda APENAS com o JSON ou HTML solicitado, sem markdown, sem texto extra.\n\n` + prompt
          }]
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

const PARANA_CITIES = [
  "curitiba","londrina","maringa","cascavel","foz-do-iguacu","ponta-grossa",
  "guarapuava","colombo","apucarana","toledo","arapongas","campo-largo",
  "campo-mourao","paranagua","umuarama","cornelio-procopio","pato-branco",
  "francisco-beltrao","telemacos-borba","irati","palmas","cianorte","castro","dois-vizinhos",
];

const CITY_NAMES: Record<string, string> = {
  "curitiba": "Curitiba","londrina": "Londrina","maringa": "Maringá",
  "cascavel": "Cascavel","foz-do-iguacu": "Foz do Iguaçu","ponta-grossa": "Ponta Grossa",
  "guarapuava": "Guarapuava","colombo": "Colombo","apucarana": "Apucarana",
  "toledo": "Toledo","arapongas": "Arapongas","campo-largo": "Campo Largo",
  "campo-mourao": "Campo Mourão","paranagua": "Paranaguá","umuarama": "Umuarama",
  "cornelio-procopio": "Cornélio Procópio","pato-branco": "Pato Branco",
  "francisco-beltrao": "Francisco Beltrão","telemacos-borba": "Telêmaco Borba",
  "irati": "Irati","palmas": "Palmas","cianorte": "Cianorte","castro": "Castro",
  "dois-vizinhos": "Dois Vizinhos",
};

// Seed questions per legal area — simulates Google Autocomplete discovery
const QUESTION_SEEDS: Record<string, string[]> = {
  transito: [
    "posso perder minha CNH por dívida",
    "como recorrer multa de trânsito",
    "CNH suspensa posso dirigir",
    "quantos pontos perde a CNH",
    "prazo para recorrer multa de trânsito",
    "habilitação cassada diferença suspensão",
    "CNH vencida multa quanto",
    "como recuperar CNH suspensa",
    "alcoolemia limite legal 2024",
    "câmera de radar multa prazo recurso",
  ],
  familia: [
    "quanto custa um divórcio no Paraná",
    "guarda compartilhada como funciona",
    "pensão alimentícia como calcular",
    "divórcio litigioso prazo",
    "reconhecimento de paternidade como fazer",
    "alienação parental o que é",
    "inventário extrajudicial prazo",
    "mudança de nome após casamento",
    "visita ao filho como funciona",
    "união estável direitos e deveres",
  ],
  trabalho: [
    "demissão sem justa causa direitos",
    "horas extras como calcular",
    "assédio moral no trabalho o que fazer",
    "adicional de insalubridade quem tem direito",
    "férias vencidas como cobrar",
    "rescisão indireta quando cabe",
    "aviso prévio indenizado ou trabalhado",
    "acidente de trabalho indenização",
    "banco de horas é legal",
    "FGTS saque quando posso",
  ],
  consumidor: [
    "produto com defeito o que fazer",
    "cobrança indevida como contestar",
    "negativação indevida como resolver",
    "contrato abusivo como cancelar",
    "serviço não prestado reembolso",
    "compra online cancelamento direito",
    "construtora atraso entrega imóvel indenização",
    "plano de saúde negou procedimento",
    "banco cobrou taxa indevida",
    "voo cancelado indenização direito",
  ],
  imobiliario: [
    "contrato de aluguel rescisão multa",
    "despejo por falta de pagamento prazo",
    "condomínio em atraso o que acontece",
    "usucapião como funciona",
    "compra de imóvel documentos necessários",
    "financiamento imobiliário atraso parcela",
    "imóvel herdado como transferir",
    "vizinho invadiu meu terreno o que fazer",
    "contrato locação índice reajuste",
    "caução depósito aluguel devolução",
  ],
  criminal: [
    "contrabando é crime afiançável",
    "legítima defesa requisitos legais",
    "flagrante delito o que é",
    "fiança como funciona",
    "réu primário pena diferente",
    "crime prescrito o que acontece",
    "habeas corpus quando usar",
    "inquérito policial prazo encerramento",
    "calúnia e difamação diferença",
    "violência doméstica como denunciar",
  ],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}


async function generatePageContent(
  question: string,
  legalArea: string,
  cityName?: string,
): Promise<{
  page_title: string;
  meta_description: string;
  content: string;
  schema_faq: any;
  related_questions: string[];
  cluster_topic: string;
  tags: string[];
}> {
  const cityContext = cityName
    ? `A pergunta é de um usuário de ${cityName} (Paraná). Adapte o conteúdo mencionando a cidade quando relevante (ex: "Em ${cityName}, você pode contar com a Fernandez & Fernandes Advocacia").`
    : "";

  const prompt = `Gere uma página SEO completa para a pergunta jurídica: "${question}"
Área do direito: ${legalArea}
${cityContext}

Retorne um JSON com esta estrutura exata:
{
  "page_title": "título SEO com a pergunta + contexto legal (máx 60 chars)",
  "meta_description": "descrição atrativa com a resposta resumida (máx 160 chars)",
  "content": "HTML completo da página com: <h1> com a pergunta exata + contexto, <section> com explicação jurídica simples, <section> com base legal (artigos de lei), <section> com exemplos práticos, <section> com perguntas relacionadas, <section class='cta-section'> com CTA para falar com advogado. Mínimo 800 palavras. Use <strong> para termos importantes.",
  "schema_faq": [{"question": "...", "answer": "..."}] (5 perguntas relacionadas),
  "related_questions": ["pergunta 1", "pergunta 2", "pergunta 3", "pergunta 4"] (perguntas relacionadas para cluster),
  "cluster_topic": "tema principal do cluster (ex: CNH e Habilitação, Divórcio e Família)",
  "tags": ["tag1", "tag2", "tag3"] (3-5 tags relevantes)
}`;

  const raw = await callAI(prompt);

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // fallback mínimo
    return {
      page_title: `${question.substring(0, 55)}?`,
      meta_description: `Entenda seus direitos sobre "${question}". Consulte um advogado especializado.`,
      content: `<h1>${question}?</h1><p>Consulte nossa equipe para obter informações precisas sobre este tema jurídico.</p>`,
      schema_faq: [],
      related_questions: [],
      cluster_topic: legalArea,
      tags: [legalArea],
    };
  }
}

serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  const corsHeaders = getCorsHeaders(req);
  const startTime = Date.now();
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body = await req.json().catch(() => ({}));
    const {
      areas = Object.keys(QUESTION_SEEDS),
      max_questions_per_area = 1,
      generate_hyperlocal = false,
      hyperlocal_cities = ["curitiba", "londrina", "maringa"],
      dry_run = false,
    } = body;

    console.log(`Content Discovery Agent starting. Areas: ${areas.join(", ")}`);

    let totalFound = 0;
    let totalGenerated = 0;
    const errors: string[] = [];

    for (const area of areas) {
      const seeds = QUESTION_SEEDS[area] || [];
      const questionsToProcess = seeds.slice(0, max_questions_per_area);

      for (const questionSeed of questionsToProcess) {
        try {
          const slug = slugify(questionSeed);

          // Check if already exists
          const { data: existing } = await supabase
            .from("legal_questions" as any)
            .select("id, status")
            .eq("slug", slug)
            .single();

          if (existing) {
            console.log(`Skipping existing: ${slug}`);
            continue;
          }

          totalFound++;

          if (dry_run) continue;

          console.log(`Generating page for: ${questionSeed}`);

          // Insert as pending first
          const { data: inserted, error: insertErr } = await supabase
            .from("legal_questions" as any)
            .insert({
              question: questionSeed + "?",
              slug,
              legal_area: area,
              status: "generating",
              source: "autocomplete",
            })
            .select("id")
            .single();

          if (insertErr || !inserted) {
            console.error("Insert error:", insertErr);
            continue;
          }

          const pageData = await generatePageContent(questionSeed, area);

          // Update with generated content
          await supabase
            .from("legal_questions" as any)
            .update({
              page_title: pageData.page_title,
              meta_description: pageData.meta_description,
              content: pageData.content,
              schema_faq: pageData.schema_faq,
              tags: pageData.tags,
              cluster_topic: pageData.cluster_topic,
              status: "published",
              published_at: new Date().toISOString(),
            })
            .eq("id", (inserted as any).id);

          totalGenerated++;

          // Generate cluster subtopics
          if (pageData.related_questions?.length > 0) {
            for (const relQ of pageData.related_questions.slice(0, 2)) {
              const relSlug = slugify(relQ);
              const { data: relExisting } = await supabase
                .from("legal_questions" as any)
                .select("id")
                .eq("slug", relSlug)
                .single();

              if (!relExisting) {
                await supabase.from("legal_questions" as any).insert({
                  question: relQ.endsWith("?") ? relQ : relQ + "?",
                  slug: relSlug,
                  legal_area: area,
                  status: "pending",
                  source: "cluster",
                  cluster_topic: pageData.cluster_topic,
                  cluster_subtopic: true,
                  parent_slug: slug,
                });
              }
            }
          }

          // Generate hyperlocal variants for high-value questions
          if (generate_hyperlocal) {
            for (const citySlug of hyperlocal_cities.slice(0, 3)) {
              const cityName = CITY_NAMES[citySlug] || citySlug;
              const citySpecificSlug = `${slug}-${citySlug}`;

              const { data: cityExisting } = await supabase
                .from("legal_questions" as any)
                .select("id")
                .eq("slug", citySpecificSlug)
                .single();

              if (!cityExisting) {
                const cityPageData = await generatePageContent(questionSeed, area, cityName);

                await supabase.from("legal_questions" as any).insert({
                  question: `${questionSeed}? (${cityName})`,
                  slug: citySpecificSlug,
                  legal_area: area,
                  status: "published",
                  source: "hyperlocal",
                  city_slug: citySlug,
                  cluster_topic: cityPageData.cluster_topic,
                  page_title: cityPageData.page_title,
                  meta_description: cityPageData.meta_description,
                  content: cityPageData.content,
                  schema_faq: cityPageData.schema_faq,
                  tags: cityPageData.tags,
                  published_at: new Date().toISOString(),
                });

                totalGenerated++;
              }
            }
          }

          // Delay de 5s entre chamadas para respeitar 15 RPM do free tier (máx 12/min na prática)
          await new Promise((r) => setTimeout(r, 5000));
        } catch (qErr: any) {
          console.error(`Error processing "${questionSeed}":`, qErr.message);
          errors.push(`${questionSeed}: ${qErr.message}`);
        }
      }
    }

    const duration = Date.now() - startTime;

    // Log execution
    await supabase.from("discovery_agent_logs" as any).insert({
      status: errors.length > 0 && totalGenerated === 0 ? "error" : "success",
      questions_found: totalFound,
      pages_generated: totalGenerated,
      areas_scanned: areas,
      duration_ms: duration,
      error_message: errors.length > 0 ? errors.slice(0, 3).join("; ") : null,
    });

    return new Response(
      JSON.stringify({
        success: true,
        questions_found: totalFound,
        pages_generated: totalGenerated,
        duration_ms: duration,
        errors: errors.slice(0, 5),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("Agent fatal error:", e);

    await supabase.from("discovery_agent_logs" as any).insert({
      status: "error",
      questions_found: 0,
      pages_generated: 0,
      areas_scanned: [],
      duration_ms: Date.now() - startTime,
      error_message: e.message,
    });

    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
