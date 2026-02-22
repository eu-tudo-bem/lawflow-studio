import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import { buildBreadcrumbSchema } from "@/lib/seoSchemas";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import OvertimeSimulator from "@/components/landing/OvertimeSimulator";
import OvertimeSEOContent from "@/components/seo/OvertimeSEOContent";

const breadcrumb = buildBreadcrumbSchema([
  { name: "Ferramentas Gratuitas", path: "/#ferramentas" },
  { name: "Simulador de Horas Extras", path: "/simulador-horas-extras" },
]);

const horasExtrasFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como calcular o valor da hora extra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A hora extra é calculada dividindo o salário mensal por 220 (para jornada de 44h semanais) e aplicando o adicional: 50% em dias úteis e 100% em domingos e feriados. Convenções coletivas podem prever percentuais maiores.",
      },
    },
    {
      "@type": "Question",
      name: "O que é adicional noturno e como funciona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O adicional noturno é de no mínimo 20% sobre a hora normal para trabalho entre 22h e 5h. A hora noturna é reduzida (52min30s). Se combinado com hora extra, os adicionais são acumulados.",
      },
    },
    {
      "@type": "Question",
      name: "Qual o prazo para cobrar horas extras não pagas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O trabalhador tem até 2 anos após o término do contrato de trabalho para entrar com ação trabalhista, podendo cobrar as horas extras dos últimos 5 anos trabalhados.",
      },
    },
  ],
};

const horasExtrasHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como calcular horas extras e adicional noturno",
  description: "Passo a passo para usar o simulador e descobrir quanto você tem a receber de horas extras.",
  step: [
    { "@type": "HowToStep", name: "Informe o salário", text: "Digite o valor do seu salário bruto mensal." },
    { "@type": "HowToStep", name: "Informe a jornada", text: "Selecione sua jornada semanal contratual (44h, 40h, 36h ou 30h)." },
    { "@type": "HowToStep", name: "Informe as horas extras", text: "Digite quantas horas extras você faz por semana e se trabalha em horário noturno." },
    { "@type": "HowToStep", name: "Veja o resultado", text: "O simulador calcula o valor mensal devido e a projeção de 5 anos para uma possível ação trabalhista." },
  ],
};

const SimuladorHorasExtras = () => {
  const location = useLocation();

  usePageSEO({
    title: "Simulador de Horas Extras e Adicional Noturno | Fernandez & Fernandes",
    description: "Calculadora de horas extras online grátis. Descubra quanto pode receber de hora extra e adicional noturno com cálculo atualizado pela CLT.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(horasExtrasFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(horasExtrasHowTo) }} />
      <div id="simulador">
        <OvertimeSimulator />
      </div>
      <OvertimeSEOContent />
      <Footer />
    </div>
  );
};

export default SimuladorHorasExtras;
