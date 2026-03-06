import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Scale, MessageCircle, ArrowRight, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageSEO } from "@/hooks/usePageSEO";
import { DOCUMENT_TYPES } from "@/data/documentTypes";

const WHATSAPP = "https://wa.me/5541995808145?text=" + encodeURIComponent("Olá! Acessei o Gerador de Documentos e gostaria de falar com um advogado.");

const GeradorDocumentos = () => {
  usePageSEO({
    title: "Gerador de Documentos Jurídicos Grátis | Fernandez & Fernandes",
    description:
      "Gere documentos jurídicos em PDF gratuitamente: notificações extrajudiciais, acordos de divórcio, contratos de arrendamento e muito mais. Rápido, simples e online.",
    canonical: "https://fernandezefernandes.adv.br/gerador-documentos",
    robots: "index, follow",
  });

  const categories = Array.from(new Set(DOCUMENT_TYPES.map((d) => d.category)));

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
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Falar com Advogado
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-[hsl(45_60%_55%)]/20 text-[hsl(45_60%_55%)] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <FileText className="h-4 w-4" />
            Ferramenta 100% Gratuita
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Gere Documentos Jurídicos{" "}
            <span className="text-[hsl(45_60%_55%)]">em PDF</span>{" "}
            Gratuitamente
          </h1>
          <p className="text-lg text-[hsl(45_20%_95%)]/80 mb-8 max-w-2xl mx-auto">
            Notificações extrajudiciais, acordos de divórcio, contratos de arrendamento e muito mais.
            Preencha o formulário e baixe seu documento em segundos.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-[hsl(45_20%_95%)]/70">
            {[
              "✅ Gratuito e sem cadastro",
              "📄 PDF instantâneo",
              "⚖️ Modelos juridicamente embasados",
              "🔒 Seus dados ficam protegidos",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Documents grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {categories.map((cat) => (
            <div key={cat} className="mb-12">
              <h2 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[hsl(45_60%_55%)] rounded-full" />
                {cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DOCUMENT_TYPES.filter((d) => d.category === cat).map((doc) => (
                  <Link
                    key={doc.slug}
                    to={`/gerador-${doc.slug}`}
                    className="group flex flex-col p-5 rounded-2xl border border-border bg-card hover:border-[hsl(45_60%_55%)] hover:shadow-lg transition-all"
                  >
                    <span className="text-3xl mb-3" aria-hidden="true">{doc.icon}</span>
                    <h3 className="font-semibold text-foreground text-sm mb-2 leading-snug group-hover:text-[hsl(220_50%_12%)]">
                      {doc.shortLabel}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">{doc.description.slice(0, 100)}…</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[hsl(45_60%_55%)] group-hover:gap-2 transition-all">
                      Gerar documento <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[hsl(220_30%_97%)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: <FileText className="h-7 w-7" />, title: "Escolha o documento", desc: "Selecione o tipo de documento que você precisa na lista acima." },
              { step: "2", icon: <CheckCircle className="h-7 w-7" />, title: "Preencha o formulário", desc: "Informe os dados das partes e detalhes do caso. Formulário rápido e simples." },
              { step: "3", icon: <Download className="h-7 w-7" />, title: "Baixe o PDF", desc: "O documento é gerado instantaneamente e pronto para download." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(220_50%_12%)] text-[hsl(45_60%_55%)] mb-4 mx-auto">
                  {icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)]">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">Precisa de mais do que um modelo?</h2>
          <p className="text-[hsl(45_20%_95%)]/80 mb-8">
            Nossos advogados revisam, personalizam e protocolam os documentos por você.
            Consulta inicial gratuita.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-[#1ebe5d] transition-all hover:scale-105 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
            Falar com Advogado Agora
          </a>
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

export default GeradorDocumentos;
