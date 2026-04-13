import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = "https://fernandezefernandes.adv.br";
const PARTS = ["static", "cities", "services", "blog"];
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
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function fetchXml(url, headers) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch ${url}: ${response.status} ${errorText}`);
  }

  return await response.text();
}

function validateCanonicalUrls(xml, label) {
  const locMatches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const invalidLoc = locMatches.find((loc) => !loc.startsWith(`${BASE_URL}/`));

  if (invalidLoc) {
    throw new Error(`[${label}] Invalid <loc> outside canonical domain: ${invalidLoc}`);
  }
}

function buildIndexXml() {
  const lastmod = new Date().toISOString().split("T")[0];
  const entries = PARTS.map(
    (part) => `  <sitemap>\n    <loc>${BASE_URL}/sitemap-${part}.xml</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
  ).join("\n");

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
  await fetchXml(`${functionUrl}?regenerate=true`, headers);

  for (const part of PARTS) {
    const xml = await fetchXml(`${functionUrl}?name=${part}`, headers);
    validateCanonicalUrls(xml, part);
    await writeFile(path.join(PUBLIC_DIR, `sitemap-${part}.xml`), xml, "utf8");
  }

  await writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), buildIndexXml(), "utf8");
  console.log(`Synced ${PARTS.length + 1} sitemap files to public/.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
