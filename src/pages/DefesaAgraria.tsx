import { 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Tractor, 
  Wheat, 
  Landmark, 
  ArrowRight,
  CloudLightning
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DefesaAgraria = () => {
  usePageSEO({
    title: "Defesa em Execução Agrária | Proteja sua Propriedade Rural",
    description: "O banco quer leiloar sua terra ou apreender sua safra? Atuação jurídica especializada em dívidas rurais, CPRs e alongamento de crédito rural.",
  });

  const whatsappLink = "https://wa.me/5541999999999?text=Olá, sou produtor rural, estou sofrendo uma execução do banco e preciso proteger meu patrimônio urgente.";

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-green-500/30">
      <Header />
      
      <main className="pt-20">
        {/* HERO SECTION - Focada no Medo de Perder a Terra */}
        <section className="bg-[#0f172a] text-white py-16 md:py-28 px-4 relative overflow-hidden">
          {/* Fundo escuro com tom esverdeado sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(21,128,61,0.15)_0,rgba(15,23,42,1)_100%)] pointer-events-none" />
          
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-5 py-2 rounded-full text-sm font-bold mb-8 animate-pulse">
              <AlertTriangle className="h-4 w-4" /> RISCO DE LEILÃO E ARRESTO DE SAFRA
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">
              O Banco está ameaçando tomar a sua <span className="text-green-500 underline decoration-green-600 underline-offset-8">Propriedade Rural?</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light">
              Quebra de safra não é crime. O alongamento da sua dívida rural é um <strong className="text-white font-semibold">DIREITO</strong> seu, não um favor do gerente. Proteja seu legado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-16 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 transition-all w-full sm:w-auto">
                <a href={whatsappLink} className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-7 w-7" /> 
                  <span className="font-bold">Falar com Especialista em Agronegócio</span>
                </a>
              </Button>
            </div>
            <p className="text-slate-400 text-sm mt-5 flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Sigilo total. Defendemos produtores em todo o Brasil.
            </p>
          </div>
        </section>

        {/* DOR DO PRODUTOR - O QUE ESTÁ EM JOGO */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-red-100 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> O Perigo da Inércia
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center mt-4">
                Se você ignorar a notificação do banco, eles vão:
              </h2>
              <ul className="space-y-4 text-lg text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>Levar a sua terra (Fazenda/Sítio) a <strong>Leilão Judicial</strong> por metade do valor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>Fazer o <strong>Arresto da sua Safra</strong> direto no silo ou cooperativa, bloqueando seus recebíveis.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <span>Realizar a <strong>Busca e Apreensão de Maquinários</strong> (Tratores, Colheitadeiras) essenciais para o plantio.</span>
                </li>
              </ul>
              <p className="text-center font-bold text-red-600 mt-8 text-xl">
                A execução é rápida e implacável. Você precisa de uma barreira jurídica agora!
              </p>
            </div>
          </div>
        </section>

        {/* SOLUÇÕES E ESTRATÉGIAS (A LEI A FAVOR DELE) */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-green-700 font-bold tracking-wider uppercase text-sm mb-2 block">Nosso Arsenal Jurídico</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Como vamos blindar o seu patrimônio</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Temos estratégias comprovadas no STJ para barrar execuções e forçar o banco a negociar nos termos do Manual de Crédito Rural.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: Wheat, 
                title: "Alongamento de Dívida", 
                desc: "O banco negou a prorrogação? A Súmula 298 do STJ garante o direito de alongar a dívida rural em caso de frustração de safra ou crise de mercado." 
              },
              { 
                icon: Landmark, 
                title: "Defesa de Penhora", 
                desc: "Alegamos a impenhorabilidade da pequena propriedade rural (trabalhada pela família) para anular leilões de terras imediatamente." 
              },
              { 
                icon: CloudLightning, 
                title: "Quebra de Safra (Clima)", 
                desc: "Seca, excesso de chuva ou pragas. Usamos laudos agronômicos para suspender as cobranças bancárias com base na teoria da imprevisão." 
              },
              { 
                icon: Tractor, 
                title: "Revisão de CPR e Juros", 
                desc: "Bancos embutem juros ilegais, taxas casadas e multas abusivas em CPRs e Cédulas Rurais. Limpamos o contrato e reduzimos o saldo devedor real." 
              }
            ].map((item, idx) => (
              <Card key={idx} className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
                <CardContent className="p-6">
                  <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                    <item.icon className="h-7 w-7 text-green-700" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PROCESSO DIGITAL PARA QUEM ESTÁ NA FAZENDA */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Atendimento Digital para o Homem do Campo</h2>
            <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto">
              Sabemos que seu tempo é na lavoura. Você não precisa sair da fazenda para ser defendido. Nossas reuniões, análises de laudos e defesas são 100% digitais.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <MessageCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">1. Contato Rápido</h3>
                <p className="text-slate-400">Mande um WhatsApp e explique a situação do seu financiamento e da sua lavoura.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <AlertTriangle className="h-10 w-10 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">2. Análise da Execução</h3>
                <p className="text-slate-400">Envie a notificação do banco. Verificamos imediatamente falhas do credor e abusos.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <Scale className="h-10 w-10 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">3. Bloqueio Judicial</h3>
                <p className="text-slate-400">Entramos com a defesa (Embargos à Execução) para travar penhoras e leilões.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-slate-900">Dúvidas Comuns do Produtor</h2>
            <Accordion type="single" collapsible className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-green-700">
                  Dei minha única fazenda como garantia no banco. Posso perdê-la?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Se a sua terra se enquadra como "pequena propriedade rural" (até 4 módulos fiscais) e é trabalhada por você e sua família, ela é protegida pela Constituição (Impenhorabilidade), MESMO que você a tenha dado em garantia hipotecária. Nós fazemos essa defesa para anular o leilão.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-green-700">
                  Tive quebra de safra por falta de chuva, mas o banco não aceitou prorrogar.
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  O banco costuma negar administrativamente para forçar juros maiores. Porém, a Súmula 298 do STJ estabelece que o alongamento da dívida é um DIREITO do produtor que comprove perda de safra ou dificuldade de comercialização. Nós entramos com uma ação para impor esse alongamento à força.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-green-700">
                  O banco penhorou minha conta onde recebo o leite/safra. O que fazer?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Isso compromete o seu fomento e sustento. Protocolamos um pedido de urgência (tutela) demonstrando que esse dinheiro tem caráter alimentar e é necessário para a manutenção da atividade rural, buscando o desbloqueio imediato.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 relative overflow-hidden text-center container mx-auto px-4">
          <div className="bg-green-800 rounded-[2rem] p-8 md:p-16 relative shadow-2xl overflow-hidden border-4 border-green-700">
            <Tractor className="absolute -left-10 -bottom-10 h-64 w-64 text-green-900/40 rotate-12" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">
                O trator do banco não vai passar por cima do seu direito.
              </h2>
              <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto font-medium">
                Clique no botão abaixo. Vamos analisar o seu contrato, o andamento da execução e montar uma barreira jurídica para salvar sua fazenda.
              </p>
              
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 h-16 px-12 rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform group">
                <a href={whatsappLink}>
                  Blindar Meu Patrimônio Agora
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
