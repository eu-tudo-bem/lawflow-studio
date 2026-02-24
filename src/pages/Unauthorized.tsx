import { useNavigate } from "react-router-dom";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <ShieldX className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
          Acesso Não Autorizado
        </h1>
        <p className="text-muted-foreground mb-6">
          Você não tem permissão para acessar esta página. Verifique suas credenciais ou entre em contato com o administrador.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            Página Inicial
          </Button>
          <Button onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
