const BASE_URL = "https://fernandezefernandes.adv.br";
const ORG_NAME = "Fernandez & Fernandes Advocacia";
const ORG_URL = BASE_URL;
const ORG_LOGO = `${BASE_URL}/favicon.ico`;

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL + "/" },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: BASE_URL + item.path,
      })),
    ],
  };
}

export interface ArticleSchemaProps {
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  updatedAt?: string | null;
  slug: string;
  coverImageUrl?: string | null;
  tags?: string[] | null;
  categoryName?: string | null;
  /** Pass "LegalArticle" for juridical content to get better classification */
  articleType?: "Article" | "LegalArticle";
}

export function buildArticleSchema({
  title,
  excerpt,
  publishedAt,
  updatedAt,
  slug,
  coverImageUrl,
  tags,
  categoryName,
  articleType = "Article",
}: ArticleSchemaProps) {
  const url = `${BASE_URL}/blog/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": articleType,
    headline: title,
    description: excerpt || title,
    datePublished: publishedAt || new Date().toISOString(),
    dateModified: updatedAt || publishedAt || new Date().toISOString(),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: coverImageUrl
      ? { "@type": "ImageObject", url: coverImageUrl }
      : { "@type": "ImageObject", url: `${BASE_URL}/favicon.ico` },
    author: {
      "@type": "Organization",
      name: ORG_NAME,
      url: ORG_URL,
      logo: { "@type": "ImageObject", url: ORG_LOGO },
    },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      url: ORG_URL,
      logo: { "@type": "ImageObject", url: ORG_LOGO },
    },
    keywords: tags?.join(", ") || categoryName || "",
    articleSection: categoryName || "Direito",
    inLanguage: "pt-BR",
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(faqs: FaqItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

/**
 * Extracts FAQ pairs from HTML content by looking for:
 * - <h3> immediately followed by <p> inside a FAQ section
 * - <h2> that contain a question mark immediately followed by <p>
 */
export function extractFaqsFromHtml(html: string): FaqItem[] {
  const faqs: FaqItem[] = [];

  // Strategy 1: h3 questions followed by p answers (most common pattern in generated content)
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = h3Regex.exec(html)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, "").trim();
    const answer = match[2].replace(/<[^>]+>/g, "").trim();
    if (question.length > 5 && answer.length > 10) {
      faqs.push({ question, answer });
    }
  }

  // Strategy 2: if no h3 found, try h2 with question marks
  if (faqs.length === 0) {
    const h2Regex = /<h2[^>]*>([^<]*\?[^<]*)<\/h2>\s*<p[^>]*>(.*?)<\/p>/gi;
    while ((match = h2Regex.exec(html)) !== null) {
      const question = match[1].replace(/<[^>]+>/g, "").trim();
      const answer = match[2].replace(/<[^>]+>/g, "").trim();
      if (question.length > 5 && answer.length > 10) {
        faqs.push({ question, answer });
      }
    }
  }

  // Deduplicate and limit to 8 FAQs (Google recommends ≤ 10)
  const seen = new Set<string>();
  return faqs
    .filter(({ question }) => {
      if (seen.has(question)) return false;
      seen.add(question);
      return true;
    })
    .slice(0, 8);
}

