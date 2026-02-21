import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import OvertimeSimulator from "@/components/landing/OvertimeSimulator";

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
      <div id="simulador">
        <OvertimeSimulator />
      </div>
      <Footer />
    </div>
  );
};

export default SimuladorHorasExtras;
