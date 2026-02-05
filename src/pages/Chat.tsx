import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scale, Users, Briefcase, Calendar, Mail, LogOut, 
  Menu, X, ArrowLeft, Send, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  client_id: string | null;
  content: string;
  read: boolean;
  created_at: string;
}

interface Client {
  id: string;
  full_name: string;
  email: string;
  user_id: string | null;
}

const Chat = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load clients with portal access
  useEffect(() => {
    const loadClients = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("clients")
        .select("id, full_name, email, user_id")
        .not("user_id", "is", null)
        .order("full_name");
      
      if (data) {
        setClients(data);
      }
    };

    loadClients();
  }, [user]);

  // Load unread message counts
  useEffect(() => {
    const loadUnreadCounts = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("messages")
        .select("client_id")
        .eq("receiver_id", user.id)
        .eq("read", false);

      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((msg) => {
          if (msg.client_id) {
            counts[msg.client_id] = (counts[msg.client_id] || 0) + 1;
          }
        });
        setUnreadCounts(counts);
      }
    };

    loadUnreadCounts();
  }, [user, messages]);

  // Load messages for selected client
  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !selectedClient) return;

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("client_id", selectedClient.id)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data);
        
        // Mark as read
        const unreadIds = data
          .filter((m) => m.receiver_id === user.id && !m.read)
          .map((m) => m.id);

        if (unreadIds.length > 0) {
          await supabase
            .from("messages")
            .update({ read: true })
            .in("id", unreadIds);
        }
      }
    };

    loadMessages();
  }, [user, selectedClient]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("lawyer-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id === user.id || newMsg.receiver_id === user.id) {
            if (selectedClient && newMsg.client_id === selectedClient.id) {
              setMessages((prev) => [...prev, newMsg]);
              // Mark as read immediately if viewing this conversation
              if (newMsg.receiver_id === user.id) {
                supabase
                  .from("messages")
                  .update({ read: true })
                  .eq("id", newMsg.id);
              }
            } else {
              // Update unread count for other clients
              if (newMsg.receiver_id === user.id && newMsg.client_id) {
                setUnreadCounts((prev) => ({
                  ...prev,
                  [newMsg.client_id!]: (prev[newMsg.client_id!] || 0) + 1,
                }));
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedClient]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !selectedClient?.user_id) return;

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedClient.user_id,
      client_id: selectedClient.id,
      content: newMessage.trim(),
    });

    if (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }

    setSending(false);
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
    { icon: Mail, label: "Contatos do Site", href: "/dashboard/messages" },
    { icon: MessageSquare, label: "Chat com Clientes", href: "/dashboard/chat", active: true },
  ];

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

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
              <h1 className="font-serif text-xl font-semibold text-foreground">
                Chat com Clientes
                {totalUnread > 0 && (
                  <Badge className="ml-2 bg-accent text-accent-foreground">{totalUnread}</Badge>
                )}
              </h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
            {/* Client List */}
            <Card className="border-0 shadow-card overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Clientes com Portal</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-[calc(100vh-280px)]">
                {clients.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhum cliente com acesso ao portal.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className={`w-full p-4 text-left hover:bg-accent/5 transition-colors ${
                          selectedClient?.id === client.id ? "bg-accent/10" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{client.full_name}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                          {unreadCounts[client.id] > 0 && (
                            <Badge className="bg-accent text-accent-foreground">
                              {unreadCounts[client.id]}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2 border-0 shadow-card flex flex-col">
              {selectedClient ? (
                <>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageSquare className="h-5 w-5" />
                      {selectedClient.full_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-380px)]">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-4" />
                        <p>Nenhuma mensagem ainda</p>
                        <p className="text-sm">Envie uma mensagem para iniciar a conversa</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.sender_id === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                isOwn
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                                }`}
                              >
                                {new Date(message.created_at).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </CardContent>
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="min-h-[60px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                      <Button type="submit" disabled={sending || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mb-4" />
                  <p className="text-lg">Selecione um cliente</p>
                  <p className="text-sm">para visualizar a conversa</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
