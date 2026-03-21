import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { usePageSEO } from "@/hooks/usePageSEO";
import { buildBreadcrumbSchema, buildArticleSchema, buildFaqSchema, extractFaqsFromHtml } from "@/lib/seoSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2, Tag, MessageCircle, Calculator } from "lucide-react";
import DOMPurify from "dompurify";
import { z } from "zod";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { useToast } from "@/hooks/use-toast";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  whatsapp: z.string().trim().min(10, "Telefone inválido").max(20, "Telefone muito longo"),
});

interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  updated_at?: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
  views: number;
  blog_categories: { name: string; slug: string } | null;
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function estimateReadingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(" ").length / 200));
}

function renderContent(content: string) {
  // Simple markdown-like rendering for stored content
  return content
    .split("\n\n")
    .map((para, i) => {
      if (para.startsWith("## ")) return `<h2 class="font-serif text-2xl font-bold text-[hsl(var(--foreground))] mt-10 mb-4">${para.slice(3)}</h2>`;
      if (para.startsWith("### ")) return `<h3 class="font-serif text-xl font-bold text-[hsl(var(--foreground))] mt-8 mb-3">${para.slice(4)}</h3>`;
      if (para.startsWith("# ")) return `<h1 class="font-serif text-3xl font-bold text-[hsl(var(--foreground))] mt-10 mb-4">${para.slice(2)}</h1>`;
      if (para.startsWith("- ") || para.startsWith("* ")) {
        const items = para.split("\n").filter(Boolean).map(l => `<li class="mb-1">${l.slice(2)}</li>`).join("");
        return `<ul class="list-disc list-inside space-y-1 my-4 text-[hsl(var(--muted-foreground))]">${items}</ul>`;
      }
      if (para.startsWith("> ")) return `<blockquote class="border-l-4 border-[hsl(var(--accent))] pl-4 italic text-[hsl(var(--muted-foreground))] my-6">${para.slice(2)}</blockquote>`;
      return `<p class="text-[hsl(var(--foreground))]/80 leading-relaxed my-4">${para}</p>`;
    })
    .join("");
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Lead form
  const [leadName, setLeadName] = useState("");
  const [leadWpp, setLeadWpp] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  usePageSEO({
    title: post?.meta_title || (post ? `${post.title} | Fernandez & Fernandes` : "Carregando... | Fernandez & Fernandes"),
    description: post?.meta_description || post?.excerpt || "Artigo jurídico do escritório Fernandez & Fernandes.",
    ogImage: post?.cover_image_url || undefined,
  });

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  async function fetchPost() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, subtitle, content, excerpt, cover_image_url, published_at, updated_at, meta_title, meta_description, tags, views, blog_categories(name, slug)")
      .eq("slug", slug!)
      .eq("status", "published")
      .maybeSingle();

    if (!data || error) {
      setNotFound(true);
    } else {
      setPost(data as Post);
      // Increment views
      await supabase.from("blog_posts").update({ views: data.views + 1 }).eq("id", data.id);
    }
    setLoading(false);
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadSubmitting(true);

    try {
      const validatedData = leadSchema.parse({
        name: leadName,
        email: leadEmail,
        whatsapp: leadWpp,
      });

      await supabase.from("blog_leads").insert({
        name: validatedData.name,
        whatsapp: validatedData.whatsapp,
        email: validatedData.email,
        post_id: post?.id || null,
        interest_tag: post?.blog_categories?.name || "Blog",
      });

      const wppMsg = encodeURIComponent(
        `Olá! Me chamo ${validatedData.name}, li o artigo "${post?.title}" e gostaria de uma análise gratuita do meu caso.`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${wppMsg}`, "_blank");
      setLeadSent(true);
      toast({ title: "Solicitação enviada!", description: "Você será redirecionado para o WhatsApp." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Erro de validação", description: error.errors[0].message, variant: "destructive" });
      }
    } finally {
      setLeadSubmitting(false);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copiado!", description: "Compartilhe com quem precisar." });
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-pulse space-y-4 max-w-3xl w-full mx-auto px-4">
            <div className="h-8 bg-[hsl(var(--muted))] rounded w-3/4" />
            <div className="h-64 bg-[hsl(var(--muted))] rounded-2xl" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-[hsl(var(--muted))] rounded" />)}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[hsl(var(--foreground))] mb-4">Artigo não encontrado</h1>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">Este artigo não existe ou foi removido.</p>
            <Button onClick={() => navigate("/blog")}>Ver todos os artigos</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) return null;

  const readingTime = estimateReadingTime(post.content);
  const isFamilyLaw = post.blog_categories?.slug === "direito-da-familia" || post.blog_categories?.slug === "direito-de-familia";
  const isLegalUpdate = post.blog_categories?.slug === "atualizacoes-da-lei";

  // Extract FAQs from HTML for structured data
  const faqs = extractFaqsFromHtml(post.content);
  const faqSchema = buildFaqSchema(faqs);
  const articleSchema = buildArticleSchema({
    title: post.title,
    excerpt: post.meta_description || post.excerpt,
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
    slug: post.slug,
    coverImageUrl: post.cover_image_url,
    tags: post.tags,
    categoryName: post.blog_categories?.name,
    articleType: isLegalUpdate ? "LegalArticle" : "Article",
  });

  return (
    <>
      <Header />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema([
            { name: "Blog Jurídico", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ])),
        }}
      />

      {/* Article / LegalArticle Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* FAQPage Schema — only when FAQs are found in content */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="min-h-screen bg-[hsl(var(--background))] pt-20">
        {/* Cover */}
        {post.cover_image_url && (
          <div className="w-full h-72 md:h-96 overflow-hidden">
            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-8">
            <Link to="/blog" className="flex items-center gap-1 hover:text-[hsl(var(--foreground))] transition-colors">
              <ArrowLeft className="h-4 w-4" /> Blog
            </Link>
            {post.blog_categories && (
              <>
                <span>/</span>
                <Link to={`/blog?categoria=${post.blog_categories.slug}`} className="hover:text-[hsl(var(--foreground))] transition-colors">
                  {post.blog_categories.name}
                </Link>
              </>
            )}
          </nav>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Article */}
            <article>
              {post.blog_categories && (
                <Badge variant="secondary" className="mb-4">{post.blog_categories.name}</Badge>
              )}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-4 leading-tight">
                {post.title}
              </h1>
              {post.subtitle && (
                <p className="text-xl text-[hsl(var(--muted-foreground))] mb-6 font-light">{post.subtitle}</p>
              )}

              <div className="flex items-center gap-6 text-sm text-[hsl(var(--muted-foreground))] pb-6 border-b border-[hsl(var(--border))] mb-8">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.published_at)}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{readingTime} min de leitura</span>
                <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-[hsl(var(--foreground))] transition-colors ml-auto">
                  <Share2 className="h-4 w-4" /> Compartilhar
                </button>
              </div>

              {/* CTA Mid-article */}
              <div className="my-8 bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
                <Calculator className="h-8 w-8 text-[hsl(var(--accent))] shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-[hsl(var(--foreground))]">Descubra seus direitos com nossa ferramenta gratuita</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Simuladores jurídicos sem cadastro obrigatório</p>
                </div>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0" onClick={() => navigate("/calculadora#simulador")}>
                  Calcular agora
                </Button>
              </div>

              {/* Content */}
              <div
                className="prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderContent(post.content)) }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-[hsl(var(--border))]">
                  <Tag className="h-4 w-4 text-[hsl(var(--muted-foreground))] mt-0.5" />
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Final CTA */}
              <div className="mt-12 bg-hero rounded-2xl p-8 text-center text-[hsl(45_20%_95%)]">
                <MessageCircle className="h-10 w-10 text-[hsl(var(--accent))] mx-auto mb-3" />
                <h2 className="font-serif text-2xl font-bold mb-2">Fale com um advogado especialista</h2>
                <p className="text-[hsl(45_20%_95%)]/70 mb-6 text-sm">
                  Análise gratuita do seu caso. Sem compromisso.
                  <br />
                  <span className="text-[hsl(var(--accent))] font-medium">⚠ Prazo para reclamar direitos trabalhistas: até 2 anos após sair da empresa.</span>
                </p>
                <Button
                  className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
                  onClick={() => navigate("/#contact")}
                >
                  Quero uma análise gratuita
                </Button>
              </div>
            </article>

            {/* Sidebar - Lead Form */}
            <aside className="space-y-6">
              <div className="sticky top-28">
                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 shadow-card">
                  {leadSent ? (
                    <div className="text-center py-4">
                      <div className="text-4xl mb-3">✅</div>
                      <h3 className="font-serif text-lg font-bold text-[hsl(var(--foreground))] mb-2">Solicitação enviada!</h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Um especialista entrará em contato em breve via WhatsApp.</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-serif text-lg font-bold text-[hsl(var(--foreground))] mb-1">
                        Análise gratuita do seu caso
                      </h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">
                        Receba orientação personalizada de um advogado especialista.
                      </p>
                      <form onSubmit={handleLeadSubmit} className="space-y-3">
                        <Input
                          placeholder="Seu nome completo"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          required
                        />
                        <Input
                          placeholder="WhatsApp (com DDD)"
                          value={leadWpp}
                          onChange={(e) => setLeadWpp(e.target.value)}
                          required
                          type="tel"
                        />
                        <Input
                          placeholder="Seu e-mail"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          required
                          type="email"
                        />
                        <Button
                          type="submit"
                          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
                          disabled={leadSubmitting}
                        >
                          {leadSubmitting ? "Enviando..." : "Quero análise gratuita"}
                        </Button>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">
                          Seus dados estão protegidos. Sem spam.
                        </p>
                      </form>
                    </>
                  )}
                </div>

                {/* Urgency notice - only for non-family law */}
                {!isFamilyLaw && (
                  <div className="mt-4 bg-[hsl(0_84%_60%)]/10 border border-[hsl(0_84%_60%)]/30 rounded-xl p-4 text-sm">
                    <p className="font-semibold text-[hsl(0_84%_60%)] mb-1">⚠ Atenção ao prazo!</p>
                    <p className="text-[hsl(var(--muted-foreground))]">
                      Você tem até 2 anos após sair da empresa para reclamar direitos trabalhistas.
                    </p>
                  </div>
                )}

                {/* Family Law - Simulator & Info */}
                {isFamilyLaw && (
                  <>
                    <div className="mt-4 bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 rounded-xl p-5">
                      <Calculator className="h-6 w-6 text-[hsl(var(--accent))] mb-2" />
                      <h4 className="font-serif font-bold text-[hsl(var(--foreground))] mb-1">Simulador de Pensão Alimentícia</h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                        Descubra uma estimativa do valor da pensão com base na sua renda e número de dependentes.
                      </p>
                      <Button asChild size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link to="/simulador-pensao#simulador">Simular agora</Link>
                      </Button>
                    </div>

                    <div className="mt-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
                      <h4 className="font-serif font-bold text-[hsl(var(--foreground))] mb-3">Sobre Direito da Família</h4>
                      <ul className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
                        <li className="flex gap-2">
                          <span className="text-[hsl(var(--accent))] font-bold">•</span>
                          <span><strong className="text-[hsl(var(--foreground))]">Pensão alimentícia:</strong> Valor definido com base na necessidade do alimentando e possibilidade do alimentante.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-[hsl(var(--accent))] font-bold">•</span>
                          <span><strong className="text-[hsl(var(--foreground))]">Guarda compartilhada:</strong> Modelo preferencial no Brasil desde 2014, priorizando o convívio equilibrado.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-[hsl(var(--accent))] font-bold">•</span>
                          <span><strong className="text-[hsl(var(--foreground))]">Divórcio:</strong> Pode ser consensual ou litigioso, com partilha de bens conforme regime adotado.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-[hsl(var(--accent))] font-bold">•</span>
                          <span><strong className="text-[hsl(var(--foreground))]">Revisão de pensão:</strong> É possível pedir revisão quando há mudança na situação financeira.</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                {/* Simulators */}
                <div className="mt-4 bg-[hsl(var(--muted))] rounded-xl p-4">
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">Ferramentas gratuitas</p>
                  <div className="space-y-2">
                    {[
                      { label: "Calculadora de Rescisão", href: "/calculadora#simulador" },
                      { label: "Simulador de Horas Extras", href: "/simulador-horas-extras#simulador" },
                      { label: "Simulador de Aposentadoria", href: "/simulador-aposentadoria#simulador" },
                      { label: "Simulador de Pensão Alimentícia", href: "/simulador-pensao#simulador" },
                    ].map((t) => (
                      <Link key={t.href} to={t.href} className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                        <Calculator className="h-3.5 w-3.5" /> {t.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
