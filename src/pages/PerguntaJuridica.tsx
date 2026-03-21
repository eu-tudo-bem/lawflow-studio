import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import {
  MessageCircle, Scale, Phone, ChevronRight, ArrowLeft,
  BookOpen, Gavel, HelpCircle, Users, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";

interface LegalQuestion {
  id: string;
  question: string;
  slug: string;
  legal_area: string;
  page_title: string | null;
  meta_description: string | null;
  content: string | null;
  schema_faq: any;
  related_slugs: string[] | null;
  city_slug: string | null;
  cluster_topic: string | null;
  tags: string[] | null;
  views: number;
  published_at: string | null;
}

interface RelatedQuestion {
  id: string;
  question: string;
  slug: string;
  legal_area: string;
}

const AREA_LABELS: Record<string, string> = {
  transito: "Direito de Trânsito",
  familia: "Direito de Família",
  trabalho: "Direito do Trabalho",
  consumidor: "Direito do Consumidor",
  imobiliario: "Direito Imobiliário",
  criminal: "Direito Penal",
  civil: "Direito Civil",
  agrario: "Direito Agrário",
};

const AREA_TOOL_LINKS: Record<string, { label: string; href: string; cta: string }[]> = {
  familia: [
    { label: "Simulador de Pensão Alimentícia", href: "/simulador-pensao", cta: "Calcule o valor da pensão agora" },
    { label: "Divórcio Consensual", href: "/divorcio-consensual", cta: "Saiba como fazer seu divórcio" },
  ],
  trabalho: [
    { label: "Simulador de Horas Extras", href: "/simulador-horas-extras", cta: "Calcule suas horas extras" },
  ],
  imobiliario: [
    { label: "Notificação de Cobrança de Aluguel", href: "/gerador-notificacao-cobranca-aluguel", cta: "Gere uma notificação de cobrança" },
  ],
};

const WHATSAPP = "5541995808145";

const PerguntaJuridica = () => {
  const { slug } = useParams<{ slug: string }>();
  const [question, setQuestion] = useState<LegalQuestion | null>(null);
  const [related, setRelated] = useState<RelatedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  usePageSEO({
    title: question?.page_title || question?.question || "Dúvida Jurídica",
    description: question?.meta_description || "Resposta jurídica clara e objetiva.",
    canonical: `https://fernandezefernandes.adv.br/pergunta/${slug}`,
  });

  useEffect(() => {
    if (!slug) return;
    loadQuestion();
  }, [slug]);

  const loadQuestion = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("legal_questions" as any)
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const q = data as unknown as LegalQuestion;
    setQuestion(q);

    // Increment views
    await supabase
      .from("legal_questions" as any)
      .update({ views: (q.views || 0) + 1 })
      .eq("id", q.id);

    // Load related questions from same area
    const { data: relData } = await supabase
      .from("legal_questions" as any)
      .select("id, question, slug, legal_area")
      .eq("status", "published")
      .eq("legal_area", q.legal_area)
      .neq("slug", slug)
      .limit(6);

    setRelated((relData as unknown as RelatedQuestion[]) || []);
    setLoading(false);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Olá! Tenho uma dúvida sobre: "${question?.question}". Gostaria de falar com um advogado.`
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
  };

  // Inject JSON-LD
  useEffect(() => {
    if (!question?.schema_faq?.length) return;

    const existing = document.getElementById("schema-faq-ld");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "schema-faq-ld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (question.schema_faq as any[]).map((f: any) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
    document.head.appendChild(script);

    return () => { document.getElementById("schema-faq-ld")?.remove(); };
  }, [question]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-serif text-foreground mb-2">Página não encontrada</h1>
          <p className="text-muted-foreground mb-6">Esta pergunta ainda não foi respondida ou foi removida.</p>
          <Button asChild>
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const areaLabel = AREA_LABELS[question.legal_area] || question.legal_area;
  const tools = AREA_TOOL_LINKS[question.legal_area] || [];

  // Split HTML content and inject mid-content banner after 2nd paragraph
  const injectMidBanner = (html: string): { before: string; after: string } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const paragraphs = Array.from(doc.body.querySelectorAll("p, h2, h3, ul, ol"));
    const splitAt = Math.min(2, Math.max(1, Math.floor(paragraphs.length / 2)));
    const cutNode = paragraphs[splitAt - 1];
    if (!cutNode) return { before: html, after: "" };

    const beforeNodes: string[] = [];
    const afterNodes: string[] = [];
    let passed = false;
    doc.body.childNodes.forEach((node) => {
      if (node === cutNode) { beforeNodes.push((node as Element).outerHTML || node.textContent || ""); passed = true; }
      else if (!passed) beforeNodes.push((node as Element).outerHTML || node.textContent || "");
      else afterNodes.push((node as Element).outerHTML || node.textContent || "");
    });
    return { before: beforeNodes.join(""), after: afterNodes.join("") };
  };

  const { before: contentBefore, after: contentAfter } = question.content
    ? injectMidBanner(question.content)
    : { before: "", after: "" };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-muted/40 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-accent">Início</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-accent">Dúvidas Jurídicas</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[200px]">{areaLabel}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Area badge */}
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">{areaLabel}</span>
              {question.city_slug && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {question.city_slug.replace(/-/g, " ")}
                  </span>
                </>
              )}
            </div>

            {/* Content */}
            {question.content ? (
              <article className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-accent">
                {/* First part */}
                <div dangerouslySetInnerHTML={{ __html: contentBefore }} />

                {/* Mid-content contact banner */}
                {contentAfter && (
                  <div className="not-prose my-6 flex items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 px-5 py-4">
                    <MessageCircle className="h-8 w-8 shrink-0 text-accent" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        Ficou com dúvida? Fale com um advogado agora.
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Consulta inicial gratuita · Resposta em minutos
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleWhatsApp}
                      className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5"
                    >
                      WhatsApp
                    </Button>
                  </div>
                )}

                {/* Rest of content */}
                {contentAfter && <div dangerouslySetInnerHTML={{ __html: contentAfter }} />}
              </article>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Conteúdo em preparação. Entre em contato para tirar sua dúvida.</p>
              </div>
            )}

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Temas relacionados:</p>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-10 p-6 bg-accent/5 border border-accent/20 rounded-2xl">
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                Precisa de ajuda com esse problema?
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Nossa equipe está pronta para analisar seu caso. Consulta inicial gratuita.
              </p>
              <div className="flex flex-wrap gap-3">
                 <Button
                  onClick={handleWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Fale com um Advogado Agora
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/#contato">
                    <Phone className="h-4 w-4 mr-2" />
                    Agendar Consulta
                  </Link>
                </Button>
              </div>
            </div>

            {/* Related questions */}
            {related.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-accent" />
                  Perguntas Relacionadas
                </h2>
                <div className="space-y-2">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      to={`/pergunta/${r.slug}`}
                      className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors group"
                    >
                      <ChevronRight className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-sm text-foreground group-hover:text-accent">
                        {r.question}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick CTA */}
            <div className="bg-foreground text-background rounded-2xl p-6 sticky top-6">
              <Gavel className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-serif font-bold text-lg mb-2">Consulta Gratuita</h3>
              <p className="text-sm opacity-80 mb-4">
                Fale com um advogado especializado em {areaLabel.toLowerCase()} agora mesmo.
              </p>
              <Button
                onClick={handleWhatsApp}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Falar no WhatsApp
              </Button>
            </div>

            {/* Tools */}
            {tools.length > 0 && (
              <div className="border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-accent" />
                  Ferramentas Gratuitas
                </h3>
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      to={tool.href}
                      className="flex items-center gap-2 text-sm text-accent hover:underline"
                    >
                      <ChevronRight className="h-3 w-3" />
                      {tool.cta}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Cluster topic */}
            {question.cluster_topic && (
              <div className="border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-accent" />
                  Mais sobre: {question.cluster_topic}
                </h3>
                <div className="space-y-2">
                  {related.filter(r => !r.slug.includes(slug || "")).slice(0, 4).map((r) => (
                    <Link
                      key={r.id}
                      to={`/pergunta/${r.slug}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{r.question}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back */}
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PerguntaJuridica;
