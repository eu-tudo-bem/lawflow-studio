import { Link } from "react-router-dom";
import { FileText, ArrowRight, CheckCircle, MessageCircle, MapPin, Shield } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { DOCUMENT_READY_SERVICES, PILLAR_CITY_SLUGS } from "@/data/documentReadyServices";
import { getServiceCitySlug, getWhatsAppLink } from "@/data/localSEOCities";
import { useEffect } from "react";

const PILLAR_CITIES = [
  ...PILLAR_CITY_SLUGS,
  { slug: "sao-jose-dos-pinhais", name: "São José dos Pinhais" },
  { slug: "colombo", name: "Colombo" },
  { slug: "guarapuava", name: "Guarapuava" },
  { slug: "pato-branco", name: "Pato Branco" },
];

// Cidades exibidas como atalhos rápidos dentro de cada card de serviço
const QUICK_CITIES = PILLAR_CITY_SLUGS;

const CasosDocumentosParana = () => {
  const canonical = "https://fernandezefernandes.adv.br/casos-com-documentos-prontos-parana";
  usePageSEO({
    title: "Casos Jurídicos com Documentos Prontos para Análise no Paraná | Fernandez & Fernandes",
    description:
      "Conheça situações jurídicas (consumidor, bancário, previdenciário e trabalhista) em que extratos, prints, contratos e protocolos permitem uma análise inicial pelo escritório, em todo o Paraná.",
    canonical,
    robots: "index, follow",
  });

  const whatsappLink = getWhatsAppLink("Paraná");

  // JSON-LD ItemList (hub) — facilita o entendimento da relação entre o pilar e as páginas filhas
  useEffect(() => {
    const id = "doc-ready-hub-schema";
    document.getElementById(id)?.remove();
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Casos com documentos prontos para análise no Paraná",
      url: canonical,
      itemListElement: DOCUMENT_READY_SERVICES.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.name,
        url: `https://fernandezefernandes.adv.br/${getServiceCitySlug(s.slug, "curitiba")}`,
      })),
    };
    const tag = document.createElement("script");
    tag.id = id;
    tag.type = "application/ld+json";
    tag.text = JSON.stringify(schema);
    document.head.appendChild(tag);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 text-[hsl(45_60%_55%)] text-sm font-semibold mb-4">
            <FileText className="h-4 w-4" />
            Análise documental inicial
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-5 leading-tight">
            Casos Jurídicos com Documentos Prontos para Análise no Paraná
          </h1>
          <p className="text-[hsl(45_20%_95%)]/80 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Veja situações em que extratos, prints, contratos, comprovantes e protocolos
            podem ajudar na análise inicial do caso. Atendimento online para clientes em
            todo o Paraná.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1ebe5d] transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-14 bg-background border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Como funciona a análise documental
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "1. Reúna os documentos", text: "Separe extratos, prints, contratos, comprovantes e protocolos relacionados ao seu caso." },
              { icon: MessageCircle, title: "2. Envie pelo WhatsApp", text: "Encaminhe o material pelo WhatsApp para a equipe do escritório iniciar a leitura." },
              { icon: Shield, title: "3. Receba orientação", text: "A equipe avalia a documentação e apresenta uma orientação jurídica personalizada." },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 text-center">
                <s.icon className="h-8 w-8 text-[hsl(45_60%_55%)] mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 bg-[hsl(220_30%_97%)]">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">
            10 frentes com documentos prontos para análise
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Áreas de consumidor, bancário, previdenciário e trabalhista em que a documentação
            do cliente é o ponto de partida do atendimento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOCUMENT_READY_SERVICES.map((s) => {
              const primaryHref = `/${getServiceCitySlug(s.slug, "curitiba")}`;
              return (
                <div
                  key={s.slug}
                  className="group flex flex-col gap-3 p-5 rounded-2xl bg-card border border-border hover:border-[hsl(45_60%_55%)] hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl" aria-hidden="true">{s.icon}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[hsl(45_60%_55%)] bg-[hsl(45_60%_55%)]/10 px-2 py-1 rounded-full">
                      {s.area}
                    </span>
                  </div>
                  <Link
                    to={primaryHref}
                    title={`${s.name} em Curitiba`}
                    className="block"
                  >
                    <h3 className="font-serif text-lg font-bold text-foreground leading-snug group-hover:text-[hsl(45_60%_55%)] transition-colors">
                      {s.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.shortDescription}</p>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-foreground mb-2">Documentos comuns:</p>
                    <ul className="space-y-1">
                      {s.documents.slice(0, 4).map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-[hsl(45_60%_55%)] shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Multi-cidade: distribui interlinking entre cidades-polo do Paraná */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-foreground mb-2">Ver em:</p>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
                      {QUICK_CITIES.map((c, i) => (
                        <span key={c.slug} className="flex items-center gap-2">
                          <Link
                            to={`/${getServiceCitySlug(s.slug, c.slug)}`}
                            title={`${s.shortName} em ${c.name}`}
                            className="text-[hsl(45_60%_55%)] hover:underline font-medium"
                          >
                            {c.name}
                          </Link>
                          {i < QUICK_CITIES.length - 1 && (
                            <span className="text-muted-foreground/50" aria-hidden="true">|</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={primaryHref}
                    className="flex items-center gap-1 text-xs font-semibold text-[hsl(45_60%_55%)] mt-auto pt-2 group-hover:underline"
                  >
                    Solicitar análise inicial <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Cidades-polo */}
      <section className="py-14 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">
            Atendimento nas principais cidades do Paraná
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Atendimento 100% online para moradores das cidades-polo e de toda a região.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {PILLAR_CITIES.map((c) => (
              <Link
                key={c.slug}
                to={`/escritorio-advocacia-${c.slug}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card hover:border-[hsl(45_60%_55%)] hover:shadow-md transition-all text-sm font-medium text-foreground"
                title={`Advocacia em ${c.name}`}
              >
                <MapPin className="h-4 w-4 text-[hsl(45_60%_55%)] shrink-0" />
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)]">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Envie seus documentos para uma análise inicial
          </h2>
          <p className="text-[hsl(45_20%_95%)]/80 text-lg leading-relaxed mb-8">
            Separe prints, extratos, contratos, comprovantes e protocolos. A análise jurídica
            depende da conferência dos documentos e das informações do caso.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-xl px-10 py-5 rounded-2xl hover:bg-[#1ebe5d] transition-all hover:scale-105 shadow-xl"
          >
            <MessageCircle className="h-7 w-7" />
            Falar pelo WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CasosDocumentosParana;
