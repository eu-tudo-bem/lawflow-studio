import { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface Message {
  id: string; full_name: string; email: string; phone: string;
  message: string; read: boolean; created_at: string;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => { if (user) loadMessages(); }, [user]);

  const loadMessages = async () => {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("contact_submissions").update({ read: true }).eq("id", id);
    if (!error) { toast({ title: "Mensagem marcada como lida!" }); loadMessages(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta mensagem?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (!error) { toast({ title: "Mensagem excluída!" }); loadMessages(); }
  };

  return (
    <DashboardLayout title="Mensagens do Site">
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
                        <span className="text-accent font-semibold">{msg.full_name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{msg.full_name}</p>
                          {!msg.read && <Badge className="bg-accent text-accent-foreground text-xs">Nova</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.email} • {msg.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {!msg.read && (
                        <Button variant="ghost" size="icon" onClick={() => markAsRead(msg.id)} title="Marcar como lida"><Check className="h-4 w-4" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(msg.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                  <p className="text-foreground ml-13 pl-13">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Messages;
