import { whatsappUrl } from "@/lib/constants";
import { 
  MessageCircle, 
  ShieldCheck, 
  Lock, 
  Briefcase, 
  CheckCircle2, 
  FileText, 
  Scale, 
  ArrowRight,
  EyeOff
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ReabilitacaoCriminal = () => {
  usePageSEO({
    title: "Reabilitação Criminal | Limpe Seus Antecedentes e Recomece",
    description: "Já cumpriu a sua pena? Tem o direito legal de limpar a sua ficha criminal. Volte ao mercado de trabalho com sigilo absoluto. Fale com um advogado.",
  });

  const whatsappLink = "https://wa.me/5541995808145?text=Olá, cumpri a minha pena e quero dar entrada no pedido de Reabilitação Criminal para limpar o meu nome. Podem ajudar-me? (Garantia de sigilo)";

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-slate-500/30">
      <Header />
      
      <main className="pt-20">
        {/* HERO SECTION - Foco em Esperança e Sigilo */}
        <section className="bg-slate-950 text-white py-16 md:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(71,85,105,0.2)_0,rgba(2,6,23,1)_100%)] pointer-events-none" />
          
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-5 py-2 rounded-full text-sm font-bold mb-8">
              <Lock className="h-4 w-4" /> ATENDIMENTO COM SIGILO ABSOLUTO
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">
              Já pagou a sua dívida com a Justiça?<br />
              <span className="text-slate-400 underline decoration-slate-600 underline-offset-8">É hora de limpar o seu nome.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light">
              A Reabilitação Criminal é um direito seu. Ocultamos os seus antecedentes criminais de certidões públicas para que possa voltar ao mercado de trabalho de cabeça erguida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-16 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 transition-all w-full sm:w-auto">
                <a href={whatsappLink} className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-7 w-7" /> 
                  <span className="font-bold">Analisar o Meu Caso em Sigilo</span>
                </a>
              </Button>
            </div>
            <p className="text-slate-500 text-sm mt-5 flex items-center justify-center gap-2">
              <EyeOff className="h-4 w-4" /> Ninguém saberá que nos contactou.
            </p>
          </div>
        </section>

        {/* DOR E AGITAÇÃO - O peso do passado */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 relative">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center mt-4">
                O que uma Ficha Criminal suja está a custar-lhe?
              </h2>
              <ul className="space-y-4 text-lg text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-slate-900 shrink-0 mt-0.5" />
                  <span><strong>Perda de Empregos:</strong> É aprovado na entrevista, mas o RH recusa a contratação após pedir a Certidão de Antecedentes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-slate-900 shrink-0 mt-0.5" />
                  <span><strong>Concursos Públicos:</strong> Fica impedido de tomar posse em cargos públicos devido à investigação social.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-slate-900 shrink-0 mt-0.5" />
                  <span><strong>Constrangimento:</strong> Medo constante de que a sua família, vizinhos ou novos amigos descubram o seu passado.</span>
                </li>
              </ul>
              <p className="text-center font-bold text-slate-900 mt-8 text-xl border-t pt-8">
                A Lei determina que a pena não pode ser perpétua. Se já a cumpriu, tem o direito de seguir em frente.
              </p>
            </div>
          </div>
        </section>

        {/* A SOLUÇÃO E REQUISITOS */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-slate-600 font-bold tracking-wider uppercase text-sm mb-2 block">A Solução Legal</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Como funciona a Reabilitação Criminal</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Trata-se de um pedido judicial formal que decreta o sigilo absoluto sobre os processos criminais que já cumpriu.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                icon: ShieldCheck, 
                title: "Certidão Limpa", 
                desc: "Após a aprovação do Juiz, a sua Certidão de Antecedentes Criminais passará a constar como 'NADA CONSTA'." 
              },
              { 
                icon: Lock, 
                title: "Sigilo Judicial", 
                desc: "Os registos do processo não são apagados, mas ficam trancados. Apenas juízes em casos muito específicos poderão aceder a eles, nunca empresas ou civis." 
              },
              { 
                icon: Briefcase, 
                title: "Direitos Restaurados", 
                desc: "Volte a concorrer a vagas de emprego em grandes empresas e a prestar concursos públicos sem o fantasma do passado." 
              }
            ].map((item, idx) => (
              <Card key={idx} className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
                <CardContent className="p-8">
                  <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
                    <item.icon className="h-8 w-8 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ - QUEBRANDO OBJEÇÕES */}
        <section className="py-20 bg-slate-900 text-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-white">Dúvidas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-2">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-slate-300">
                  Quem tem direito à Reabilitação Criminal?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-base px-4 pb-4">
                  Tem direito qualquer pessoa que já tenha cumprido totalmente a sua pena (ou que esta tenha sido extinta) há pelo menos 2 anos, desde que tenha tido bom comportamento público e privado durante esse período.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-700 mx-4" />
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-slate-300">
                  Preciso ir a uma esquadra ou fórum?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-base px-4 pb-4">
                  Não. O nosso serviço é 100% digital e feito pelos nossos advogados. Fazemos o pedido diretamente ao Juiz da Vara de Execução Penal de forma eletrónica. O senhor(a) não precisa de se expor.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-700 mx-4" />
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-slate-300">
                  O processo vai sumir da Internet (Google, Jusbrasil)?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-base px-4 pb-4">
                  A Reabilitação decreta o sigilo judicial. Com essa decisão em mãos, a nossa equipa notifica os sites de busca (como o Jusbrasil, Escavador e Google) para que removam o seu nome das pesquisas associadas àquele processo criminal.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 relative overflow-hidden text-center container mx-auto px-4">
          <div className="bg-slate-200 rounded-[2rem] p-8 md:p-16 relative shadow-2xl overflow-hidden border-4 border-slate-300">
            <Scale className="absolute -left-10 -bottom-10 h-64 w-64 text-slate-300/50 rotate-12" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-slate-900">
                O seu passado não define o seu futuro.
              </h2>
              <p className="text-xl text-slate-700 mb-10 max-w-2xl mx-auto font-medium">
                Clique no botão abaixo. Vamos analisar o seu processo com total discrição e iniciar o seu pedido de reabilitação.
              </p>
              
              <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800 text-white h-16 px-12 rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform group">
                <a href={whatsappLink}>
                  Limpar a Minha Ficha Criminal
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

export default ReabilitacaoCriminal;
