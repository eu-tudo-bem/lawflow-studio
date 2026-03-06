import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://fernandezefernandes.adv.br";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ── Fetch cities and services from DB (dynamic) ───────────────────
    const [
      { data: cities },
      { data: services },
      { data: posts },
      { data: questions },
    ] = await Promise.all([
      supabase.from("seo_cities").select("slug").eq("active", true),
      supabase.from("seo_services").select("slug").eq("active", true),
      supabase
        .from("blog_posts")
        .select("slug, updated_at, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase
        .from("legal_questions")
        .select("slug, updated_at, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
    ]);

    const citySlugs = (cities || []).map((c) => c.slug);
    const serviceSlugs = (services || []).map((s) => s.slug);

    // ── Hyper-local pages built from DB ───────────────────────────────
    const hyperlocalCityPages = citySlugs.map((slug) => ({
      loc: `/escritorio-advocacia-${slug}`,
      changefreq: "monthly",
      priority: "0.9",
    }));

    const hyperlocalServicePages = serviceSlugs.flatMap((svc) =>
      citySlugs.map((city) => ({
        loc: `/advogado-${svc}-${city}`,
        changefreq: "monthly",
        priority: "0.85",
      }))
    );

    const allStaticPages = [
      ...staticPages,
      ...hyperlocalCityPages,
      ...hyperlocalServicePages,
    ];

    // ── Build XML ─────────────────────────────────────────────────────
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const page of allStaticPages) {
      xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    if (posts) {
      for (const post of posts) {
        const lastmod = (post.updated_at || post.published_at || "").split("T")[0];
        xml += `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    }

    if (questions) {
      for (const q of questions) {
        const lastmod = (q.updated_at || q.published_at || "").split("T")[0];
        xml += `  <url>
    <loc>${BASE_URL}/pergunta/${q.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
`;
      }
    }

    xml += `</urlset>`;

    // ── Save to storage bucket ────────────────────────────────────────
    const xmlBlob = new Blob([xml], { type: "application/xml" });
    await supabase.storage
      .from("sitemap")
      .upload("sitemap.xml", xmlBlob, {
        contentType: "application/xml",
        upsert: true,
        cacheControl: "3600",
      });

    const totalPages =
      allStaticPages.length + (posts?.length || 0) + (questions?.length || 0);

    console.log(
      `Sitemap updated: ${allStaticPages.length} static (${citySlugs.length} cities × ${serviceSlugs.length} services) | ${posts?.length || 0} blog posts | ${questions?.length || 0} legal questions | total: ${totalPages} URLs`
    );

    return new Response(xml, {
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
