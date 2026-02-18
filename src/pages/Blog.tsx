import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, ArrowRight, BookOpen, Tag } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  views: number;
  featured: boolean;
  tags: string[] | null;
  blog_categories: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const READING_TIME_WPM = 200;

function estimateReadingTime(excerpt: string | null): number {
  if (!excerpt) return 3;
  return Math.max(1, Math.ceil(excerpt.split(" ").length / READING_TIME_WPM));
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("categoria") || "";
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#conteudo") {
      setTimeout(() => {
        document.getElementById("conteudo")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  }, [location.hash]);

  useEffect(() => {
    document.title = "Guia Jurídico Atualizado 2026 | Fernandez & Fernandes";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Artigos jurídicos atualizados sobre direito trabalhista, previdenciário, empresarial e família. Linguagem clara, exemplos práticos e orientação especializada.");
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [activeCategory]);

  async function fetchCategories() {
    const { data } = await supabase.from("blog_categories").select("id, name, slug").order("name");
    if (data) setCategories(data);
  }

  async function fetchPosts() {
    setLoading(true);
    let query = supabase
      .from("blog_posts")
      .select("id, title, slug, subtitle, excerpt, cover_image_url, published_at, views, featured, tags, blog_categories(name, slug)")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false });

    if (activeCategory) {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) query = query.eq("category_id", cat.id);
    }

    const { data } = await query;
    setPosts((data as Post[]) || []);
    setLoading(false);
  }

  const filteredPosts = posts.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const heroPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const otherPosts = filteredPosts.filter((p) => p.id !== heroPost?.id);

  return (
    <>
      <Header />
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Guia Jurídico Atualizado",
            description: "Central de conteúdo jurídico do escritório Fernandez & Fernandes",
            url: window.location.origin + "/blog",
          }),
        }}
      />

      <main className="min-h-screen bg-[hsl(var(--background))] pt-20">
        {/* Hero Header */}
        <section className="bg-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              Central de Conteúdo Jurídico
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[hsl(45_20%_95%)] mb-4">
              Guia Jurídico Atualizado 2026
            </h1>
            <p className="text-[hsl(45_20%_95%)]/70 text-lg max-w-2xl mx-auto mb-8">
              Conteúdo especializado em linguagem clara. Conheça seus direitos e tome decisões informadas.
            </p>
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar artigos, temas ou palavras-chave..."
                className="pl-11 h-12 bg-[hsl(0_0%_100%)] text-[hsl(var(--foreground))] border-0 rounded-xl shadow-elevated"
              />
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] sticky top-20 z-40 shadow-card">
          <div className="container mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            <Button
              variant={!activeCategory ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchParams({})}
              className={!activeCategory ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shrink-0" : "shrink-0"}
            >
              Todos
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchParams({ categoria: cat.slug })}
                className={`shrink-0 ${activeCategory === cat.slug ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : ""}`}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </section>

        <div id="conteudo" className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-[hsl(var(--muted))] rounded-2xl h-72" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen className="h-16 w-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-40" />
              <h2 className="font-serif text-2xl text-[hsl(var(--foreground))] mb-2">Nenhum artigo encontrado</h2>
              <p className="text-[hsl(var(--muted-foreground))]">Tente outro termo de busca ou categoria.</p>
            </div>
          ) : (
            <>
              {/* Hero Post */}
              {heroPost && (
                <Link to={`/blog/${heroPost.slug}`} className="group block mb-12">
                  <article className="relative overflow-hidden rounded-3xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-elevated">
                    {heroPost.cover_image_url && (
                      <div className="absolute inset-0">
                        <img src={heroPost.cover_image_url} alt={heroPost.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-25 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary))]/80 to-transparent" />
                      </div>
                    )}
                    <div className="relative p-8 md:p-12 max-w-3xl">
                      <div className="flex items-center gap-3 mb-4">
                        {heroPost.featured && (
                          <span className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Destaque
                          </span>
                        )}
                        {heroPost.blog_categories && (
                          <span className="text-[hsl(var(--primary-foreground))]/70 text-sm">{heroPost.blog_categories.name}</span>
                        )}
                      </div>
                      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 group-hover:text-[hsl(var(--accent))] transition-colors">
                        {heroPost.title}
                      </h2>
                      {heroPost.subtitle && <p className="text-[hsl(var(--primary-foreground))]/80 text-lg mb-4">{heroPost.subtitle}</p>}
                      {heroPost.excerpt && <p className="text-[hsl(var(--primary-foreground))]/60 mb-6 line-clamp-2">{heroPost.excerpt}</p>}
                      <div className="flex items-center gap-4 text-sm text-[hsl(var(--primary-foreground))]/60">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(heroPost.published_at)}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{estimateReadingTime(heroPost.excerpt)} min de leitura</span>
                      </div>
                      <div className="mt-6 inline-flex items-center gap-2 text-[hsl(var(--accent))] font-medium group-hover:gap-3 transition-all">
                        Ler artigo completo <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Other Posts Grid */}
              {otherPosts.length > 0 && (
                <>
                  <h2 className="font-serif text-2xl font-bold text-[hsl(var(--foreground))] mb-6">
                    {activeCategory ? "Artigos da categoria" : "Mais artigos"}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                        <article className="h-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col">
                          {post.cover_image_url ? (
                            <div className="aspect-video overflow-hidden bg-[hsl(var(--muted))]">
                              <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                          ) : (
                            <div className="aspect-video bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary))]/60 flex items-center justify-center">
                              <BookOpen className="h-12 w-12 text-[hsl(var(--primary-foreground))]/30" />
                            </div>
                          )}
                          <div className="p-6 flex flex-col flex-1">
                            {post.blog_categories && (
                              <Badge variant="secondary" className="w-fit mb-3 text-xs">{post.blog_categories.name}</Badge>
                            )}
                            <h3 className="font-serif text-xl font-bold text-[hsl(var(--foreground))] mb-2 line-clamp-2 group-hover:text-[hsl(var(--accent))] transition-colors flex-1">
                              {post.title}
                            </h3>
                            {post.excerpt && <p className="text-[hsl(var(--muted-foreground))] text-sm mb-4 line-clamp-3">{post.excerpt}</p>}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">
                                    <Tag className="h-3 w-3" />{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))] mt-auto pt-4 border-t border-[hsl(var(--border))]">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(post.published_at)}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{estimateReadingTime(post.excerpt)} min</span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* CTA Banner */}
          <div className="mt-16 bg-hero rounded-3xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-[hsl(45_20%_95%)] mb-3">
              Tem uma dúvida jurídica específica?
            </h2>
            <p className="text-[hsl(45_20%_95%)]/70 mb-6 max-w-xl mx-auto">
              Use nossas ferramentas gratuitas ou fale diretamente com um especialista.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
                onClick={() => navigate("/#contact")}
              >
                Falar com Advogado
              </Button>
              <Button
                variant="outline"
                className="border-[hsl(45_20%_95%)]/30 text-[hsl(45_20%_95%)] hover:bg-[hsl(220_50%_20%)]"
                onClick={() => navigate("/calculadora#simulador")}
              >
                Ver Ferramentas Gratuitas
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
