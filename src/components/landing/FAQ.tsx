import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quanto custa uma consulta com advogado?",
    answer:
      "A primeira consulta pode ser agendada sem compromisso. Os honorários variam conforme a complexidade do caso e a área do direito. Entre em contato para receber uma proposta personalizada.",
  },
  {
    question: "Quais áreas do direito o escritório atende?",
    answer:
      "Atuamos em Direito Trabalhista, Família, Empresarial, Civil, Tributário, Criminal, Imobiliário e Administrativo, com advogados especializados em cada área.",
  },
  {
    question: "Como funciona o atendimento online?",
    answer:
      "Oferecemos atendimento por videochamada, WhatsApp e e-mail. Você pode agendar uma consulta online diretamente pelo nosso site ou pelo WhatsApp, sem precisar se deslocar.",
  },
  {
    question: "O escritório atende em São Paulo e região?",
    answer:
      "Sim, nosso escritório está localizado na Av. Paulista, em São Paulo - SP, e atendemos clientes de toda a região metropolitana, além de atendimento remoto para todo o Brasil.",
  },
  {
    question: "Quanto tempo demora um processo judicial?",
    answer:
      "O prazo varia conforme a complexidade e a área do direito. Processos trabalhistas costumam levar de 6 meses a 2 anos, enquanto processos de família podem variar bastante. Na consulta inicial, fornecemos uma estimativa realista para o seu caso.",
  },
  {
    question: "O que preciso levar na primeira consulta?",
    answer:
      "Documentos pessoais (RG, CPF), comprovante de residência e todos os documentos relacionados ao seu caso (contratos, notificações, comprovantes, etc.). Quanto mais informação, melhor será a análise.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-accent/10 text-accent rounded-full">
            Dúvidas Frequentes
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Perguntas frequentes sobre advocacia
          </h2>
          <p className="text-muted-foreground">
            Tire suas principais dúvidas sobre nossos serviços jurídicos,
            atendimento e processos.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-lg border-0 shadow-card px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* FAQ Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
};

export default FAQ;
