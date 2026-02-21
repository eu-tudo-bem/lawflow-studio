import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import RetirementSimulator from "@/components/landing/RetirementSimulator";

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
      <main id="simulador">
        <RetirementSimulator />
      </main>
      <Footer />
    </div>
  );
};

export default SimuladorAposentadoria;
