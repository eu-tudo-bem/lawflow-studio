import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

const ClientMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Get client info
      const { data: clientData } = await supabase
        .from("clients")
        .select("id, created_by")
        .eq("user_id", user.id)
        .maybeSingle();

      if (clientData) {
        setClientId(clientData.id);
      }

      // Fetch messages
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && messagesData) {
        setMessages(messagesData);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("messages")
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
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    const markAsRead = async () => {
      if (!user) return;
      
      const unreadIds = messages
        .filter((m) => m.receiver_id === user.id && !m.read)
        .map((m) => m.id);

      if (unreadIds.length > 0) {
        await supabase
          .from("messages")
          .update({ read: true })
          .in("id", unreadIds);
      }
    };

    markAsRead();
  }, [messages, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !clientId) return;

    setSending(true);

    // Get the lawyer (created_by) for this client
    const { data: clientData } = await supabase
      .from("clients")
      .select("created_by")
      .eq("id", clientId)
      .single();

    if (!clientData?.created_by) {
      toast({
        title: "Erro",
        description: "Não foi possível encontrar seu advogado responsável.",
        variant: "destructive",
      });
      setSending(false);
      return;
    }

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: clientData.created_by,
      client_id: clientId,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Mensagens</h1>
        <p className="text-muted-foreground">Comunique-se com seu advogado</p>
      </div>

      <Card className="h-[calc(100vh-280px)] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5" />
            Conversa com seu Advogado
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
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
      </Card>
    </div>
  );
};

export default ClientMessages;
