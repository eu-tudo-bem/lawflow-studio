import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSearch, ChevronRight, CheckCircle, AlertTriangle, Download, Edit, FileText, Loader2, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";

interface SubmissionRow {
  id: string; description: string; legal_area: string; status: string;
  created_at: string; updated_at: string;
  clients: { full_name: string; email: string } | null;
  ai_analyses: AnalysisRow[] | null;
}

interface AnalysisRow {
  id: string; extracted_data: any; technical_summary: string; suggested_thesis: string;
  suggested_action_type: string; draft_document: string; viability_score: string;
  reviewed: boolean; notes: string | null; created_at: string;
}

interface DocRow { id: string; file_name: string; file_path: string; file_type: string; file_size: number; }

const legalAreaMap: Record<string, string> = {
  bancario: "Bancário", trabalhista: "Trabalhista", empresarial: "Empresarial",
  consumidor: "Consumidor", familia: "Família", imobiliario: "Imobiliário",
  tributario: "Tributário", outro: "Outro",
};

const viabilityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Baixa", color: "bg-destructive/10 text-destructive" },
  medium: { label: "Média", color: "bg-yellow-500/10 text-yellow-600" },
  high: { label: "Alta", color: "bg-green-500/10 text-green-600" },
};

const AnalysesReceived = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [editingDraft, setEditingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) loadSubmissions(); }, [user]);

  const loadSubmissions = async () => {
    const { data } = await supabase.from("document_submissions").select("*, clients(full_name, email), ai_analyses(*)").order("created_at", { ascending: false });
    if (data) setSubmissions(data as unknown as SubmissionRow[]);
    setDataLoading(false);
  };

  const loadDocs = async (submissionId: string) => {
    const { data } = await supabase.from("submission_documents").select("*").eq("submission_id", submissionId);
    if (data) setDocs(data);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id); loadDocs(id);
    const sub = submissions.find(s => s.id === id);
    if (sub?.ai_analyses?.[0]) setDraftText(sub.ai_analyses[0].draft_document || "");
    setEditingDraft(false);
  };

  const handleMarkReviewed = async (analysisId: string) => {
    setSaving(true);
    await supabase.from("ai_analyses").update({ reviewed: true, reviewed_by: user!.id, reviewed_at: new Date().toISOString() }).eq("id", analysisId);
    const sub = submissions.find(s => s.ai_analyses?.[0]?.id === analysisId);
    if (sub) await supabase.from("document_submissions").update({ status: "completed" }).eq("id", sub.id);
    await loadSubmissions(); setSaving(false);
    toast({ title: "Marcado como revisado" });
  };

  const handleSaveDraft = async (analysisId: string) => {
    setSaving(true);
    await supabase.from("ai_analyses").update({ draft_document: draftText }).eq("id", analysisId);
    await loadSubmissions(); setEditingDraft(false); setSaving(false);
    toast({ title: "Minuta salva" });
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const selected = submissions.find(s => s.id === selectedId);
  const analysis = selected?.ai_analyses?.[0];

  return (
    <DashboardLayout
      title={selectedId ? "Detalhes da Análise" : "Análises Recebidas"}
      headerActions={selectedId ? (
        <Button variant="outline" onClick={() => { setSelectedId(null); setDocs([]); }}>
          <ArrowLeft className="h-4 w-4 mr-2" />Voltar
        </Button>
      ) : undefined}
    >
      {dataLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : !selectedId ? (
        submissions.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center py-12"><FileSearch className="h-12 w-12 text-muted-foreground mb-4" /><h3 className="font-semibold text-lg">Nenhuma análise</h3><p className="text-muted-foreground">Quando clientes enviarem documentos, as análises aparecerão aqui.</p></CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map(sub => {
              const a = sub.ai_analyses?.[0];
              const vScore = a?.viability_score ? viabilityConfig[a.viability_score] : null;
              return (
                <Card key={sub.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSelect(sub.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg"><FileSearch className="h-5 w-5 text-primary" /></div>
                        <div>
                          <CardTitle className="text-lg">{sub.clients?.full_name || "Cliente"}</CardTitle>
                          <p className="text-sm text-muted-foreground">{legalAreaMap[sub.legal_area] || sub.legal_area} • {new Date(sub.created_at).toLocaleDateString("pt-BR")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {vScore && <span className={`text-xs font-medium px-2 py-1 rounded-full ${vScore.color}`}>{vScore.label}</span>}
                        <Badge variant={sub.status === "completed" ? "outline" : sub.status === "submitted" ? "secondary" : "default"}>
                          {sub.status === "submitted" ? "Enviado" : sub.status === "analyzing" ? "Analisando" : sub.status === "in_review" ? "Em Revisão" : "Concluído"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent><p className="text-muted-foreground line-clamp-2">{sub.description}</p></CardContent>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Linha do Tempo</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                {["submitted", "analyzing", "in_review", "completed"].map((step, i) => {
                  const labels: Record<string, string> = { submitted: "Enviado", analyzing: "Em Análise", in_review: "Em Revisão", completed: "Concluído" };
                  const isActive = selected?.status === step;
                  const isPast = ["submitted", "analyzing", "in_review", "completed"].indexOf(selected?.status || "") >= i;
                  return (
                    <div key={step} className="flex items-center gap-2">
                      {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      <span className={`text-sm px-3 py-1 rounded-full ${isActive ? "bg-primary text-primary-foreground" : isPast ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{labels[step]}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Documentos Anexados ({docs.length})</CardTitle></CardHeader>
            <CardContent>
              {docs.length === 0 ? <p className="text-muted-foreground text-sm">Nenhum documento.</p> : (
                <div className="space-y-2">
                  {docs.map(d => (
                    <div key={d.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="flex-1 truncate text-sm">{d.file_name}</span>
                      <span className="text-xs text-muted-foreground">{(d.file_size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {analysis ? (
            <>
              <Card>
                <CardHeader><CardTitle className="text-lg">Dados Extraídos</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["parties", "values", "dates", "clauses"].map(key => {
                      const labels: Record<string, string> = { parties: "Partes", values: "Valores", dates: "Datas", clauses: "Cláusulas" };
                      const items = analysis.extracted_data?.[key] || [];
                      return (
                        <div key={key}>
                          <p className="text-sm font-medium mb-1">{labels[key]}</p>
                          {items.length === 0 ? <p className="text-sm text-muted-foreground">Não identificado</p> : (
                            <ul className="text-sm text-muted-foreground space-y-1">{items.map((item: string, i: number) => <li key={i}>• {item}</li>)}</ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Resumo Técnico</CardTitle></CardHeader>
                <CardContent className="prose prose-sm max-w-none"><p className="whitespace-pre-wrap text-muted-foreground">{analysis.technical_summary}</p></CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card><CardHeader><CardTitle className="text-lg">Tese Sugerida</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{analysis.suggested_thesis}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-lg">Tipo de Ação</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{analysis.suggested_action_type}</p></CardContent></Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Minuta</CardTitle>
                  <div className="flex gap-2">
                    {!editingDraft && <Button size="sm" variant="outline" onClick={() => setEditingDraft(true)}><Edit className="h-4 w-4 mr-1" />Editar</Button>}
                    <Button size="sm" variant="outline" onClick={() => handleDownload(draftText, "minuta.txt")}><Download className="h-4 w-4 mr-1" />Exportar TXT</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingDraft ? (
                    <div className="space-y-3">
                      <Textarea value={draftText} onChange={e => setDraftText(e.target.value)} rows={20} className="font-mono text-sm" />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => { setEditingDraft(false); setDraftText(analysis.draft_document); }}>Cancelar</Button>
                        <Button onClick={() => handleSaveDraft(analysis.id)} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Salvar</Button>
                      </div>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-muted p-4 rounded-lg max-h-96 overflow-auto">{analysis.draft_document}</pre>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-3 justify-end">
                {!analysis.reviewed && (
                  <Button onClick={() => handleMarkReviewed(analysis.id)} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}Marcar como Revisado
                  </Button>
                )}
                {analysis.reviewed && <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-4 w-4 mr-1" />Revisado</Badge>}
              </div>
            </>
          ) : (
            <Card><CardContent className="flex flex-col items-center py-12"><AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" /><h3 className="font-semibold text-lg">Análise pendente</h3><p className="text-muted-foreground">A IA ainda está processando este caso.</p></CardContent></Card>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AnalysesReceived;
