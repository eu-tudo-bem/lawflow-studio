import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import AlimonySimulator from "@/components/landing/AlimonySimulator";

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
      <div id="simulador">
        <AlimonySimulator />
      </div>
      <Footer />
    </div>
  );
};

export default SimuladorPensao;
