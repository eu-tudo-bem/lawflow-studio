import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Scale, Play, RefreshCw, ExternalLink, CheckCircle2, AlertCircle,
  Clock, Newspaper, TrendingUp, Search, Tag, Calendar, ChevronRight,
  BarChart3, Zap, FileText, Globe, MapPin, ArrowUpRight, Brain, Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { PARANA_CITIES, LEGAL_SERVICES, getServiceCitySlug } from "@/data/localSEOCities";
import { DiscoveryAgentTab } from "@/components/DiscoveryAgentTab";
import { HyperlocalSEOPanel } from "@/components/HyperlocalSEOPanel";

interface LegalChange {
  id: string;
  titulo: string;
  resumo: string | null;
  area_direito: string;
  tipo_impacto: string | null;
  fonte: string | null;
  norma_referencia: string | null;
  palavras_chave: string[] | null;
  status: string;
  blog_post_id: string | null;
  leads_gerados: number;
  created_at: string;
}

interface MonitorLog {
  id: string;
  status: string;
  changes_found: number;
  posts_generated: number;
  duration_ms: number | null;
  areas_scanned: string[] | null;
  error_message: string | null;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  views: number;
  published_at: string | null;
}

const AREA_LABELS: Record<string, string> = {
  familia: "Família",
  civil: "Civil",
  imobiliario: "Imobiliário",
  agrario: "Agrário",
  trabalhista: "Trabalhista",
  consumidor: "Consumidor",
};

