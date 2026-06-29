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

/* Fixed sitemap parts — "perguntas" is now separate from "blog" */
const FIXED_PARTS = ["static", "cities", "blog", "perguntas"] as const;
const INDEX_SENTINEL = "__index__";
const INVALID_SENTINEL = "__invalid__";

/* Consolidation: max URLs per consolidated services sitemap chunk
   (Google limit is 50,000 — leave headroom for future growth). */
const MAX_URLS_PER_SITEMAP = 45000;


const DOCUMENT_GENERATOR_SLUGS = [
  "notificacao-cobranca-aluguel",
  "notificacao-divida",
  "acordo-divorcio",
  "declaracao-uniao-estavel",
  "contrato-arrendamento-rural",
  "declaracao-dependencia-economica",
  "revisao-pensao-alimenticia",
];

/* ── Static pages — all simulators, calculators, service pages & generators ── */
const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/blog", changefreq: "daily", priority: "0.9" },
  { loc: "/calculadora", changefreq: "monthly", priority: "0.7" },
  { loc: "/calculadora-rescisao", changefreq: "monthly", priority: "0.7" },
  { loc: "/simulador-pensao", changefreq: "monthly", priority: "0.7" },
  { loc: "/simulador-juros", changefreq: "monthly", priority: "0.7" },
  { loc: "/simulador-aposentadoria", changefreq: "monthly", priority: "0.7" },
  { loc: "/simulador-horas-extras", changefreq: "monthly", priority: "0.7" },
  { loc: "/pensao-alimenticia", changefreq: "monthly", priority: "0.8" },
  { loc: "/divorcio-consensual", changefreq: "monthly", priority: "0.8" },
  { loc: "/cobranca-aluguel", changefreq: "monthly", priority: "0.8" },
  { loc: "/direito-agrario", changefreq: "monthly", priority: "0.8" },
  { loc: "/defesa-agraria", changefreq: "monthly", priority: "0.8" },
  { loc: "/transferencia-veiculos", changefreq: "monthly", priority: "0.8" },
  { loc: "/recuperacao-veiculos", changefreq: "monthly", priority: "0.8" },
  { loc: "/naturalizacao", changefreq: "monthly", priority: "0.8" },
  { loc: "/reabilitacao-criminal", changefreq: "monthly", priority: "0.8" },
  { loc: "/execucao-pensao", changefreq: "monthly", priority: "0.8" },
  { loc: "/casos-com-documentos-prontos-parana", changefreq: "weekly", priority: "0.9" },
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

/* ── Slug helpers ── */
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

/* ── Part name routing ── */
function normalizePartName(name: string): string | null {
  const decoded = decodeURIComponent(name).trim().toLowerCase();

  if ((FIXED_PARTS as readonly string[]).includes(decoded)) return decoded;
  // Consolidated service chunks: services-1, services-2, ...
  const chunkMatch = decoded.match(/^services-(\d+)$/);
  if (chunkMatch) return `services-${parseInt(chunkMatch[1], 10)}`;
  return null;
}

function extractRequestedPart(url: URL): string | null {
  const queryName = url.searchParams.get("name");
  if (queryName) return normalizePartName(queryName) ?? INVALID_SENTINEL;

  const seg = url.pathname.split("/").filter(Boolean).at(-1);
  if (!seg || seg === "sitemap" || seg === "sitemap.xml") return INDEX_SENTINEL;

  const m = seg.match(/^sitemap-(.+)\.xml$/i);
  return m ? (normalizePartName(m[1]) ?? INVALID_SENTINEL) : null;
}

/* ── XML builders ── */
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

