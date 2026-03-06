import { useState, useEffect } from "react";
import {
  Search, Play, RefreshCw, CheckCircle2, AlertCircle, Clock,
  TrendingUp, Globe, Zap, BarChart3, Eye, ChevronRight,
  MapPin, Brain, FileText, Plus, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface LegalQuestion {
  id: string;
  question: string;
  slug: string;
  legal_area: string;
  status: string;
  source: string;
  cluster_topic: string | null;
  city_slug: string | null;
  views: number;
  leads_generated: number;
  created_at: string;
  published_at: string | null;
}

interface DiscoveryLog {
  id: string;
  status: string;
  questions_found: number;
  pages_generated: number;
  areas_scanned: string[] | null;
  duration_ms: number | null;
  error_message: string | null;
  created_at: string;
}

const AREA_OPTIONS = [
  { id: "transito", label: "🚦 Trânsito" },
  { id: "familia", label: "👨‍👩‍👧 Família" },
  { id: "trabalho", label: "💼 Trabalho" },
  { id: "consumidor", label: "🛒 Consumidor" },
  { id: "imobiliario", label: "🏠 Imobiliário" },
  { id: "criminal", label: "⚖️ Criminal" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  generating: { label: "Gerando…", color: "bg-blue-100 text-blue-800" },
  published: { label: "Publicada", color: "bg-green-100 text-green-800" },
  archived: { label: "Arquivada", color: "bg-gray-100 text-gray-600" },
};

const SOURCE_CONFIG: Record<string, { label: string; icon: string }> = {
  autocomplete: { label: "Autocomplete", icon: "🔍" },
  trends: { label: "Trends", icon: "📈" },
  legislative: { label: "Legislativa", icon: "⚖️" },
  cluster: { label: "Cluster", icon: "🔗" },
  hyperlocal: { label: "Hiperlocal", icon: "📍" },
  manual: { label: "Manual", icon: "✏️" },
};

export const DiscoveryAgentTab = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<LegalQuestion[]>([]);
  const [logs, setLogs] = useState<DiscoveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0, published: 0, pending: 0, totalViews: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [qRes, logRes] = await Promise.all([
      supabase
        .from("legal_questions" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("discovery_agent_logs" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const qData = (qRes.data || []) as unknown as LegalQuestion[];
    setQuestions(qData);
    setLogs((logRes.data || []) as unknown as DiscoveryLog[]);

    setStats({
      total: qData.length,
      published: qData.filter(q => q.status === "published").length,
      pending: qData.filter(q => q.status === "pending").length,
      totalViews: qData.reduce((s, q) => s + (q.views || 0), 0),
    });
    setLoading(false);
  };

  const runAgent = async (options: {
    areas?: string[];
    max_questions_per_area?: number;
    generate_hyperlocal?: boolean;
    hyperlocal_cities?: string[];
  } = {}) => {
    setRunning(true);
    toast({
      title: "Agente iniciado 🤖",
      description: "Descobrindo perguntas jurídicas e gerando páginas SEO…",
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/content-discovery-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            areas: options.areas || (selectedAreas.length > 0 ? selectedAreas : undefined),
            max_questions_per_area: options.max_questions_per_area || 3,
            generate_hyperlocal: options.generate_hyperlocal || false,
            hyperlocal_cities: options.hyperlocal_cities || ["curitiba", "londrina", "maringa"],
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro no agente");

      toast({
        title: "Agente concluído ✅",
        description: `${result.questions_found} pergunta(s) encontrada(s), ${result.pages_generated} página(s) gerada(s).`,
      });
      await loadData();
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const publishQuestion = async (id: string) => {
    await supabase.from("legal_questions" as any)
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", id);
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: "published" } : q));
    toast({ title: "Página publicada ✅" });
  };

  const archiveQuestion = async (id: string) => {
    await supabase.from("legal_questions" as any).update({ status: "archived" }).eq("id", id);
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: "archived" } : q));
    toast({ title: "Pergunta arquivada" });
  };

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const filtered = questions.filter(q =>
    filterStatus === "all" ? true : q.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: "Perguntas Descobertas", value: stats.total, color: "text-accent" },
          { icon: Globe, label: "Páginas Publicadas", value: stats.published, color: "text-green-600" },
          { icon: Clock, label: "Aguardando Geração", value: stats.pending, color: "text-yellow-600" },
          { icon: Eye, label: "Visualizações", value: stats.totalViews, color: "text-blue-600" },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border-0 shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-lg">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Executar Agente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Filtrar por área (opcional):</p>
              <div className="flex flex-wrap gap-2">
                {AREA_OPTIONS.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => toggleArea(area.id)}
                    className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                      selectedAreas.includes(area.id)
                        ? "bg-accent text-accent-foreground border-accent"
                        : "border-border text-muted-foreground hover:border-accent/50"
                    }`}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => runAgent({ max_questions_per_area: 3 })}
                disabled={running}
              >
                {running ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Gerando…</>
                ) : (
                  <><Search className="h-4 w-4 mr-2" />Descobrir Perguntas</>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => runAgent({ generate_hyperlocal: true, max_questions_per_area: 2 })}
                disabled={running}
              >
                <MapPin className="h-4 w-4 mr-2" />
                + Gerar Versões Hiperlocais
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => runAgent({ max_questions_per_area: 10 })}
                disabled={running}
              >
                <Plus className="h-3 w-3 mr-1" />
                Modo Completo (10/área)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Histórico do Agente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma execução ainda.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {log.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {log.questions_found} enc. / {log.pages_generated} pub.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                        {log.error_message && (
                          <p className="text-xs text-destructive mt-0.5 line-clamp-1">{log.error_message}</p>
                        )}
                      </div>
                    </div>
                    {log.duration_ms && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {(log.duration_ms / 1000).toFixed(0)}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="border-0 shadow-card bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <span className="text-accent font-bold shrink-0">1.</span>
              <span>Descobre perguntas reais que usuários buscam no Google (autocomplete)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-accent font-bold shrink-0">2.</span>
              <span>Gera página SEO completa com explicação jurídica, base legal e CTAs</span>
            </div>
            <div className="flex gap-2">
              <span className="text-accent font-bold shrink-0">3.</span>
              <span>Cria clusters de conteúdo com páginas relacionadas interligadas</span>
            </div>
            <div className="flex gap-2">
              <span className="text-accent font-bold shrink-0">4.</span>
              <span>Replica para cidades do Paraná (versão hiperlocal)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-accent font-bold shrink-0">5.</span>
              <span>Sitemap atualizado automaticamente para indexação rápida</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Table */}
      <Card className="border-0 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Perguntas Geradas ({filtered.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground"
            >
              <option value="all">Todas</option>
              <option value="published">Publicadas</option>
              <option value="pending">Pendentes</option>
              <option value="generating">Gerando</option>
              <option value="archived">Arquivadas</option>
            </select>
            <Button variant="ghost" size="sm" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhuma pergunta encontrada.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clique em "Descobrir Perguntas" para iniciar o agente.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((q) => {
                const statusCfg = STATUS_CONFIG[q.status] || STATUS_CONFIG.pending;
                const sourceCfg = SOURCE_CONFIG[q.source] || SOURCE_CONFIG.manual;
                return (
                  <div
                    key={q.id}
                    className="border border-border rounded-lg p-4 hover:border-accent/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={`${statusCfg.color} border-0 text-xs`}>
                            {statusCfg.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {sourceCfg.icon} {sourceCfg.label}
                          </span>
                          {q.city_slug && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {q.city_slug}
                            </span>
                          )}
                          {q.cluster_topic && (
                            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                              {q.cluster_topic}
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-foreground text-sm">{q.question}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">/pergunta/{q.slug}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {q.views}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {q.status === "published" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                          <Link to={`/pergunta/${q.slug}`} target="_blank">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Ver Página
                          </Link>
                        </Button>
                      )}
                      {q.status === "pending" && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-accent text-accent-foreground"
                          onClick={() => publishQuestion(q.id)}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Publicar
                        </Button>
                      )}
                      {q.status !== "archived" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => archiveQuestion(q.id)}
                        >
                          Arquivar
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(q.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
