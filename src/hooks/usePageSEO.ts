import { useEffect } from "react";

interface PageSEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
}

const BASE_URL = "https://fernandezefernandes.adv.br";
const DEFAULT_OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4d4490b6-0f65-4dc8-a521-def249e2f0ab/id-preview-dad89a7d--9225230f-7fc9-43cc-81e6-0534a0f9899a.lovable.app-1771628949583.png";

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

export function usePageSEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  robots = "index, follow",
}: PageSEOConfig) {
  useEffect(() => {
    document.title = title;
    setMetaTag("description", description);
    setMetaTag("robots", robots);
    setCanonical(canonical || `${BASE_URL}${window.location.pathname}`);

    // Open Graph
    setMetaTag("og:title", ogTitle || title, "property");
    setMetaTag("og:description", ogDescription || description, "property");
    setMetaTag("og:url", canonical || `${BASE_URL}${window.location.pathname}`, "property");
    setMetaTag("og:image", ogImage || DEFAULT_OG_IMAGE, "property");

    // Twitter
    setMetaTag("twitter:title", ogTitle || title);
    setMetaTag("twitter:description", ogDescription || description);
    setMetaTag("twitter:image", ogImage || DEFAULT_OG_IMAGE);
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, robots]);
}
