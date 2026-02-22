import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import { buildBreadcrumbSchema } from "@/lib/seoSchemas";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import RetirementSimulator from "@/components/landing/RetirementSimulator";
import RetirementSEOContent from "@/components/seo/RetirementSEOContent";

const breadcrumb = buildBreadcrumbSchema([
  { name: "Ferramentas Gratuitas", path: "/#ferramentas" },
  { name: "Simulador de Aposentadoria", path: "/simulador-aposentadoria" },
]);

const aposentadoriaFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quando posso me aposentar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende da regra aplicável. Na regra geral pós-reforma: homens precisam de 65 anos de idade e 20 anos de contribuição; mulheres, 62 anos e 15 anos de contribuição. Existem regras de transição que podem antecipar o benefício.",
      },
    },
    {
      "@type": "Question",
      name: "Como funciona a regra de pontos para aposentadoria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A regra de pontos soma a idade do segurado com o tempo de contribuição. Em 2026, são necessários 102 pontos para mulheres e 105 para homens, com mínimo de 30 e 35 anos de contribuição respectivamente.",
      },
    },
    {
      "@type": "Question",
      name: "Como é calculado o valor da aposentadoria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O valor é calculado com base na média de todos os salários de contribuição desde julho de 1994. O beneficiário recebe 60% dessa média + 2% por ano de contribuição que exceder 20 anos (homens) ou 15 anos (mulheres).",
      },
    },
  ],
};

const aposentadoriaHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como simular sua aposentadoria online",
  description: "Use o simulador para descobrir quando pode se aposentar e qual o valor estimado do benefício.",
  step: [
    { "@type": "HowToStep", name: "Informe seus dados pessoais", text: "Digite sua idade, sexo e tipo de vínculo (CLT, autônomo, servidor ou rural)." },
    { "@type": "HowToStep", name: "Informe o tempo de contribuição", text: "Digite quantos anos você já contribuiu para o INSS." },
    { "@type": "HowToStep", name: "Informe o salário médio", text: "Digite a média aproximada dos seus salários de contribuição." },
    { "@type": "HowToStep", name: "Veja o resultado", text: "O simulador mostra quando você poderá se aposentar e estima o valor do benefício." },
  ],
};

const SimuladorAposentadoria = () => {
  const location = useLocation();

  usePageSEO({
    title: "Simulador de Aposentadoria Online | Fernandez & Fernandes",
    description: "Verifique se você já pode se aposentar. Simulador gratuito com regras atualizadas da Reforma da Previdência. Calcule tempo de contribuição e idade mínima.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aposentadoriaFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aposentadoriaHowTo) }} />
      <main id="simulador">
        <RetirementSimulator />
      </main>
      <RetirementSEOContent />
      <Footer />
    </div>
  );
};

export default SimuladorAposentadoria;
