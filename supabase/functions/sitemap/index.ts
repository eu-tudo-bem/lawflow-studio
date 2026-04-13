import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";

const BASE_URL = "https://fernandezefernandes.adv.br";

function sanitizeSlug(slug: string): string {
  return slug
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w-]/g, "")
    .toLowerCase();
}

const DOCUMENT_GENERATOR_SLUGS = [
  "notificacao-cobranca-aluguel",
  "notificacao-divida",
  "acordo-divorcio",
  "declaracao-uniao-estavel",
  "contrato-arrendamento-rural",
  "declaracao-dependencia-economica",
  "revisao-pensao-alimenticia",
];

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
  { loc: "/gerador-documentos", changefreq: "monthly", priority: "0.8" },
  ...DOCUMENT_GENERATOR_SLUGS.map((slug) => ({
    loc: `/gerador-${slug}`,
    changefreq: "monthly",
    priority: "0.75",
  })),
];

interface UrlEntry { loc: string; changefreq?: string; priority?: string; lastmod?: string }

function buildUrlset(entries: UrlEntry[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const e of entries) {
    xml += `  <url>\n    <loc>${BASE_URL}${e.loc}</loc>\n`;
    if (e.lastmod) xml += `    <lastmod>${e.lastmod}</lastmod>\n`;
    if (e.changefreq) xml += `    <changefreq>${e.changefreq}</changefreq>\n`;
    if (e.priority) xml += `    <priority>${e.priority}</priority>\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>`;
  return xml;
}

function buildSitemapIndex(sitemapNames: string[], storageBaseUrl: string): string {
  const now = new Date().toISOString().split("T")[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const name of sitemapNames) {
    xml += `  <sitemap>\n    <loc>${storageBaseUrl}/${name}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
  }
  xml += `</sitemapindex>`;
  return xml;
}

async function uploadToStorage(supabase: ReturnType<typeof createClient>, filename: string, content: string) {
  const blob = new Blob([content], { type: "application/xml" });
  const { error } = await supabase.storage
    .from("sitemap")
    .upload(filename, blob, { contentType: "application/xml", upsert: true, cacheControl: "3600" });
  if (error) console.error(`[sitemap] Failed to upload ${filename}:`, error.message);
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  const corsHeaders = getCorsHeaders(req);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [
      { data: cities, error: citiesError },
      { data: services, error: servicesError },
      { data: posts, error: postsError },
      { data: questions, error: questionsError },
    ] = await Promise.all([
      supabase.from("seo_cities").select("slug").eq("active", true),
      supabase.from("seo_services").select("slug").eq("active", true),
      supabase.from("blog_posts").select("slug, updated_at, published_at").eq("status", "published").order("published_at", { ascending: false }),
      supabase.from("legal_questions").select("slug, updated_at, published_at").eq("status", "published").order("published_at", { ascending: false }),
    ]);

    if (citiesError) console.error("[sitemap] seo_cities:", citiesError.message);
    if (servicesError) console.error("[sitemap] seo_services:", servicesError.message);
    if (postsError) console.error("[sitemap] blog_posts:", postsError.message);
    if (questionsError) console.error("[sitemap] legal_questions:", questionsError.message);

    const citySlugs = (cities || []).map((c) => sanitizeSlug(c.slug));
    const serviceSlugs = (services || []).map((s) => sanitizeSlug(s.slug));

    const storageBaseUrl = `${supabaseUrl}/storage/v1/object/public/sitemap`;
    const allFilenames: string[] = [];
    const uploads: Promise<void>[] = [];

    // ── 1) sitemap-static.xml ─────────────────────────────────────────
    const staticXml = buildUrlset(staticPages);
    allFilenames.push("sitemap-static.xml");
    uploads.push(uploadToStorage(supabase, "sitemap-static.xml", staticXml));

    // ── 2) sitemap-cities.xml ─────────────────────────────────────────
    const cityEntries = citySlugs.map((slug) => ({
      loc: `/escritorio-advocacia-${slug}`,
      changefreq: "monthly",
      priority: "0.9",
    }));
    const citiesXml = buildUrlset(cityEntries);
    allFilenames.push("sitemap-cities.xml");
    uploads.push(uploadToStorage(supabase, "sitemap-cities.xml", citiesXml));

    // ── 3) One sitemap per service (all cities for that service) ──────
    for (const svc of serviceSlugs) {
      const entries = citySlugs.map((city) => ({
        loc: `/advogado-${svc}-${city}`,
        changefreq: "monthly",
        priority: "0.85",
      }));
      const filename = `sitemap-${svc}.xml`;
      allFilenames.push(filename);
      uploads.push(uploadToStorage(supabase, filename, buildUrlset(entries)));
    }

    // ── 4) sitemap-blog.xml ───────────────────────────────────────────
    const blogEntries: UrlEntry[] = [];
    if (posts) {
      for (const p of posts) {
        blogEntries.push({
          loc: `/blog/${p.slug}`,
          lastmod: (p.updated_at || p.published_at || "").split("T")[0],
          changefreq: "monthly",
          priority: "0.8",
        });
      }
    }
    allFilenames.push("sitemap-blog.xml");
    uploads.push(uploadToStorage(supabase, "sitemap-blog.xml", buildUrlset(blogEntries)));

    // ── 5) sitemap-perguntas.xml ──────────────────────────────────────
    const questionEntries: UrlEntry[] = [];
    if (questions) {
      for (const q of questions) {
        questionEntries.push({
          loc: `/pergunta/${q.slug}`,
          lastmod: (q.updated_at || q.published_at || "").split("T")[0],
          changefreq: "monthly",
          priority: "0.75",
        });
      }
    }
    allFilenames.push("sitemap-perguntas.xml");
    uploads.push(uploadToStorage(supabase, "sitemap-perguntas.xml", buildUrlset(questionEntries)));

    // ── 6) sitemap.xml (index) ────────────────────────────────────────
    const indexXml = buildSitemapIndex(allFilenames, storageBaseUrl);
    uploads.push(uploadToStorage(supabase, "sitemap.xml", indexXml));

    // Upload everything in parallel
    await Promise.all(uploads);

    const totalServiceUrls = serviceSlugs.length * citySlugs.length;
    const total = staticPages.length + cityEntries.length + totalServiceUrls + blogEntries.length + questionEntries.length;
    console.log(
      `Sitemap index updated: ${allFilenames.length} sub-sitemaps | ${staticPages.length} static | ${cityEntries.length} cities | ${serviceSlugs.length} services × ${citySlugs.length} cities = ${totalServiceUrls} | ${blogEntries.length} blog | ${questionEntries.length} perguntas | total: ${total} URLs`
    );

    return new Response(indexXml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
});
