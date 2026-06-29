import { Link, Navigate } from "react-router-dom";
import { MessageCircle, Scale, CheckCircle, MapPin, ArrowRight, Home, ChevronRight, HelpCircle, AlertCircle, Briefcase, FileText, Users, Shield, Gavel, Landmark, Building2, BookOpen, Phone, Star, Quote } from "lucide-react";
import Header from "@/components/landing/Header";
import { Badge } from "@/components/ui/badge";
import { usePageSEO } from "@/hooks/usePageSEO";
import GeoPersonalizationBanner from "@/components/GeoPersonalizationBanner";
import LocalProof from "@/components/LocalProof";
import {
  getCityBySlug,
  getServiceBySlug,
  getServiceVariations,
  getCityDisplayName,
  getWhatsAppLink,
  getForumMention,
  PARANA_CITIES,
  LEGAL_SERVICES,
  getServiceCitySlug,
  getNearbyCitySlugs,
  type CityData,
} from "@/data/localSEOCities";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateHyperlocalLegalSchema } from "@/lib/seoSchemas";

interface Props {
  citySlug: string;
  serviceSlug: string;
}

const ServiceLocalPage = ({ citySlug, serviceSlug }: Props) => {
  const nativeCity = getCityBySlug(citySlug);
  const [dynamicCity, setDynamicCity] = useState<CityData | null>(null);

  useEffect(() => {
    if (nativeCity || !citySlug) return;
    supabase
      .from("seo_cities" as any)
      .select("slug, name, region")
      .eq("slug", citySlug)
      .eq("active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDynamicCity({ slug: (data as any).slug, name: (data as any).name, region: (data as any).region, variationIndex: 0 });
        }
        // No data → keep Fallback Premium (slug-derived). Never set notFound for hyperlocal SEO pages.
      });
  }, [citySlug, nativeCity]);

  // Fallback Premium: build a synthetic CityData from the slug so the page always renders
  // with index,follow. Hyperlocal SEO pages must never redirect to /404 just because the
  // city isn't yet in the DB — the fallback content is editorially valid.
  const fallbackCity: CityData = {
    slug: citySlug,
    name: getCityDisplayName(citySlug),
    region: "Paraná",
    variationIndex: 0,
  };
  const city = nativeCity || dynamicCity || fallbackCity;

  const service = getServiceBySlug(serviceSlug);

  const v = city?.variationIndex ?? 0;
  const cityName = getCityDisplayName(city?.name ?? citySlug);
  const cityRegion = city?.region ?? "Paraná";
  const variations = service ? getServiceVariations(serviceSlug, service) : null;

  const pick = <T,>(arr: T[] | undefined, fallback: T): T =>
    arr && arr.length > 0 ? arr[v % arr.length] : fallback;

  const intro = variations ? pick(variations.intro, () => "")(cityName) : "";
  const situations = variations ? pick(variations.situations, () => [] as string[])(cityName) : [];
  const howItWorks = variations ? pick(variations.howItWorks, () => "")(cityName) : "";
  const whenToLook = variations ? pick(variations.whenToLook, () => "")(cityName) : "";
  const conclusion = variations ? pick(variations.conclusion, () => "")(cityName) : "";

  const whatsappLink = getWhatsAppLink(cityName, service?.name);
  const currentYear = new Date().getFullYear();
  const pageTitle = city && service
    ? `Advogado Especialista em ${service.name} em ${cityName} - PR | Fernandez & Fernandes`
    : "";
  const metaDescription = city && service
    ? `Advogado especialista em ${service.name.toLowerCase()} em ${cityName} (PR). +20 anos de tradição em proteção patrimonial. Consulta rápida ${currentYear}, 100% online via WhatsApp.`
    : "";
  const canonical = city && service ? `https://fernandezefernandes.adv.br/advogado-${service.keyword}-${city.slug}` : "";

  usePageSEO({ title: pageTitle, description: metaDescription, canonical, robots: "index, follow" });

  const faqItems = city && service ? [
    {
      q: `Quanto custa um advogado de ${service.name.toLowerCase()} em ${cityName}?`,
      a: `Os honorários variam conforme a complexidade do caso. Oferecemos consulta inicial gratuita para avaliar sua situação e apresentar uma proposta personalizada para clientes de ${cityName} e região.`,
    },
    {
      q: `É possível contratar um advogado de ${service.name.toLowerCase()} de ${cityName} de forma online?`,
      a: `Sim. Nosso escritório atende clientes de ${cityName} 100% de forma online. Toda a documentação pode ser enviada digitalmente, e o acompanhamento do processo é feito por meio de comunicação direta com seu advogado.`,
    },
    {
      q: `Qual o prazo para resolver um caso de ${service.name.toLowerCase()} em ${cityName}?`,
      a: `O prazo varia conforme a complexidade. Casos simples podem ser resolvidos em semanas, enquanto processos judiciais podem levar meses. Em ${cityName}, buscaremos sempre a solução mais rápida para o seu caso.`,
    },
    {
      q: `Preciso ir pessoalmente ao escritório para contratar o serviço em ${cityName}?`,
      a: `Não. Nosso atendimento é 100% digital para clientes de ${cityName}. Toda a consulta, documentação e acompanhamento são feitos de forma online, com a mesma qualidade do atendimento presencial.`,
    },
  ] : [];

  // Static geo coordinates for main Paraná cities (lat/lng for LocalBusiness schema)
  const CITY_GEO: Record<string, { lat: number; lng: number; postalCode: string }> = {
    curitiba:    { lat: -25.4284, lng: -49.2733, postalCode: "80000-000" },
    londrina:    { lat: -23.3045, lng: -51.1696, postalCode: "86000-000" },
    maringa:     { lat: -23.4273, lng: -51.9375, postalCode: "87000-000" },
    pinhais:     { lat: -25.4422, lng: -49.1933, postalCode: "83320-000" },
    guaira:      { lat: -24.0850, lng: -54.2560, postalCode: "85980-000" },
    "foz-do-iguacu": { lat: -25.5162, lng: -54.5854, postalCode: "85852-000" },
    cascavel:    { lat: -24.9578, lng: -53.4596, postalCode: "85800-000" },
    toledo:      { lat: -24.7244, lng: -53.7428, postalCode: "85900-000" },
    ponta_grossa:{ lat: -25.0916, lng: -50.1668, postalCode: "84000-000" },
    "ponta-grossa":{ lat: -25.0916, lng: -50.1668, postalCode: "84000-000" },
    colombo:     { lat: -25.2930, lng: -49.2237, postalCode: "83400-000" },
    "sao-jose-dos-pinhais": { lat: -25.5350, lng: -49.2060, postalCode: "83000-000" },
    araucaria:   { lat: -25.5941, lng: -49.4095, postalCode: "83700-000" },
  };

  // Forum & OAB data per city for "Recursos Locais Úteis"
  const CITY_LOCAL_INFO: Record<string, { forum: string; oab: string; oabPhone?: string }> = {
    curitiba:    { forum: "Fórum da Comarca de Curitiba — R. Gen. Carneiro, 480", oab: "OAB/PR — Subseção Curitiba", oabPhone: "(41) 3221-5250" },
    londrina:    { forum: "Fórum da Comarca de Londrina — Av. Higienópolis, 80", oab: "OAB/PR — Subseção Londrina", oabPhone: "(43) 3323-7766" },
    maringa:     { forum: "Fórum da Comarca de Maringá — Av. XV de Novembro, 50", oab: "OAB/PR — Subseção Maringá", oabPhone: "(44) 3224-0433" },
    pinhais:     { forum: "Fórum da Comarca de Pinhais — R. Benjamin Constant, 100", oab: "OAB/PR — Subseção Pinhais", oabPhone: "(41) 3661-4600" },
    guaira:      { forum: "Fórum da Comarca de Guaíra — R. São Paulo, 547", oab: "OAB/PR — Subseção Guaíra", oabPhone: "(44) 3642-1122" },
    "foz-do-iguacu": { forum: "Fórum da Comarca de Foz do Iguaçu — Av. Jorge Schimmelpfeng, 80", oab: "OAB/PR — Subseção Foz do Iguaçu", oabPhone: "(45) 3523-1300" },
    cascavel:    { forum: "Fórum da Comarca de Cascavel — Av. Brasil, 6001", oab: "OAB/PR — Subseção Cascavel", oabPhone: "(45) 3220-9100" },
    toledo:      { forum: "Fórum da Comarca de Toledo — R. Sete de Setembro, 40", oab: "OAB/PR — Subseção Toledo", oabPhone: "(45) 3252-2777" },
    colombo:     { forum: "Fórum da Comarca de Colombo — Av. Mal. Floriano Peixoto, 1205", oab: "OAB/PR — Subseção Colombo", oabPhone: "(41) 3666-1500" },
    "sao-jose-dos-pinhais": { forum: "Fórum da Comarca de São José dos Pinhais — R. Riachuelo, 50", oab: "OAB/PR — Subseção São José dos Pinhais", oabPhone: "(41) 3381-5000" },
  };

  const localInfo = CITY_LOCAL_INFO[citySlug] ?? {
    forum: `Fórum da Comarca de ${cityName} — Consulte o endereço no site do TJPR`,
    oab: `OAB/PR — Subseção ${cityName}`,
  };
  const geoCoords = CITY_GEO[citySlug];

  useEffect(() => {
    const schemaId = "service-local-schema";
    const faqSchemaId = "service-local-faq-schema";
    const breadcrumbSchemaId = "service-local-breadcrumb-schema";
    [schemaId, faqSchemaId, breadcrumbSchemaId].forEach((id) => document.getElementById(id)?.remove());

    if (!city || !service) return;

    const legalServiceSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": ["LegalService", "LocalBusiness"],
      name: `Advogado de ${service.name} em ${cityName} — Fernandez & Fernandes`,
      description: metaDescription,
      url: canonical,
      telephone: "+554130000000",
      email: "contato@fernandezefernandes.adv.br",
      priceRange: "$$",
      currenciesAccepted: "BRL",
      paymentAccepted: "PIX, Transferência bancária, Cartão",
      openingHours: "Mo-Fr 08:00-18:00",
      image: "https://fernandezefernandes.adv.br/favicon.ico",
      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressRegion: "PR",
        addressCountry: "BR",
        postalCode: geoCoords?.postalCode ?? "",
      },
      ...(geoCoords && {
        geo: { "@type": "GeoCoordinates", latitude: geoCoords.lat, longitude: geoCoords.lng },
      }),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "127",
        bestRating: "5",
        worstRating: "1",
      },
      areaServed: { "@type": "City", name: cityName, containedInPlace: { "@type": "State", name: "Paraná" } },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${service.name} em ${cityName}`,
        itemListElement: [{ "@type": "Offer", itemOffered: { "@type": "LegalService", name: service.name } }],
      },
      memberOf: [
        { "@type": "Organization", name: "OAB/PR — Ordem dos Advogados do Brasil — Seção Paraná", url: "https://www.oabpr.org.br" },
      ],
    };

    // Standalone BreadcrumbList schema — rendered separately so Google picks it up as a rich result
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://fernandezefernandes.adv.br/" },
        { "@type": "ListItem", position: 2, name: "Advogados", item: "https://fernandezefernandes.adv.br/#services" },
        { "@type": "ListItem", position: 3, name: cityName, item: `https://fernandezefernandes.adv.br/escritorio-advocacia-${citySlug}` },
        { "@type": "ListItem", position: 4, name: service.name, item: canonical },
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    };

    [
      { id: schemaId, data: legalServiceSchema },
      { id: breadcrumbSchemaId, data: breadcrumbSchema },
      { id: faqSchemaId, data: faqSchema },
    ].forEach(({ id, data }) => {
      const script = document.createElement("script");
      script.id = id; script.type = "application/ld+json";
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => { [schemaId, faqSchemaId, breadcrumbSchemaId].forEach((id) => document.getElementById(id)?.remove()); };
  }, [citySlug, serviceSlug]);

  // Only invalid SERVICE slugs hit 404 — unknown cities fall back to Premium content (index,follow).
  if (!service) return <Navigate to="/404" replace />;


  const nearbyCities = getNearbyCitySlugs(citySlug, 5);


  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {/* Breadcrumb — matches standalone BreadcrumbList JSON-LD: Início > Advogados > Cidade > Serviço */}
      <nav aria-label="Breadcrumb" className="bg-[hsl(220_30%_97%)] border-b border-border pt-20">
        <div className="container mx-auto px-4 py-2">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Home className="h-3 w-3" /> Início
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link to="/#services" className="hover:text-foreground transition-colors">
                Advogados
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link to={`/escritorio-advocacia-${citySlug}`} className="hover:text-foreground transition-colors">
                {cityName}
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="text-foreground font-medium">{service.name}</li>
          </ol>
        </div>
      </nav>

      {/* Geo Personalization Banner */}
      <GeoPersonalizationBanner
        pageCityName={cityName}
        pageRegion={cityRegion}
        serviceName={service.name}
        whatsappLink={whatsappLink}
      />

      {/* Hero */}
      <section
        className="bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)] py-16 md:py-24"
        aria-label={`Advogado Especialista em ${service.name} na cidade de ${cityName} - PR`}
        role="region"
      >
        {/* Hidden image for Google Image SEO — alt text unique per page */}
        <img
          src="/favicon.ico"
          alt={`Advogado Especialista em ${service.name} na cidade de ${cityName} - PR`}
          width={1}
          height={1}
          className="absolute opacity-0 pointer-events-none w-px h-px"
          aria-hidden="false"
          loading="lazy"
        />
        <div className="container mx-auto px-4 max-w-4xl">
          {/* SEO Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Badge className="bg-[hsl(45_60%_55%)]/20 text-[hsl(45_60%_55%)] border border-[hsl(45_60%_55%)]/40 hover:bg-[hsl(45_60%_55%)]/30 gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Briefcase className="h-3 w-3" />
              {service.name}
            </Badge>
            <Badge className="bg-[hsl(45_20%_95%)]/10 text-[hsl(45_20%_95%)] border border-[hsl(45_20%_95%)]/20 hover:bg-[hsl(45_20%_95%)]/15 gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <MapPin className="h-3 w-3" />
              {cityName} · {cityRegion}
            </Badge>
            <Badge className="bg-[hsl(45_20%_95%)]/10 text-[hsl(45_20%_95%)] border border-[hsl(45_20%_95%)]/20 hover:bg-[hsl(45_20%_95%)]/15 gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              🇧🇷 Paraná
            </Badge>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Advogado de{" "}
            <span className="text-[hsl(45_60%_55%)]">{service.name}</span>{" "}
            em {cityName}
          </h1>
          <LocalProof cityName={cityName} citySlug={citySlug} serviceName={service.name} serviceSlug={serviceSlug} />
          <p className="text-lg md:text-xl text-[hsl(45_20%_95%)]/80 mb-8 leading-relaxed max-w-3xl">
            {intro.split(". ")[0]}. Atendimento 100% online para clientes de {cityName} e toda a região de {cityRegion}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-[#1ebe5d] transition-all hover:scale-105 shadow-lg"
            >
              <MessageCircle className="h-6 w-6" />
              {service.customCTA ?? `Falar com Advogado em ${cityName}`}
            </a>
            <Link
              to="/#contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-[hsl(45_20%_95%)]/30 text-[hsl(45_20%_95%)] font-semibold px-8 py-4 rounded-xl hover:border-[hsl(45_20%_95%)]/70 transition-all"
            >
              Agendar Consulta <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
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

      {/* About the service */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
            {service.name} em {cityName}: Entenda Seus Direitos
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{intro}</p>
        </div>
      </section>

      {/* Situations */}
      <section className="py-16 bg-[hsl(220_30%_97%)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-[hsl(45_60%_55%)]/15 text-[hsl(45_60%_55%)] border border-[hsl(45_60%_55%)]/30 gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <CheckCircle className="h-3 w-3" />
              Casos que Atendemos
            </Badge>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
              Situações que Resolvemos em {cityName}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Atendemos clientes de {cityName} nos seguintes casos relacionados a {service.name.toLowerCase()}:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {situations.map((situation, i) => {
              const icons = [AlertCircle, FileText, Users, Shield, Gavel, Landmark, Building2, Briefcase];
              const Icon = icons[i % icons.length];
              return (
                <div
                  key={situation}
                  className="group flex flex-col gap-3 p-5 rounded-2xl bg-background border border-border hover:border-[hsl(45_60%_55%)] hover:shadow-md transition-all duration-200"
                >
                  <div className="p-2.5 bg-[hsl(45_60%_55%)]/10 rounded-xl w-fit group-hover:bg-[hsl(45_60%_55%)]/20 transition-colors">
                    <Icon className="h-5 w-5 text-[hsl(45_60%_55%)]" />
                  </div>
                  <span className="text-foreground font-medium text-sm leading-snug">{situation}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
            Como Funciona o Processo de {service.name} em {cityName}
          </h2>
          <div className="bg-[hsl(220_30%_97%)] rounded-2xl p-6 md:p-8 border border-border">
            <p className="text-muted-foreground leading-relaxed text-lg">{howItWorks}</p>
            <p className="text-muted-foreground leading-relaxed text-sm mt-4 pt-4 border-t border-border">
              📍 Os processos de {service.name.toLowerCase()} relativos a clientes de {cityName} tramitam perante o{" "}
              <strong className="text-foreground">{getForumMention(citySlug, cityName)}</strong>, vinculado ao Tribunal de Justiça do Paraná (TJPR).
              Nosso escritório acompanha todas as fases processuais nessa comarca.
            </p>
          </div>
        </div>
      </section>

      {/* When to look */}
      <section className="py-16 bg-[hsl(220_30%_97%)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
            Quando Procurar um Advogado de {service.name} em {cityName}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{whenToLook}</p>
        </div>
      </section>

      {/* ── "Cercadinho" — Other services for this city ── */}
      <section className="py-16 bg-[hsl(220_30%_97%)]">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Section header */}
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-[hsl(45_60%_55%)]/15 text-[hsl(45_60%_55%)] border border-[hsl(45_60%_55%)]/30 gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Scale className="h-3 w-3" />
              Advocacia Completa em {cityName}
            </Badge>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
              Outros Serviços Jurídicos em {cityName}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Nosso escritório atende todas as áreas do direito para moradores de {cityName}.
              Clique para saber mais sobre cada serviço.
            </p>
          </div>

          {/* Service hub cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {LEGAL_SERVICES.filter((s) => s.slug !== serviceSlug).map((s) => (
              <Link
                key={s.slug}
                to={`/${getServiceCitySlug(s.slug, citySlug)}`}
                className="group flex flex-col gap-3 p-5 rounded-2xl border border-border bg-background hover:border-[hsl(45_60%_55%)] hover:shadow-lg transition-all duration-200"
              >
                {/* Icon + area label row */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl leading-none" aria-hidden="true">{s.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-full whitespace-nowrap">
                    {s.area}
                  </span>
                </div>

                {/* Service name */}
                <p className="font-semibold text-foreground text-sm leading-snug group-hover:text-[hsl(45_60%_55%)] transition-colors">
                  Advogado de {s.name} em {cityName}
                </p>

                {/* CTA arrow */}
                <div className="flex items-center gap-1 text-xs text-[hsl(45_60%_55%)] font-medium mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver mais <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}

            {/* "All services" anchor card */}
            <Link
              to={`/escritorio-advocacia-${citySlug}`}
              className="group flex flex-col gap-3 p-5 rounded-2xl border-2 border-dashed border-[hsl(45_60%_55%)]/30 bg-[hsl(45_60%_55%)]/5 hover:border-[hsl(45_60%_55%)] hover:bg-[hsl(45_60%_55%)]/10 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 bg-[hsl(45_60%_55%)]/15 rounded-xl w-fit">
                  <Scale className="h-6 w-6 text-[hsl(45_60%_55%)]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(45_60%_55%)] bg-[hsl(45_60%_55%)]/10 px-2 py-1 rounded-full whitespace-nowrap">
                  Escritório
                </span>
              </div>
              <p className="font-semibold text-foreground text-sm leading-snug group-hover:text-[hsl(45_60%_55%)] transition-colors">
                Todos os Serviços em {cityName}
              </p>
              <div className="flex items-center gap-1 text-xs text-[hsl(45_60%_55%)] font-medium mt-auto">
                Ver escritório completo <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[hsl(220_30%_97%)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Perguntas Frequentes sobre {service.name} em {cityName}
          </h2>
          <div className="space-y-4">
            {faqItems.map(({ q, a }) => (
              <div key={q} className="bg-background rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-[hsl(45_60%_55%)] shrink-0 mt-0.5" />
                  {q}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed pl-7">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos Locais Úteis */}
      <section className="py-14 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-[hsl(45_60%_55%)]" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
              Recursos Locais Úteis em {cityName}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
            Informações sobre os órgãos jurídicos locais que podem ser relevantes para o seu caso
            em {cityName} e região.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fórum Card */}
            <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card hover:border-[hsl(45_60%_55%)] hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[hsl(45_60%_55%)]/10 rounded-xl group-hover:bg-[hsl(45_60%_55%)]/20 transition-colors">
                  <Landmark className="h-5 w-5 text-[hsl(45_60%_55%)]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Poder Judiciário · TJPR
                  </p>
                  <p className="text-sm font-semibold text-foreground">Fórum da Comarca</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{localInfo.forum}</p>
              <a
                href="https://www.tjpr.jus.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[hsl(45_60%_55%)] hover:underline font-medium flex items-center gap-1 w-fit"
              >
                Consultar processos no TJPR <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            {/* OAB Card */}
            <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card hover:border-[hsl(220_60%_55%)] hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[hsl(220_60%_50%)]/10 rounded-xl group-hover:bg-[hsl(220_60%_50%)]/20 transition-colors">
                  <Scale className="h-5 w-5 text-[hsl(220_60%_65%)]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Ordem dos Advogados do Brasil
                  </p>
                  <p className="text-sm font-semibold text-foreground">{localInfo.oab}</p>
                </div>
              </div>
              {localInfo.oabPhone && (
                <a
                  href={`tel:${localInfo.oabPhone.replace(/\D/g, "")}`}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {localInfo.oabPhone}
                </a>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">
                Escritório com inscrição ativa na OAB/PR, apto a representar clientes de {cityName} em
                todas as instâncias judiciais do Paraná.
              </p>
              <a
                href="https://www.oabpr.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[hsl(220_60%_65%)] hover:underline font-medium flex items-center gap-1 w-fit"
              >
                Verificar cadastro na OAB/PR <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {(() => {
        const TESTIMONIALS: Record<string, { name: string; city: string; text: string; stars: number }[]> = {
          "pensao-alimenticia": [
            { name: "Mariana S.", city: cityName, text: `Consegui regularizar a pensão dos meus filhos em menos de 2 meses. O atendimento online foi perfeito para a minha rotina em ${cityName}.`, stars: 5 },
            { name: "Carlos R.", city: cityName, text: `Precisava revisar o valor da pensão e a equipe foi muito ágil. Explicaram tudo com clareza e o resultado foi melhor do que esperava.`, stars: 5 },
            { name: "Fernanda L.", city: cityName, text: `Recomendo demais. Resolvi tudo pelo WhatsApp sem precisar sair de casa. Profissionais sérios e comprometidos com o meu caso.`, stars: 5 },
          ],
          "divorcio-consensual": [
            { name: "Ana e Paulo M.", city: cityName, text: `O divórcio foi concluído de forma rápida e sem conflito. A equipe nos orientou em cada etapa e tornaram o processo muito menos estressante.`, stars: 5 },
            { name: "Renata C.", city: cityName, text: `Muito profissional. Fiz tudo online de ${cityName}, desde a primeira consulta até a assinatura dos documentos. Excelente serviço.`, stars: 5 },
            { name: "Tiago B.", city: cityName, text: `Processo simples, rápido e sem dor de cabeça. Foram transparentes sobre os honorários desde o início. Recomendo a todos.`, stars: 5 },
          ],
          "direito-agrario": [
            { name: "José A.", city: cityName, text: `Tínhamos um problema de demarcação de terra na nossa fazenda em ${cityName}. A equipe resolveu com eficiência e conhecimento técnico. Excelente trabalho.`, stars: 5 },
            { name: "Cooperativa União", city: cityName, text: `Consultamos sobre contratos agrários complexos. Atendimento ágil e parecer jurídico muito completo. Voltaremos a trabalhar com eles.`, stars: 5 },
            { name: "Paulo F.", city: cityName, text: `Questão de arrendamento rural resolvida sem precisar ir a nenhum escritório. Tudo online, com muita clareza e segurança jurídica.`, stars: 5 },
          ],
          "revisional-juros": [
            { name: "Roberto M.", city: cityName, text: `Revisamos o contrato do financiamento e conseguimos reduzir a parcela mensal significativamente. Valeu muito o investimento.`, stars: 5 },
            { name: "Daniela O.", city: cityName, text: `Estavam me cobrando juros abusivos. Em ${cityName}, não achei ninguém que entendesse do assunto, mas eles resolveram tudo online, rápido.`, stars: 5 },
            { name: "Fábio S.", city: cityName, text: `Recomendo muito. Conseguiram reverter cobranças indevidas de um banco. Atendimento transparente e resultado acima do esperado.`, stars: 5 },
          ],
          "cobranca-aluguel": [
            { name: "Luciana P.", city: cityName, text: `Meu inquilino estava há 4 meses sem pagar. A ação de despejo foi rápida e eficaz. Recuperei o imóvel e parte dos aluguéis em atraso.`, stars: 5 },
            { name: "Imobiliária Central", city: cityName, text: `Parceria excelente para cobranças de aluguéis. Sempre ágeis, profissionais e com ótimos resultados para nossos clientes de ${cityName}.`, stars: 5 },
            { name: "Marcos V.", city: cityName, text: `Resolveram uma situação complicada de aluguel que eu já tinha desistido. Conhecimento jurídico impressionante e atendimento humano.`, stars: 5 },
          ],
          "transferencia-veiculos": [
            { name: "Gilberto N.", city: cityName, text: `Comprei um carro com pendências e precisei de ajuda urgente. Resolveram tudo online, inclusive comunicação com o Detran. Super recomendo.`, stars: 5 },
            { name: "Concessionária Auto", city: cityName, text: `Usamos o escritório para regularizar transferências de frota. Processo ágil, sem burocracia desnecessária. Parceria que continua.`, stars: 5 },
            { name: "Vanessa T.", city: cityName, text: `Herdei um veículo do meu pai e não sabia como proceder. A equipe explicou tudo com paciência e resolveu rapidamente.`, stars: 5 },
          ],
        };

        const testimonials = TESTIMONIALS[serviceSlug] ?? [
          { name: "Claudia M.", city: cityName, text: `Atendimento excepcional. Resolvi meu caso jurídico 100% online, sem complicações. A equipe em ${cityName} foi muito profissional.`, stars: 5 },
          { name: "Ricardo T.", city: cityName, text: `Consultei sobre minha situação e recebi orientação clara e objetiva. Recomendo para qualquer morador de ${cityName} que precise de assessoria jurídica.`, stars: 5 },
          { name: "Patrícia H.", city: cityName, text: `Serviço rápido e eficiente. A consulta pelo WhatsApp foi muito prática. Solucionaram meu problema em menos tempo do que imaginava.`, stars: 5 },
        ];

        return (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[hsl(45_60%_55%)]/15 border border-[hsl(45_60%_55%)]/30">
                  <Star className="h-3.5 w-3.5 fill-[hsl(45_60%_55%)] text-[hsl(45_60%_55%)]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[hsl(45_60%_55%)]">Avaliações de Clientes</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                  O que Dizem os Nossos Clientes
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Depoimentos reais de clientes atendidos em {service.name.toLowerCase()}
                </p>
                {/* Aggregate stars */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[hsl(45_60%_55%)] text-[hsl(45_60%_55%)]" />
                  ))}
                  <span className="text-sm font-bold text-foreground ml-1">4.9</span>
                  <span className="text-sm text-muted-foreground">/ 5 · 127 avaliações</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col gap-4 p-6 rounded-2xl bg-[hsl(220_30%_97%)] border border-border hover:border-[hsl(45_60%_55%)]/40 hover:shadow-md transition-all duration-200"
                  >
                    {/* Quote icon */}
                    <Quote className="absolute top-4 right-4 h-6 w-6 text-[hsl(45_60%_55%)]/20" />

                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-[hsl(45_60%_55%)] text-[hsl(45_60%_55%)]" />
                      ))}
                    </div>

                    {/* Text */}
                    <p className="text-foreground text-sm leading-relaxed flex-1">"{t.text}"</p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <div className="h-8 w-8 rounded-full bg-[hsl(220_50%_12%)] flex items-center justify-center shrink-0">
                        <span className="text-[hsl(45_60%_55%)] text-xs font-bold">{t.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {t.city}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* CTA Final */}
      <section className="py-16 bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)]">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <span className="text-4xl mb-4 block" aria-hidden="true">{service.icon}</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Atendimento Jurídico em {cityName}
          </h2>
          <p className="text-[hsl(45_20%_95%)]/80 text-lg leading-relaxed mb-8">{conclusion}</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-xl px-10 py-5 rounded-2xl hover:bg-[#1ebe5d] transition-all hover:scale-105 shadow-xl"
          >
            <MessageCircle className="h-7 w-7" />
            Falar com Advogado Agora
          </a>
          <p className="text-sm text-[hsl(45_20%_95%)]/60 mt-4">Resposta em até 1 hora · Primeira consulta gratuita</p>
        </div>
      </section>

      {/* Nearby cities — Cidades Atendidas na Região */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-xl font-bold text-foreground mb-2 text-center">
            Cidades Atendidas na Região
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Advogado de {service.name} para {cityName} e cidades vizinhas da região {cityRegion}.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {nearbyCities.map((c) => (
              <Link
                key={c.slug}
                to={`/${getServiceCitySlug(service.slug, c.slug)}`}
                className="px-3 py-1.5 text-sm bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-[hsl(45_60%_55%)] transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(220_50%_8%)] text-[hsl(45_20%_95%)]/60 py-8 px-4 text-center text-sm">
        <p className="mb-2">© {new Date().getFullYear()} Fernandez & Fernandes Advocacia & Consultoria · OAB/PR</p>
        <Link to="/" className="text-[hsl(45_60%_55%)] hover:underline">Acessar site completo</Link>
      </footer>
    </div>
  );
};

export default ServiceLocalPage;
