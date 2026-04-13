import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";

const BASE_URL = "https://fernandezefernandes.adv.br";
const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};

const FIXED_PARTS = ["static", "cities", "blog"] as const;

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

function buildSitemapIndex(serviceSlugs: string[]): string {
  const now = new Date().toISOString().split("T")[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Fixed parts: static, cities, blog
  for (const part of FIXED_PARTS) {
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-${part}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
  }

  // Per-service parts
  for (const svc of serviceSlugs) {
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-services-${svc}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
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

/** List all service slugs stored in the sitemap bucket (for building the index without regenerating). */
async function listServiceSlugsFromStorage(
  supabase: ReturnType<typeof createClient>,
): Promise<string[]> {
  const { data, error } = await supabase.storage.from("sitemap").list("", { limit: 500 });
  if (error || !data) return [];
  const prefix = "sitemap-services-";
  return data
    .map((f) => f.name)
    .filter((n) => n.startsWith(prefix) && n.endsWith(".xml"))
    .map((n) => n.slice(prefix.length, -4))
    .sort();
}

function isValidName(name: string): boolean {
  // Fixed parts or services-* pattern
  if ((FIXED_PARTS as readonly string[]).includes(name)) return true;
  if (name.startsWith("services-") && /^services-[\w-]+$/.test(name)) return true;
  return false;
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  const corsHeaders = getCorsHeaders(req);

  try {
    const url = new URL(req.url);
    const name = url.searchParams.get("name");
    const regenerate = url.searchParams.get("regenerate") === "true";
    const listParts = url.searchParams.get("list-parts") === "true";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ── list-parts: returns JSON array of all sitemap part names ──
    if (listParts) {
      const svcSlugs = await listServiceSlugsFromStorage(supabase);
      const allParts = [
        ...FIXED_PARTS,
        ...svcSlugs.map((s) => `services-${s}`),
      ];
      return new Response(JSON.stringify(allParts), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Proxy a specific part from storage ──
    if (name && !regenerate) {
      if (!isValidName(name)) {
        return new Response("Invalid name", { status: 400, headers: corsHeaders });
      }
      const filename = name.startsWith("services-")
        ? `sitemap-${name}.xml`
        : `sitemap-${name}.xml`;
      const content = await fetchFromStorage(supabase, filename);
      if (!content) {
        return new Response("Sitemap not found", { status: 404, headers: corsHeaders });
      }
      return new Response(content, { headers: { ...corsHeaders, ...XML_HEADERS } });
    }

    // ── Return index without regenerating ──
    if (!regenerate && !name) {
      const svcSlugs = await listServiceSlugsFromStorage(supabase);
      const indexXml = buildSitemapIndex(svcSlugs);
      return new Response(indexXml, { headers: { ...corsHeaders, ...XML_HEADERS } });
    }

    // ── Regenerate all sitemaps ──────────────────────────────────────
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

    // 1) sitemap-static.xml
    await uploadToStorage(supabase, "sitemap-static.xml", buildUrlset(staticPages));

    // 2) sitemap-cities.xml
    const cityEntries = citySlugs.map((slug) => ({
      loc: `/escritorio-advocacia-${slug}`,
      changefreq: "monthly",
      priority: "0.9",
    }));
    await uploadToStorage(supabase, "sitemap-cities.xml", buildUrlset(cityEntries));

    // 3) Per-service sitemaps (one at a time to save memory)
    let totalServiceUrls = 0;
    for (const svc of serviceSlugs) {
      const entries: UrlEntry[] = citySlugs.map((city) => ({
        loc: `/advogado-${svc}-${city}`,
        changefreq: "monthly",
        priority: "0.85",
      }));
      totalServiceUrls += entries.length;
      await uploadToStorage(supabase, `sitemap-services-${svc}.xml`, buildUrlset(entries));
    }

    // 4) sitemap-blog.xml
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
    await uploadToStorage(supabase, "sitemap-blog.xml", buildUrlset(blogEntries));

    // 5) Index
    const indexXml = buildSitemapIndex(serviceSlugs);
    await uploadToStorage(supabase, "sitemap.xml", indexXml);

    // Clean up old monolithic sitemap-services.xml if it exists
    await supabase.storage.from("sitemap").remove(["sitemap-services.xml"]);

    const total = staticPages.length + cityEntries.length + totalServiceUrls + blogEntries.length;
    console.log(
      `Sitemap regenerated: ${3 + serviceSlugs.length} sub-sitemaps | ${staticPages.length} static | ${cityEntries.length} cities | ${serviceSlugs.length} service files (${totalServiceUrls} URLs) | ${blogEntries.length} blog+perguntas | total: ${total} URLs`,
    );

    return new Response(indexXml, { headers: { ...corsHeaders, ...XML_HEADERS } });
  } catch (error) {
    console.error("Sitemap error:", error);
    return new Response("Error generating sitemap", { status: 500, headers: getCorsHeaders(req) });
  }
});
