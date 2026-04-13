import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";

const BASE_URL = "https://fernandezefernandes.adv.br";
const XML_HEADERS = { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" };

const VALID_PARTS = ["static", "cities", "services", "blog"] as const;
type SitemapPart = typeof VALID_PARTS[number];

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

interface UrlEntry {
  loc: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
}

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

function buildSitemapIndex(): string {
  const now = new Date().toISOString().split("T")[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const part of VALID_PARTS) {
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap.xml?part=${part}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
  }
  xml += `</sitemapindex>`;
  return xml;
}

async function uploadToStorage(
  supabase: ReturnType<typeof createClient>,
  filename: string,
  content: string,
) {
  const blob = new Blob([content], { type: "application/xml" });
  const { error } = await supabase.storage
    .from("sitemap")
    .upload(filename, blob, { contentType: "application/xml", upsert: true, cacheControl: "3600" });
  if (error) console.error(`[sitemap] Failed to upload ${filename}:`, error.message);
}

async function fetchFromStorage(
  supabase: ReturnType<typeof createClient>,
  filename: string,
): Promise<string | null> {
  const { data, error } = await supabase.storage.from("sitemap").download(filename);
  if (error || !data) {
    console.error(`[sitemap] Failed to download ${filename}:`, error?.message);
    return null;
  }
  return await data.text();
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  const corsHeaders = getCorsHeaders(req);

  try {
    const url = new URL(req.url);
    const part = url.searchParams.get("part") as SitemapPart | null;
    const regenerate = url.searchParams.get("regenerate") === "true";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If part is requested and we're not regenerating, proxy from storage
    if (part && !regenerate) {
      if (!VALID_PARTS.includes(part)) {
        return new Response("Invalid part", { status: 400, headers: corsHeaders });
      }
      const content = await fetchFromStorage(supabase, `sitemap-${part}.xml`);
      if (!content) {
        return new Response("Sitemap not found", { status: 404, headers: corsHeaders });
      }
      return new Response(content, { headers: { ...corsHeaders, ...XML_HEADERS } });
    }

    // If no part and not regenerating, return the index
    if (!regenerate && !part) {
      const indexXml = buildSitemapIndex();
      return new Response(indexXml, { headers: { ...corsHeaders, ...XML_HEADERS } });
    }

    // ── Regenerate all sitemaps ────────────────────────────────────────
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

    const uploads: Promise<void>[] = [];

    // 1) sitemap-static.xml
    const staticXml = buildUrlset(staticPages);
    uploads.push(uploadToStorage(supabase, "sitemap-static.xml", staticXml));

    // 2) sitemap-cities.xml
    const cityEntries = citySlugs.map((slug) => ({
      loc: `/escritorio-advocacia-${slug}`,
      changefreq: "monthly",
      priority: "0.9",
    }));
    uploads.push(uploadToStorage(supabase, "sitemap-cities.xml", buildUrlset(cityEntries)));

    // 3) sitemap-services.xml
    const serviceEntries: UrlEntry[] = [];
    for (const svc of serviceSlugs) {
      for (const city of citySlugs) {
        serviceEntries.push({
          loc: `/advogado-${svc}-${city}`,
          changefreq: "monthly",
          priority: "0.85",
        });
      }
    }
    uploads.push(uploadToStorage(supabase, "sitemap-services.xml", buildUrlset(serviceEntries)));

    // 4) sitemap-blog.xml (blog + perguntas)
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
    if (questions) {
      for (const q of questions) {
        blogEntries.push({
          loc: `/pergunta/${q.slug}`,
          lastmod: (q.updated_at || q.published_at || "").split("T")[0],
          changefreq: "monthly",
          priority: "0.75",
        });
      }
    }
    uploads.push(uploadToStorage(supabase, "sitemap-blog.xml", buildUrlset(blogEntries)));

    // 5) sitemap.xml index (stored for reference)
    const indexXml = buildSitemapIndex();
    uploads.push(uploadToStorage(supabase, "sitemap.xml", indexXml));

    await Promise.all(uploads);

    const total = staticPages.length + cityEntries.length + serviceEntries.length + blogEntries.length;
    console.log(
      `Sitemap regenerated: 4 sub-sitemaps | ${staticPages.length} static | ${cityEntries.length} cities | ${serviceEntries.length} services | ${blogEntries.length} blog+perguntas | total: ${total} URLs`,
    );

    return new Response(indexXml, { headers: { ...corsHeaders, ...XML_HEADERS } });
  } catch (error) {
    console.error("Sitemap error:", error);
    return new Response("Error generating sitemap", { status: 500, headers: getCorsHeaders(req) });
  }
});
