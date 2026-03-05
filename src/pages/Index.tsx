import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { usePageSEO } from "@/hooks/usePageSEO";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";

// Below-the-fold sections: lazy-loaded to reduce initial JS parse time and improve FCP
const Services = lazy(() => import("@/components/landing/Services"));
const About = lazy(() => import("@/components/landing/About"));
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const FAQ = lazy(() => import("@/components/landing/FAQ"));
const Contact = lazy(() => import("@/components/landing/Contact"));
const Footer = lazy(() => import("@/components/landing/Footer"));

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
