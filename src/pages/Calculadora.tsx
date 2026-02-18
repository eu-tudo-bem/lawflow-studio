import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import TerminationCalculator from "@/components/landing/TerminationCalculator";

const Calculadora = () => {
  const location = useLocation();

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
        <TerminationCalculator />
      </div>
      <Footer />
    </div>
  );
};

export default Calculadora;
