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
  Landmark,
  Car,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const RecuperacaoVeiculos = () => {
  usePageSEO({
    title: "Defesa e Liberação de Veículos Apreendidos | Receita Federal e PRF",
    description:
      "Veículo retido na fronteira, PRF ou Receita Federal por descaminho? Atuação jurídica urgente para evitar a Pena de Perdimento e leilão. Fale agora.",
  });

  const whatsappLink =
    whatsappUrl("Olá, tive meu veículo apreendido pela Receita/Polícia e preciso de ajuda com urgência para evitar o perdimento.");

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-yellow-500/30">
      <Header />

      <main className="pt-20">
        {/* HERO SECTION - URGÊNCIA MÁXIMA */}
        <section className="bg-slate-950 text-white py-16 md:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,138,4,0.15)_0,rgba(2,6,23,1)_100%)] pointer-events-none" />

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-5 py-2 rounded-full text-sm font-bold mb-8 animate-pulse">
              <AlertTriangle className="h-4 w-4" /> ATENÇÃO: PRAZO CURTO PARA DEFESA ADMINISTRATIVA NA RECEITA!
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">
              Carro apreendido na{" "}
              <span className="text-yellow-500 underline decoration-red-500 underline-offset-8">fronteira?</span>
              <br />
              Evite a Pena de Perdimento.
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light">
              Não perca o seu patrimônio para a União. Atuamos com{" "}
              <strong className="text-white font-semibold">medidas de urgência</strong> para liberação de veículos
              retidos pela Receita Federal, Polícia Federal e PRF.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-16 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 transition-all w-full sm:w-auto"
              >
                <a href={whatsappLink} className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-7 w-7" />
                  <span className="font-bold">Analisar Auto de Infração Agora</span>
                </a>
              </Button>
            </div>
            <p className="text-slate-500 text-sm mt-5 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" /> Análise de caso gratuita e sigilosa. Resposta imediata.
            </p>
          </div>
        </section>

        {/* DOR & AGITAÇÃO - O QUE ESTÁ EM JOGO */}
        <section id="perdimento" className="py-16 bg-red-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-red-100 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> O Risco é Real
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center mt-4">
                Se você não agir rápido, você pode:
              </h2>
              <ul className="space-y-4 text-lg text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Sofrer a <strong>Pena de Perdimento</strong>, onde o Estado toma a posse definitiva do seu veículo
                    sem te pagar nada e o envia para leilão.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Responder a um inquérito policial na Justiça Federal por{" "}
                    <strong>Crime de Descaminho ou Contrabando</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Ter seu nome inscrito na <strong>Dívida Ativa da União</strong> caso multas aduaneiras pesadas sejam
                    aplicadas.
                  </span>
                </li>
              </ul>
              <p className="text-center font-bold text-red-600 mt-8 text-xl">
                O prazo de defesa administrativa na Receita Federal é de apenas 20 dias após a autuação!
              </p>
            </div>
          </div>
        </section>

        {/* A SOLUÇÃO (AUTORIDADE) */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-yellow-600 font-bold tracking-wider uppercase text-sm mb-2 block">
              Nossa Especialidade
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              Direito Aduaneiro e Liberação de Veículos
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Estratégias jurídicas comprovadas para reverter apreensões nas rotas e fronteiras do Brasil.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Landmark,
                title: "Defesa na Receita Federal",
                desc: "Atuamos na esfera administrativa para barrar a pena de perdimento por transporte de mercadorias irregulares, aplicando o princípio da proporcionalidade.",
              },
              {
                icon: Gavel,
                title: "Ação Judicial Anulatória",
                desc: "Quando a via administrativa se esgota, judicializamos o caso na Justiça Federal com pedidos de liminar para a devolução imediata do bem.",
              },
              {
                icon: Car,
                title: "Defesa de Terceiros e Frotistas",
                desc: "Protegemos motoristas de aplicativo, locadoras e donos de frotas que tiveram veículos retidos por atos praticados por passageiros ou terceiros.",
              },
              {
                icon: ShieldCheck,
                title: "Defesa Criminal (Descaminho)",
                desc: "Atuação completa para blindar você contra inquéritos e processos penais derivados da apreensão de mercadorias na fronteira.",
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
        <section id="passo-a-passo" className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Atendimento 100% Digital e Sigiloso</h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Não importa em qual barreira da PRF ou cidade de fronteira você foi parado. Nossa atuação é imediata e
                  protocolada eletronicamente.
                </p>
                <div className="space-y-6">
                  {[
                    "1. Clique no botão de WhatsApp e explique o ocorrido",
                    "2. Envie a foto do Termo de Retenção ou Auto de Infração",
                    "3. Nossa equipe aduaneira faz a análise técnica gratuitamente",
                    "4. Protocolamos o pedido de liberação no sistema do Governo (e-CAC/Eproc)",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="bg-yellow-500/20 text-yellow-500 p-2 rounded-full shrink-0">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avaliação para prova social aduaneira */}
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-slate-300 italic text-lg mb-6">
                  "A Receita apreendeu minha van alegando transporte de mercadoria irregular de passageiros. Fiquei
                  desesperado pois é meu ganha pão. O escritório fez a defesa mostrando a desproporção da pena de
                  perdimento e a boa-fé. O juiz mandou liberar o veículo rapidamente. Trabalho impecável."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xl text-slate-400">
                    M
                  </div>
                  <div>
                    <p className="font-bold">Marcos S.</p>
                    <p className="text-sm text-slate-400">Motorista Liberado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - QUEBRA DE OBJEÇÕES */}
        <section id="fronteira-pr" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-slate-900">
              Dúvidas Frequentes
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-2"
            >
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-yellow-600">
                  Meu veículo foi apreendido com mercadorias na fronteira. Vou perdê-lo?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Não necessariamente. A aplicação da pena de perdimento exige o princípio da proporcionalidade. Se o
                  valor da mercadoria apreendida não for muito superior ao valor do veículo e você for réu primário,
                  nossos advogados têm fortes teses para conseguir reverter a apreensão.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-yellow-600">
                  Eu era apenas o motorista (App/Frete) e a mercadoria era do passageiro. E agora?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Esta é uma situação muito comum. Atuamos com a tese de "Boa-Fé de Terceiro". Precisamos demonstrar que
                  você estava apenas prestando um serviço de transporte, sem ligação com o descaminho, para exigir a
                  liberação imediata do seu instrumento de trabalho.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-yellow-600">
                  Preciso ir até o escritório físico de vocês para iniciar a defesa?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Não. Atuamos em todo o Brasil de forma 100% digital. Todo o processo administrativo contra a Receita
                  Federal (e-CAC) ou judicial na Justiça Federal (Eproc/PJe) é feito eletronicamente, garantindo
                  velocidade máxima na sua defesa, não importa onde você foi parado.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL DE ALTO IMPACTO */}
        <section id="contato-whatsapp" className="py-24 relative overflow-hidden text-center container mx-auto px-4">
          <div className="bg-yellow-500 rounded-[2rem] p-8 md:p-16 relative shadow-2xl overflow-hidden border-4 border-yellow-400">
            <Scale className="absolute -right-10 -bottom-10 h-64 w-64 text-yellow-600/20 rotate-12" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-slate-900">
                Cada hora que passa diminui suas chances.
              </h2>
              <p className="text-xl text-slate-800 mb-10 max-w-2xl mx-auto font-medium">
                Clique no botão abaixo agora. Um advogado especialista vai avaliar seu Auto de Apreensão gratuitamente e
                traçar o plano para recuperar seu veículo antes do leilão.
              </p>

              <Button
                asChild
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white h-16 px-12 rounded-full text-xl shadow-xl hover:scale-105 transition-transform group"
              >
                <a href={whatsappLink}>
                  Quero Falar com um Especialista Agora
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
