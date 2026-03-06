import { useEffect, useState } from "react";
import { FileText, Download, TrendingUp, Users, BarChart3, RefreshCw, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { DOCUMENT_TYPES } from "@/data/documentTypes";

interface DocGenRow {
  id: string;
  document_type: string;
  document_label: string;
  lead_name: string;
  lead_email: string;
  lead_whatsapp: string;
  converted: boolean;
  created_at: string;
}

const DocumentosAdmin = () => {
  const [rows, setRows] = useState<DocGenRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("document_generations" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setRows((data || []) as unknown as DocGenRow[]);
    setLoading(false);
  };

  // Stats
  const total = rows.length;
  const converted = rows.filter((r) => r.converted).length;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  const byType: Record<string, number> = {};
  rows.forEach((r) => { byType[r.document_type] = (byType[r.document_type] || 0) + 1; });
  const sortedTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]);

  const recentRows = rows.slice(0, 20);

  return (
    <DashboardLayout
      title="Gerador de Documentos"
      headerActions={
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Download, label: "Documentos Gerados", value: total, color: "text-accent" },
          { icon: Users, label: "Leads Capturados", value: total, color: "text-blue-600" },
          { icon: MessageCircle, label: "Conversões (WhatsApp)", value: converted, color: "text-green-600" },
          { icon: TrendingUp, label: "Taxa de Conversão", value: `${conversionRate}%`, color: "text-purple-600" },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Most used document types */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="font-serif text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Tipos mais gerados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum documento gerado ainda.</p>
            ) : (
              <div className="space-y-3">
                {sortedTypes.slice(0, 7).map(([slug, count]) => {
                  const docType = DOCUMENT_TYPES.find((d) => d.slug === slug);
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={slug}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground truncate max-w-[75%]">
                          {docType?.shortLabel || slug}
                        </span>
                        <span className="text-xs text-muted-foreground">{count} · {pct}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available document types */}
        <Card className="border-0 shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Documentos disponíveis ({DOCUMENT_TYPES.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DOCUMENT_TYPES.map((doc) => (
                <a
                  key={doc.slug}
                  href={`/gerador-${doc.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors text-sm"
                >
                  <span aria-hidden="true">{doc.icon}</span>
                  <span className="text-foreground font-medium truncate">{doc.shortLabel}</span>
                  <Badge variant="outline" className="ml-auto text-xs shrink-0">
                    {byType[doc.slug] || 0}
                  </Badge>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent leads */}
      <Card className="border-0 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Leads Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : recentRows.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhum documento gerado ainda.</p>
              <a href="/gerador-documentos" target="_blank" className="text-sm text-accent hover:underline mt-1 inline-block">
                Acessar o Gerador de Documentos →
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Data</th>
                    <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Documento</th>
                    <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Nome</th>
                    <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">E-mail</th>
                    <th className="text-left py-2 text-xs font-semibold text-muted-foreground">WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRows.map((row) => {
                    const docType = DOCUMENT_TYPES.find((d) => d.slug === row.document_type);
                    return (
                      <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                          {new Date(row.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="flex items-center gap-1.5">
                            <span aria-hidden="true">{docType?.icon}</span>
                            <span className="truncate max-w-[120px]">{docType?.shortLabel || row.document_type}</span>
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-medium text-foreground">{row.lead_name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{row.lead_email}</td>
                        <td className="py-3">
                          <a
                            href={`https://wa.me/${row.lead_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${row.lead_name}! Vi que você gerou um documento em nosso site. Posso te ajudar com orientação jurídica?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            {row.lead_whatsapp}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DocumentosAdmin;
