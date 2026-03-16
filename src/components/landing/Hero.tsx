import { ArrowRight, Shield, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

// Served from /public so the browser can discover & preload it before React hydrates
const heroBg = "/hero-bg.webp";

const TYPING_WORDS = [
  "Divórcio Consensual",
  "Pensão Alimentícia",
  "Direito Agrário",
  "Direito Trabalhista",
  "Inventário",
  "Direito Empresarial",
];

const TYPING_SPEED = 70;
const ERASING_SPEED = 40;
const PAUSE_AFTER_WORD = 1800;
const PAUSE_BEFORE_ERASE = 200;

function useTypingEffect(words: string[]) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = words[wordIndex];

    if (!isErasing && displayed.length < current.length) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        TYPING_SPEED
      );
    } else if (!isErasing && displayed.length === current.length) {
      timeoutRef.current = setTimeout(
        () => setIsErasing(true),
        PAUSE_AFTER_WORD
      );
    } else if (isErasing && displayed.length > 0) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(displayed.slice(0, -1)),
        ERASING_SPEED
      );
    } else if (isErasing && displayed.length === 0) {
      timeoutRef.current = setTimeout(() => {
        setIsErasing(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, PAUSE_BEFORE_ERASE);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, isErasing, wordIndex, words]);

  return { displayed, isErasing };
}

const Hero = () => {
  const { displayed, isErasing } = useTypingEffect(TYPING_WORDS);

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative flex items-center justify-center pt-20"
      style={{ contain: "layout size", height: "100vh", minHeight: "600px" }}
    >
      {/* Background Image with Overlay — position:absolute so it never contributes to layout flow */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          srcSet="/hero-bg-mobile.webp 640w, /hero-bg-tablet.webp 1280w, /hero-bg.webp 1920w"
          sizes="(max-width: 640px) 640px, (max-width: 1280px) 1280px, 1920px"
          alt="Escritório de Advocacia"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/85 to-navy-dark/70" />
      </div>

      {/* Content — rendered immediately visible; NO opacity-0 animations on the container or children
          to prevent CLS. Only the typing cursor uses animation (opacity blink, no layout impact). */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-accent/20 text-gold-light rounded-full">
            Excelência Jurídica há mais de 20 anos
          </span>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Defendemos seus direitos
            <br />
            em casos de{" "}
            {/* contain:layout isolates width changes from the typing effect */}
            <span className="inline-block relative pr-4" style={{ contain: "layout", minWidth: "2ch" }}>
              <span className="text-gold">{displayed}</span>
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 w-[3px] h-full bg-gold rounded-sm"
                style={{
                  animation: "blink 1s step-end infinite",
                  willChange: "opacity",
                }}
              />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
            Nossa equipe de advogados especializados está pronta para oferecer
            soluções jurídicas personalizadas, com ética, transparência e
            comprometimento com seu caso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
              onClick={scrollToContact}
            >
              Agende sua Consulta
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() =>
                document
                  .querySelector("#services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Conheça nossos Serviços
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Users className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-foreground">2.500+</p>
                <p className="text-sm text-primary-foreground/60">Clientes Atendidos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Award className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-foreground">95%</p>
                <p className="text-sm text-primary-foreground/60">Casos de Sucesso</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Shield className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-foreground">20+</p>
                <p className="text-sm text-primary-foreground/60">Anos de Experiência</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
