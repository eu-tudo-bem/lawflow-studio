import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import OvertimeSimulator from "@/components/landing/OvertimeSimulator";

const SimuladorHorasExtras = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Simulador de Horas Extras e Adicional Noturno – Cálculo Atualizado 2026";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Calculadora de horas extras online grátis. Descubra quanto pode receber de hora extra e adicional noturno com cálculo atualizado pela CLT.");
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = "Calculadora de horas extras online grátis. Descubra quanto pode receber de hora extra e adicional noturno com cálculo atualizado pela CLT.";
      document.head.appendChild(newMeta);
    }
  }, []);

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
