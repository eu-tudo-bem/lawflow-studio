import { whatsappUrl } from "@/lib/constants";
import { 
  MessageCircle, 
  ShieldCheck, 
  Globe2, 
  Plane, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Scale, 
  ArrowRight,
  Landmark
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Naturalizacao = () => {
  usePageSEO({
    title: "Naturalização de Estrangeiros | Advogado de Imigração",
    description: "Conquiste o seu Passaporte Brasileiro sem burocracia. Assessoria jurídica completa para naturalização ordinária, extraordinária e por casamento.",
  });

  const whatsappLink = "https://wa.me/5541995808145?text=Olá, sou estrangeiro e quero dar início ao meu processo de naturalização brasileira. Podem ajudar-me?";

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-blue-500/30">
      <Header />
      
      <main className="pt-20">
        {/* HERO SECTION - Focada no Sonho e na Liberdade */}
        <section className="bg-slate-950 text-white py-16 md:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0,rgba(2,6,23,1)_100%)] pointer-events-none" />
          
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 px-5 py-2 rounded-full text-sm font-bold mb-8">
              <Globe2 className="h-4 w-4" /> ASSESSORIA JURÍDICA MIGRATÓRIA
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">
              Conquiste a sua <span className="text-blue-500 underline decoration-blue-600 underline-offset-8">Cidadania Brasileira</span> sem stress.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light">
              Esqueça as filas da Polícia Federal e a burocracia do sistema. Cuidamos de todo o seu processo de naturalização para que consiga o seu passaporte brasileiro de forma segura e ágil.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-16 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-105 transition-all w-full sm:w-auto">
                <a href={whatsappLink} className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-7 w-7" /> 
                  <span className="font-bold">Falar com Advogado de Imigração</span>
                </a>
              </Button>
            </div>
            <p className="text-slate-400 text-sm mt-5 flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Atendimento em Português, Inglês e Espanhol.
            </p>
          </div>
        </section>

        {/* DOR & AGITAÇÃO - A Burocracia Brasileira */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-blue-100 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> O Custo de Fazer Sozinho
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center mt-4">
                A Polícia Federal não perdoa erros no processo:
              </h2>
              <ul className="space-y-4 text-lg text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Processos Arquivados:</strong> A falta de um único documento traduzido e apostilado pode fazer o seu pedido ser negado após meses de espera.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Sistema Confuso:</strong> O <em>MigranteWeb</em> muda constantemente. Submeter os formulários incorretos gera atrasos de anos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Limitações da Vida Civil:</strong> Sem a naturalização, você não pode obter o passaporte, prestar concursos públicos ou votar.</span>
                </li>
              </ul>
              <p className="text-center font-bold text-blue-700 mt-8 text-xl">
                Nós blindamos o seu pedido para que seja aprovado à primeira.
              </p>
            </div>
          </div>
        </section>

        {/* SOLUÇÕES (OS TIPOS DE NATURALIZAÇÃO) */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-700 font-bold tracking-wider uppercase text-sm mb-2 block">Tipos de Vistos e Cidadania</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Qual é o seu caminho para a Naturalização?</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Analisamos o seu perfil para enquadrar o seu pedido na lei migratória mais rápida possível.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: FileText, 
                title: "Ordinária (Padrão)", 
                desc: "Para quem reside legalmente no Brasil há pelo menos 4 anos. O prazo pode cair para 1 ano se tiver filho brasileiro ou cônjuge." 
              },
              { 
                icon: ShieldCheck, 
                title: "Extraordinária", 
                desc: "Para estrangeiros que vivem no Brasil há mais de 15 anos ininterruptos, exigindo menos documentos e comprovações." 
              },
              { 
                icon: Plane, 
                title: "Casamento ou União", 
                desc: "Assessoria completa para regularização e naturalização baseada em casamento ou união estável com cidadão brasileiro." 
              },
              { 
                icon: Landmark, 
                title: "Investidores", 
                desc: "Para estrangeiros que pretendem investir em imóveis ou empresas no Brasil, garantindo a autorização de residência." 
              }
            ].map((item, idx) => (
              <Card key={idx} className="border-slate-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
                <CardContent className="p-6">
                  <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                    <item.icon className="h-7 w-7 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PROCESSO 100% ONLINE E ASSESSORIA COMPLETA */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Da Análise ao Passaporte na Mão</h2>
            <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto">
              Cuidamos de 100% dos trâmites legais. Só precisará de comparecer na Polícia Federal quando formos recolher a sua biometria e entregar a sua nova carteira.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <FileText className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">1. Auditoria de Documentos</h3>
                <p className="text-slate-400">Verificamos e organizamos antecedentes criminais, certidões e tratamos das traduções ajuramentadas.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <Globe2 className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">2. Protocolo Oficial</h3>
                <p className="text-slate-400">Preenchemos o MigranteWeb e montamos a fundamentação jurídica perfeita para o Ministério da Justiça.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <Scale className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">3. Acompanhamento</h3>
                <p className="text-slate-400">Monitorizamos o seu processo diariamente, respondendo a qualquer exigência do Governo imediatamente.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - QUEBRANDO OBJEÇÕES DO ESTRANGEIRO */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-slate-900">Dúvidas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-blue-700">
                  Perco a minha nacionalidade de origem se me tornar brasileiro?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Na grande maioria dos casos, não. O Brasil aceita a dupla nacionalidade (e até múltiplas). Contudo, é importante avaliarmos a legislação do seu país de origem. Os nossos advogados farão essa análise por si.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-blue-700">
                  Preciso fazer a prova de proficiência em Português (Celpe-Bras)?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  Para a Naturalização Ordinária, sim, precisa comprovar que sabe comunicar em português. No entanto, existem isenções para cidadãos de países de língua portuguesa (CPLP) e meios alternativos de comprovação que a nossa equipa pode auxiliar a obter.
                </AccordionContent>
              </AccordionItem>
              <div className="h-px bg-slate-100 mx-4" />
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-left font-bold text-lg px-4 hover:text-blue-700">
                  Quanto tempo demora até ser aprovado?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base px-4 pb-4">
                  O prazo legal de análise pelo Ministério da Justiça é de cerca de 180 dias. Mas se o processo for protocolado com erros, pode demorar anos ou ser negado. Por isso a assessoria jurídica garante que o seu processo corra no menor tempo possível.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 relative overflow-hidden text-center container mx-auto px-4">
          <div className="bg-blue-900 rounded-[2rem] p-8 md:p-16 relative shadow-2xl overflow-hidden border-4 border-blue-800">
            <Plane className="absolute -left-10 -bottom-10 h-64 w-64 text-blue-950/40 rotate-12" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">
                Dê o passo definitivo para o seu futuro no Brasil.
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
                Clique no botão abaixo para agendar a sua consulta com um advogado especialista. Vamos analisar a sua documentação e traçar a rota mais rápida para a sua cidadania.
              </p>
              
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 h-16 px-12 rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform group">
                <a href={whatsappLink}>
                  Iniciar o Meu Processo Agora
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

export default Naturalizacao;
