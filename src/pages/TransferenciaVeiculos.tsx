import { useState } from "react";
import { trackConversion as trackConversionUtil } from "@/lib/trackConversion";
import { whatsappUrl, PHONE_NUMBER as WA_PHONE } from "@/lib/constants";
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
  FileText,
  Star,
  ArrowRight,
  Send,
  Eye,
  Car,
  Scale,
  ListChecks,
  AlertTriangle,
  Truck,
  Bike,
  ClipboardCheck,
  Handshake,
} from "lucide-react";

const WHATSAPP_URL =
  whatsappUrl("Olá! Preciso de assessoria jurídica para transferência de veículo.");
const PHONE_NUMBER = WA_PHONE;

const formSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  tipoVeiculo: z.string().trim().max(50).optional(),
  descricao: z.string().trim().max(500).optional(),
});

const trackConversionLocal = (event: "form_submit" | "whatsapp_click" | "phone_click") => {
  trackConversionUtil(event, "transferencia_veiculos");
};

const TransferenciaVeiculos = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    tipoVeiculo: "",
    descricao: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  usePageSEO({
    title: "Advogado Especialista em Transferência de Veículos | Fernandez & Fernandes",
    description:
      "Regularize a transferência de seu veículo de forma rápida, segura e sem complicação. Atendimento especializado em obrigação de fazer e documentação veicular.",
    canonical: "https://fernandezefernandes.adv.br/transferencia-veiculos",
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
        email: `${validated.telefone.replace(/\D/g, "")}@lead.veiculo`,
        message: `[LP Transferência Veículos] Tipo de veículo: ${validated.tipoVeiculo || "Não informado"}. ${validated.descricao || "Sem descrição adicional."}`,
      });
      if (error) throw error;
      trackConversionLocal("form_submit");
      setIsSubmitted(true);
      toast({
        title: "Solicitação enviada!",
        description: "Um advogado especialista entrará em contato em breve.",
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
      {/* Header mínimo */}
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
                Advogado Transferência de Veículo
              </span>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Regularização e Transferência de Veículos{" "}
                <span className="text-gradient-gold">Sem Complicação</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Solução jurídica rápida e segura para transferir carros, motos e
                caminhões. Resolva pendências documentais com quem entende do
                assunto.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-gold"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Fale com Advogado Especialista
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
                  onClick={scrollToForm}
                >
                  Regularize Seu Veículo Agora
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* DOR / PROBLEMA */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4 text-center">
                Problemas Com a Documentação Do Veículo?
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                Milhares de proprietários enfrentam dificuldades na transferência
                de veículos. Sem a regularização correta, os riscos são reais e
                podem gerar prejuízos significativos.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <AlertTriangle className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Documentação Irregular
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Veículo comprado mas nunca transferido, documento em nome de
                    terceiro ou pendências no DETRAN geram insegurança e podem
                    resultar em multas, apreensão e responsabilização indevida.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Clock className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Prazo Apertado Para Transferência
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A legislação estabelece prazo de 30 dias para a transferência
                    de veículo após a compra. O descumprimento gera multa e
                    complica a regularização do documento do veículo.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Scale className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Multas E Problemas Futuros
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Enquanto a transferência de carro não é regularizada, o
                    antigo proprietário continua responsável por multas, IPVA e
                    acidentes. Uma situação que exige solução jurídica imediata.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <FileText className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Vendedores E Compradores Sem Orientação
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Muitas negociações são feitas sem contrato adequado ou
                    comunicação de venda, gerando obrigações de fazer
                    transferência de veículo que poderiam ser evitadas com
                    assessoria jurídica.
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
                Como Funciona O Serviço
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: "01",
                    icon: ClipboardCheck,
                    title: "Análise Da Documentação",
                    desc: "Avaliamos toda a documentação do veículo, identificando pendências e irregularidades.",
                  },
                  {
                    step: "02",
                    icon: Scale,
                    title: "Orientação Legal",
                    desc: "Explicamos as obrigações legais de cada parte e o caminho mais seguro para a transferência.",
                  },
                  {
                    step: "03",
                    icon: FileText,
                    title: "Preparação De Documentos",
                    desc: "Elaboramos e protocolamos toda a documentação necessária para a regularização do veículo.",
                  },
                  {
                    step: "04",
                    icon: CheckCircle,
                    title: "Conclusão Do Processo",
                    desc: "Acompanhamos cada etapa até a conclusão da transferência com total segurança jurídica.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-6 text-center shadow-card relative"
                  >
                    <span className="text-5xl font-bold text-accent/15 absolute top-2 right-3 font-serif">
                      {item.step}
                    </span>
                    <div className="relative z-10">
                      <item.icon className="h-7 w-7 text-accent mx-auto mb-3" />
                      <h3 className="font-serif text-base font-bold text-foreground mb-2">
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
              Não deixe a documentação do seu veículo virar um problema jurídico.
            </h2>
            <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
              Fale agora com um advogado especialista em transferência de veículo
              e resolva sua situação com segurança.
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-gold"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Regularize Seu Veículo Agora
            </Button>
          </div>
        </section>

        {/* POR QUE CONTRATAR */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4">
                Por Que Contratar Nosso Escritório
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experiência comprovada em regularização de veículo, ações de
                obrigação de fazer e resolução de pendências documentais.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Experiência Comprovada",
                  desc: "Atuação sólida em transferência de veículos e obrigações de fazer junto ao DETRAN e Justiça.",
                },
                {
                  icon: CheckCircle,
                  title: "Regularização Garantida",
                  desc: "Resolvemos pendências documentais com segurança jurídica e sem riscos para o cliente.",
                },
                {
                  icon: Clock,
                  title: "Atendimento Rápido",
                  desc: "Resposta ágil e acompanhamento personalizado do início ao fim do processo.",
                },
                {
                  icon: Eye,
                  title: "Transparência Total",
                  desc: "Clareza em prazos, valores e cada etapa do processo de regularização.",
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

        {/* TIPOS DE VEÍCULO */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-10 text-center">
                Atendemos Todos Os Tipos De Veículos
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <Car className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Carros
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Transferência de carro, regularização de documento e ação de
                    obrigação de fazer para automóveis de qualquer categoria.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <Bike className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Motos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Regularização e transferência de motocicletas com agilidade e
                    segurança jurídica completa.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <Truck className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Caminhões
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Documentação de veículos pesados, transferência de caminhões e
                    resolução de pendências para veículos de carga.
                  </p>
                </div>
              </div>
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
                  text: "Comprei um carro e o vendedor não queria transferir. Eles entraram com a ação e resolveram tudo rapidamente. Excelente trabalho.",
                  name: "Carlos M.",
                  city: "Curitiba/PR",
                },
                {
                  text: "Tinha um veículo em meu nome que vendi há anos e nunca fizeram a transferência. Estava recebendo multas. Resolveram minha situação em poucas semanas.",
                  name: "Fernanda R.",
                  city: "Londrina/PR",
                },
                {
                  text: "Precisei regularizar a documentação do caminhão da empresa. Atendimento rápido, profissional e sem complicação. Recomendo.",
                  name: "Roberto S.",
                  city: "Maringá/PR",
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
                Benefícios De Regularizar Seu Veículo
              </h2>
              <div className="space-y-4">
                {[
                  "Transferência segura e dentro da lei",
                  "Eliminação de multas e responsabilidades indevidas",
                  "Documento veicular regularizado no seu nome",
                  "Proteção contra fraudes e problemas judiciais",
                  "Atendimento rápido e personalizado",
                  "Resolução de obrigações de fazer de forma eficaz",
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
                Regularize Seu Veículo Agora
              </h2>
              <p className="text-primary-foreground/70 text-center mb-8">
                Preencha o formulário e um advogado especialista em
                transferência de veículos entrará em contato para avaliar seu
                caso.
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
                  <Input
                    name="telefone"
                    placeholder="Telefone / WhatsApp"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                  <Input
                    name="tipoVeiculo"
                    placeholder="Tipo de veículo (carro, moto, caminhão)"
                    value={formData.tipoVeiculo}
                    onChange={handleChange}
                    className="h-12"
                  />
                  <Textarea
                    name="descricao"
                    placeholder="Descreva brevemente seu problema (opcional)"
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
                        Transferência Segura e Rápida
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
              Não Deixe a Situação Se Complicar
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Fale agora com um advogado especialista em transferência de
              veículo e resolva a documentação do seu carro, moto ou caminhão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Fale com Advogado Especialista
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-6"
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

export default TransferenciaVeiculos;
