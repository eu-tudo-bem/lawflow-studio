import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Search, BookOpen, X, ChevronLeft,
  Save, Globe, FileText, Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  views: number;
  featured: boolean;
  blog_categories: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FormData {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category_id: string;
  status: "draft" | "published";
  featured: boolean;
  meta_title: string;
  meta_description: string;
  tags: string;
}

const defaultForm: FormData = {
  title: "", slug: "", subtitle: "", excerpt: "", content: "",
  cover_image_url: "", category_id: "", status: "draft",
  featured: false, meta_title: "", meta_description: "", tags: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");
}

export default function BlogAdmin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (user) { fetchPosts(); fetchCategories(); }
  }, [user]);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, status, published_at, views, featured, blog_categories(name)")
      .order("created_at", { ascending: false });
    setPosts((data as Post[]) || []);
    setLoading(false);
  }

  async function fetchCategories() {
    const { data } = await supabase.from("blog_categories").select("id, name, slug").order("name");
    setCategories(data || []);
  }

  function openNew() {
    setForm(defaultForm);
    setEditingId(null);
    setView("form");
    setActiveTab("content");
  }

  async function openEdit(id: string) {
    const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
    if (data) {
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        subtitle: data.subtitle || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        cover_image_url: data.cover_image_url || "",
        category_id: data.category_id || "",
        status: data.status as "draft" | "published",
        featured: data.featured || false,
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        tags: (data.tags || []).join(", "),
      });
      setEditingId(id);
      setView("form");
      setActiveTab("content");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Artigo excluído." });
    fetchPosts();
  }

  async function handleToggleStatus(post: Post) {
    const newStatus = post.status === "published" ? "draft" : "published";
    await supabase.from("blog_posts").update({
      status: newStatus,
      published_at: newStatus === "published" ? new Date().toISOString() : null,
    }).eq("id", post.id);
    toast({ title: newStatus === "published" ? "Artigo publicado!" : "Artigo salvo como rascunho." });
    fetchPosts();
  }

  async function handleSave(publish = false) {
    if (!form.title || !form.content) {
      toast({ title: "Preencha título e conteúdo.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      subtitle: form.subtitle || null,
      excerpt: form.excerpt || null,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      category_id: form.category_id || null,
      status: publish ? "published" : form.status,
      featured: form.featured,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      published_at: publish ? new Date().toISOString() : null,
      author_id: user!.id,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: publish ? "Artigo publicado!" : "Artigo salvo!" });
      setView("list");
      fetchPosts();
    }
  }

  const filtered = posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    published: "bg-green-100 text-green-700",
    draft: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]",
    scheduled: "bg-blue-100 text-blue-700",
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[hsl(var(--muted))]">
      {/* Top Bar */}
      <div className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {view === "form" && (
            <button onClick={() => setView("list")} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <BookOpen className="h-5 w-5 text-[hsl(var(--accent))]" />
          <span className="font-serif text-lg font-semibold">
            {view === "list" ? "Gerenciar Blog" : editingId ? "Editar Artigo" : "Novo Artigo"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" className="text-[hsl(var(--primary-foreground))]/70 hover:text-[hsl(var(--primary-foreground))] hover:bg-white/10" onClick={() => navigate("/blog")} >
            <Globe className="h-4 w-4 mr-2" /> Ver blog
          </Button>
          <Button size="sm" variant="ghost" className="text-[hsl(var(--primary-foreground))]/70 hover:text-[hsl(var(--primary-foreground))] hover:bg-white/10" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar artigos..." className="pl-9 bg-[hsl(var(--background))]" />
            </div>
            <Button onClick={openNew} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold shrink-0">
              <Plus className="h-4 w-4 mr-2" /> Novo Artigo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Publicados", count: posts.filter(p => p.status === "published").length, color: "text-green-600" },
              { label: "Rascunhos", count: posts.filter(p => p.status === "draft").length, color: "text-[hsl(var(--muted-foreground))]" },
              { label: "Total de views", count: posts.reduce((a, p) => a + p.views, 0), color: "text-[hsl(var(--accent))]" },
            ].map(s => (
              <div key={s.label} className="bg-[hsl(var(--background))] rounded-xl p-4 shadow-card text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Posts Table */}
          <div className="bg-[hsl(var(--background))] rounded-2xl shadow-card overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-14 bg-[hsl(var(--muted))] rounded animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-[hsl(var(--muted-foreground))]">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum artigo encontrado.</p>
                <Button onClick={openNew} variant="outline" className="mt-4">Criar primeiro artigo</Button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">Artigo</th>
                    <th className="text-left px-3 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide hidden md:table-cell">Categoria</th>
                    <th className="text-left px-3 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {filtered.map(post => (
                    <tr key={post.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {post.featured && <span className="text-[hsl(var(--accent))] text-xs font-bold">⭐</span>}
                          <div>
                            <p className="font-medium text-[hsl(var(--foreground))] text-sm line-clamp-1">{post.title}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {post.views} views
                              {post.published_at && (
                                <><span className="mx-1">·</span><Calendar className="h-3 w-3" />
                                {new Date(post.published_at).toLocaleDateString("pt-BR")}</>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 hidden md:table-cell">
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">{post.blog_categories?.name || "—"}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[post.status] || ""}`}>
                          {post.status === "published" ? "Publicado" : post.status === "draft" ? "Rascunho" : "Agendado"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleStatus(post)}
                            className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                            title={post.status === "published" ? "Despublicar" : "Publicar"}
                          >
                            {post.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button onClick={() => openEdit(post.id)} className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-[hsl(var(--muted-foreground))] hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {post.status === "published" && (
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        /* FORM */
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-[hsl(var(--muted))] p-1 rounded-xl w-fit">
            {(["content", "seo"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab === "content" ? "Conteúdo" : "SEO & Configurações"}
              </button>
            ))}
          </div>

          <div className="bg-[hsl(var(--background))] rounded-2xl shadow-card p-6 md:p-8">
            {activeTab === "content" ? (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">Título *</label>
                  <Input
                    value={form.title}
                    onChange={e => setForm(f => ({
                      ...f,
                      title: e.target.value,
                      slug: editingId ? f.slug : slugify(e.target.value),
                    }))}
                    placeholder="Título forte e otimizado para SEO"
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">Subtítulo</label>
                  <Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Complemento explicativo do título" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">Resumo (excerpt)</label>
                  <Textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Breve descrição exibida nas listagens" rows={3} />
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">
                    Conteúdo * <span className="font-normal text-[hsl(var(--muted-foreground))]">(Suporte a Markdown: ## H2, ### H3, - lista, &gt; citação)</span>
                  </label>
                  <Textarea
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Escreva o conteúdo completo do artigo aqui..."
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">URL da imagem de capa</label>
                  <Input value={form.cover_image_url} onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))} placeholder="https://..." type="url" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">Categoria</label>
                    <select
                      value={form.category_id}
                      onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                      className="w-full h-10 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-sm"
                    >
                      <option value="">Sem categoria</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">Tags (separadas por vírgula)</label>
                    <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="direito trabalhista, horas extras" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="featured" className="text-sm text-[hsl(var(--foreground))]">⭐ Destaque (hero post)</label>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">Slug (URL amigável)</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-l-md text-sm text-[hsl(var(--muted-foreground))]">/blog/</span>
                    <Input
                      value={form.slug}
                      onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                      className="rounded-l-none"
                      placeholder="titulo-do-artigo"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">Meta título (SEO)</label>
                  <Input
                    value={form.meta_title}
                    onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))}
                    placeholder="Título para mecanismos de busca (máx. 60 caracteres)"
                    maxLength={60}
                  />
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{form.meta_title.length}/60 caracteres</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">Meta descrição (SEO)</label>
                  <Textarea
                    value={form.meta_description}
                    onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
                    placeholder="Descrição para mecanismos de busca (máx. 160 caracteres)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{form.meta_description.length}/160 caracteres</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as "draft" | "published" }))}
                    className="w-full h-10 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-sm"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button onClick={() => handleSave(false)} variant="outline" disabled={saving} className="flex-1">
              <Save className="h-4 w-4 mr-2" /> {saving ? "Salvando..." : "Salvar Rascunho"}
            </Button>
            <Button onClick={() => handleSave(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold flex-1" disabled={saving}>
              <Globe className="h-4 w-4 mr-2" /> {saving ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
