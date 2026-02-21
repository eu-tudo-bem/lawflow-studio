import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import About from "@/components/landing/About";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const location = useLocation();

  usePageSEO({
    title: "Fernandez & Fernandes | Advocacia Estratégica",
    description: "Escritório de advocacia com mais de 20 anos de experiência. Atuação em direito trabalhista, família, empresarial, tributário e mais. Agende sua consulta.",
  });

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
