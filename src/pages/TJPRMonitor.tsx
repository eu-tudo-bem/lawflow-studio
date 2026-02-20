import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, RefreshCw, Eye, Trash2, Gavel
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface Processo {
  id: string; numero_processo: string; cliente_id: string | null; area_direito: string | null;
  observacoes: string | null; status_atual: string | null; comarca: string | null;
  vara: string | null; ultima_verificacao: string | null; created_at: string;
  clients?: { full_name: string } | null;
}

interface LogConsulta {
  id: string; status_anterior: string | null; status_novo: string | null;
  erro: string | null; sucesso: boolean; created_at: string;
}

const statusColorMap: Record<string, string> = {
  "Ativo": "bg-green-500/15 text-green-700 border-green-300",
  "Em andamento": "bg-green-500/15 text-green-700 border-green-300",
  "Suspenso": "bg-yellow-500/15 text-yellow-700 border-yellow-300",
  "Em instância superior": "bg-blue-500/15 text-blue-700 border-blue-300",
  "Recurso": "bg-blue-500/15 text-blue-700 border-blue-300",
  "Arquivado": "bg-muted text-muted-foreground border-border",
  "Baixado": "bg-muted text-muted-foreground border-border",
  "Inválido": "bg-red-500/15 text-red-700 border-red-300",
  "Desconhecido": "bg-muted text-muted-foreground border-border",
};

