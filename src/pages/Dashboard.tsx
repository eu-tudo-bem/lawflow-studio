import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, Calendar, Mail, Plus, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";

interface DashboardStats {
  clients: number;
  cases: number;
  appointments: number;
  messages: number;
}

interface RecentClient {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface RecentAppointment {
  id: string;
  title: string;
  scheduled_at: string;
  clients: { full_name: string } | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({ clients: 0, cases: 0, appointments: 0, messages: 0 });
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<RecentAppointment[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    const [clientsRes, casesRes, appointmentsRes, messagesRes] = await Promise.all([
      supabase.from("clients").select("id", { count: "exact", head: true }),
      supabase.from("cases").select("id", { count: "exact", head: true }),
      supabase.from("appointments").select("id", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("read", false),
    ]);

    setStats({
      clients: clientsRes.count || 0,
      cases: casesRes.count || 0,
      appointments: appointmentsRes.count || 0,
      messages: messagesRes.count || 0,
    });

    const { data: clients } = await supabase
      .from("clients")
      .select("id, full_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (clients) setRecentClients(clients);

    const { data: appointments } = await supabase
      .from("appointments")
      .select("id, title, scheduled_at, clients(full_name)")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(5);
    if (appointments) setUpcomingAppointments(appointments as RecentAppointment[]);
  };

  return (
    <DashboardLayout
      title="Dashboard"
      headerActions={
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => navigate("/dashboard/clients")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.clients}</p>
                <p className="text-sm text-muted-foreground">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Briefcase className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.cases}</p>
                <p className="text-sm text-muted-foreground">Casos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.appointments}</p>
                <p className="text-sm text-muted-foreground">Agendamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.messages}</p>
                <p className="text-sm text-muted-foreground">Novas Mensagens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Data */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Clientes Recentes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/clients")}>
              Ver todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentClients.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum cliente cadastrado.</p>
            ) : (
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-semibold">{client.full_name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{client.full_name}</p>
                      <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Próximos Agendamentos</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/appointments")}>
              Ver todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum agendamento próximo.</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{appointment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appointment.scheduled_at).toLocaleDateString("pt-BR", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                        {appointment.clients && ` • ${appointment.clients.full_name}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
