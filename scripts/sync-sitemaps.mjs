import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import { readdirSync } from "node:fs";
import path from "node:path";

const BASE_URL = "https://fernandezefernandes.adv.br";
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

function parseDotEnv(content) {
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) return null;
        const key = line.slice(0, separatorIndex).trim();
        let value = line.slice(separatorIndex + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        return [key, value];
      })
      .filter(Boolean),
  );
}

async function loadProjectEnv() {
  try {
    const envFile = await readFile(path.join(ROOT_DIR, ".env"), "utf8");
    return parseDotEnv(envFile);
  } catch {
    return {};
  }
}

function getEnvValue(name, envFileValues) {
  const value = process.env[name] || envFileValues[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function fetchJson(url, headers) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function fetchXml(url, headers) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch ${url}: ${res.status} ${errorText}`);
  }
  return res.text();
}

function validateCanonicalUrls(xml, label) {
  const locMatches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const invalid = locMatches.find((loc) => !loc.startsWith(`${BASE_URL}/`));
  if (invalid) throw new Error(`[${label}] Invalid <loc> outside canonical domain: ${invalid}`);
}

function buildIndexXml(parts) {
  const lastmod = new Date().toISOString().split("T")[0];
  const entries = parts
    .map(
      (part) =>
        `  <sitemap>\n    <loc>${BASE_URL}/sitemap-${part}.xml</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
}

async function main() {
  const envFileValues = await loadProjectEnv();
  const supabaseUrl = getEnvValue("VITE_SUPABASE_URL", envFileValues).replace(/\/$/, "");
  const publishableKey = getEnvValue("VITE_SUPABASE_PUBLISHABLE_KEY", envFileValues);
  const functionUrl = `${supabaseUrl}/functions/v1/sitemap`;
  const headers = {
    apikey: publishableKey,
    Authorization: `Bearer ${publishableKey}`,
  };

  await mkdir(PUBLIC_DIR, { recursive: true });

  // 1) Regenerate all sitemaps in storage
  console.log("Regenerating sitemaps in storage...");
  await fetchXml(`${functionUrl}?regenerate=true`, headers);

  // 2) Discover all parts dynamically
  const parts = await fetchJson(`${functionUrl}?list-parts=true`, headers);
  console.log(`Discovered ${parts.length} sitemap parts: ${parts.join(", ")}`);

  // 3) Remove old sitemap-services.xml if present (replaced by per-service files)
  try {
    await unlink(path.join(PUBLIC_DIR, "sitemap-services.xml"));
    console.log("Removed old sitemap-services.xml");
  } catch {
    // fine if not exists
  }

  // 4) Download each part
  for (const part of parts) {
    const xml = await fetchXml(`${functionUrl}?name=${part}`, headers);
    validateCanonicalUrls(xml, part);
    await writeFile(path.join(PUBLIC_DIR, `sitemap-${part}.xml`), xml, "utf8");
  }

  // 5) Write index
  await writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), buildIndexXml(parts), "utf8");
  console.log(`Synced ${parts.length + 1} sitemap files to public/.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
