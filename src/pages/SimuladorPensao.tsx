import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import { buildBreadcrumbSchema } from "@/lib/seoSchemas";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import AlimonySimulator from "@/components/landing/AlimonySimulator";

const breadcrumb = buildBreadcrumbSchema([
  { name: "Ferramentas Gratuitas", path: "/#ferramentas" },
  { name: "Simulador de Pensão Alimentícia", path: "/simulador-pensao" },
]);

const pensaoFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como é calculada a pensão alimentícia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A pensão alimentícia é calculada com base na necessidade do alimentando e na capacidade financeira do alimentante. Geralmente varia entre 15% e 30% da renda líquida do pagador, podendo incluir despesas extras como saúde e educação.",
      },
    },
    {
      "@type": "Question",
      name: "Até que idade se paga pensão alimentícia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Em regra, a pensão é devida até os 18 anos. Porém, pode ser estendida até os 24 anos se o filho estiver cursando ensino superior ou técnico. Em casos especiais (deficiência, incapacidade), pode ser vitalícia.",
      },
    },
    {
      "@type": "Question",
      name: "É possível reduzir o valor da pensão alimentícia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. É possível pedir revisão judicial da pensão alimentícia quando houver mudança na situação financeira do pagador ou nas necessidades do alimentando. É necessário comprovar a alteração por meio de documentos.",
      },
    },
  ],
};

const pensaoHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como simular o valor da pensão alimentícia",
  description: "Use o simulador gratuito para estimar o valor da pensão alimentícia com base na sua situação.",
  step: [
    { "@type": "HowToStep", name: "Informe seu papel", text: "Indique se você é quem paga ou quem recebe a pensão." },
    { "@type": "HowToStep", name: "Adicione os dependentes", text: "Informe o número e a idade dos filhos." },
    { "@type": "HowToStep", name: "Informe a renda", text: "Digite a renda mensal do alimentante." },
    { "@type": "HowToStep", name: "Veja a estimativa", text: "O simulador calcula automaticamente a faixa estimada de pensão alimentícia." },
  ],
};

const SimuladorPensao = () => {
  const location = useLocation();

  usePageSEO({
    title: "Simulador de Pensão Alimentícia Online | Fernandez & Fernandes",
    description: "Calcule uma estimativa de pensão alimentícia com base na renda e número de dependentes. Simulador gratuito e atualizado conforme a legislação vigente.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pensaoFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pensaoHowTo) }} />
      <div id="simulador">
        <AlimonySimulator />
      </div>
      <Footer />
    </div>
  );
};

export default SimuladorPensao;
