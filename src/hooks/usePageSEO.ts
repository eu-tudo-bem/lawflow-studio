import { useEffect } from "react";
import { extractFaqsFromHtml, buildFaqSchema } from "@/lib/seoSchemas";

interface PageSEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  /** Pass the page's HTML string to auto-inject FAQPage JSON-LD when FAQ content is detected */
  faqHtml?: string;
}

const DEFAULT_OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4d4490b6-0f65-4dc8-a521-def249e2f0ab/id-preview--9225230f-7fc9-43cc-81e6-0534a0f9899a.lovable.app-1771628949583.png";
const FAQ_SCHEMA_ID = "auto-faq-schema";

function setMetaTag(name: string, content: string, attribute: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
  if (el) {
    el.setAttribute("content", content);
  } else {
    el = document.createElement("meta");
    el.setAttribute(attribute, name);
    el.content = content;
    document.head.appendChild(el);
  }
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (el) {
    el.href = href;
  } else {
    el = document.createElement("link");
    el.rel = "canonical";
    el.href = href;
    document.head.appendChild(el);
  }
}

/** Strip www. from any URL to enforce the canonical non-www domain */
function stripWww(url: string): string {
  return url.replace(/^(https?:\/\/)www\./i, "$1");
}

/** Inject or remove FAQPage JSON-LD based on extracted FAQ pairs from HTML */
function syncFaqSchema(html?: string) {
  document.getElementById(FAQ_SCHEMA_ID)?.remove();
  if (!html) return;
  const faqs = extractFaqsFromHtml(html);
  const schema = buildFaqSchema(faqs);
  if (!schema) return;
  const script = document.createElement("script");
  script.id = FAQ_SCHEMA_ID;
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

export function usePageSEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  robots = "index, follow",
  faqHtml,
}: PageSEOConfig) {
  useEffect(() => {
    // Sanitize: strip www and skip if not yet resolved (avoids wrong "/" during async loading)
    const resolvedCanonical = canonical ? stripWww(canonical) : "";
    const isPublicHyperlocalRoute =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/advogado-") || window.location.pathname.startsWith("/advogado/"));
    const effectiveRobots = isPublicHyperlocalRoute ? "index, follow" : robots;

    document.title = title;
    setMetaTag("description", description);
    setMetaTag("robots", effectiveRobots);

    if (resolvedCanonical) {
      setCanonical(resolvedCanonical);
    }

    // Open Graph
    setMetaTag("og:title", ogTitle || title, "property");
    setMetaTag("og:description", ogDescription || description, "property");
    if (resolvedCanonical) {
      setMetaTag("og:url", resolvedCanonical, "property");
    }
    setMetaTag("og:image", ogImage || DEFAULT_OG_IMAGE, "property");

    // Twitter
    setMetaTag("twitter:title", ogTitle || title);
    setMetaTag("twitter:description", ogDescription || description);
    setMetaTag("twitter:image", ogImage || DEFAULT_OG_IMAGE);

    // Auto-inject FAQPage JSON-LD when faqHtml is provided
    syncFaqSchema(faqHtml);

    return () => {
      document.getElementById(FAQ_SCHEMA_ID)?.remove();
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, robots, faqHtml]);
}
