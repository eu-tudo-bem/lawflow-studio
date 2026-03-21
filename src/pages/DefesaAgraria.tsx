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
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DefesaAgraria = () => {
  usePageSEO({
    title: "Advogado Agronegócio | Defesa em Execução Rural e CPR",
    description:
      "Sofrendo execução de CPR ou crédito rural? Atuamos no alongamento de dívida rural, defesa contra tradings e proteção da sua fazenda contra leilões.",
  });

  const whatsappLink =
    "https://wa.me/5541995808145?text=Olá, sou produtor rural e preciso de ajuda urgente com uma execução de dívida/contrato agrícola.";

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-green-700/30">
      <Header />

      <main className="pt-20">
        {/* HERO SECTION - URGÊNCIA MÁXIMA PARA O PRODUTOR */}
        <section className="bg-slate-950 text-white py-16 md:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(21,128,61,0.15)_0,rgba(2,6,23,1)_100%)] pointer-events-none" />

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-5 py-2 rounded-full text-sm font-bold mb-8 animate-pulse">
              <AlertTriangle className="h-4 w-4" /> ATENÇÃO: PRAZO CURTO PARA EMBARGOS À EXECUÇÃO!
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">
              Execução de CPR ou
              <br />
              <span className="text-green-500 underline decoration-green-600 underline-offset-8">Crédito Rural?</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light">
              Proteja sua fazenda, safra e maquinário. Atuação especializada no{" "}
              <strong className="text-white font-semibold">alongamento de dívida rural</strong> e defesa contra Bancos,
              Tradings e Cooperativas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-16 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 transition-all w-full sm:w-auto"
              >
                <a href={whatsappLink} className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-7 w-7" />
                  <span className="font-bold">Falar com Advogado do Agronegócio</span>
                </a>
              </Button>
            </div>
            <p className="text-slate-500 text-sm mt-5 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" /> Análise sigilosa de contratos e notificações.
            </p>
          </div>
        </section>

        {/* DOR & AGITAÇÃO - O RISCO DO LEILÃO E PENHORA */}
        <section id="leilao" className="py-16 bg-red-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-red-100 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> O Patrimônio em Risco
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center mt-4">
                O que acontece se você não contestar a execução?
              </h2>
              <ul className="space-y-4 text-lg text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Penhora da sua Safra:</strong> A justiça pode determinar o arresto imediato dos seus grãos
                    diretamente no silo ou na cooperativa.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Leilão de Terras:</strong> Sua propriedade rural, dada como garantia fiduciária ou
                    hipotecária, pode ir a leilão por preço de banana.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Bloqueio de Maquinário:</strong> Apreensão de tratores e colheitadeiras (BNDES/Finame),
                    paralisando totalmente a sua produção.
                  </span>
                </li>
              </ul>
              <p className="text-center font-bold text-red-600 mt-8 text-xl">
                Não entregue o trabalho de uma vida. Existem ferramentas legais exclusivas para o produtor rural!
              </p>
            </div>
          </div>
        </section>

        {/* A SOLUÇÃO (AUTORIDADE NO AGRO) */}
        <section id="execucao-cpr" className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-green-700 font-bold tracking-wider uppercase text-sm mb-2 block">
              Nossa Especialidade
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              Estratégias de Defesa para o Produtor Rural
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Temos profunda expertise na legislação do agronegócio (Estatuto da Terra, Manual de Crédito Rural e Lei da
              CPR).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* CARD 1: Alongamento de Dívida (Termo fortíssimo do Ads) */}
            <Card
              id="alongamento"
              className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white"
            >
              <CardContent className="p-8">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                  <TrendingDown className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Alongamento de Dívida Rural</h3>
                <p className="text-slate-600 leading-relaxed">
                  Sofreu com seca, praga, geada ou queda nos preços? Exigimos judicialmente a prorrogação do seu
                  financiamento rural, um direito legal do produtor (Súmula 298 do STJ).
                </p>
              </CardContent>
            </Card>

            {/* CARD 2: Execução de CPR */}
            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
              <CardContent className="p-8">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                  <FileText className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Defesa em Execução de CPR</h3>
                <p className="text-slate-600 leading-relaxed">
                  Contestamos a validade de Cédulas de Produto Rural (Física ou Financeira) cobradas por Tradings e
                  revendas de insumos, barrando arrestos abusivos de safra.
                </p>
              </CardContent>
            </Card>

            {/* CARD 3: Suspensão de Leilões */}
            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
              <CardContent className="p-8">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                  <Gavel className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Suspensão de Leilões</h3>
                <p className="text-slate-600 leading-relaxed">
                  Ações anulatórias e embargos para suspender leilões de propriedades rurais dados em garantia
                  (alienação fiduciária e hipoteca) por falhas processuais do banco.
                </p>
              </CardContent>
            </Card>

            {/* CARD 4: Juros e Crédito Rural */}
            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
              <CardContent className="p-8">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                  <Landmark className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Revisão de Crédito Rural</h3>
                <p className="text-slate-600 leading-relaxed">
                  Expurgo de juros abusivos, multas ilegais e taxas indevidas em Cédulas de Crédito Rural (CCR) cobradas
                  por bancos cooperativos e privados.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PROVA SOCIAL / FACILIDADE */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                  Atendimento Especializado em todo o Paraná e MS
                </h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Compreendemos a dinâmica da sua colheita e do seu negócio. O atendimento é ágil, digital e focado em
                  estancar a sangria financeira imediatamente.
                </p>
                <div className="space-y-6">
                  {[
                    "1. Contato direto via WhatsApp com total sigilo",
                    "2. Análise da matrícula da fazenda, CPRs ou notificações do banco",
                    "3. Parecer técnico e estratégia de defesa (Blindagem Patrimonial)",
                    "4. Protocolo judicial de urgência para barrar penhoras e leilões",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="bg-green-600/20 text-green-500 p-2 rounded-full shrink-0">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avaliação Fictícia para prova social no Agro */}
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-slate-300 italic text-lg mb-6">
                  "Tivemos uma frustração de safra no Oeste do Paraná e a cooperativa executou a CPR, pedindo o bloqueio
                  das contas e das colheitadeiras. A equipe do escritório agiu rápido, provou a quebra climática e
                  forçou o alongamento da dívida. Salvou a nossa lavoura."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xl text-slate-400">
                    A
                  </div>
                  <div>
                    <p className="font-bold">Antônio P.</p>
                    <p className="text-sm text-slate-400">Produtor de Soja e Milho</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - QUEBRA DE OBJEÇÕES DO PRODUTOR */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-slate-900">
              Dúvidas Frequentes do Produtor
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-2"
            >
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-green-700">
                  O banco pode negar o alongamento da minha dívida rural?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  O banco costuma negar administrativamente, mas a lei é clara: se você provar que a incapacidade de
                  pagamento ocorreu por fatores climáticos (seca, geada) ou problemas de mercado, o alongamento da
                  dívida nas mesmas taxas originais é um DIREITO do produtor, e não um favor do banco (Súmula 298 do
                  STJ).
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-green-700">
                  Minha fazenda foi dada em garantia (Alienação Fiduciária). Posso perder ela?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Sim, a alienação fiduciária permite que o credor consolide a propriedade e leve a leilão de forma
                  extrajudicial (muito rápida). Por isso, é essencial entrar com medidas liminares urgentes para barrar
                  o leilão, apontando erros no contrato ou na notificação do banco.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-green-700">
                  Como funciona o atendimento se minha fazenda é longe do escritório?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Nosso atendimento é nacional e 100% digital. Reuniões são feitas por vídeo e todo o protocolo nos
                  tribunais é eletrônico. Isso permite que atuemos de forma imediata na proteção do seu patrimônio, não
                  importando a localização da sua propriedade.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL DE ALTO IMPACTO */}
        <section id="contato" className="py-24 relative overflow-hidden text-center container mx-auto px-4">
          <div className="bg-green-700 rounded-[2rem] p-8 md:p-16 relative shadow-2xl overflow-hidden border-4 border-green-600">
            <Wheat className="absolute -left-10 -bottom-10 h-64 w-64 text-green-800/30 rotate-12" />
            <Tractor className="absolute -right-10 top-10 h-48 w-48 text-green-800/30 -rotate-6" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">
                Não espere o Oficial de Justiça chegar na porteira.
              </h2>
              <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto font-medium">
                Clique no botão abaixo agora. Fale com um advogado especialista em agronegócio para blindar seu
                patrimônio e renegociar sua dívida de forma justa.
              </p>

              <Button
                asChild
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white h-16 px-12 rounded-full text-xl shadow-xl hover:scale-105 transition-transform group"
              >
                <a href={whatsappLink}>
                  Falar com Advogado do Agronegócio
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
