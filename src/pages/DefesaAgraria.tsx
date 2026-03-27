import { whatsappUrl } from "@/lib/constants";
import {
  MessageCircle,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Scale,
  Star,
  TrendingDown,
  Gavel,
  ArrowRight,
  Tractor,
  Wheat,
  FileText,
  Landmark,
  Users,
  Map,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DefesaAgraria = () => {
  usePageSEO({
    title: "Advocacia Especializada no Agronegócio | Consultoria e Defesa Rural",
    description:
      "Soluções jurídicas completas para o produtor rural: Contratos, Sucessão Familiar, Regularização de Terras e Defesa contra Execuções Bancárias.",
  });

  const whatsappLink = whatsappUrl(
    "Olá, gostaria de uma consultoria jurídica especializada para minha propriedade rural.",
  );

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-green-700/30">
      <Header />

      <main className="pt-20">
        {/* HERO SECTION - FOCO EM SEGURANÇA PATRIMONIAL */}
        <section className="bg-slate-950 text-white py-16 md:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(21,128,61,0.15)_0,rgba(2,6,23,1)_100%)] pointer-events-none" />

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-2 rounded-full text-sm font-bold mb-8">
              <ShieldCheck className="h-4 w-4" /> SEGURANÇA JURÍDICA PARA O PRODUTOR RURAL
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">
              Proteja seu Patrimônio e a
              <br />
              <span className="text-green-500 underline decoration-green-600 underline-offset-8">
                Prosperidade da sua Terra
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light">
              Do planejamento preventivo à defesa judicial complexa. Atuação especializada em{" "}
              <strong className="text-white font-semibold">Direito Agrário</strong> para garantir a continuidade do seu
              negócio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-16 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 transition-all w-full sm:w-auto"
              >
                <a href={whatsappLink} className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-7 w-7" />
                  <span className="font-bold">Consultar Especialista Agora</span>
                </a>
              </Button>
            </div>
            <p className="text-slate-500 text-sm mt-5 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" /> Atendimento ágil e sigiloso para todo o Brasil.
            </p>
          </div>
        </section>

        {/* ÁREAS DE ATUAÇÃO - GENERALISTA E ESTRATÉGICO */}
        <section id="servicos" className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-green-700 font-bold tracking-wider uppercase text-sm mb-2 block">
              Nossas Soluções
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              Inteligência Jurídica no Campo
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Cobrimos todas as frentes necessárias para que você se preocupe apenas com a produção.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* CARD 1: Contratos */}
            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
              <CardContent className="p-8">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                  <FileText className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Contratos Agrários</h3>
                <p className="text-slate-600 leading-relaxed">
                  Elaboração e revisão de Arrendamentos, Parcerias Rurais, Compra e Venda de Insumos e Contratos de
                  Safra, garantindo cláusulas seguras.
                </p>
              </CardContent>
            </Card>

            {/* CARD 2: Sucessão e Holding */}
            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
              <CardContent className="p-8">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                  <Users className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Planejamento Sucessório</h3>
                <p className="text-slate-600 leading-relaxed">
                  Proteção da herança familiar através de Holdings Rurais, evitando brigas de inventário e otimizando a
                  carga tributária na sucessão.
                </p>
              </CardContent>
            </Card>

            {/* CARD 3: Defesa em Execuções (O antigo nicho mantido como pilar) */}
            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
              <CardContent className="p-8">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                  <TrendingDown className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Crédito e Dívida Rural</h3>
                <p className="text-slate-600 leading-relaxed">
                  Alongamento de dívida, defesa em execuções de CPR e suspensão de leilões. Garantimos o seu direito
                  legal de prorrogação do crédito.
                </p>
              </CardContent>
            </Card>

            {/* CARD 4: Regularização */}
            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
              <CardContent className="p-8">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                  <Map className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Regularização de Terras</h3>
                <p className="text-slate-600 leading-relaxed">
                  Usucapião rural, retificação de área, CAR, Georreferenciamento e defesas em ações de reintegração de
                  posse e ambientais.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PROVA SOCIAL DIVERSIFICADA */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12">Confiança de quem produz</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Depoimento 1 - Consultoria */}
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 text-left">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-slate-300 italic mb-6">
                  "O planejamento sucessório feito pelo escritório trouxe paz para nossa família. Conseguimos organizar
                  a holding e garantir que o negócio continue firme com meus filhos."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center font-bold">
                    R
                  </div>
                  <div>
                    <p className="font-bold">Ricardo S.</p>
                    <p className="text-xs text-slate-400">Pecuária de Corte</p>
                  </div>
                </div>
              </div>

              {/* Depoimento 2 - Defesa */}
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 text-left">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-slate-300 italic mb-6">
                  "Estávamos com uma execução de CPR abusiva. A equipe conseguiu suspender o leilão e renegociar o
                  contrato com juros justos. Excelente trabalho técnico."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center font-bold">
                    M
                  </div>
                  <div>
                    <p className="font-bold">Marcos A.</p>
                    <p className="text-xs text-slate-400">Produtor de Grãos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ REVISADO */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-slate-900">
              Perguntas Frequentes
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-2"
            >
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-green-700">
                  Por que fazer uma Holding Rural?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  A Holding protege o patrimônio contra riscos de dívidas, facilita a sucessão sem necessidade de
                  inventário judicial demorado e pode reduzir drasticamente o imposto sobre a renda da atividade rural.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-green-700">
                  Como funciona a revisão de contratos de arrendamento?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Analisamos se os prazos, índices de reajuste e garantias estão de acordo com o Estatuto da Terra,
                  evitando nulidades que possam prejudicar o arrendador ou o arrendatário no futuro.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="contato" className="py-24 relative overflow-hidden text-center container mx-auto px-4">
          <div className="bg-green-700 rounded-[2rem] p-8 md:p-16 relative shadow-2xl overflow-hidden border-4 border-green-600">
            <Wheat className="absolute -left-10 -bottom-10 h-64 w-64 text-green-800/30 rotate-12" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">
                Sua produção não pode parar por falta de suporte jurídico.
              </h2>
              <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
                Fale agora com um advogado especialista e garanta a segurança jurídica da sua operação rural.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white h-16 px-12 rounded-full text-xl shadow-xl hover:scale-105 transition-transform group"
              >
                <a href={whatsappLink}>
                  Agendar Consultoria Especializada
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DefesaAgraria;
