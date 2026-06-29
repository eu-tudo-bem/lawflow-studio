import { mkdir, readFile, readdir, writeFile, unlink } from "node:fs/promises";
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

async function fetchJson(url, headers, init = {}) {
  const res = await fetch(url, { headers, ...init });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function fetchXml(url, headers, init = {}) {
  const res = await fetch(url, { headers, ...init });
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

  console.log("Regenerating sitemaps in storage...");
  await fetchXml(functionUrl, headers, { method: "POST" });

  const parts = await fetchJson(`${functionUrl}?list-parts=true`, headers);
  const validParts = parts.filter((part) => !/^services-\d+$/.test(part));
  console.log(`Discovered ${validParts.length} valid sitemap parts: ${validParts.join(", ")}`);

  for (const oldFile of [
    "sitemap-services.xml",
    ...parts.filter((part) => /^services-\d+$/.test(part)).map((part) => `sitemap-${part}.xml`),
  ]) {
    try {
      await unlink(path.join(PUBLIC_DIR, oldFile));
    } catch {
      // fine if not exists
    }
  }

  for (const part of validParts) {
    const xml = await fetchXml(`${functionUrl}/sitemap-${part}.xml`, headers);
    validateCanonicalUrls(xml, part);
    await writeFile(path.join(PUBLIC_DIR, `sitemap-${part}.xml`), xml, "utf8");
  }

  const indexXml = await fetchXml(`${functionUrl}/sitemap.xml`, headers);
  validateCanonicalUrls(indexXml, "index");
  await writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), indexXml, "utf8");

  console.log(`Synced ${validParts.length + 1} sitemap files to public/.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
