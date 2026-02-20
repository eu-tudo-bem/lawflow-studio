import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Clock } from "lucide-react";
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

type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

interface Appointment {
  id: string; title: string; description: string | null; scheduled_at: string;
  status: AppointmentStatus; client_id: string; clients: { full_name: string } | null;
}
interface Client { id: string; full_name: string; }

const statusLabels: Record<AppointmentStatus, string> = { scheduled: "Agendado", confirmed: "Confirmado", completed: "Realizado", cancelled: "Cancelado" };
const statusColors: Record<AppointmentStatus, string> = { scheduled: "bg-blue-100 text-blue-800", confirmed: "bg-green-100 text-green-800", completed: "bg-gray-100 text-gray-800", cancelled: "bg-red-100 text-red-800" };

const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", scheduled_at: "", status: "scheduled" as AppointmentStatus, client_id: "" });

  useEffect(() => { if (user) { loadAppointments(); loadClients(); } }, [user]);

  const loadAppointments = async () => {
    const { data } = await supabase.from("appointments").select("*, clients(full_name)").order("scheduled_at", { ascending: true });
    if (data) setAppointments(data as Appointment[]);
  };
  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("id, full_name").order("full_name");
    if (data) setClients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        const { error } = await supabase.from("appointments").update({ title: formData.title, description: formData.description || null, scheduled_at: formData.scheduled_at, status: formData.status, client_id: formData.client_id }).eq("id", editingAppointment.id);
        if (error) throw error;
        toast({ title: "Agendamento atualizado!" });
      } else {
        const { error } = await supabase.from("appointments").insert({ title: formData.title, description: formData.description || null, scheduled_at: formData.scheduled_at, status: formData.status, client_id: formData.client_id, assigned_to: user?.id });
        if (error) throw error;
        toast({ title: "Agendamento criado!" });
      }
      setIsDialogOpen(false); resetForm(); loadAppointments();
    } catch (error: any) { toast({ title: "Erro", description: error.message, variant: "destructive" }); }
  };

  const handleEdit = (a: Appointment) => { setEditingAppointment(a); setFormData({ title: a.title, description: a.description || "", scheduled_at: a.scheduled_at.slice(0, 16), status: a.status, client_id: a.client_id }); setIsDialogOpen(true); };
  const handleDelete = async (id: string) => { if (!confirm("Deseja excluir este agendamento?")) return; const { error } = await supabase.from("appointments").delete().eq("id", id); if (!error) { toast({ title: "Agendamento excluído!" }); loadAppointments(); } };
  const resetForm = () => { setEditingAppointment(null); setFormData({ title: "", description: "", scheduled_at: "", status: "scheduled", client_id: "" }); };
  const filteredAppointments = appointments.filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.clients?.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout
      title="Agendamentos"
      headerActions={
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4 mr-2" />Novo Agendamento</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle className="font-serif">{editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Título *" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })} required>
                <SelectTrigger><SelectValue placeholder="Selecione o cliente *" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="datetime-local" value={formData.scheduled_at} onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })} required />
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as AppointmentStatus })}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>{Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
              <Textarea placeholder="Descrição" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{editingAppointment ? "Salvar Alterações" : "Criar Agendamento"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Buscar agendamentos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 max-w-md" />
      </div>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum agendamento encontrado.</div>
          ) : (
            <div className="divide-y divide-border">
              {filteredAppointments.map((a) => (
                <div key={a.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Clock className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="font-medium text-foreground">{a.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(a.scheduled_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        {a.clients && ` • ${a.clients.full_name}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={statusColors[a.status]}>{statusLabels[a.status]}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(a)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default Appointments;
