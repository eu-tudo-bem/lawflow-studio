import { useParams, Navigate, Link, useLocation } from "react-router-dom";
import { MessageCircle, Scale, Users, CheckCircle, MapPin, Phone, ArrowRight, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageSEO } from "@/hooks/usePageSEO";
import {
  getCityBySlug,
  textVariations,
  getWhatsAppLink,
  PARANA_CITIES,
  LEGAL_SERVICES,
  getServiceCitySlug,
  getCityDisplayName,
  getNearbyCitySlugs,
  type CityData,
} from "@/data/localSEOCities";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateHyperlocalLegalSchema } from "@/lib/seoSchemas";
import DocumentReadyCasesSection from "@/components/DocumentReadyCasesSection";

const CURRENT_YEAR = new Date().getFullYear();

const services = [
  { label: "Divórcio Consensual", icon: "⚖️" },
  { label: "Pensão Alimentícia", icon: "👨‍👩‍👧" },
  { label: "Execução de Aluguéis", icon: "🏠" },
  { label: "Regularização de Veículos", icon: "🚗" },
  { label: "Direito Agrário", icon: "🌾" },
  { label: "Usucapião", icon: "📋" },
  { label: "Cobranças Judiciais", icon: "💼" },
];

const LocalAdvocaciaPage = ({ citySlugOverride }: { citySlugOverride?: string } = {}) => {
  const params = useParams<{ cidade?: string; "*"?: string }>();
  const location = useLocation();

  // Support: explicit prop > /escritorio-advocacia/:cidade > pathname pattern
  let cidadeSlug = citySlugOverride || params.cidade || params["*"] || "";
  if (!cidadeSlug) {
    const m = location.pathname.match(/^\/escritorio-advocacia-(.+)$/);
    cidadeSlug = m ? m[1] : "";
  }

  const nativeCity = getCityBySlug(cidadeSlug);
  const [dynamicCity, setDynamicCity] = useState<CityData | null>(null);

  // Fetch from DB if not a native city. Missing DB record → keep Fallback Premium (index,follow).
  useEffect(() => {
    if (nativeCity || !cidadeSlug) return;
    supabase
      .from("seo_cities" as any)
      .select("slug, name, region")
      .eq("slug", cidadeSlug)
      .eq("active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDynamicCity({ slug: (data as any).slug, name: (data as any).name, region: (data as any).region, variationIndex: 0 });
        }
      });
  }, [cidadeSlug, nativeCity]);

  // Fallback Premium: synthesize CityData from the slug so the page always renders indexable.
  const fallbackCity: CityData | null = cidadeSlug
    ? { slug: cidadeSlug, name: getCityDisplayName(cidadeSlug), region: "Paraná", variationIndex: 0 }
    : null;
  const city = nativeCity || dynamicCity || fallbackCity;


  const cityName = getCityDisplayName(city?.name ?? cidadeSlug);
  const cityRegion = city?.region ?? "Paraná";
  const citySlug = city?.slug ?? "";
  const v = city?.variationIndex ?? 0;

  const subtitle = textVariations.subtitle[v](cityName, cityRegion);
  const serviceIntro = textVariations.serviceIntro[v](cityName);
  const problemsIntro = textVariations.problemsIntro[v](cityName);
  const attendanceText = textVariations.attendanceText[v](cityName);
  const ctaText = textVariations.ctaText[v](cityName);
  const whatsappLink = getWhatsAppLink(cityName);

  // CTR-optimised title with brand and Paraná positioning
  const metaTitle = city
    ? `Advogado em ${cityName} - PR | Consulta Rápida ${CURRENT_YEAR} · Fernandez & Fernandes`
    : "Advocacia no Paraná";
  const metaDescription = city
    ? `Advogado em ${cityName} (PR) com +20 anos de tradição: divórcio, pensão, cobranças e proteção patrimonial. Consulta gratuita 100% online via WhatsApp.`
    : "";
  const canonical = city
    ? `https://fernandezefernandes.adv.br/escritorio-advocacia-${citySlug}`
    : "";

  // Nearby cities for internal linking cluster
  const nearbyCities = citySlug
    ? getNearbyCitySlugs(citySlug, 6)
    : PARANA_CITIES.slice(0, 6);


  usePageSEO({
    title: metaTitle,
    description: metaDescription,
    canonical,
    robots: "index, follow",
  });

  // LocalBusiness + LegalService Schema Markup
  useEffect(() => {
    const schemaId = "local-business-schema";
    const existing = document.getElementById(schemaId);
    if (existing) existing.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": ["LegalService", "LocalBusiness"],
      name: `Fernandez & Fernandes Advocacia – ${cityName}`,
      description: metaDescription,
      url: canonical,
      telephone: "+554130000000",
      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressRegion: "PR",
        addressCountry: "BR",
      },
      areaServed: {
        "@type": "City",
        name: cityName,
        containedInPlace: {
          "@type": "State",
          name: "Paraná",
        },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Serviços Jurídicos em ${cityName}`,
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "LegalService",
            name: s.label,
          },
        })),
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Início",
            item: "https://fernandezefernandes.adv.br",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: `Advocacia em ${cityName}`,
            item: canonical,
          },
        ],
      },
    };

    if (!city) return;

    const script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // Hyperlocal geo-targeted LegalService schema (areaServed: State + City)
    const hyperlocalId = "hyperlocal-legal-schema";
    document.getElementById(hyperlocalId)?.remove();
    const hyperlocalScript = document.createElement("script");
    hyperlocalScript.id = hyperlocalId;
    hyperlocalScript.type = "application/ld+json";
    hyperlocalScript.text = JSON.stringify(
      generateHyperlocalLegalSchema("Advocacia Estratégica", cityName, canonical),
    );
    document.head.appendChild(hyperlocalScript);

    return () => {
      document.getElementById(schemaId)?.remove();
      document.getElementById(hyperlocalId)?.remove();
    };
  }, [citySlug]);

  // Fallback Premium guarantees `city` is always set when cidadeSlug exists.
  // Only render the spinner if there is literally no slug to work with.
  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-background font-sans">
      {/* Minimal Header */}
      <header className="bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)] py-4 px-4 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Scale className="h-6 w-6 text-[hsl(45_60%_55%)]" />
            <span className="font-serif font-semibold text-lg">Fernandez & Fernandes</span>
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Falar Agora
          </a>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-[hsl(220_30%_97%)] border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Home className="h-3 w-3" />
                Início
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="text-foreground font-medium">Advocacia em {cityName}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 text-[hsl(45_60%_55%)] text-sm font-medium mb-4">
            <MapPin className="h-4 w-4" />
            {cityRegion} · Estado do Paraná
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Escritório de Advocacia em{" "}
            <span className="text-[hsl(45_60%_55%)]">{cityName}</span>
          </h1>
          <p className="text-lg md:text-xl text-[hsl(45_20%_95%)]/80 mb-8 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-[#1ebe5d] transition-all hover:scale-105 shadow-lg"
            >
              <MessageCircle className="h-6 w-6" />
              {ctaText}
            </a>
            <Link
              to="/#contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-[hsl(45_20%_95%)]/30 text-[hsl(45_20%_95%)] font-semibold px-8 py-4 rounded-xl hover:border-[hsl(45_20%_95%)]/70 transition-all"
            >
              Agendar Consulta
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-[hsl(220_50%_16%)] text-[hsl(45_20%_95%)] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "20+", label: "Anos de Experiência" },
              { value: "2.500+", label: "Clientes Atendidos" },
              { value: "95%", label: "Casos de Sucesso" },
              { value: "100%", label: "Atendimento Online" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-[hsl(45_60%_55%)]">{stat.value}</p>
                <p className="text-sm text-[hsl(45_20%_95%)]/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
              Serviços Jurídicos em {cityName}
            </h2>
            <p className="text-muted-foreground">{serviceIntro}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.label}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-[hsl(45_60%_55%)] hover:shadow-md transition-all"
              >
                <span className="text-2xl" aria-hidden="true">{service.icon}</span>
                <span className="font-medium text-foreground">{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="py-16 bg-[hsl(220_30%_97%)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
              Problemas que Resolvemos em {cityName}
            </h2>
            <p className="text-muted-foreground">{problemsIntro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              `Advogado para divórcio em ${cityName}`,
              `Advogado para pensão alimentícia em ${cityName}`,
              `Advogado para cobrança de aluguel em ${cityName}`,
              `Advogado para regularização de veículo em ${cityName}`,
              `Advogado para usucapião em ${cityName}`,
              `Advogado para direito agrário em ${cityName}`,
            ].map((problem) => (
              <div
                key={problem}
                className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border"
              >
                <CheckCircle className="h-5 w-5 text-[hsl(45_60%_55%)] mt-0.5 flex-shrink-0" />
                <span className="text-foreground font-medium">{problem}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attendance / CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(220_50%_12%)] mb-6">
            <Users className="h-8 w-8 text-[hsl(45_60%_55%)]" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            Atendimento para {cityName} e Região
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {attendanceText}
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-xl px-10 py-5 rounded-2xl hover:bg-[#1ebe5d] transition-all hover:scale-105 shadow-xl"
          >
            <MessageCircle className="h-7 w-7" />
            Falar com Advogado Agora
          </a>
          <p className="text-sm text-muted-foreground mt-4">
            Resposta em até 1 hora · Primeira consulta gratuita
          </p>
        </div>
      </section>

      {/* Other Cities — Cidades Atendidas na Região */}
      <section className="py-12 bg-[hsl(220_30%_97%)] border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-xl font-bold text-foreground mb-2 text-center">
            Cidades Atendidas na Região
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Atendemos também as cidades vizinhas de {cityName} em toda a região de {cityRegion}.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {nearbyCities.map((c) => (
              <Link
                key={c.slug}
                to={`/escritorio-advocacia-${c.slug}`}
                className="px-3 py-1.5 text-sm bg-background border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-[hsl(45_60%_55%)] transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
          {/* All Paraná cities secondary list */}
          <div className="flex flex-wrap gap-2 justify-center">
            {PARANA_CITIES.filter((c) => c.slug !== citySlug && !nearbyCities.find((n) => n.slug === c.slug))
              .slice(0, 8)
              .map((c) => (
                <Link
                  key={c.slug}
                  to={`/escritorio-advocacia-${c.slug}`}
                  className="px-3 py-1.5 text-sm bg-background border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-[hsl(45_60%_55%)] transition-colors"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Services links cluster for this city */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-xl font-bold text-foreground mb-6 text-center">
            Serviços Jurídicos em {cityName} — Guia {CURRENT_YEAR}
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {LEGAL_SERVICES.map((s) => (
              <Link
                key={s.slug}
                to={`/${getServiceCitySlug(s.slug, citySlug)}`}
                className="px-3 py-1.5 text-sm bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-[hsl(45_60%_55%)] transition-colors"
              >
                {s.icon} {s.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(220_50%_8%)] text-[hsl(45_20%_95%)]/60 py-8 px-4 text-center text-sm">
        <p className="mb-2">
          © {new Date().getFullYear()} Fernandez & Fernandes Advocacia & Consultoria · OAB/PR
        </p>
        <Link to="/" className="text-[hsl(45_60%_55%)] hover:underline">
          Acessar site completo
        </Link>
      </footer>
    </div>
  );
};

export default LocalAdvocaciaPage;
