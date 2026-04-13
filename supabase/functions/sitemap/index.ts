import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleOptions } from "../_shared/cors.ts";

const BASE_URL = "https://fernandezefernandes.adv.br";
const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};
const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const FIXED_PARTS = ["static", "cities", "blog"] as const;
const INDEX_SENTINEL = "__index__";
const INVALID_SENTINEL = "__invalid__";

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

function sanitizeSlug(slug: string): string {
  return slug
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function isValidServiceSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && !/^\d+$/.test(slug);
}

function normalizePartName(name: string): string | null {
  const decoded = decodeURIComponent(name).trim().toLowerCase();

  if ((FIXED_PARTS as readonly string[]).includes(decoded)) {
    return decoded;
  }

  if (decoded.startsWith("services-")) {
    const serviceSlug = sanitizeSlug(decoded.slice("services-".length));
    return isValidServiceSlug(serviceSlug) ? `services-${serviceSlug}` : null;
  }

  return null;
}

function extractRequestedPart(url: URL): string | null {
  const queryName = url.searchParams.get("name");
  if (queryName) {
    return normalizePartName(queryName) ?? INVALID_SENTINEL;
  }

  const lastSegment = url.pathname.split("/").filter(Boolean).at(-1);
  if (!lastSegment || lastSegment === "sitemap" || lastSegment === "sitemap.xml") {
    return INDEX_SENTINEL;
  }

  const match = lastSegment.match(/^sitemap-(.+)\.xml$/i);
  if (!match) {
    return null;
  }

  return normalizePartName(match[1]) ?? INVALID_SENTINEL;
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

function buildEmptyUrlset(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
}

function buildSitemapIndex(serviceSlugs: string[]): string {
  const now = new Date().toISOString().split("T")[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const part of FIXED_PARTS) {
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-${part}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
  }

  for (const svc of serviceSlugs) {
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-services-${svc}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
  }

  xml += `</sitemapindex>`;
  return xml;
}

function getStorageFilename(partName: string): string {
  return `sitemap-${partName}.xml`;
}

async function uploadToStorage(
  supabase: any,
  filename: string,
  content: string,
) {
  const blob = new Blob([content], { type: "application/xml" });
  const { error } = await supabase.storage
    .from("sitemap")
    .upload(filename, blob, { contentType: "application/xml", upsert: true, cacheControl: "3600" });

  if (error) {
    console.error(`[sitemap] Failed to upload ${filename}:`, error.message);
  }
}

async function fetchFromStorage(
  supabase: any,
  filename: string,
): Promise<string | null> {
  const { data, error } = await supabase.storage.from("sitemap").download(filename);

  if (error || !data) {
    console.warn(`[sitemap] Missing file in storage: ${filename}`, error?.message ?? "not_found");
    return null;
  }

  console.log(`[sitemap] Serving ${filename} from storage`);
  return await data.text();
}

async function listServiceSlugsFromStorage(
  supabase: any,
): Promise<string[]> {
  const { data, error } = await supabase.storage.from("sitemap").list("", { limit: 500 });
  if (error || !data) return [];

  return data
    .map((file) => file.name.match(/^sitemap-services-(.+)\.xml$/)?.[1] ?? null)
    .filter((slug): slug is string => Boolean(slug))
    .filter((slug) => slug === sanitizeSlug(slug) && isValidServiceSlug(slug))
    .sort();
}

async function cleanupStaleServiceFiles(
  supabase: any,
  activeServiceSlugs: string[],
) {
  const { data, error } = await supabase.storage.from("sitemap").list("", { limit: 500 });
  if (error || !data) {
    if (error) console.error("[sitemap] Failed to list storage for cleanup:", error.message);
    return;
  }

  const validServiceFiles = new Set(activeServiceSlugs.map((slug) => `sitemap-services-${slug}.xml`));
  const staleFiles = data
    .map((file) => file.name)
    .filter((name) => name === "sitemap-services.xml" || (name.startsWith("sitemap-services-") && name.endsWith(".xml") && !validServiceFiles.has(name)));

  if (!staleFiles.length) return;

  const { error: removeError } = await supabase.storage.from("sitemap").remove(staleFiles);
  if (removeError) {
    console.error("[sitemap] Failed to remove stale files:", removeError.message);
    return;
  }

  console.log(`[sitemap] Removed stale service files: ${staleFiles.join(", ")}`);
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  const corsHeaders = getCorsHeaders(req);

  try {
    const url = new URL(req.url);
    const requestedPart = extractRequestedPart(url);
    const shouldRegenerate = req.method === "POST" || url.searchParams.get("regenerate") === "true";
    const listParts = url.searchParams.get("list-parts") === "true";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (listParts) {
      const svcSlugs = await listServiceSlugsFromStorage(supabase);
      const allParts = [...FIXED_PARTS, ...svcSlugs.map((slug) => `services-${slug}`)];
      return new Response(JSON.stringify(allParts), {
        headers: { ...corsHeaders, ...JSON_HEADERS },
      });
    }

    if (!shouldRegenerate) {
      if (requestedPart && requestedPart !== INDEX_SENTINEL && requestedPart !== INVALID_SENTINEL) {
        const filename = getStorageFilename(requestedPart);
        const content = await fetchFromStorage(supabase, filename);
        return new Response(content ?? buildEmptyUrlset(), {
          headers: { ...corsHeaders, ...XML_HEADERS },
        });
      }

      if (requestedPart === INVALID_SENTINEL) {
        return new Response(buildEmptyUrlset(), {
          headers: { ...corsHeaders, ...XML_HEADERS },
        });
      }

      const svcSlugs = await listServiceSlugsFromStorage(supabase);
      return new Response(buildSitemapIndex(svcSlugs), {
        headers: { ...corsHeaders, ...XML_HEADERS },
      });
    }

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

    const citySlugs = Array.from(new Set((cities || []).map((city) => sanitizeSlug(city.slug)).filter(Boolean)));
    const serviceSlugs = Array.from(new Set((services || []).map((service) => sanitizeSlug(service.slug)).filter(isValidServiceSlug)));

    await uploadToStorage(supabase, "sitemap-static.xml", buildUrlset(staticPages));

    const cityEntries = citySlugs.map((slug) => ({
      loc: `/escritorio-advocacia-${slug}`,
      changefreq: "monthly",
      priority: "0.9",
    }));
    await uploadToStorage(supabase, "sitemap-cities.xml", buildUrlset(cityEntries));

    let totalServiceUrls = 0;
    for (const serviceSlug of serviceSlugs) {
      const entries: UrlEntry[] = citySlugs.map((citySlug) => ({
        loc: `/advogado-${serviceSlug}-${citySlug}`,
        changefreq: "monthly",
        priority: "0.85",
      }));

      totalServiceUrls += entries.length;
      await uploadToStorage(supabase, `sitemap-services-${serviceSlug}.xml`, buildUrlset(entries));
    }

    const blogEntries: UrlEntry[] = [
      ...((posts || []).map((post) => ({
        loc: `/blog/${sanitizeSlug(post.slug)}`,
        lastmod: (post.updated_at || post.published_at || "").split("T")[0],
        changefreq: "monthly",
        priority: "0.8",
      }))),
      ...((questions || []).map((question) => ({
        loc: `/pergunta/${sanitizeSlug(question.slug)}`,
        lastmod: (question.updated_at || question.published_at || "").split("T")[0],
        changefreq: "monthly",
        priority: "0.75",
      }))),
    ];
    await uploadToStorage(supabase, "sitemap-blog.xml", buildUrlset(blogEntries));

    const indexXml = buildSitemapIndex(serviceSlugs);
    await uploadToStorage(supabase, "sitemap.xml", indexXml);
    await cleanupStaleServiceFiles(supabase, serviceSlugs);

    const total = staticPages.length + cityEntries.length + totalServiceUrls + blogEntries.length;
    console.log(
      `Sitemap regenerated: ${3 + serviceSlugs.length} sub-sitemaps | ${staticPages.length} static | ${cityEntries.length} cities | ${serviceSlugs.length} service files (${totalServiceUrls} URLs) | ${blogEntries.length} blog+perguntas | total: ${total} URLs`,
    );

    return new Response(indexXml, {
      headers: { ...corsHeaders, ...XML_HEADERS },
    });
  } catch (error) {
    console.error("Sitemap error:", error);
    return new Response(buildEmptyUrlset(), {
      status: 500,
      headers: { ...getCorsHeaders(req), ...XML_HEADERS },
    });
  }
});