const AREA_COLORS: Record<string, string> = {
  familia: "bg-pink-100 text-pink-800",
  civil: "bg-blue-100 text-blue-800",
  imobiliario: "bg-amber-100 text-amber-800",
  agrario: "bg-green-100 text-green-800",
  trabalhista: "bg-purple-100 text-purple-800",
  consumidor: "bg-orange-100 text-orange-800",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  detected: { label: "Detectada", color: "bg-yellow-100 text-yellow-800", icon: Search },
  published: { label: "Publicada", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  dismissed: { label: "Descartada", color: "bg-gray-100 text-gray-600", icon: AlertCircle },
};

const LegalMonitor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [changes, setChanges] = useState<LegalChange[]>([]);
  const [logs, setLogs] = useState<MonitorLog[]>([]);
  const [topPosts, setTopPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState({
    totalChanges: 0,
    published: 0,
    totalLeads: 0,
    lastRun: null as string | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [changesRes, logsRes, postsRes] = await Promise.all([
        supabase
          .from("legal_changes" as any)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("legal_monitor_logs" as any)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("blog_posts")
          .select("id, title, slug, views, published_at")
          .eq("status", "published")
          .order("views", { ascending: false })
          .limit(5),
      ]);

      const changesData = (changesRes.data || []) as unknown as LegalChange[];
      const logsData = (logsRes.data || []) as unknown as MonitorLog[];
      const postsData = (postsRes.data || []) as BlogPost[];

      setChanges(changesData);
      setLogs(logsData);
      setTopPosts(postsData);

      setStats({
        totalChanges: changesData.length,
        published: changesData.filter((c) => c.status === "published").length,
        totalLeads: changesData.reduce((sum, c) => sum + (c.leads_gerados || 0), 0),
        lastRun: logsData[0]?.created_at || null,
      });
    } finally {
      setLoading(false);
    }
  };

  const runMonitor = async (areas?: string[]) => {
    setRunning(true);
    toast({ title: "Agente iniciado", description: "Monitorando fontes jurídicas… isso pode levar 1-2 minutos." });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legal-monitor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(areas ? { areas } : {}),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Erro ao executar o monitor");

      toast({
        title: "Monitor concluído ✅",
        description: `${result.changes_found} mudança(s) detectada(s), ${result.posts_generated} página(s) gerada(s).`,
      });

      await loadData();
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const dismissChange = async (id: string) => {
    await supabase.from("legal_changes" as any).update({ status: "dismissed" }).eq("id", id);
    setChanges((prev) => prev.map((c) => (c.id === id ? { ...c, status: "dismissed" } : c)));
    toast({ title: "Mudança descartada" });
  };

  return (
    <DashboardLayout
      title="Monitor Jurídico Inteligente"
      headerActions={
        <Button
          onClick={() => runMonitor()}
          disabled={running}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {running ? (
            <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Executando…</>
          ) : (
            <><Play className="h-4 w-4 mr-2" />Executar Monitor</>
          )}
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Scale, label: "Mudanças Detectadas", value: stats.totalChanges, color: "text-accent" },
          { icon: Newspaper, label: "Páginas Publicadas", value: stats.published, color: "text-green-600" },
          { icon: TrendingUp, label: "Leads Gerados", value: stats.totalLeads, color: "text-blue-600" },
          {
            icon: Clock,
            label: "Última Execução",
            value: stats.lastRun
              ? new Date(stats.lastRun).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
              : "—",
            color: "text-muted-foreground",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="monitor" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Monitor Legislativo
          </TabsTrigger>
          <TabsTrigger value="discovery" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Agente de Descoberta
          </TabsTrigger>
          <TabsTrigger value="hyperlocal" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            SEO Hiperlocal
          </TabsTrigger>
        </TabsList>

        {/* ── Monitor Legislativo ── */}
        <TabsContent value="monitor">
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Monitor by Area */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  Monitor por Área
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: "familia", label: "Direito de Família" },
                  { id: "civil", label: "Direito Civil" },
                  { id: "imobiliario", label: "Direito Imobiliário" },
                  { id: "agrario", label: "Direito Agrário" },
                  { id: "trabalhista", label: "Direito do Trabalho" },
                  { id: "consumidor", label: "Direito do Consumidor" },
                ].map((area) => (
                  <Button
                    key={area.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                    disabled={running}
                    onClick={() => runMonitor([area.id])}
                  >
                    <span>{area.label}</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Execution Logs */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  Histórico de Execuções
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Carregando…</p>
                ) : logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma execução registrada.</p>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {log.status === "success" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          ) : log.status === "error" ? (
                            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-medium text-foreground">
                              {log.changes_found} detec. / {log.posts_generated} pub.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleDateString("pt-BR", {
                                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        {log.duration_ms && (
                          <span className="text-xs text-muted-foreground">{(log.duration_ms / 1000).toFixed(0)}s</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Posts */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  Páginas com Mais Visitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma página ainda.</p>
                ) : (
                  <div className="space-y-3">
                    {topPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between gap-2">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-foreground hover:text-accent line-clamp-2 flex-1"
                        >
                          {post.title}
                        </a>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <TrendingUp className="h-3 w-3" />
                          {post.views}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Changes Table */}
          <Card className="border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Mudanças Legislativas Detectadas
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={loadData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : changes.length === 0 ? (
                <div className="text-center py-12">
                  <Scale className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Nenhuma mudança detectada ainda.</p>
                  <p className="text-sm text-muted-foreground mt-1">Clique em "Executar Monitor" para iniciar.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {changes.map((change) => {
                    const statusCfg = STATUS_CONFIG[change.status] || STATUS_CONFIG["detected"];
                    const StatusIcon = statusCfg.icon;
                    return (
                      <div
                        key={change.id}
                        className="border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
                      >
                        <div className="flex flex-wrap items-start gap-2 mb-2">
                        <Badge className={`${AREA_COLORS[change.area_direito] || "bg-muted text-muted-foreground"} border-0 text-xs`}>
                            {AREA_LABELS[change.area_direito] || change.area_direito}
                          </Badge>
                          <Badge className={`${statusCfg.color} border-0 text-xs flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusCfg.label}
                          </Badge>
                          {change.fonte && (
                            <Badge variant="outline" className="text-xs">
                              {change.fonte}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{change.titulo}</h3>
                        {change.resumo && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{change.resumo}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {change.norma_referencia && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{change.norma_referencia}</span>
                          )}
                          {change.tipo_impacto && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {change.tipo_impacto}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                            <Calendar className="h-3 w-3" />
                            {new Date(change.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        {change.palavras_chave && change.palavras_chave.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {change.palavras_chave.slice(0, 5).map((kw) => (
                              <span key={kw} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          {change.blog_post_id && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => navigate(`/dashboard/blog`)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ver Página
                            </Button>
                          )}
                          {change.status === "detected" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-muted-foreground hover:text-destructive"
                              onClick={() => dismissChange(change.id)}
                            >
                              Descartar
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Agente de Descoberta ── */}
        <TabsContent value="discovery">
          <DiscoveryAgentTab />
        </TabsContent>

        {/* ── SEO Hiperlocal ── */}
        <TabsContent value="hyperlocal">
          <HyperlocalSEOPanel />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default LegalMonitor;
