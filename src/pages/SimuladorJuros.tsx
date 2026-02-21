import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import InterestSimulator from "@/components/landing/InterestSimulator";

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
      <div id="simulador">
        <InterestSimulator />
      </div>
      <Footer />
    </div>
  );
};

export default SimuladorJuros;
