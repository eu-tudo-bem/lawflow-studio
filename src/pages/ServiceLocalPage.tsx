import { Link, Navigate } from "react-router-dom";
import { MessageCircle, Scale, CheckCircle, MapPin, ArrowRight, Home, ChevronRight, HelpCircle } from "lucide-react";
import { usePageSEO } from "@/hooks/usePageSEO";
import {
  getCityBySlug,
  getServiceBySlug,
  serviceTextVariations,
  getWhatsAppLink,
  PARANA_CITIES,
  LEGAL_SERVICES,
  getServiceCitySlug,
} from "@/data/localSEOCities";
import { useEffect } from "react";

interface Props {
  citySlug: string;
  serviceSlug: string;
}

const ServiceLocalPage = ({ citySlug, serviceSlug }: Props) => {
  const city = getCityBySlug(citySlug);
  const service = getServiceBySlug(serviceSlug);

  const v = city?.variationIndex ?? 0;
  const cityName = city?.name ?? "";
  const cityRegion = city?.region ?? "";
  const variations = service ? serviceTextVariations[serviceSlug] : null;

  const intro = variations ? variations.intro[v % variations.intro.length](cityName) : "";
  const situations = variations ? variations.situations[v % variations.situations.length](cityName) : [];
  const howItWorks = variations ? variations.howItWorks[v % variations.howItWorks.length](cityName) : "";
  const whenToLook = variations ? variations.whenToLook[v % variations.whenToLook.length](cityName) : "";
  const conclusion = variations ? variations.conclusion[v % variations.conclusion.length](cityName) : "";

  const whatsappLink = getWhatsAppLink(cityName, service?.name);
  const pageTitle = city && service ? `Advogado de ${service.name} em ${cityName} | Fernandez & Fernandes` : "";
  const metaDescription = city && service
    ? `Precisa de advogado de ${service.name.toLowerCase()} em ${cityName}? Atendimento especializado, rápido e online. Consulta gratuita. Fale agora via WhatsApp.`
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

  useEffect(() => {
    const schemaId = "service-local-schema";
    const faqSchemaId = "service-local-faq-schema";
    [schemaId, faqSchemaId].forEach((id) => document.getElementById(id)?.remove());

    if (!city || !service) return;

    const legalServiceSchema = {
      "@context": "https://schema.org",
      "@type": ["LegalService", "LocalBusiness"],
      name: `Advogado de ${service.name} em ${cityName} — Fernandez & Fernandes`,
      description: metaDescription,
      url: canonical,
      telephone: "+554130000000",
      priceRange: "$$",
      address: { "@type": "PostalAddress", addressLocality: cityName, addressRegion: "PR", addressCountry: "BR" },
      areaServed: { "@type": "City", name: cityName, containedInPlace: { "@type": "State", name: "Paraná" } },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${service.name} em ${cityName}`,
        itemListElement: [{ "@type": "Offer", itemOffered: { "@type": "LegalService", name: service.name } }],
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://fernandezefernandes.adv.br" },
          { "@type": "ListItem", position: 2, name: service.name, item: `https://fernandezefernandes.adv.br/${service.slug}` },
          { "@type": "ListItem", position: 3, name: `${service.name} em ${cityName}`, item: canonical },
        ],
      },
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

    [{ id: schemaId, data: legalServiceSchema }, { id: faqSchemaId, data: faqSchema }].forEach(({ id, data }) => {
      const script = document.createElement("script");
      script.id = id; script.type = "application/ld+json";
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => { [schemaId, faqSchemaId].forEach((id) => document.getElementById(id)?.remove()); };
  }, [citySlug, serviceSlug]);

  if (!city || !service) return <Navigate to="/404" replace />;

  const nearbyCities = city.nearbySlug
    ? city.nearbySlug.map((s) => PARANA_CITIES.find((c) => c.slug === s)).filter(Boolean).slice(0, 5) as typeof PARANA_CITIES
    : PARANA_CITIES.filter((c) => c.slug !== citySlug).slice(0, 5);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
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
          <ol className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Home className="h-3 w-3" /> Início
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link to={`/${service.slug}`} className="hover:text-foreground transition-colors">
                {service.name}
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="text-foreground font-medium">{cityName}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 text-[hsl(45_60%_55%)] text-sm font-medium mb-4">
            <MapPin className="h-4 w-4" />
            {cityRegion} · Estado do Paraná
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Advogado de{" "}
            <span className="text-[hsl(45_60%_55%)]">{service.name}</span>{" "}
            em {cityName}
          </h1>
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
              Falar com Advogado em {cityName}
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
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
            Situações que Resolvemos em {cityName}
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Atendemos clientes de {cityName} nos seguintes casos relacionados a {service.name.toLowerCase()}:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {situations.map((situation) => (
              <div key={situation} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                <CheckCircle className="h-5 w-5 text-[hsl(45_60%_55%)] mt-0.5 flex-shrink-0" />
                <span className="text-foreground font-medium">{situation}</span>
              </div>
            ))}
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

      {/* Other services for this city */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-xl font-bold text-foreground mb-6 text-center">
            Outros Serviços Jurídicos em {cityName}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LEGAL_SERVICES.filter((s) => s.slug !== serviceSlug).map((s) => (
              <Link
                key={s.slug}
                to={`/${getServiceCitySlug(s.slug, citySlug)}`}
                className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-[hsl(45_60%_55%)] hover:shadow-md transition-all"
              >
                <span className="text-xl" aria-hidden="true">{s.icon}</span>
                <span className="text-sm font-medium text-foreground">{s.shortName}</span>
              </Link>
            ))}
            <Link
              to={`/escritorio-advocacia-${citySlug}`}
              className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-[hsl(45_60%_55%)] hover:shadow-md transition-all"
            >
              <Scale className="h-5 w-5 text-[hsl(45_60%_55%)]" />
              <span className="text-sm font-medium text-foreground">Todos os Serviços</span>
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

      {/* Nearby cities */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4 text-center">
            Advogado de {service.name} em Outras Cidades do Paraná
          </h2>
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
