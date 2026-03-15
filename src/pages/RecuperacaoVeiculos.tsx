import { MessageCircle, Car, ShieldCheck, Clock, FileText, AlertTriangle, CheckCircle2, Scale } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const RecuperacaoVeiculos = () => {
  usePageSEO({
    title: "Recuperação de Veículos Apreendidos | Advogado Especialista em Busca e Apreensão",
    description: "Teve seu veículo apreendido? Atuação jurídica rápida para liberação de carros e motos com busca e apreensão ou irregularidades. Fale conosco agora.",
  });

  const whatsappLink = "https://wa.me/5541999999999?text=Olá, preciso de ajuda urgente com um veículo apreendido.";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-16 md:py-24 px-4 relative overflow-hidden">
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <AlertTriangle className="h-4 w-4" /> ATENDIMENTO DE URGÊNCIA 24H
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Recupere seu Veículo <span className="text-yellow-500">Apreendido</span> com Estratégia Jurídica
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
              Proteja seu patrimônio. Atuamos na defesa contra busca e apreensão, juros abusivos e liberação de veículos em pátios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white h-14 px-10 rounded-full text-lg shadow-xl hover:scale-105 transition-all">
                <a href={whatsappLink} className="flex items-center gap-2">
                  <MessageCircle className="h-6 w-6" /> Falar com Advogado Agora
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Serviços / Diferenciais */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Como ajudamos você</h2>
            <p className="text-slate-600">Soluções jurídicas rápidas para as situações mais críticas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Scale, title: "Defesa em Busca e Apreensão", desc: "Análise técnica para suspender a liminar e manter o veículo com você." },
              { icon: Clock, title: "Liberação de Pátio", desc: "Agilidade nos trâmites administrativos para retirada de veículos apreendidos por blitz." },
              { icon: FileText, title: "Revisão de Juros", desc: "Redução de parcelas abusivas que levam à inadimplência e risco de perda do bem." }
            ].map((item, idx) => (
              <Card key={idx} className="border-slate-100 shadow-sm hover:shadow-md transition-all">
                <CardContent className="pt-8">
                  <item.icon className="h-12 w-12 text-yellow-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">Dúvidas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>O banco levou meu carro, ainda dá tempo?</AccordionTrigger>
                <AccordionContent>
                  Sim. Após a apreensão, existe um prazo curto de 5 dias para purgar a mora ou apresentar defesa para tentar reverter a situação.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Posso perder meu veículo por IPVA atrasado?</AccordionTrigger>
                <AccordionContent>
                  O veículo pode ser apreendido em blitz, mas existem meios legais de facilitar a retirada e questionar taxas abusivas de pátio.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 text-center container mx-auto px-4">
          <div className="bg-slate-900 rounded-3xl p-10 md:p-20 text-white">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Não deixe seu veículo ir a leilão</h2>
            <p className="text-xl text-slate-400 mb-10">Inicie sua defesa agora mesmo de forma 100% digital.</p>
            <Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 h-14 px-12 rounded-full">
              <a href={whatsappLink}>Iniciar Consulta Gratuita</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RecuperacaoVeiculos;