const getStatusColor = (status: string | null) => {
  if (!status) return statusColorMap["Desconhecido"];
  for (const [key, value] of Object.entries(statusColorMap)) {
    if (status.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return statusColorMap["Desconhecido"];
};

const TJPRMonitor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clients, setClients] = useState<{ id: string; full_name: string }[]>([]);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<LogConsulta[]>([]);
  const [selectedProcessoNum, setSelectedProcessoNum] = useState("");
  const [form, setForm] = useState({ numero_processo: "", cliente_id: "", area_direito: "", observacoes: "" });

  useEffect(() => { if (user) { loadProcessos(); loadClients(); } }, [user]);

  const loadProcessos = async () => {
    setLoadingData(true);
    const { data } = await supabase.from("tjpr_processos_monitorados").select("*, clients(full_name)").order("created_at", { ascending: false });
    if (data) setProcessos(data as Processo[]);
    setLoadingData(false);
  };

  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("id, full_name").order("full_name");
    if (data) setClients(data);
  };

  const handleAdd = async () => {
    if (!form.numero_processo || !user) return;
    const cleaned = form.numero_processo.replace(/\D/g, "");
    if (!cleaned) { toast({ title: "Número inválido", description: "Informe o número do processo.", variant: "destructive" }); return; }
    const { error } = await supabase.from("tjpr_processos_monitorados").insert({ numero_processo: cleaned, cliente_id: form.cliente_id || null, area_direito: form.area_direito || null, observacoes: form.observacoes || null, created_by: user.id });
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Processo cadastrado", description: "O processo será monitorado automaticamente." });
    setForm({ numero_processo: "", cliente_id: "", area_direito: "", observacoes: "" });
    setDialogOpen(false); loadProcessos();
  };

  const handleRefresh = async (processoId: string) => {
    setRefreshingId(processoId);
    try {
      const { error } = await supabase.functions.invoke("tjpr-monitor", { body: { processo_id: processoId } });
      if (error) throw error;
      toast({ title: "Consulta realizada", description: "Status atualizado." }); loadProcessos();
    } catch (err: any) { toast({ title: "Erro na consulta", description: err.message, variant: "destructive" }); }
    setRefreshingId(null);
  };

  const handleRefreshAll = async () => {
    setRefreshingAll(true);
    try {
      const { error } = await supabase.functions.invoke("tjpr-monitor", { body: {} });
      if (error) throw error;
      toast({ title: "Consulta em lote realizada" }); loadProcessos();
    } catch (err: any) { toast({ title: "Erro", description: err.message, variant: "destructive" }); }
    setRefreshingAll(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tjpr_processos_monitorados").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Processo removido" }); loadProcessos();
  };

  const viewLogs = async (processoId: string, numero: string) => {
    setSelectedProcessoNum(numero);
    const { data } = await supabase.from("tjpr_logs_consulta").select("id, status_anterior, status_novo, erro, sucesso, created_at").eq("processo_id", processoId).order("created_at", { ascending: false }).limit(20);
    setSelectedLogs((data || []) as LogConsulta[]); setLogsDialogOpen(true);
  };

  return (
    <DashboardLayout
      title="Monitoramento TJPR"
      headerActions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshAll} disabled={refreshingAll}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshingAll ? "animate-spin" : ""}`} />Atualizar Todos
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4 mr-2" />Novo Processo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Cadastrar Processo para Monitoramento</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Número do Processo (somente números)</Label><Input placeholder="00123456720258160001" value={form.numero_processo} onChange={(e) => setForm({ ...form, numero_processo: e.target.value.replace(/\D/g, "") })} /></div>
                <div><Label>Cliente</Label><Select value={form.cliente_id} onValueChange={(v) => setForm({ ...form, cliente_id: v })}><SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger><SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Área do Direito</Label><Select value={form.area_direito} onValueChange={(v) => setForm({ ...form, area_direito: v })}><SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger><SelectContent><SelectItem value="trabalhista">Trabalhista</SelectItem><SelectItem value="bancario">Bancário</SelectItem><SelectItem value="consumidor">Consumidor</SelectItem><SelectItem value="familia">Família</SelectItem><SelectItem value="empresarial">Empresarial</SelectItem><SelectItem value="imobiliario">Imobiliário</SelectItem><SelectItem value="tributario">Tributário</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent></Select></div>
                <div><Label>Observações</Label><Textarea placeholder="Anotações internas..." value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} /></div>
                <Button className="w-full" onClick={handleAdd}>Cadastrar e Monitorar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{processos.length}</p><p className="text-sm text-muted-foreground">Processos Monitorados</p></CardContent></Card>
        <Card className="border-0 shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{processos.filter(p => p.status_atual?.toLowerCase().includes("ativo") || p.status_atual?.toLowerCase().includes("andamento")).length}</p><p className="text-sm text-muted-foreground">Ativos</p></CardContent></Card>
        <Card className="border-0 shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-yellow-600">{processos.filter(p => p.status_atual?.toLowerCase().includes("suspenso")).length}</p><p className="text-sm text-muted-foreground">Suspensos</p></CardContent></Card>
        <Card className="border-0 shadow-card"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-muted-foreground">{processos.filter(p => p.status_atual?.toLowerCase().includes("arquivado") || p.status_atual?.toLowerCase().includes("baixado")).length}</p><p className="text-sm text-muted-foreground">Arquivados</p></CardContent></Card>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-card">
        <CardHeader><CardTitle className="font-serif">Processos Monitorados</CardTitle></CardHeader>
        <CardContent>
          {loadingData ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" /></div>
          ) : processos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum processo cadastrado para monitoramento.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead><TableHead>Cliente</TableHead><TableHead>Status</TableHead>
                    <TableHead>Comarca</TableHead><TableHead>Vara</TableHead><TableHead>Última Verificação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-sm">{p.numero_processo}</TableCell>
                      <TableCell>{p.clients?.full_name || "—"}</TableCell>
                      <TableCell><Badge className={getStatusColor(p.status_atual)} variant="outline">{p.status_atual || "Desconhecido"}</Badge></TableCell>
                      <TableCell>{p.comarca || "—"}</TableCell>
                      <TableCell>{p.vara || "—"}</TableCell>
                      <TableCell>{p.ultima_verificacao ? new Date(p.ultima_verificacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Nunca"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" onClick={() => handleRefresh(p.id)} disabled={refreshingId === p.id} title="Atualizar agora"><RefreshCw className={`h-4 w-4 ${refreshingId === p.id ? "animate-spin" : ""}`} /></Button>
                          <Button variant="ghost" size="icon" onClick={() => viewLogs(p.id, p.numero_processo)} title="Ver histórico"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} title="Remover"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs Dialog */}
      <Dialog open={logsDialogOpen} onOpenChange={setLogsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Histórico de Consultas — {selectedProcessoNum}</DialogTitle></DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {selectedLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Nenhum registro de consulta.</p>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Status Anterior</TableHead><TableHead>Status Novo</TableHead><TableHead>Resultado</TableHead></TableRow></TableHeader>
                <TableBody>
                  {selectedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{new Date(log.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</TableCell>
                      <TableCell>{log.status_anterior || "—"}</TableCell>
                      <TableCell>{log.status_novo || "—"}</TableCell>
                      <TableCell>{log.sucesso ? <Badge className="bg-green-500/15 text-green-700 border-green-300" variant="outline">Sucesso</Badge> : <Badge variant="destructive" title={log.erro || undefined}>Erro</Badge>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TJPRMonitor;
