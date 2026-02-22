import { useState } from "react";
import { trackConversion as trackConversionUtil } from "@/lib/trackConversion";
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
  Heart,
  Users,
  FileText,
  Star,
  ArrowRight,
  Send,
  Eye,
  HeartHandshake,
  ListChecks,
} from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5511999999999?text=Olá! Gostaria de informações sobre divórcio consensual.";
const PHONE_NUMBER = "tel:+551130000000";

const formSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  cidade: z.string().trim().min(1, "Cidade é obrigatória").max(100),
  filhosMenores: z.enum(["sim", "nao", ""]),
  descricao: z.string().trim().max(500).optional(),
});

const trackConversionLocal = (event: "form_submit" | "whatsapp_click" | "phone_click") => {
  trackConversionUtil(event, "divorcio_consensual");
};

const DivorcioConsensual = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cidade: "",
    filhosMenores: "",
    descricao: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  usePageSEO({
    title: "Divórcio Consensual Rápido e Seguro | Fernandez & Fernandes",
    description:
      "Resolva seu divórcio consensual de forma tranquila, rápida e segura. Advogados especializados em Direito de Família. Fale agora com um especialista.",
    canonical: "https://fernandezefernandes.adv.br/divorcio-consensual",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validated = formSchema.parse(formData);
      const filhosLabel = validated.filhosMenores === "sim" ? "Sim" : validated.filhosMenores === "nao" ? "Não" : "Não informado";
      const { error } = await supabase.from("contact_submissions").insert({
        full_name: validated.nome,
        phone: validated.telefone,
        email: `${validated.telefone.replace(/\D/g, "")}@lead.divorcio`,
        message: `[LP Divórcio Consensual] Cidade: ${validated.cidade}. Filhos menores: ${filhosLabel}. ${validated.descricao || "Sem descrição adicional."}`,
      });
      if (error) throw error;
      trackConversionLocal("form_submit");
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
    trackConversionLocal("whatsapp_click");
    window.open(WHATSAPP_URL, "_blank");
  };

  const handlePhoneClick = () => {
    trackConversionLocal("phone_click");
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
                Advocacia Especializada em Direito de Família
              </span>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Divórcio Consensual{" "}
                <span className="text-gradient-gold">Rápido e Seguro</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Resolva sua separação de forma tranquila, com orientação jurídica
                especializada. Menos burocracia, menos desgaste, mais segurança.
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
                  Iniciar Divórcio Consensual
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
                Divórcio Consensual: Entenda Como Funciona
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Heart className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    O Que É Divórcio Consensual?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    É a forma mais rápida e pacífica de encerrar o casamento,
                    quando ambas as partes concordam com a separação e as condições
                    como partilha de bens, guarda e pensão. Menos conflito, mais
                    tranquilidade.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <CheckCircle className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Quando É Possível?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Quando ambos os cônjuges estão de acordo com a separação e
                    conseguem definir juntos questões como divisão de bens, guarda
                    dos filhos e eventual pensão alimentícia. Não há prazo mínimo
                    de casamento.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Clock className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Vantagens do Consensual
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Processo significativamente mais rápido, menor custo emocional
                    e financeiro, menos desgaste para toda a família, preserva o
                    relacionamento entre as partes — especialmente importante
                    quando há filhos.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <FileText className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Pode Ser Feito Online?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sim! Sem filhos menores ou incapazes, o divórcio consensual pode
                    ser realizado diretamente em cartório, de forma extrajudicial,
                    com agilidade e praticidade. Orientamos você em cada etapa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA - PASSOS */}
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
                    title: "Análise do Caso",
                    desc: "Avaliamos sua situação e orientamos sobre a melhor forma de proceder.",
                  },
                  {
                    step: "02",
                    title: "Elaboração do Acordo",
                    desc: "Redigimos o acordo contemplando todos os pontos necessários entre as partes.",
                  },
                  {
                    step: "03",
                    title: "Protocolo",
                    desc: "Encaminhamos o pedido judicial ou em cartório conforme o caso.",
                  },
                  {
                    step: "04",
                    title: "Finalização",
                    desc: "Acompanhamos até a homologação e averbação do divórcio.",
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
              Resolva sua separação com tranquilidade e segurança jurídica.
            </h2>
            <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
              Conte com advogados especializados para tornar esse processo mais
              simples do que você imagina.
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
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4">
                Por Que Escolher a Fernandez & Fernandes?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experiência consolidada em Direito de Família, com um atendimento
                que une estratégia jurídica e sensibilidade humana.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Experiência em Família",
                  desc: "Anos de atuação em divórcios, guarda, partilha e direito de família.",
                },
                {
                  icon: HeartHandshake,
                  title: "Atendimento Humanizado",
                  desc: "Entendemos que esse é um momento delicado. Acolhemos cada cliente com empatia e respeito.",
                },
                {
                  icon: Eye,
                  title: "Segurança em Cada Etapa",
                  desc: "Total transparência, sigilo profissional e acompanhamento completo do início ao fim.",
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
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-10 text-center">
              O Que Nossos Clientes Dizem
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  text: "Pensei que seria muito difícil, mas a equipe tornou tudo simples e rápido. Saí aliviada e segura.",
                  name: "Juliana M.",
                  city: "Curitiba/PR",
                },
                {
                  text: "Fizemos o divórcio em cartório sem nenhuma dor de cabeça. Atendimento impecável e muito humano.",
                  name: "Roberto e Cláudia L.",
                  city: "São Paulo/SP",
                },
                {
                  text: "Excelentes profissionais. Nos orientaram com clareza e respeito. Recomendo de olhos fechados.",
                  name: "Fernanda S.",
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
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-10 text-center">
                Benefícios de Contar Conosco
              </h2>
              <div className="space-y-4">
                {[
                  "Processo rápido — judicial ou extrajudicial",
                  "Menos conflito e desgaste emocional",
                  "Orientação personalizada para cada situação",
                  "Transparência total em honorários e prazos",
                  "Acompanhamento completo até a averbação",
                  "Linguagem clara, sem complicações",
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
                Inicie Seu Divórcio Consensual
              </h2>
              <p className="text-primary-foreground/70 text-center mb-8">
                Preencha o formulário e um advogado especialista entrará em
                contato para orientá-lo.
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
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Possuem filhos menores?
                    </label>
                    <select
                      name="filhosMenores"
                      value={formData.filhosMenores}
                      onChange={handleChange}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                    >
                      <option value="">Selecione...</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
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
                        Iniciar Divórcio Consensual
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
        <section className="py-12 bg-muted">
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

export default DivorcioConsensual;
