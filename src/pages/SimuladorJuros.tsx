import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import InterestSimulator from "@/components/landing/InterestSimulator";

const jurosFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como saber se estou pagando juros abusivos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Compare a taxa do seu contrato com a taxa média do Banco Central para a mesma modalidade. Se a taxa cobrada for significativamente superior à média de mercado, pode ser considerada abusiva e passível de revisão judicial.",
      },
    },
    {
      "@type": "Question",
      name: "É possível reduzir juros de empréstimo na Justiça?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. O consumidor pode entrar com ação revisional de contrato para reduzir juros abusivos. O STJ já firmou entendimento de que taxas muito acima da média de mercado podem ser revisadas judicialmente.",
      },
    },
    {
      "@type": "Question",
      name: "Quais tipos de contrato podem ter juros revisados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Financiamentos de veículos, empréstimos pessoais, financiamentos imobiliários, cartão de crédito e cheque especial são os tipos mais comuns de contratos com juros abusivos passíveis de revisão.",
      },
    },
  ],
};

const jurosHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como verificar se seus juros são abusivos",
  description: "Passo a passo para usar o simulador e descobrir se você paga juros acima do mercado.",
  step: [
    { "@type": "HowToStep", name: "Selecione o tipo de contrato", text: "Escolha entre veículo, imóvel, empréstimo pessoal ou outro." },
    { "@type": "HowToStep", name: "Informe os valores", text: "Digite o valor financiado, número e valor das parcelas." },
    { "@type": "HowToStep", name: "Informe a taxa cobrada", text: "Digite a taxa de juros mensal do seu contrato, se souber." },
    { "@type": "HowToStep", name: "Veja a análise", text: "O simulador compara sua taxa com a média de mercado e indica se há abusividade." },
  ],
};

const SimuladorJuros = () => {
  const location = useLocation();

  usePageSEO({
    title: "Simulador de Juros Abusivos Online | Fernandez & Fernandes",
    description: "Descubra se você está pagando juros abusivos em empréstimos ou financiamentos. Simulador gratuito para revisão de contratos bancários.",
  });

  useEffect(() => {
    if (location.hash === "#simulador") {
      setTimeout(() => {
        document.getElementById("simulador")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen pt-20">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jurosFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jurosHowTo) }} />
      <div id="simulador">
        <InterestSimulator />
      </div>
      <Footer />
    </div>
  );
};

export default SimuladorJuros;