function buildErrorXml(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<error><message>${message}</message></error>`;
}

function buildSitemapIndex(serviceChunkCount: number): string {
  const now = new Date().toISOString().split("T")[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const part of FIXED_PARTS) {
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-${part}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
  }
  for (let i = 1; i <= serviceChunkCount; i++) {
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-services-${i}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
  }
  xml += `</sitemapindex>`;
  return xml;
}

/* ── Storage helpers ── */
async function uploadToStorage(supabase: any, filename: string, content: string) {
  const blob = new Blob([content], { type: "application/xml; charset=utf-8" });
  const { error } = await supabase.storage
    .from("sitemap")
    .upload(filename, blob, { contentType: "application/xml; charset=utf-8", upsert: true, cacheControl: "3600" });
  if (error) console.error(`[sitemap] upload ${filename}:`, error.message);
}

async function fetchFromStorage(supabase: any, filename: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("sitemap").download(filename);
  if (error || !data) {
    console.warn(`[sitemap] missing ${filename}:`, error?.message ?? "not_found");
    return null;
  }
  console.log(`[sitemap] serving ${filename}`);
  return await data.text();
}

async function listServiceChunkCountFromStorage(supabase: any): Promise<number> {
  const { data, error } = await supabase.storage.from("sitemap").list("", { limit: 500 });
  if (error || !data) return 0;
  let max = 0;
  for (const f of data) {
    const m = f.name.match(/^sitemap-services-(\d+)\.xml$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return max;
}

async function cleanupStaleFiles(supabase: any, activeChunkCount: number) {
  const { data, error } = await supabase.storage.from("sitemap").list("", { limit: 500 });
  if (error || !data) return;
  const keep = new Set<string>();
  for (let i = 1; i <= activeChunkCount; i++) keep.add(`sitemap-services-${i}.xml`);
  const stale = data
    .map((f: any) => f.name as string)
    .filter((n: string) => {
      if (n === "sitemap-services.xml") return true;
      // Remove old per-service files (slug-based) — keep only numeric chunks in `keep`.
      if (/^sitemap-services-.+\.xml$/.test(n) && !keep.has(n)) return true;
      return false;
    });
  if (stale.length) {
    await supabase.storage.from("sitemap").remove(stale);
    console.log(`[sitemap] removed stale: ${stale.join(", ")}`);
  }
}

/* ── Main handler ── */
Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  const cors = getCorsHeaders(req);

  try {
    const url = new URL(req.url);
    const part = extractRequestedPart(url);
    const regen = req.method === "POST" || url.searchParams.get("regenerate") === "true";
    const listParts = url.searchParams.get("list-parts") === "true";

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    /* ── list-parts (JSON) ── */
    if (listParts) {
      const chunks = await listServiceChunkCountFromStorage(supabase);
      const parts = [...FIXED_PARTS, ...Array.from({ length: chunks }, (_, i) => `services-${i + 1}`)];
      return new Response(JSON.stringify(parts), {
        headers: { ...cors, ...JSON_HEADERS },
      });
    }

    /* ── Serve from storage (no regeneration) ── */
    if (!regen) {
      if (part && part !== INDEX_SENTINEL && part !== INVALID_SENTINEL) {
        const filename = `sitemap-${part}.xml`;
        const content = await fetchFromStorage(supabase, filename);

        if (!content) {
          if (part === "perguntas") {
            console.error("[sitemap] sitemap-perguntas.xml not found in storage");
            return new Response(buildErrorXml("sitemap-perguntas.xml not found in storage"), {
              status: 404,
              headers: { ...cors, ...XML_HEADERS },
            });
          }

          return new Response(buildEmptyUrlset(), { headers: { ...cors, ...XML_HEADERS } });
        }

        return new Response(content, { headers: { ...cors, ...XML_HEADERS } });
      }
      if (part === INVALID_SENTINEL) {
        return new Response(buildEmptyUrlset(), { headers: { ...cors, ...XML_HEADERS } });
      }
      const chunks = await listServiceChunkCountFromStorage(supabase);
      return new Response(buildSitemapIndex(chunks), { headers: { ...cors, ...XML_HEADERS } });
    }

    /* ══════════════════════════════════════════════════════════════════
       REGENERATION (POST or ?regenerate=true)
       ══════════════════════════════════════════════════════════════════ */
    const [
      { data: cities, error: e1 },
      { data: services, error: e2 },
      { data: posts, error: e3 },
      { data: questions, error: e4 },
    ] = await Promise.all([
      supabase.from("seo_cities").select("slug").eq("active", true),
      supabase.from("seo_services").select("slug").eq("active", true),
      supabase.from("blog_posts").select("slug, updated_at, published_at").eq("status", "published").order("published_at", { ascending: false }),
      supabase.from("legal_questions").select("slug, updated_at, published_at").eq("status", "published").not("slug", "is", null).neq("slug", "").order("published_at", { ascending: false }),
    ]);
    if (e1) console.error("[sitemap] seo_cities:", e1.message);
    if (e2) console.error("[sitemap] seo_services:", e2.message);
    if (e3) console.error("[sitemap] blog_posts:", e3.message);
    if (e4) console.error("[sitemap] legal_questions:", e4.message);

    const citySlugs = [...new Set((cities || []).map((c: any) => sanitizeSlug(c.slug)).filter(Boolean))];
    const serviceSlugs = [...new Set((services || []).map((s: any) => sanitizeSlug(s.slug)).filter(isValidServiceSlug))];

    /* 1) static */
    await uploadToStorage(supabase, "sitemap-static.xml", buildUrlset(staticPages));

    /* 2) cities */
    const cityEntries = citySlugs.map((slug) => ({ loc: `/escritorio-advocacia-${slug}`, changefreq: "monthly", priority: "0.9" }));
    await uploadToStorage(supabase, "sitemap-cities.xml", buildUrlset(cityEntries));

    /* 3) services — CONSOLIDATED into chunked sitemaps (≤ MAX_URLS_PER_SITEMAP each) */
    const allServiceEntries: UrlEntry[] = [];
    for (const svc of serviceSlugs) {
      for (const city of citySlugs) {
        allServiceEntries.push({
          loc: `/advogado-${svc}-${city}`,
          changefreq: "monthly",
          priority: "0.85",
        });
      }
    }
    const chunkCount = Math.max(1, Math.ceil(allServiceEntries.length / MAX_URLS_PER_SITEMAP));
    for (let i = 0; i < chunkCount; i++) {
      const slice = allServiceEntries.slice(i * MAX_URLS_PER_SITEMAP, (i + 1) * MAX_URLS_PER_SITEMAP);
      await uploadToStorage(supabase, `sitemap-services-${i + 1}.xml`, buildUrlset(slice));
    }
    const totalSvcUrls = allServiceEntries.length;

    /* 4) blog (posts only) */
    const blogEntries: UrlEntry[] = (posts || []).map((p: any) => ({
      loc: `/blog/${sanitizeSlug(p.slug)}`,
      lastmod: (p.updated_at || p.published_at || "").split("T")[0],
      changefreq: "monthly",
      priority: "0.8",
    }));
    await uploadToStorage(supabase, "sitemap-blog.xml", buildUrlset(blogEntries));

    /* 5) perguntas (questions only — separate file) */
    const publishedQuestions = (questions || []).filter((q: any) => typeof q.slug === "string" && sanitizeSlug(q.slug).length > 0);
    const discardedQuestionCount = (questions || []).length - publishedQuestions.length;

    console.log(`[sitemap] legal_questions published rows: ${(questions || []).length}`);
    if (!publishedQuestions.length) {
      console.error("[sitemap] legal_questions returned 0 published rows while generating sitemap-perguntas.xml");
    }
    if (discardedQuestionCount > 0) {
      console.warn(`[sitemap] discarded ${discardedQuestionCount} legal_questions rows with invalid slugs`);
    }

    const perguntaEntries: UrlEntry[] = Array.from(
      new Map(
        publishedQuestions.map((q: any) => {
          const slug = sanitizeSlug(q.slug);
          return [
            slug,
            {
              loc: `/pergunta/${slug}`,
              lastmod: (q.updated_at || q.published_at || "").split("T")[0],
              changefreq: "monthly",
              priority: "0.75",
            },
          ];
        }),
      ).values(),
    );

    await uploadToStorage(supabase, "sitemap-perguntas.xml", buildUrlset(perguntaEntries));
    console.log(`[sitemap] generated sitemap-perguntas.xml with ${perguntaEntries.length} URLs`);

    /* 6) index */
    const indexXml = buildSitemapIndex(chunkCount);
    await uploadToStorage(supabase, "sitemap.xml", indexXml);

    /* 7) cleanup — remove legacy per-service files and any extra numeric chunks */
    await cleanupStaleFiles(supabase, chunkCount);

    const total = staticPages.length + cityEntries.length + totalSvcUrls + blogEntries.length + perguntaEntries.length;
    console.log(
      `Sitemap regenerated: ${FIXED_PARTS.length + chunkCount} sub-sitemaps | ` +
      `${staticPages.length} static | ${cityEntries.length} cities | ` +
      `${chunkCount} consolidated service chunks (${totalSvcUrls} URLs) | ` +
      `${blogEntries.length} blog | ${perguntaEntries.length} perguntas | total: ${total} URLs`,
    );

    return new Response(indexXml, { headers: { ...cors, ...XML_HEADERS } });
  } catch (err) {
    console.error("Sitemap error:", err);
    return new Response(buildEmptyUrlset(), { status: 500, headers: { ...getCorsHeaders(req), ...XML_HEADERS } });
  }
});
