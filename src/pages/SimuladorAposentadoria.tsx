import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import RetirementSimulator from "@/components/landing/RetirementSimulator";

const SimuladorAposentadoria = () => {
  return (
    <div className="min-h-screen pt-20">
      <Header />
      <main>
        <RetirementSimulator />
      </main>
      <Footer />
    </div>
  );
};

export default SimuladorAposentadoria;
