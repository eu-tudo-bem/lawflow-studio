import { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle, AlertCircle, XCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

type Appointment = Tables<"appointments">;

const statusConfig = {
  scheduled: { label: "Agendado", icon: Clock, variant: "secondary" as const },
  confirmed: { label: "Confirmado", icon: AlertCircle, variant: "default" as const },
  completed: { label: "Concluído", icon: CheckCircle, variant: "outline" as const },
  cancelled: { label: "Cancelado", icon: XCircle, variant: "destructive" as const },
};

const ClientAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduled_at: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Get client ID
      const { data: clientData } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (clientData) {
        setClientId(clientData.id);
      }

      // Fetch appointments
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("scheduled_at", { ascending: true });

      if (!error && data) {
        setAppointments(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      toast({
        title: "Erro",
        description: "Não foi possível identificar seu cadastro de cliente.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("appointments").insert({
      client_id: clientId,
      title: formData.title,
      description: formData.description,
      scheduled_at: new Date(formData.scheduled_at).toISOString(),
      status: "scheduled",
    });

    if (error) {
      toast({
        title: "Erro ao solicitar agendamento",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Solicitação enviada!",
        description: "Seu pedido de agendamento foi enviado. Aguarde a confirmação.",
      });
      setDialogOpen(false);
      setFormData({ title: "", description: "", scheduled_at: "" });
      
      // Refresh appointments
      const { data } = await supabase
        .from("appointments")
        .select("*")
        .order("scheduled_at", { ascending: true });
      if (data) setAppointments(data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.scheduled_at) >= new Date() && a.status !== "cancelled"
  );
  const pastAppointments = appointments.filter(
    (a) => new Date(a.scheduled_at) < new Date() || a.status === "cancelled"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie suas consultas e reuniões</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Solicitar Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Novo Agendamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assunto</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Reunião sobre processo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Data e Hora Sugerida</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Observações</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes adicionais sobre o agendamento..."
                />
              </div>
              <Button type="submit" className="w-full">
                Enviar Solicitação
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Próximos Agendamentos</h2>
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Nenhum agendamento próximo</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => {
              const status = statusConfig[appointment.status];
              const StatusIcon = status.icon;
              const date = new Date(appointment.scheduled_at);
              
              return (
                <Card key={appointment.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{appointment.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {date.toLocaleDateString("pt-BR")} às {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <Badge variant={status.variant} className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  {appointment.description && (
                    <CardContent>
                      <p className="text-muted-foreground">{appointment.description}</p>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-muted-foreground">Histórico</h2>
          <div className="grid gap-4 opacity-70">
            {pastAppointments.map((appointment) => {
              const status = statusConfig[appointment.status];
              const StatusIcon = status.icon;
              const date = new Date(appointment.scheduled_at);
              
              return (
                <Card key={appointment.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{appointment.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {date.toLocaleDateString("pt-BR")} às {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <Badge variant={status.variant} className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAppointments;
