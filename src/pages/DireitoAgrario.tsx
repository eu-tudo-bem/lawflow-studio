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
  FileText,
  Star,
  ArrowRight,
  Send,
  Eye,
  TrendingUp,
  Scale,
  ListChecks,
  Landmark,
  TreePine,
  MapPin,
  Users,
  Lock,
  Handshake,
} from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5511999999999?text=Olá! Preciso de assessoria jurídica em Direito Agrário.";
const PHONE_NUMBER = "tel:+551130000000";

const formSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  cidade: z.string().trim().min(1, "Cidade é obrigatória").max(100),
  tipoPropriedade: z.string().trim().max(100).optional(),
  descricao: z.string().trim().max(500).optional(),
});

const trackConversionLocal = (event: "form_submit" | "whatsapp_click" | "phone_click") => {
  trackConversionUtil(event, "direito_agrario");
};

const DireitoAgrario = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cidade: "",
    tipoPropriedade: "",
    descricao: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  usePageSEO({
    title: "Advogado Especialista em Direito Agrário | Fernandez & Fernandes",
    description:
      "Atuação em contratos rurais, regularização de imóvel rural, usucapião e conflitos possessórios. Segurança jurídica para produtores e proprietários rurais.",
    canonical: "https://fernandezefernandes.adv.br/direito-agrario",
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
        email: `${validated.telefone.replace(/\D/g, "")}@lead.agrario`,
        message: `[LP Direito Agrário] Cidade: ${validated.cidade}. Tipo de propriedade: ${validated.tipoPropriedade || "Não informado"}. ${validated.descricao || "Sem descrição adicional."}`,
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
                Advocacia Especializada em Direito Agrário
              </span>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Proteção Jurídica Para Produtores Rurais{" "}
                <span className="text-gradient-gold">
                  E Proprietários De Terra
                </span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Segurança jurídica estratégica para proteger patrimônio, produção
                e propriedade rural. Assessoria completa em direito agrário.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-gold"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Fale Com Advogado Agrário
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
                  onClick={scrollToForm}
                >
                  Regularize Sua Propriedade Rural
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* DOR E CONTEXTO */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4 text-center">
                Problemas No Campo Exigem Soluções Jurídicas Especializadas
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                O direito agrário protege quem produz e quem é dono da terra. Sem
                a assessoria jurídica adequada, riscos podem comprometer anos de
                trabalho e investimento.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Scale className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Conflitos De Posse E Propriedade
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Disputas possessórias, invasões, sobreposição de títulos e
                    conflitos de divisas são situações que exigem advogado
                    especialista em conflito de terra para garantir a defesa da
                    posse rural de forma eficaz.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <FileText className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Insegurança Documental
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Imóveis rurais sem matrícula regularizada, documentação
                    incompleta ou cadeia dominial irregular geram riscos
                    patrimoniais graves. A regularização de imóvel rural é
                    essencial para proteger o proprietário.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Handshake className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Contratos Rurais Mal Elaborados
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Problemas em contrato de arrendamento rural ou parceria
                    agrícola geram prejuízos para ambas as partes. A revisão e
                    elaboração de contratos agrários seguros é fundamental.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <Users className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    Disputa Por Herança Rural
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Inventários de propriedades rurais envolvem questões
                    específicas como módulo fiscal, indivisibilidade e direito de
                    preferência. A falta de planejamento sucessório pode
                    fragmentar o patrimônio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRINCIPAIS SERVIÇOS */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-10 text-center">
                Principais Serviços Em Direito Agrário
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: MapPin,
                    title: "Regularização De Imóvel Rural",
                    desc: "Retificação de área, georreferenciamento, CCIR, ITR e adequação junto ao INCRA e cartórios para garantir a titularidade segura da propriedade.",
                  },
                  {
                    icon: FileText,
                    title: "Contratos De Arrendamento E Parceria Rural",
                    desc: "Elaboração, revisão e negociação de contratos de arrendamento rural e parceria agrícola conforme o Estatuto da Terra e legislação vigente.",
                  },
                  {
                    icon: Landmark,
                    title: "Usucapião De Área Rural",
                    desc: "Ação de usucapião rural para reconhecimento da propriedade de quem ocupa e trabalha a terra produtivamente. Atuação judicial e extrajudicial.",
                  },
                  {
                    icon: Shield,
                    title: "Defesa Em Conflitos Possessórios",
                    desc: "Ações de reintegração de posse, manutenção de posse e interdito proibitório para proteger proprietários e produtores rurais de invasões e turbações.",
                  },
                  {
                    icon: Scale,
                    title: "Revisão De Contratos Agrários",
                    desc: "Análise e adequação de cláusulas contratuais para garantir equilíbrio, legalidade e proteção aos interesses do produtor ou proprietário rural.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Assessoria Em Crédito Rural",
                    desc: "Orientação jurídica em operações de crédito rural, financiamentos agrícolas e questões envolvendo instituições financeiras e garantias rurais.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-6 shadow-card"
                  >
                    <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                      <item.icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
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
              A terra é o seu maior patrimônio. Proteja-o com segurança jurídica.
            </h2>
            <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
              Fale agora com um advogado especialista em direito agrário e
              garanta a proteção da sua propriedade rural.
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-gold"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Fale Com Advogado Agrário
            </Button>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-10 text-center">
                Como Funciona O Atendimento
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  {
                    step: "01",
                    title: "Análise Documental",
                    desc: "Avaliamos toda a documentação da propriedade rural, matrícula, escritura e registros.",
                  },
                  {
                    step: "02",
                    title: "Avaliação Jurídica",
                    desc: "Identificamos riscos, oportunidades e a melhor estratégia para o seu caso.",
                  },
                  {
                    step: "03",
                    title: "Estratégia Personalizada",
                    desc: "Definimos um plano de ação sob medida para proteger seu patrimônio rural.",
                  },
                  {
                    step: "04",
                    title: "Atuação Judicial ou Extrajudicial",
                    desc: "Executamos a estratégia com excelência técnica e dedicação.",
                  },
                  {
                    step: "05",
                    title: "Acompanhamento Contínuo",
                    desc: "Mantemos você informado em cada etapa até a resolução completa.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-5 text-center shadow-card relative"
                  >
                    <span className="text-4xl font-bold text-accent/15 absolute top-2 right-3 font-serif">
                      {item.step}
                    </span>
                    <div className="relative z-10">
                      <ListChecks className="h-6 w-6 text-accent mx-auto mb-3" />
                      <h3 className="font-serif text-base font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PATRIMÔNIO */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4">
                  Proteja Seu Patrimônio No Campo
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  A propriedade rural é mais do que um ativo financeiro — é o
                  legado de uma família, a base de uma produção e a segurança de
                  gerações futuras. Proteger a terra é proteger tudo o que foi
                  construído.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <TreePine className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Continuidade Da Produção
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A segurança jurídica garante que sua atividade produtiva não
                    seja interrompida por disputas, irregularidades ou conflitos
                    possessórios.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <Lock className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Ativo Estratégico Protegido
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Terra valorizada e documentada é um ativo seguro para
                    financiamentos, negociações e planejamento patrimonial de
                    longo prazo.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                    <Users className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Segurança Para Futuras Gerações
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Planejamento sucessório rural garante que o patrimônio chegue
                    íntegro às próximas gerações, sem fragmentação ou litígios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POR QUE NOS ESCOLHER */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4">
                Por Que Escolher a Fernandez & Fernandes?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experiência consolidada em assessoria jurídica rural, com foco em
                proteger quem produz e quem investe na terra.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Experiência No Campo",
                  desc: "Atuação sólida em questões agrárias, fundiárias e contratos rurais com conhecimento técnico e prático.",
                },
                {
                  icon: Scale,
                  title: "Atuação Estratégica",
                  desc: "Cada caso é analisado com profundidade para definir a melhor estratégia judicial ou extrajudicial.",
                },
                {
                  icon: Eye,
                  title: "Transparência Total",
                  desc: "Acompanhamento claro de cada etapa, com comunicação direta sobre prazos, custos e perspectivas.",
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
                  text: "Regularizaram toda a documentação da minha fazenda que estava irregular há anos. Trabalho sério e competente.",
                  name: "João Pedro S.",
                  city: "Maringá/PR",
                },
                {
                  text: "Tive um conflito de posse com vizinho e eles resolveram de forma rápida e profissional. Recomendo para qualquer produtor rural.",
                  name: "Maria Aparecida L.",
                  city: "Londrina/PR",
                },
                {
                  text: "Assessoria completa no contrato de arrendamento da minha propriedade. Evitaram problemas que eu nem imaginava que poderiam acontecer.",
                  name: "Roberto F.",
                  city: "Cascavel/PR",
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
                Benefícios Da Assessoria Jurídica Rural
              </h2>
              <div className="space-y-4">
                {[
                  "Regularização completa da propriedade rural",
                  "Proteção contra invasões e disputas possessórias",
                  "Contratos rurais seguros e juridicamente válidos",
                  "Planejamento sucessório para preservar o patrimônio",
                  "Acompanhamento especializado em crédito rural",
                  "Atuação ágil e estratégica em todas as comarcas",
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
                Proteja Seu Patrimônio No Campo
              </h2>
              <p className="text-primary-foreground/70 text-center mb-8">
                Preencha o formulário e um advogado especialista em direito
                agrário entrará em contato para avaliar seu caso.
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
                    name="tipoPropriedade"
                    placeholder="Tipo de propriedade (ex: fazenda, sítio, chácara)"
                    value={formData.tipoPropriedade}
                    onChange={handleChange}
                    className="h-12"
                  />
                  <Textarea
                    name="descricao"
                    placeholder="Descreva brevemente seu problema ou necessidade (opcional)"
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
                        Proteja Seu Patrimônio No Campo
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
              Não Espere o Problema Crescer
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Fale agora com um advogado especialista em direito agrário e
              garanta a segurança jurídica da sua propriedade rural.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Fale Com Advogado Agrário
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

export default DireitoAgrario;
