import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import DashboardLayout from "@/components/DashboardLayout";

type CaseStatus = Database["public"]["Enums"]["case_status"];

interface Case {
  id: string; title: string; description: string | null; status: CaseStatus;
  client_id: string; clients: { full_name: string } | null; created_at: string;
}
interface Client { id: string; full_name: string; }

const statusLabels: Record<CaseStatus, string> = { pending: "Pendente", in_progress: "Em Andamento", completed: "Concluído", cancelled: "Cancelado" };
const statusColors: Record<CaseStatus, string> = { pending: "bg-yellow-100 text-yellow-800", in_progress: "bg-blue-100 text-blue-800", completed: "bg-green-100 text-green-800", cancelled: "bg-gray-100 text-gray-800" };

const Cases = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cases, setCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", status: "pending" as CaseStatus, client_id: "" });

  useEffect(() => { if (user) { loadCases(); loadClients(); } }, [user]);

  const loadCases = async () => {
    const { data } = await supabase.from("cases").select("*, clients(full_name)").order("created_at", { ascending: false });
    if (data) setCases(data as Case[]);
  };
  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("id, full_name").order("full_name");
    if (data) setClients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCase) {
        const { error } = await supabase.from("cases").update({ title: formData.title, description: formData.description || null, status: formData.status, client_id: formData.client_id }).eq("id", editingCase.id);
        if (error) throw error;
        toast({ title: "Caso atualizado!" });
      } else {
        const { error } = await supabase.from("cases").insert({ title: formData.title, description: formData.description || null, status: formData.status, client_id: formData.client_id, assigned_to: user?.id });
        if (error) throw error;
        toast({ title: "Caso cadastrado!" });
      }
      setIsDialogOpen(false); resetForm(); loadCases();
    } catch (error: any) { toast({ title: "Erro", description: error.message, variant: "destructive" }); }
  };

  const handleEdit = (c: Case) => { setEditingCase(c); setFormData({ title: c.title, description: c.description || "", status: c.status, client_id: c.client_id }); setIsDialogOpen(true); };
  const handleDelete = async (id: string) => { if (!confirm("Deseja excluir este caso?")) return; const { error } = await supabase.from("cases").delete().eq("id", id); if (!error) { toast({ title: "Caso excluído!" }); loadCases(); } };
  const resetForm = () => { setEditingCase(null); setFormData({ title: "", description: "", status: "pending", client_id: "" }); };
  const filteredCases = cases.filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.clients?.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout
      title="Casos"
      headerActions={
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4 mr-2" />Novo Caso</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle className="font-serif">{editingCase ? "Editar Caso" : "Novo Caso"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Título do caso *" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })} required>
                <SelectTrigger><SelectValue placeholder="Selecione o cliente *" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as CaseStatus })}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>{Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
              <Textarea placeholder="Descrição" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{editingCase ? "Salvar Alterações" : "Cadastrar Caso"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Buscar casos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 max-w-md" />
      </div>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {filteredCases.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum caso encontrado.</div>
          ) : (
            <div className="divide-y divide-border">
              {filteredCases.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Briefcase className="h-5 w-5 text-accent" /></div>
                    <div><p className="font-medium text-foreground">{c.title}</p><p className="text-sm text-muted-foreground">{c.clients?.full_name}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={statusColors[c.status]}>{statusLabels[c.status]}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Cases;
