import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scale, Users, Briefcase, Calendar, Mail, LogOut, 
  Menu, X, Plus, Search, Edit, Trash2, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type CaseStatus = Database["public"]["Enums"]["case_status"];

interface Case {
  id: string;
  title: string;
  description: string | null;
  status: CaseStatus;
  client_id: string;
  clients: { full_name: string } | null;
  created_at: string;
}

interface Client {
  id: string;
  full_name: string;
}

const statusLabels: Record<CaseStatus, string> = {
  pending: "Pendente",
  in_progress: "Em Andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const statusColors: Record<CaseStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const Cases = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as CaseStatus,
    client_id: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadCases();
      loadClients();
    }
  }, [user]);

  const loadCases = async () => {
    const { data } = await supabase
      .from("cases")
      .select("*, clients(full_name)")
      .order("created_at", { ascending: false });
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
        const { error } = await supabase
          .from("cases")
          .update({
            title: formData.title,
            description: formData.description || null,
            status: formData.status,
            client_id: formData.client_id,
          })
          .eq("id", editingCase.id);
        if (error) throw error;
        toast({ title: "Caso atualizado!" });
      } else {
        const { error } = await supabase
          .from("cases")
          .insert({
            title: formData.title,
            description: formData.description || null,
            status: formData.status,
            client_id: formData.client_id,
            assigned_to: user?.id,
          });
        if (error) throw error;
        toast({ title: "Caso cadastrado!" });
      }
      setIsDialogOpen(false);
      resetForm();
      loadCases();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (c: Case) => {
    setEditingCase(c);
    setFormData({
      title: c.title,
      description: c.description || "",
      status: c.status,
      client_id: c.client_id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este caso?")) return;
    const { error } = await supabase.from("cases").delete().eq("id", id);
    if (!error) {
      toast({ title: "Caso excluído!" });
      loadCases();
    }
  };

  const resetForm = () => {
    setEditingCase(null);
    setFormData({ title: "", description: "", status: "pending", client_id: "" });
  };

  const filteredCases = cases.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.clients?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    { icon: Briefcase, label: "Casos", href: "/dashboard/cases", active: true },
    { icon: Calendar, label: "Agendamentos", href: "/dashboard/appointments" },
    { icon: Mail, label: "Mensagens", href: "/dashboard/messages" },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-sidebar-primary" />
            <div>
              <span className="font-serif text-lg font-semibold text-sidebar-foreground">Silva & Associados</span>
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
              <h1 className="font-serif text-xl font-semibold text-foreground">Casos</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Caso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-serif">{editingCase ? "Editar Caso" : "Novo Caso"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Título do caso *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente *" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as CaseStatus })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Descrição"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    {editingCase ? "Salvar Alterações" : "Cadastrar Caso"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-4 lg:p-8">
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
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{c.title}</p>
                          <p className="text-sm text-muted-foreground">{c.clients?.full_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={statusColors[c.status]}>{statusLabels[c.status]}</Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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

export default Cases;
