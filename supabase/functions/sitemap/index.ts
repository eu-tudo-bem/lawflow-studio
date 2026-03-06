import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://fernandezefernandes.adv.br";

const PARANA_CITY_SLUGS = [
  "curitiba", "londrina", "maringa", "cascavel", "foz-do-iguacu",
  "ponta-grossa", "guarapuava", "colombo", "apucarana", "toledo",
  "arapongas", "campo-largo", "campo-mourao", "paranagua", "umuarama",
  "cornelio-procopio", "pato-branco", "francisco-beltrao", "castro", "dois-vizinhos",
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
  // Hyper-local SEO pages – Paraná cities
  ...PARANA_CITY_SLUGS.map((slug) => ({
    loc: `/escritorio-advocacia-${slug}`,
    changefreq: "monthly",
    priority: "0.9",
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

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const page of staticPages) {
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

    xml += `</urlset>`;

    // Save to storage bucket for static access
    const xmlBlob = new Blob([xml], { type: "application/xml" });
    await supabase.storage
      .from("sitemap")
      .upload("sitemap.xml", xmlBlob, {
        contentType: "application/xml",
        upsert: true,
        cacheControl: "3600",
      });

    console.log("Sitemap updated successfully with", (posts?.length || 0), "blog posts");

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
