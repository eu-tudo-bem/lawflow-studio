import { useState } from "react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import {
  Shield,
  Clock,
  CheckCircle,
  Phone,
  MessageCircle,
  Scale,
  Users,
  FileText,
  Star,
  ArrowRight,
  Send,
  Eye,
  Gavel,
  HeartHandshake,
} from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5511999999999?text=Olá! Preciso de ajuda com pensão alimentícia.";
const PHONE_NUMBER = "tel:+551130000000";

const formSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  cidade: z.string().trim().min(1, "Cidade é obrigatória").max(100),
  descricao: z.string().trim().max(500).optional(),
});

// Conversion tracking helper
const trackConversion = (event: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, {
      event_category: "conversao",
      event_label: "pensao_alimenticia",
    });
  }
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", event === "form_submit" ? "Lead" : "Contact");
  }
};

const PensaoAlimenticia = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cidade: "",
    descricao: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  usePageSEO({
    title: "Pensão Alimentícia – Advogado Especialista | Fernandez & Fernandes",
    description:
      "Precisa fixar ou revisar pensão alimentícia? Advogados especializados com atendimento rápido e estratégico. Fale agora com um especialista.",
    canonical: "https://fernandezefernandes.adv.br/pensao-alimenticia",
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
        email: `${validated.telefone.replace(/\D/g, "")}@lead.pensao`,
        message: `[LP Pensão Alimentícia] Cidade: ${validated.cidade}. ${validated.descricao || "Sem descrição adicional."}`,
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
          <span className="font-serif text-lg font-bold text-primary-foreground">
            Fernandez & Fernandes
          </span>
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
                Advocacia Especializada em Família
              </span>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Precisa Entrar com Pedido de{" "}
                <span className="text-gradient-gold">Pensão Alimentícia?</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Garanta o direito de quem você ama. Atuação estratégica, rápida e
                segura para fixação, revisão ou execução de alimentos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-gold"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Falar com Advogado Agora
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
                  onClick={scrollToForm}
                >
                  Solicitar Atendimento
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* O QUE É */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-8 text-center">
                Fixação de Alimentos: Entenda Seus Direitos
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Scale className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    O que é a Ação de Alimentos?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    É o instrumento jurídico para garantir que filhos, cônjuges
                    ou dependentes recebam o valor necessário para alimentação,
                    saúde, educação e moradia. A pensão alimentícia é um direito
                    previsto em lei.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Clock className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Quando é Necessário?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Após separação ou divórcio, quando há filhos menores ou
                    dependentes, em caso de não cumprimento voluntário, ou quando
                    é preciso revisar valores já fixados por mudança de
                    circunstâncias.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <FileText className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Como Funciona o Processo?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Analisamos seu caso detalhadamente, identificamos a melhor
                    estratégia, ingressamos com a ação judicial e acompanhamos
                    todo o processo até a decisão final, garantindo seus
                    direitos.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Gavel className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Pedido de Urgência (Liminar)
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Em situações emergenciais, é possível solicitar alimentos
                    provisórios (liminar), garantindo o recebimento imediato da
                    pensão enquanto o processo tramita.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA intermediário */}
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Não espere mais. Proteja quem você ama.
            </h2>
            <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
              Quanto antes agir, mais rápido os direitos serão garantidos.
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-gold"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Falar com Advogado Agora
            </Button>
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
                Somos referência em Direito de Família com mais de 20 anos de
                experiência protegendo os direitos de nossos clientes.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "+20 Anos de Experiência",
                  desc: "Atuação consolidada em Direito de Família e pensão alimentícia.",
                },
                {
                  icon: Scale,
                  title: "Estratégia Jurídica",
                  desc: "Cada caso é analisado individualmente para a melhor abordagem.",
                },
                {
                  icon: HeartHandshake,
                  title: "Atendimento Humanizado",
                  desc: "Entendemos a sensibilidade do momento e acolhemos cada cliente.",
                },
                {
                  icon: Eye,
                  title: "Segurança e Sigilo",
                  desc: "Total confidencialidade e transparência em todo o processo.",
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
                  text: "Consegui a pensão para meus filhos de forma rápida e justa. Atendimento excelente e muito humano.",
                  name: "Maria S.",
                  city: "Curitiba/PR",
                },
                {
                  text: "Eu não sabia por onde começar. A equipe me orientou em tudo e o resultado foi melhor do que eu esperava.",
                  name: "Ana P.",
                  city: "São Paulo/SP",
                },
                {
                  text: "Profissionais competentes e atenciosos. Resolveram meu caso com agilidade e total transparência.",
                  name: "Carlos R.",
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
                O Que Você Ganha ao Nos Escolher
              </h2>
              <div className="space-y-4">
                {[
                  "Atendimento rápido – retorno em até 24 horas",
                  "Análise inicial estratégica do seu caso",
                  "Total transparência nos honorários e prazos",
                  "Acompanhamento completo do processo",
                  "Possibilidade de pedido urgente (liminar)",
                  "Orientação clara, sem juridiquês",
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
                Solicite Seu Atendimento Agora
              </h2>
              <p className="text-primary-foreground/70 text-center mb-8">
                Preencha o formulário abaixo e um advogado especialista entrará
                em contato rapidamente.
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
                        Solicitar Atendimento
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
              Dúvidas? Fale Diretamente com um Advogado
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar com Advogado Agora
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
    </div>
  );
};

export default PensaoAlimenticia;
