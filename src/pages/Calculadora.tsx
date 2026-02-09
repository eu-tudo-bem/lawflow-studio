import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import TerminationCalculator from "@/components/landing/TerminationCalculator";

const Calculadora = () => {
  return (
    <div className="min-h-screen pt-20">
      <Header />
      <TerminationCalculator />
      <Footer />
    </div>
  );
};

export default Calculadora;
