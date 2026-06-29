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

/** Primary author — Person with OAB credentials for E-E-A-T signals */
export const ARTICLE_AUTHOR = {
  name: "Dr. Fernandez",
  jobTitle: "Advogado Especialista — OAB/PR",
  oabNumber: "OAB/PR 54.321",
  description: "Advogado com mais de 20 anos de experiência em Direito de Família, Imobiliário e Agrário. Sócio-fundador do escritório Fernandez & Fernandes.",
  specialization: "Direito de Família, Imobiliário e Agrário",
  url: ORG_URL,
  image: `${BASE_URL}/favicon.ico`,
};

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
      "@type": "Person",
      name: ARTICLE_AUTHOR.name,
      jobTitle: ARTICLE_AUTHOR.jobTitle,
      description: ARTICLE_AUTHOR.description,
      url: ARTICLE_AUTHOR.url,
      image: { "@type": "ImageObject", url: ARTICLE_AUTHOR.image },
      memberOf: {
        "@type": "Organization",
        name: ORG_NAME,
        url: ORG_URL,
        logo: { "@type": "ImageObject", url: ORG_LOGO },
      },
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

/**
 * Generates a hyperlocal LegalService JSON-LD schema, signalling to Google
 * that the firm explicitly serves a given city within Paraná.
 *
 * Used on hyperlocal SEO pages (e.g. /advogado-<servico>-<cidade>) to reinforce
 * geo-relevance for Rich Results and local pack rankings.
 */
export function generateHyperlocalLegalSchema(
  serviceName: string,
  cityName: string,
  pageUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Fernandez e Fernandes - Advocacia Estratégica",
    description: `${serviceName} em ${cityName} - PR. Atendimento jurídico especializado com mais de 20 anos de tradição.`,
    url: pageUrl,
    image: ORG_LOGO,
    logo: ORG_LOGO,
    priceRange: "$$",
    telephone: "+554130000000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Franz Josef Hoch, 283",
      addressLocality: "Curitiba",
      addressRegion: "PR",
      postalCode: "82510-460",
      addressCountry: "BR",
    },
    areaServed: [
      {
        "@type": "State",
        name: "Paraná",
      },
      {
        "@type": "City",
        name: cityName,
        containedInPlace: {
          "@type": "State",
          name: "Paraná",
        },
      },
    ],
    serviceType: serviceName,
    provider: {
      "@type": "LegalService",
      name: ORG_NAME,
      url: ORG_URL,
    },
  };
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

