import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scale, Users, Briefcase, Calendar, Mail, LogOut, 
  Menu, X, Plus, ChevronRight, Clock, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({ clients: 0, cases: 0, appointments: 0, messages: 0 });
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<RecentAppointment[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    // Load stats
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

    // Load recent clients
    const { data: clients } = await supabase
      .from("clients")
      .select("id, full_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (clients) setRecentClients(clients);

    // Load upcoming appointments
    const { data: appointments } = await supabase
      .from("appointments")
      .select("id, title, scheduled_at, clients(full_name)")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(5);

    if (appointments) setUpcomingAppointments(appointments as RecentAppointment[]);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  const menuItems = [
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: Briefcase, label: "Casos", href: "/dashboard/cases" },
    { icon: Calendar, label: "Agendamentos", href: "/dashboard/appointments" },
    { icon: Mail, label: "Contatos do Site", href: "/dashboard/messages", badge: stats.messages },
    { icon: MessageSquare, label: "Chat com Clientes", href: "/dashboard/chat" },
  ];

  return (
    <div className="min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-sidebar-primary" />
            <div>
              <span className="font-serif text-lg font-semibold text-sidebar-foreground">
                Silva & Associados
              </span>
              <p className="text-xs text-sidebar-foreground/60">Sistema de Gestão</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.badge ? (
                <span className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </Button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="font-serif text-xl font-semibold text-foreground">Dashboard</h1>
            </div>
            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate("/dashboard/clients")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">
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
            {/* Recent Clients */}
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
                          <span className="text-accent font-semibold">
                            {client.full_name.charAt(0)}
                          </span>
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

            {/* Upcoming Appointments */}
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
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
