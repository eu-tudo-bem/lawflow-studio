import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import { buildBreadcrumbSchema } from "@/lib/seoSchemas";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import TerminationCalculator from "@/components/landing/TerminationCalculator";

const breadcrumb = buildBreadcrumbSchema([
  { name: "Ferramentas Gratuitas", path: "/#ferramentas" },
  { name: "Calculadora de Rescisão Trabalhista", path: "/calculadora" },
]);

const calculadoraFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como calcular rescisão trabalhista?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A rescisão trabalhista inclui saldo de salário, aviso prévio proporcional, 13º proporcional, férias proporcionais + 1/3, férias vencidas e multa de 40% do FGTS (em demissão sem justa causa). Use nosso simulador gratuito para obter uma estimativa completa.",
      },
    },
    {
      "@type": "Question",
      name: "Quais são meus direitos na demissão sem justa causa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Na demissão sem justa causa, o trabalhador tem direito a: saldo de salário, aviso prévio (trabalhado ou indenizado), 13º proporcional, férias proporcionais e vencidas + 1/3, multa de 40% sobre o FGTS, saque do FGTS e seguro-desemprego.",
      },
    },
    {
      "@type": "Question",
      name: "O cálculo da rescisão é preciso?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O simulador oferece uma estimativa baseada nos valores informados e nas regras da CLT. O valor final pode variar conforme convenções coletivas, adicionais e outras particularidades do contrato de trabalho.",
      },
    },
  ],
};

const calculadoraHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como calcular sua rescisão trabalhista online",
  description: "Passo a passo para calcular o valor estimado da sua rescisão usando o simulador gratuito.",
  step: [
    { "@type": "HowToStep", name: "Informe o salário", text: "Digite o valor do seu último salário bruto mensal." },
    { "@type": "HowToStep", name: "Selecione o tipo de rescisão", text: "Escolha entre demissão sem justa causa, pedido de demissão, justa causa ou rescisão indireta." },
    { "@type": "HowToStep", name: "Preencha o tempo de trabalho", text: "Informe a data de admissão e a data de demissão." },
    { "@type": "HowToStep", name: "Veja o resultado", text: "O simulador calcula automaticamente todos os valores devidos, incluindo saldo salarial, aviso prévio, 13º, férias e FGTS." },
  ],
};

const Calculadora = () => {
  const location = useLocation();

  usePageSEO({
    title: "Calculadora de Rescisão Trabalhista Grátis | Fernandez & Fernandes",
    description: "Calcule online o valor da sua rescisão trabalhista: saldo salarial, aviso prévio, 13º, férias e FGTS. Simulador gratuito atualizado pela CLT 2026.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculadoraFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculadoraHowTo) }} />
      <div id="simulador">
        <TerminationCalculator />
      </div>
      <Footer />
    </div>
  );
};

export default Calculadora;
