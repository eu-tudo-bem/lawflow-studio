import {
  MessageCircle,
  ShieldCheck,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Scale,
  Star,
  TrendingDown,
  Gavel,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const RecuperacaoVeiculos = () => {
  usePageSEO({
    title: "Recuperação de Veículos Apreendidos | Evite o Leilão do seu Carro",
    description:
      "Busca e apreensão de veículos? Você tem prazo para agir! Atuação jurídica especializada para liberação do seu carro ou moto. Fale agora com um advogado.",
  });

  // Substitua pelo número real do seu escritório
  const whatsappLink =
    "https://wa.me/5541999999999?text=Olá, tive meu veículo apreendido e preciso de ajuda com urgência para não perder o bem.";

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-yellow-500/30">
      <Header />

      <main className="pt-20">
        {/* HERO SECTION - URGÊNCIA MÁXIMA */}
        <section className="bg-slate-950 text-white py-16 md:py-28 px-4 relative overflow-hidden">
          {/* Efeito de fundo sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,138,4,0.15)_0,rgba(2,6,23,1)_100%)] pointer-events-none" />

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-5 py-2 rounded-full text-sm font-bold mb-8 animate-pulse">
              <AlertTriangle className="h-4 w-4" /> ATENÇÃO: PRAZO CURTO PARA DEFESA!
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">
              Teve seu veículo{" "}
              <span className="text-yellow-500 underline decoration-red-500 underline-offset-8">apreendido?</span>
              <br />
              Nós podemos recuperar.
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light">
              Não perca o dinheiro que você já pagou. Atuamos com{" "}
              <strong className="text-white font-semibold">medidas de urgência</strong> contra busca e apreensão e juros
              abusivos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-16 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 transition-all w-full sm:w-auto"
              >
                <a href={whatsappLink} className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-7 w-7" />
                  <span className="font-bold">Falar com Especialista Agora</span>
                </a>
              </Button>
            </div>
            <p className="text-slate-500 text-sm mt-5 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" /> Análise de caso gratuita e sigilosa. Resposta em minutos.
            </p>
          </div>
        </section>

        {/* DOR & AGITAÇÃO - O QUE ESTÁ EM JOGO */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-red-100 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> O Risco é Real
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center mt-4">
                Se você não agir rápido, o banco vai:
              </h2>
              <ul className="space-y-4 text-lg text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Levar seu veículo para <strong>leilão por um valor muito abaixo</strong> do mercado.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Ficar com <strong>todo o dinheiro</strong> das parcelas que você já pagou.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Continuar cobrando o saldo devedor restante, deixando seu <strong>nome sujo</strong>.
                  </span>
                </li>
              </ul>
              <p className="text-center font-bold text-red-600 mt-8 text-xl">
                Você tem apenas 5 dias após a apreensão para purgar a mora. O relógio está correndo!
              </p>
            </div>
          </div>
        </section>

        {/* A SOLUÇÃO (AUTORIDADE) */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-yellow-600 font-bold tracking-wider uppercase text-sm mb-2 block">
              Nossa Estratégia
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              Como vamos defender seu patrimônio
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Temos métodos legais específicos para reverter os abusos cometidos pelas instituições financeiras.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Gavel,
                title: "Quebra da Liminar",
                desc: "Analisamos falhas na notificação extrajudicial do banco para pedir a nulidade imediata da busca e apreensão.",
              },
              {
                icon: TrendingDown,
                title: "Redução de Juros Abusivos",
                desc: "Identificamos taxas ilegais no seu contrato que inflaram a dívida, exigindo recálculo e diminuição das parcelas.",
              },
              {
                icon: ShieldCheck,
                title: "Acordo Extrajudicial",
                desc: "Negociamos diretamente com a financeira para quitar o veículo ou retomar o contrato com condições justas para você.",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white"
              >
                <CardContent className="p-8">
                  <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
                    <item.icon className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PROVA SOCIAL / FACILIDADE */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                  Processo 100% Digital e Sem Burocracia
                </h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Sabemos que você está passando por um momento estressante. Por isso, simplificamos tudo. Você não
                  precisa sair de casa para lutar pelo seu veículo.
                </p>
                <div className="space-y-6">
                  {[
                    "1. Clique no botão de WhatsApp",
                    "2. Envie a cópia do seu contrato ou mandado",
                    "3. Fazemos a análise gratuita na mesma hora",
                    "4. Protocolamos sua defesa rapidamente",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="bg-yellow-500/20 text-yellow-500 p-2 rounded-full">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avaliação Fictícia para prova social */}
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-slate-300 italic text-lg mb-6">
                  "Meu carro de trabalho foi apreendido numa terça-feira. Entrei em desespero. Achei o escritório na
                  internet e mandei mensagem. Eles acharam um erro na notificação do banco e na sexta-feira o juiz
                  mandou devolver meu carro. Salvaram minha vida!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xl text-slate-400">
                    R
                  </div>
                  <div>
                    <p className="font-bold">Roberto S.</p>
                    <p className="text-sm text-slate-400">Cliente Atendido Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - QUEBRA DE OBJEÇÕES */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-slate-900">
              Ainda tem dúvidas?
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-2"
            >
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-yellow-600">
                  O veículo já foi levado pelo guincho. Ainda tem jeito?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Sim! O banco não é dono definitivo imediato. Existe um prazo de 5 dias corridos após a execução da
                  liminar para pagar a dívida, e 15 dias para apresentar a defesa jurídica (contestação) apontando
                  irregularidades.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-yellow-600">
                  Escondi o veículo para não ser apreendido. O que eu faço?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Essa é uma medida provisória e perigosa. Se o oficial não achar o bem, o processo pode evoluir para
                  algo pior, bloqueando suas contas bancárias. O ideal é entrar com a defesa e tentar um acordo enquanto
                  o veículo ainda está seguro.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-yellow-600">
                  Preciso ir até o escritório físico de vocês?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Não. Atuamos em todo o Brasil de forma 100% digital. O processo eletrônico permite que façamos sua
                  defesa, juntada de documentos e despachos com o juiz de forma totalmente online, ganhando um tempo
                  precioso para o seu caso.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL DE ALTO IMPACTO */}
        <section className="py-24 relative overflow-hidden text-center container mx-auto px-4">
          <div className="bg-yellow-500 rounded-[2rem] p-8 md:p-16 relative shadow-2xl overflow-hidden border-4 border-yellow-400">
            {/* Elementos visuais de fundo */}
            <Scale className="absolute -right-10 -bottom-10 h-64 w-64 text-yellow-600/20 rotate-12" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-slate-900">
                Cada hora que passa diminui suas chances.
              </h2>
              <p className="text-xl text-slate-800 mb-10 max-w-2xl mx-auto font-medium">
                Clique no botão abaixo agora. Um dos nossos advogados especialistas vai avaliar seu contrato
                gratuitamente e traçar o plano para recuperar seu veículo.
              </p>

              <Button
                asChild
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white h-16 px-12 rounded-full text-xl shadow-xl hover:scale-105 transition-transform group"
              >
                <a href={whatsappLink}>
                  Quero Falar com um Advogado
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

export default RecuperacaoVeiculos;
