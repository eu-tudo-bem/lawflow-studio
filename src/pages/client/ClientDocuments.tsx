import { useEffect, useState } from "react";
import { Upload, FileText, Clock, Search, CheckCircle, Send, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const statusConfig: Record<string, { label: string; icon: typeof Clock; variant: "secondary" | "default" | "outline" | "destructive" }> = {
  submitted: { label: "Enviado", icon: Send, variant: "secondary" },
  analyzing: { label: "Em Análise", icon: Search, variant: "default" },
  in_review: { label: "Em Revisão", icon: Clock, variant: "default" },
  completed: { label: "Concluído", icon: CheckCircle, variant: "outline" },
};

const legalAreas = [
  { value: "bancario", label: "Bancário" },
  { value: "trabalhista", label: "Trabalhista" },
  { value: "empresarial", label: "Empresarial" },
  { value: "consumidor", label: "Consumidor" },
  { value: "familia", label: "Família" },
  { value: "imobiliario", label: "Imobiliário" },
  { value: "tributario", label: "Tributário" },
  { value: "outro", label: "Outro" },
];

interface Submission {
  id: string;
  description: string;
  legal_area: string;
  status: string;
  created_at: string;
}

const ClientDocuments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [description, setDescription] = useState("");
  const [legalArea, setLegalArea] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Get client id
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (client) {
        setClientId(client.id);
        const { data } = await supabase
          .from("document_submissions")
          .select("*")
          .eq("client_id", client.id)
          .order("created_at", { ascending: false });
        if (data) setSubmissions(data as Submission[]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_DESCRIPTION_LENGTH = 2000;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];
      const valid = newFiles.filter(f => {
        if (!allowed.includes(f.type)) return false;
        if (f.size > MAX_FILE_SIZE) {
          toast({ title: `Arquivo "${f.name}" excede 10MB`, description: "O tamanho máximo por arquivo é 10MB.", variant: "destructive" });
          return false;
        }
        return true;
      });
      if (valid.length !== newFiles.length && valid.length < newFiles.length) {
        const invalidType = newFiles.filter(f => !allowed.includes(f.type));
        if (invalidType.length > 0) {
          toast({ title: "Alguns arquivos ignorados", description: "Apenas PDF, DOCX, JPG e PNG são aceitos.", variant: "destructive" });
        }
      }
      setFiles(prev => [...prev, ...valid]);
    }
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!clientId || !description.trim() || !legalArea || files.length === 0) {
      toast({ title: "Preencha todos os campos", description: "Descrição, área jurídica e pelo menos um documento são obrigatórios.", variant: "destructive" });
      return;
    }
    if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
      toast({ title: "Descrição muito longa", description: `Máximo de ${MAX_DESCRIPTION_LENGTH} caracteres.`, variant: "destructive" });
      return;
    }
    if (files.some(f => f.size > MAX_FILE_SIZE)) {
      toast({ title: "Arquivo excede o limite", description: "O tamanho máximo por arquivo é 10MB.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Create submission
      const { data: submission, error: subError } = await supabase
        .from("document_submissions")
        .insert({ client_id: clientId, description, legal_area: legalArea as any })
        .select()
        .single();

      if (subError || !submission) throw subError;

      // Upload files
      for (const file of files) {
        const filePath = `${user!.id}/${submission.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("client-documents")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        await supabase.from("submission_documents").insert({
          submission_id: submission.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
        });
      }

      // Trigger AI analysis
      const { error: fnError } = await supabase.functions.invoke("analyze-documents", {
        body: { submission_id: submission.id },
      });

      if (fnError) console.error("Analysis trigger error:", fnError);

      setSubmissions(prev => [submission as Submission, ...prev]);
      setShowForm(false);
      setDescription("");
      setLegalArea("");
      setFiles([]);
      toast({ title: "Documentos enviados!", description: "Sua análise está sendo processada." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao enviar", description: "Tente novamente.", variant: "destructive" });
    }
    setSubmitting(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Enviar Documentos</h1>
          <p className="text-muted-foreground">Envie documentos para análise jurídica</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Nova Submissão
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enviar Documentos para Análise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Área do Direito *</Label>
              <Select value={legalArea} onValueChange={setLegalArea}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {legalAreas.map(a => (
                    <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Descrição do Problema *</Label>
              <Textarea
                placeholder="Descreva seu caso em detalhes..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label>Documentos * (PDF, DOCX, JPG, PNG)</Label>
              <Input
                type="file"
                multiple
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="mt-1"
              />
              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate">{f.name}</span>
                      <span className="text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => removeFile(i)}><X className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setShowForm(false); setFiles([]); }}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Enviar para Análise
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions list */}
      {submissions.length === 0 && !showForm ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhuma submissão</h3>
            <p className="text-muted-foreground text-center">Envie documentos para receber uma análise jurídica.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map(sub => {
            const status = statusConfig[sub.status] || statusConfig.submitted;
            const StatusIcon = status.icon;
            const area = legalAreas.find(a => a.value === sub.legal_area);
            return (
              <Card key={sub.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{area?.label || sub.legal_area}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Enviado em {new Date(sub.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge variant={status.variant} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{sub.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientDocuments;
