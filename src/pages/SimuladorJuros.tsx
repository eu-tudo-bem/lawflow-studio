import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import InterestSimulator from "@/components/landing/InterestSimulator";

const SimuladorJuros = () => {
  return (
    <div className="min-h-screen pt-20">
      <Header />
      <InterestSimulator />
      <Footer />
    </div>
  );
};

export default SimuladorJuros;
