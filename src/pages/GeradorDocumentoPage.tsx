import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { WHATSAPP_NUMBER, whatsappUrl } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Scale, MessageCircle, Download, CheckCircle, ArrowRight,
  Home, ChevronRight, HelpCircle, FileText, Loader2, ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePageSEO } from "@/hooks/usePageSEO";
import { supabase } from "@/integrations/supabase/client";
import { generateDocumentPDF } from "@/lib/pdfGenerator";
import { leadCaptureSchema, getDocumentTypeBySlug, type DocumentType } from "@/data/documentTypes";
import { trackConversion } from "@/lib/trackConversion";

const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}?text=`;

interface Props { docTypeSlug: string; }

// Dynamic form schema builder
function buildFormSchema(docType: DocumentType) {
  const shape: Record<string, z.ZodString> = {};
  docType.fields.forEach((f) => {
    let rule = z.string().trim();
    if (f.required) {
      rule = rule.min(1, `${f.label} é obrigatório`) as z.ZodString;
    } else {
      rule = rule.optional() as unknown as z.ZodString;
    }
    shape[f.id] = rule;
  });
  return z.object(shape);
}

const GeradorDocumentoPage = ({ docTypeSlug }: Props) => {
  const docType = getDocumentTypeBySlug(docTypeSlug);
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "lead" | "done">("form");
  const [formDataSnapshot, setFormDataSnapshot] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);

  const metaTitle = docType?.metaTitle ?? "";
  const metaDesc = docType?.metaDescription ?? "";
  const canonical = docType ? `https://fernandezefernandes.adv.br/gerador-${docType.slug}` : "";

  usePageSEO({ title: metaTitle, description: metaDesc, canonical, robots: "index, follow" });

  // FAQ schema
  useEffect(() => {
    if (!docType) return;
    const id = "doc-faq-schema";
    document.getElementById(id)?.remove();
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: docType.faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    };
    const s = document.createElement("script");
    s.id = id; s.type = "application/ld+json"; s.text = JSON.stringify(schema);
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, [docTypeSlug]);

  // Form for the document fields
  const formSchema = docType ? buildFormSchema(docType) : z.object({});
  const docForm = useForm({ resolver: zodResolver(formSchema), mode: "onChange" });

  // Form for lead capture
  const leadForm = useForm({ resolver: zodResolver(leadCaptureSchema), mode: "onChange" });

  if (!docType) return <Navigate to="/gerador-documentos" replace />;

  const onDocFormSubmit = (data: Record<string, string>) => {
    setFormDataSnapshot(data);
    setStep("lead");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onLeadSubmit = async (leadData: z.infer<typeof leadCaptureSchema>) => {
    setGenerating(true);
    try {
      // 1. Save lead to DB
      await supabase.from("document_generations" as any).insert({
        document_type: docType.slug,
        document_label: docType.label,
        lead_name: leadData.lead_name,
        lead_email: leadData.lead_email,
        lead_whatsapp: leadData.lead_whatsapp,
        form_data: formDataSnapshot,
      });

      // 2. Generate PDF
      const pdf = generateDocumentPDF(docType, formDataSnapshot);
      const fileName = `${docType.slug}-${Date.now()}.pdf`;
      pdf.save(fileName);

      // 3. Track conversion
      trackConversion("form_submit", `documento_${docType.slug}`);

      // 4. GTM event
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "document_generated",
          document_type: docType.slug,
          lead_email: leadData.lead_email,
        });
      }

      setStep("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast({ title: "Erro ao gerar documento", description: "Tente novamente em instantes.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Olá! Gerei um ${docType.label} no site e gostaria de orientação jurídica sobre o meu caso.`
  );
  const whatsappLink = WHATSAPP_BASE + whatsappMsg;

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)] py-4 px-4 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Scale className="h-6 w-6 text-[hsl(45_60%_55%)]" />
            <span className="font-serif font-semibold text-lg">Fernandez & Fernandes</span>
          </Link>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#1ebe5d] transition-colors">
            <MessageCircle className="h-4 w-4" /> Falar Agora
          </a>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-[hsl(220_30%_97%)] border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
            <li><Link to="/" className="flex items-center gap-1 hover:text-foreground"><Home className="h-3 w-3" /> Início</Link></li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li><Link to="/gerador-documentos" className="hover:text-foreground">Gerador de Documentos</Link></li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="text-foreground font-medium">{docType.shortLabel}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)] py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <span className="text-4xl mb-4 block" aria-hidden="true">{docType.icon}</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Gerar{" "}
            <span className="text-[hsl(45_60%_55%)]">{docType.shortLabel}</span>
          </h1>
          <p className="text-[hsl(45_20%_95%)]/80 text-lg mb-6 max-w-2xl mx-auto">{docType.description}</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-[hsl(45_20%_95%)]/70">
            <span>✅ Gratuito</span>
            <span>📄 PDF instantâneo</span>
            <span>🔒 Dados protegidos</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-3xl py-12">
        {/* ── Step: Form ─────────────────────────────────────────────── */}
        {step === "form" && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold">1</div>
              <span className="font-semibold text-foreground">Preencha os dados do documento</span>
            </div>

            <form onSubmit={docForm.handleSubmit(onDocFormSubmit as any)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docType.fields.map((field) => (
                  <div key={field.id} className={field.colSpan === "full" ? "md:col-span-2" : ""}>
                    <Label htmlFor={field.id} className="text-sm font-medium text-foreground mb-1 block">
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        className="resize-none min-h-[80px]"
                        {...(docForm.register as any)(field.id)}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                        placeholder={field.placeholder}
                        {...(docForm.register as any)(field.id)}
                      />
                    )}
                    {(docForm.formState.errors as any)[field.id] && (
                      <p className="text-xs text-destructive mt-1">
                        {((docForm.formState.errors as any)[field.id] as any).message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <Button type="submit" size="lg" className="w-full bg-[hsl(220_50%_12%)] hover:bg-[hsl(220_50%_18%)] text-[hsl(45_20%_95%)]">
                Continuar e Gerar Documento <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        )}

        {/* ── Step: Lead capture ─────────────────────────────────── */}
        {step === "lead" && (
          <div>
            <div className="bg-[hsl(220_30%_97%)] rounded-2xl border border-border p-6 mb-6 text-center">
              <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h2 className="font-serif text-xl font-bold text-foreground mb-2">Quase pronto!</h2>
              <p className="text-muted-foreground text-sm">
                Informe seus dados para baixar o documento gratuitamente.
                Usamos apenas para envio de orientação jurídica, se desejar.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold">2</div>
              <span className="font-semibold text-foreground">Seus dados para o download</span>
            </div>

            <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="lead_name">Nome completo <span className="text-destructive">*</span></Label>
                <Input id="lead_name" placeholder="Seu nome completo" {...leadForm.register("lead_name")} className="mt-1" />
                {leadForm.formState.errors.lead_name && (
                  <p className="text-xs text-destructive mt-1">{String(leadForm.formState.errors.lead_name.message)}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lead_email">E-mail <span className="text-destructive">*</span></Label>
                <Input id="lead_email" type="email" placeholder="seu@email.com" {...leadForm.register("lead_email")} className="mt-1" />
                {leadForm.formState.errors.lead_email && (
                  <p className="text-xs text-destructive mt-1">{String(leadForm.formState.errors.lead_email.message)}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lead_whatsapp">WhatsApp <span className="text-destructive">*</span></Label>
                <Input id="lead_whatsapp" placeholder="(41) 99999-9999" {...leadForm.register("lead_whatsapp")} className="mt-1" />
                {leadForm.formState.errors.lead_whatsapp && (
                  <p className="text-xs text-destructive mt-1">{String(leadForm.formState.errors.lead_whatsapp.message)}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep("form")} className="flex-1">
                  Voltar
                </Button>
                <Button type="submit" disabled={generating} className="flex-1 bg-[hsl(220_50%_12%)] hover:bg-[hsl(220_50%_18%)] text-[hsl(45_20%_95%)]">
                  {generating ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Gerando…</>
                  ) : (
                    <><Download className="h-4 w-4 mr-2" /> Baixar PDF Grátis</>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                🔒 Seus dados são protegidos. Não enviamos spam.
              </p>
            </form>
          </div>
        )}

        {/* ── Step: Done ─────────────────────────────────────────── */}
        {step === "done" && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
              Documento Gerado com Sucesso!
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              O download do seu <strong>{docType.shortLabel}</strong> foi iniciado. Verifique sua pasta de downloads.
            </p>

            {/* CTA Box */}
            <div className="bg-[hsl(220_30%_97%)] rounded-2xl border border-border p-6 mb-8 text-left max-w-lg mx-auto">
              <h3 className="font-serif font-bold text-foreground mb-2">
                ⚠️ Seu documento foi gerado. Um advogado pode revisar para evitar erros.
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Documentos jurídicos mal preenchidos podem ser inválidos. Nossa equipe revisa e orienta você gratuitamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackConversion("whatsapp_click", `documento_${docType.slug}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#1ebe5d] transition-all text-sm"
                >
                  <MessageCircle className="h-5 w-5" /> Falar com Advogado
                </a>
                <a
                  href={"https://wa.me/5541995808145?text=" + encodeURIComponent("Gostaria de solicitar análise jurídica do documento que gerei no site.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-border text-foreground font-semibold px-5 py-3 rounded-xl hover:border-accent transition-all text-sm"
                >
                  <FileText className="h-4 w-4" /> Solicitar Análise
                </a>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => { setStep("form"); setFormDataSnapshot({}); docForm.reset(); leadForm.reset(); }}
            >
              Gerar outro documento
            </Button>
          </div>
        )}
      </div>

      {/* About + When to use */}
      {step === "form" && (
        <section className="bg-[hsl(220_30%_97%)] py-12 border-t border-border">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground mb-3">
                  O que é {docType.shortLabel}?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{docType.description}</p>
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground mb-3">Quando utilizar?</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{docType.whenToUse}</p>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="font-serif text-lg font-bold text-foreground mb-3">Como funciona?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{docType.howItWorks}</p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-serif text-xl font-bold text-foreground mb-6 text-center">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {docType.faq.map(({ q, a }) => (
              <div key={q} className="bg-[hsl(220_30%_97%)] rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-[hsl(45_60%_55%)] shrink-0 mt-0.5" />
                  {q}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed pl-7">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="py-12 bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)]">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="font-serif text-xl font-bold mb-3">Precisa de orientação jurídica personalizada?</h2>
          <p className="text-[hsl(45_20%_95%)]/70 text-sm mb-6">
            Nossos advogados analisam seu caso gratuitamente e indicam o melhor caminho.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#1ebe5d] transition-all hover:scale-105 shadow-lg">
            <MessageCircle className="h-5 w-5" /> Consulta Gratuita via WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(220_50%_8%)] text-[hsl(45_20%_95%)]/60 py-8 px-4 text-center text-sm">
        <p className="mb-2">© {new Date().getFullYear()} Fernandez & Fernandes Advocacia & Consultoria · OAB/PR</p>
        <Link to="/" className="text-[hsl(45_60%_55%)] hover:underline">Acessar site completo</Link>
      </footer>
    </div>
  );
};

export default GeradorDocumentoPage;
