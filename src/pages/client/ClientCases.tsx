import { useEffect, useState } from "react";
import { Briefcase, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

type Case = Tables<"cases">;

const statusConfig = {
  pending: { label: "Pendente", icon: Clock, variant: "secondary" as const },
  in_progress: { label: "Em Andamento", icon: AlertCircle, variant: "default" as const },
  completed: { label: "Concluído", icon: CheckCircle, variant: "outline" as const },
  cancelled: { label: "Cancelado", icon: XCircle, variant: "destructive" as const },
};

const ClientCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCases(data);
      }
      setLoading(false);
    };

    fetchCases();
  }, [user]);

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
        <h1 className="font-serif text-2xl font-bold text-foreground">Meus Casos</h1>
        <p className="text-muted-foreground">Acompanhe o andamento dos seus processos</p>
      </div>

      {cases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum caso encontrado</h3>
            <p className="text-muted-foreground text-center">
              Você ainda não possui casos registrados. Entre em contato com seu advogado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cases.map((caseItem) => {
            const status = statusConfig[caseItem.status];
            const StatusIcon = status.icon;
            
            return (
              <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Aberto em {new Date(caseItem.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge variant={status.variant} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                {caseItem.description && (
                  <CardContent>
                    <p className="text-muted-foreground">{caseItem.description}</p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientCases;
