import { useState } from "react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import logoImg from "@/assets/logo.png";
import {
  Shield,
  Clock,
  CheckCircle,
  Phone,
  MessageCircle,
  Building2,
  FileText,
  Star,
  ArrowRight,
  Send,
  Eye,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Scale,
  ListChecks,
} from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5511999999999?text=Olá! Preciso de ajuda com cobrança de aluguel atrasado.";
const PHONE_NUMBER = "tel:+551130000000";

const formSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  cidade: z.string().trim().min(1, "Cidade é obrigatória").max(100),
  valorDivida: z.string().trim().max(50).optional(),
  descricao: z.string().trim().max(500).optional(),
});

const trackConversion = (event: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, {
      event_category: "conversao",
      event_label: "cobranca_aluguel",
    });
  }
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", event === "form_submit" ? "Lead" : "Contact");
  }
};

const CobrancaAluguel = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cidade: "",
    valorDivida: "",
    descricao: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  usePageSEO({
    title: "Advogado Cobrança de Aluguel Atrasado | Fernandez & Fernandes",
    description:
      "Inquilino não paga aluguel? Advogados especializados em cobrança de aluguel atrasado, ação de despejo e execução de contrato de locação. Fale agora.",
    canonical: "https://fernandezefernandes.adv.br/cobranca-aluguel",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validated = formSchema.parse(formData);
      const { error } = await supabase.from("contact_submissions").insert({
        full_name: validated.nome,
        phone: validated.telefone,
        email: `${validated.telefone.replace(/\D/g, "")}@lead.aluguel`,
        message: `[LP Cobrança Aluguel] Cidade: ${validated.cidade}. Valor aprox. da dívida: ${validated.valorDivida || "Não informado"}. ${validated.descricao || "Sem descrição adicional."}`,
      });
      if (error) throw error;
      trackConversion("form_submit");
      setIsSubmitted(true);
      toast({
        title: "Solicitação enviada!",
        description: "Um advogado entrará em contato em breve.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Verifique os dados",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao enviar",
          description: "Tente novamente ou entre em contato por WhatsApp.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    trackConversion("whatsapp_click");
    window.open(WHATSAPP_URL, "_blank");
  };

  const handlePhoneClick = () => {
    trackConversion("phone_click");
    window.location.href = PHONE_NUMBER;
  };

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal top bar */}
      <header className="bg-primary py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Fernandez & Fernandes Logo" className="h-9 w-9" />
            <div>
              <span className="font-serif text-lg font-bold text-primary-foreground">
                Fernandez & Fernandes
              </span>
              <p className="text-xs text-primary-foreground/60">Advocacia & Consultoria</p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleWhatsAppClick}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            WhatsApp
          </Button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="bg-hero py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-accent/20 text-accent rounded-full">
                Advocacia Especializada em Direito Imobiliário
              </span>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Inquilino Não Paga Aluguel?{" "}
                <span className="text-gradient-gold">
                  Saiba Como Cobrar Legalmente
                </span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Recupere valores atrasados e regularize seu imóvel com segurança
                jurídica. Atuação estratégica para proprietários e investidores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-gold"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Falar com Advogado Especialista
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
                  onClick={scrollToForm}
                >
                  Cobrar Aluguel Atrasado Agora
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* O QUE FAZER */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-8 text-center">
                Cobrança de Aluguel Atrasado: O Que Você Precisa Saber
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <AlertTriangle className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    O Que Fazer Quando o Inquilino Não Paga?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    O primeiro passo é buscar orientação jurídica especializada.
                    Existem medidas legais eficazes para cobrar o aluguel atrasado
                    e, se necessário, reaver o imóvel — sem precisar esperar
                    indefinidamente.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Scale className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Quando Cabe Ação de Despejo?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A ação de despejo por falta de pagamento pode ser proposta logo
                    após o vencimento do aluguel. É possível solicitar despejo
                    liminar em até 15 dias, garantindo agilidade na retomada do
                    imóvel.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <FileText className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Execução de Contrato de Locação
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Se o contrato de aluguel possui cláusulas que configuram título
                    executivo, é possível executar diretamente os valores devidos,
                    acelerando a recuperação do crédito sem necessidade de ação de
                    conhecimento.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Clock className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Cobrança Judicial Rápida
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Com a estratégia jurídica adequada, é possível cumular o pedido
                    de despejo com a cobrança dos aluguéis atrasados na mesma ação,
                    otimizando tempo e custos para o proprietário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-10 text-center">
                Como Funciona o Processo
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: "01",
                    title: "Análise do Contrato",
                    desc: "Avaliamos o contrato de locação, garantias e débitos para definir a melhor estratégia.",
                  },
                  {
                    step: "02",
                    title: "Notificação",
                    desc: "Notificamos formalmente o inquilino, buscando uma solução rápida antes da via judicial.",
                  },
                  {
                    step: "03",
                    title: "Ação Judicial",
                    desc: "Se necessário, ingressamos com ação de despejo e/ou cobrança para recuperar seus valores.",
                  },
                  {
                    step: "04",
                    title: "Recuperação do Crédito",
                    desc: "Acompanhamos até a efetiva recuperação dos aluguéis e regularização do imóvel.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-6 text-center shadow-card relative"
                  >
                    <span className="text-5xl font-bold text-accent/15 absolute top-3 right-4 font-serif">
                      {item.step}
                    </span>
                    <div className="relative z-10">
                      <ListChecks className="h-7 w-7 text-accent mx-auto mb-3" />
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA intermediário */}
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Cada dia sem cobrar é dinheiro perdido.
            </h2>
            <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
              Não espere o prejuízo aumentar. Fale agora com um advogado
              especialista em cobrança de aluguel.
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-gold"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Falar com Advogado Especialista
            </Button>
          </div>
        </section>

        {/* SEÇÃO INVESTIDOR / PATRIMÔNIO */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4">
                  Proteja Seu Patrimônio e Sua Renda
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Se você é proprietário ou investidor imobiliário, cada mês de
                  inadimplência compromete sua rentabilidade. Atuamos para
                  minimizar seu prejuízo e proteger seu investimento.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <Building2 className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Imóvel Parado = Prejuízo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enquanto o inquilino inadimplente ocupa seu imóvel, você paga
                    condomínio, IPTU e perde a receita do aluguel.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <DollarSign className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Recuperação de Valores
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cobramos judicialmente todos os valores devidos: aluguéis,
                    encargos, multas e indenizações previstas em contrato.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <TrendingUp className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Proteção do Investimento
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Atuação preventiva e corretiva para que seu patrimônio
                    imobiliário continue gerando renda com segurança.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AUTORIDADE */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4">
                Por Que Escolher a Fernandez & Fernandes?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experiência consolidada em Direito Imobiliário e locatício, com
                foco em resultados para proprietários e investidores.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Experiência Imobiliária",
                  desc: "Anos de atuação em cobranças, despejos e contratos de locação comercial e residencial.",
                },
                {
                  icon: DollarSign,
                  title: "Foco em Resultados",
                  desc: "Nossa estratégia é direcionada para a recuperação efetiva dos valores devidos ao proprietário.",
                },
                {
                  icon: Eye,
                  title: "Transparência Total",
                  desc: "Você acompanha cada etapa do processo com clareza sobre prazos, custos e expectativas.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl p-6 text-center shadow-card"
                >
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <item.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-10 text-center">
              O Que Nossos Clientes Dizem
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  text: "O inquilino devia 8 meses de aluguel. Em menos de 2 meses conseguiram o despejo e iniciaram a cobrança. Excelentes.",
                  name: "Carlos R.",
                  city: "Curitiba/PR",
                },
                {
                  text: "Tenho 3 imóveis alugados e quando tive problema com inadimplência, resolveram rápido e com total profissionalismo.",
                  name: "Ana Paula M.",
                  city: "São Paulo/SP",
                },
                {
                  text: "Atendimento objetivo e direto ao ponto. Recuperei os valores devidos e retomei meu imóvel. Recomendo.",
                  name: "Marcos L.",
                  city: "Londrina/PR",
                },
              ].map((t, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-card">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 text-accent fill-accent"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic leading-relaxed">
                    "{t.text}"
                  </p>
                  <p className="font-semibold text-foreground text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-10 text-center">
                Benefícios de Contar Conosco
              </h2>
              <div className="space-y-4">
                {[
                  "Recuperação efetiva de aluguéis e encargos atrasados",
                  "Redução de prejuízos com atuação rápida e estratégica",
                  "Segurança jurídica em todas as etapas do processo",
                  "Transparência total em honorários e prazos",
                  "Acompanhamento completo até a retomada do imóvel",
                  "Experiência comprovada em ações de despejo e cobrança",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-card"
                  >
                    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO */}
        <section id="formulario" className="py-16 md:py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary-foreground mb-4 text-center">
                Recupere Seu Aluguel Atrasado
              </h2>
              <p className="text-primary-foreground/70 text-center mb-8">
                Preencha o formulário e um advogado especialista entrará em
                contato para avaliar seu caso.
              </p>

              {isSubmitted ? (
                <div className="bg-card rounded-2xl p-8 text-center shadow-elevated">
                  <div className="inline-flex p-4 bg-accent/10 rounded-full mb-4">
                    <CheckCircle className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                    Solicitação Enviada!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Entraremos em contato em breve. Se preferir, fale agora
                    mesmo:
                  </p>
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleWhatsAppClick}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Falar pelo WhatsApp
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl p-8 shadow-elevated space-y-4"
                >
                  <Input
                    name="nome"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      name="telefone"
                      placeholder="Telefone / WhatsApp"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      className="h-12"
                    />
                    <Input
                      name="cidade"
                      placeholder="Sua cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      required
                      className="h-12"
                    />
                  </div>
                  <Input
                    name="valorDivida"
                    placeholder="Valor aproximado da dívida (opcional)"
                    value={formData.valorDivida}
                    onChange={handleChange}
                    className="h-12"
                  />
                  <Textarea
                    name="descricao"
                    placeholder="Descreva brevemente sua situação (opcional)"
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={4}
                    className="resize-none"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 shadow-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        Cobrar Aluguel Atrasado Agora
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Suas informações são tratadas com total sigilo profissional.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              Não Deixe o Prejuízo Aumentar
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Fale agora com um advogado especialista em cobrança de aluguel e
              proteja seu patrimônio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar com Advogado Especialista
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={handlePhoneClick}
              >
                <Phone className="h-5 w-5 mr-2" />
                Ligar Agora
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer mínimo */}
      <footer className="bg-primary py-6">
        <div className="container mx-auto px-4 text-center space-y-2">
          <a
            href="/"
            className="text-primary-foreground/80 hover:text-primary-foreground text-sm underline underline-offset-2 transition-colors"
          >
            Acessar site completo
          </a>
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Fernandez & Fernandes Advocacia. Todos
            os direitos reservados.
          </p>
        </div>
      </footer>

      {/* WhatsApp fixo */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
      >
        <MessageCircle size={28} fill="white" strokeWidth={0} />
      </a>
    </div>
  );
};

export default CobrancaAluguel;
