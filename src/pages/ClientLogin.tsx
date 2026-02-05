import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Scale, Mail, Lock, ArrowLeft, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user has client role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .eq("role", "client")
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        throw new Error("Esta área é exclusiva para clientes. Se você é advogado, use o login da área restrita.");
      }

      toast({
        title: "Bem-vindo!",
        description: "Acesso ao portal do cliente realizado com sucesso.",
      });

      navigate("/client-portal");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>

          <div className="bg-card rounded-2xl p-8 shadow-card">
            <div className="flex items-center gap-3 mb-8">
              <User className="h-8 w-8 text-primary" />
              <div>
                <span className="font-serif text-xl font-semibold text-foreground">
                  Portal do Cliente
                </span>
                <p className="text-xs text-muted-foreground">Silva & Associados</p>
              </div>
            </div>

            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
              Acesse seu portal
            </h1>
            <p className="text-muted-foreground mb-6">
              Acompanhe seus casos, agendamentos e converse com seu advogado.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar no Portal"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                É advogado?{" "}
                <Link to="/login" className="text-accent hover:underline">
                  Acesse a área restrita
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <User className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">
            Portal do Cliente
          </h2>
          <p className="text-primary-foreground/70">
            Acompanhe o andamento dos seus processos, agende consultas e 
            comunique-se diretamente com seu advogado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
