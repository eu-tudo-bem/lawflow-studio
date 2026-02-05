import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scale, Users, Briefcase, Calendar, Mail, LogOut, 
  Menu, X, ArrowLeft, Check, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  created_at: string;
}

const Messages = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) loadMessages();
  }, [user]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ read: true })
      .eq("id", id);
    if (!error) {
      toast({ title: "Mensagem marcada como lida!" });
      loadMessages();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta mensagem?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (!error) {
      toast({ title: "Mensagem excluída!" });
      loadMessages();
    }
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
    { icon: Mail, label: "Mensagens", href: "/dashboard/messages", active: true },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-sidebar-primary" />
            <div>
              <span className="font-serif text-lg font-semibold text-sidebar-foreground">Fernandez & Fernandes</span>
              <p className="text-xs text-sidebar-foreground/60">Sistema de Gestão</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent mb-4" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
            Dashboard
          </Button>
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start gap-3 ${item.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="font-serif text-xl font-semibold text-foreground">Mensagens do Site</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          <Card className="border-0 shadow-card">
            <CardContent className="p-0">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">Nenhuma mensagem recebida.</div>
              ) : (
                <div className="divide-y divide-border">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`p-4 ${!msg.read ? "bg-accent/5" : ""}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-accent font-semibold">
                              {msg.full_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{msg.full_name}</p>
                              {!msg.read && (
                                <Badge className="bg-accent text-accent-foreground text-xs">Nova</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{msg.email} • {msg.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {!msg.read && (
                            <Button variant="ghost" size="icon" onClick={() => markAsRead(msg.id)} title="Marcar como lida">
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(msg.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-foreground ml-13 pl-13">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Messages;
