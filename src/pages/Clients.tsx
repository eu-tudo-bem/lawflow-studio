import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Key, UserPlus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";

interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  cpf: string | null;
  address: string | null;
  notes: string | null;
  user_id: string | null;
  created_at: string;
}

const Clients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [createWithAccess, setCreateWithAccess] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [formData, setFormData] = useState({
    full_name: "", email: "", phone: "", cpf: "", address: "", notes: "", password: "",
  });

  useEffect(() => {
    if (user) loadClients();
  }, [user]);

  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (data) setClients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        const { error } = await supabase.from("clients").update({
          full_name: formData.full_name, email: formData.email, phone: formData.phone,
          cpf: formData.cpf || null, address: formData.address || null, notes: formData.notes || null,
        }).eq("id", editingClient.id);
        if (error) throw error;
        toast({ title: "Cliente atualizado!" });
      } else if (createWithAccess) {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-client-account`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session?.access_token}` },
            body: JSON.stringify({
              email: formData.email, password: formData.password, full_name: formData.full_name,
              phone: formData.phone, cpf: formData.cpf || undefined, address: formData.address || undefined,
              notes: formData.notes || undefined,
            }),
          }
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setGeneratedPassword(formData.password);
        setShowPasswordDialog(true);
      } else {
        const { error } = await supabase.from("clients").insert({
          full_name: formData.full_name, email: formData.email, phone: formData.phone,
          cpf: formData.cpf || null, address: formData.address || null, notes: formData.notes || null,
          created_by: user?.id,
        });
        if (error) throw error;
        toast({ title: "Cliente cadastrado!" });
      }
      setIsDialogOpen(false);
      resetForm();
      loadClients();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setCreateWithAccess(false);
    setFormData({
      full_name: client.full_name, email: client.email, phone: client.phone,
      cpf: client.cpf || "", address: client.address || "", notes: client.notes || "", password: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este cliente?")) return;
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    } else {
      toast({ title: "Cliente excluído!" });
      loadClients();
    }
  };

  const resetForm = () => {
    setEditingClient(null);
    setCreateWithAccess(false);
    setFormData({ full_name: "", email: "", phone: "", cpf: "", address: "", notes: "", password: "" });
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      toast({ title: "Senha copiada para a área de transferência!" });
    } catch {
      toast({ title: "Erro ao copiar", description: "Copie a senha manualmente.", variant: "destructive" });
    }
  };

  const handleClosePasswordDialog = () => {
    setShowPasswordDialog(false);
    setGeneratedPassword("");
  };

  const filteredClients = clients.filter(
    (c) => c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Clientes"
      headerActions={
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">{editingClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
              {!editingClient && <DialogDescription>Cadastre um novo cliente. Opcionalmente, crie acesso ao portal.</DialogDescription>}
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Nome completo *" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input type="email" placeholder="E-mail *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <Input placeholder="Telefone *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              </div>
              <Input placeholder="CPF" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} />
              <Input placeholder="Endereço" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              <Textarea placeholder="Observações" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
              {!editingClient && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="createWithAccess" checked={createWithAccess} onCheckedChange={(checked) => setCreateWithAccess(checked === true)} />
                    <Label htmlFor="createWithAccess" className="flex items-center gap-2 cursor-pointer">
                      <Key className="h-4 w-4" />
                      Criar acesso ao Portal do Cliente
                    </Label>
                  </div>
                  {createWithAccess && (
                    <div className="pl-6">
                      <Input type="password" placeholder="Senha para o cliente *" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={createWithAccess} minLength={6} />
                      <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres. Compartilhe esta senha com o cliente.</p>
                    </div>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {editingClient ? "Salvar Alterações" : createWithAccess ? "Cadastrar com Acesso" : "Cadastrar Cliente"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Buscar clientes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 max-w-md" />
      </div>

      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {filteredClients.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum cliente encontrado.</div>
          ) : (
            <div className="divide-y divide-border">
              {filteredClients.map((client) => (
                <div key={client.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-semibold">{client.full_name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{client.full_name}</p>
                        {client.user_id && (
                          <Badge variant="outline" className="text-xs"><Key className="h-3 w-3 mr-1" />Portal</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{client.email} • {client.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={handleClosePasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Conta Criada com Sucesso</DialogTitle>
            <DialogDescription>Compartilhe a senha abaixo com o cliente de forma segura.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <code className="flex-1 text-sm font-mono break-all">{generatedPassword}</code>
              <Button variant="outline" size="icon" onClick={handleCopyPassword}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Oriente o cliente a alterar a senha no primeiro acesso.
            </p>
            <Button className="w-full" onClick={handleClosePasswordDialog}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Clients;
