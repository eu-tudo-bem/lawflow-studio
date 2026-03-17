import {
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Scale,
  ArrowRight,
  Baby,
  Lock,
  Wallet,
  Gavel,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ExecucaoPensao = () => {
  usePageSEO({
    title: "Execução de Pensão Alimentícia | Cobre os Atrasados Rápido",
    description:
      "Ele parou de pagar a pensão? Saiba como a lei pode forçar o pagamento através de prisão civil, bloqueio de contas e desconto em salário. Fale com um especialista.",
  });

  const whatsappLink =
    "https://wa.me/5541999999999?text=Olá, preciso de ajuda urgente para cobrar pensão alimentícia atrasada.";

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-rose-500/30">
      <Header />

      <main className="pt-20">
        {/* HERO SECTION - Dor e Ação imediata */}
        <section className="bg-slate-950 text-white py-16 md:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.15)_0,rgba(2,6,23,1)_100%)] pointer-events-none" />

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/50 text-rose-400 px-5 py-2 rounded-full text-sm font-bold mb-8 animate-pulse">
              <AlertTriangle className="h-4 w-4" /> BASTA 1 MÊS DE ATRASO PARA EXECUTAR
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">
              O pai parou de pagar a pensão? <br />
              <span className="text-rose-500 underline decoration-rose-600 underline-offset-8">
                A lei está do seu lado.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light">
              Desculpas não pagam o supermercado. Pare de implorar pelo que é direito do seu filho. Atuamos com{" "}
              <strong className="text-white font-semibold">medidas drásticas</strong> para forçar o pagamento imediato.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-16 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 transition-all w-full sm:w-auto"
              >
                <a href={whatsappLink} className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-7 w-7" />
                  <span className="font-bold">Quero Cobrar a Pensão Agora</span>
                </a>
              </Button>
            </div>
            <p className="text-slate-400 text-sm mt-5 flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Sigilo total. Defesa humanizada e combativa.
            </p>
          </div>
        </section>

        {/* DOR E EMPATIA - O que ela está passando */}
        <section className="py-16 bg-rose-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-rose-100 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <Baby className="h-5 w-5" /> Prioridade Absoluta
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center mt-4">
                Sabemos o quanto é desgastante tentar resolver amigavelmente e só ouvir:
              </h2>
              <ul className="space-y-4 text-lg text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                  <span>"Este mês estou apertado, semana que vem eu deposito..."</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                  <span>"Fiquei desempregado, não tenho como pagar nada agora."</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                  <span>Ostenta nas redes sociais, mas diz que não tem dinheiro para o filho.</span>
                </li>
              </ul>
              <p className="text-center font-bold text-rose-700 mt-8 text-xl">
                A obrigação é dele, o desgaste não precisa ser seu. Deixe a Justiça fazer a cobrança.
              </p>
            </div>
          </div>
        </section>

        {/* AS SOLUÇÕES (O ARSENAL JURÍDICO) */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-rose-700 font-bold tracking-wider uppercase text-sm mb-2 block">
              Nosso Arsenal Jurídico
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              Como forçamos o devedor a pagar
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              A lei brasileira é extremamente rigorosa com quem não paga pensão. Usamos todos os meios legais
              disponíveis.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Lock,
                title: "Prisão Civil",
                desc: "A medida mais rápida. Se ele não pagar os últimos 3 meses em até 3 dias após notificado, o juiz decreta prisão de 1 a 3 meses em regime fechado.",
              },
              {
                icon: Wallet,
                title: "Bloqueio de Contas",
                desc: "Rastreamos e bloqueamos saldos em contas bancárias, poupanças e até investimentos (Bacenjud) para garantir os valores mais antigos.",
              },
              {
                icon: Gavel,
                title: "Desconto em Salário",
                desc: "Se ele trabalha com carteira assinada, oficiamos a empresa para que a pensão seja descontada direto na folha de pagamento.",
              },
              {
                icon: Scale,
                title: "Suspensão de CNH",
                desc: "Atingimos onde dói: pedimos a suspensão da Carteira de Habilitação, bloqueio de cartões de crédito e apreensão do passaporte do devedor.",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white"
              >
                <CardContent className="p-6">
                  <div className="bg-rose-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-rose-100">
                    <item.icon className="h-7 w-7 text-rose-700" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ - QUEBRANDO AS DESCULPAS DO DEVEDOR */}
        <section className="py-20 bg-slate-50">
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
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-rose-700">
                  Ele foi demitido e parou de pagar. Posso pedir a prisão?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  SIM! O desemprego não cancela a obrigação e não é desculpa para o calote. Enquanto ele não entrar com
                  um pedido de revisão e o juiz não autorizar, a pensão continua a acumular e ele pode ser preso pelos
                  atrasados.
                </AccordionContent>
              </AccordionItem>

              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-rose-700">
                  A guarda é compartilhada e ele acha que não precisa mais pagar. O que fazer?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Isso é um mito muito usado por devedores. A guarda compartilhada divide o convívio, mas não isenta o
                  pagamento da pensão se o juiz já a tiver fixado. Se ele parou de pagar por conta própria, podemos
                  executar e pedir o bloqueio das contas (Bacenjud).
                </AccordionContent>
              </AccordionItem>

              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-rose-700">
                  Meu filho fez 18 anos e o pai parou de depositar do nada. Ele pode?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Não! A pensão não é cancelada automaticamente aos 18 anos. O devedor é obrigado a entrar com uma Ação
                  de Exoneração. Se ele simplesmente parou de pagar, a dívida está a acumular e nós podemos executar os
                  meses em atraso rigorosamente.
                </AccordionContent>
              </AccordionItem>

              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-4" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-rose-700">
                  Quantos meses precisam atrasar para pedir a prisão?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Apenas 1 mês de atraso já é suficiente para darmos entrada no pedido de execução sob pena de prisão
                  civil. Não precisa esperar acumular 3 meses. Aja rápido para não deixar a dívida virar uma bola de
                  neve.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 relative overflow-hidden text-center container mx-auto px-4">
          <div className="bg-rose-700 rounded-[2rem] p-8 md:p-16 relative shadow-2xl overflow-hidden border-4 border-rose-600">
            <Gavel className="absolute -left-10 -bottom-10 h-64 w-64 text-rose-900/40 rotate-12" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">
                O direito do seu filho não pode esperar.
              </h2>
              <p className="text-xl text-rose-100 mb-10 max-w-2xl mx-auto font-medium">
                Clique no botão abaixo. Uma de nossas advogadas vai ouvir o seu caso com total sigilo e iniciar a
                cobrança judicial imediatamente.
              </p>

              <Button
                asChild
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 h-16 px-12 rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform group"
              >
                <a href={whatsappLink}>
                  Falar com Advogado Agora
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

export default ExecucaoPensao;
