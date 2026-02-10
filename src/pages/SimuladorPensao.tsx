import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import AlimonySimulator from "@/components/landing/AlimonySimulator";

const SimuladorPensao = () => {
  return (
    <div className="min-h-screen pt-20">
      <Header />
      <AlimonySimulator />
      <Footer />
    </div>
  );
};

export default SimuladorPensao;
