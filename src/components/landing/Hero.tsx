import { ArrowRight, Shield, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

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
      timeoutRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), TYPING_SPEED);
    } else if (!isErasing && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setIsErasing(true), PAUSE_AFTER_WORD);
    } else if (isErasing && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), ERASING_SPEED);
    } else if (isErasing && displayed.length === 0) {
      timeoutRef.current = setTimeout(() => { setIsErasing(false); setWordIndex((i) => (i + 1) % words.length); }, PAUSE_BEFORE_ERASE);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, isErasing, wordIndex, words]);

  return { displayed, isErasing };
}

const stats = [
  { icon: Users,  value: "2.500+", label: "Clientes Atendidos" },
  { icon: Award,  value: "95%",    label: "Casos de Sucesso" },
  { icon: Shield, value: "20+",    label: "Anos de Experiência" },
];

const Hero = () => {
  const { displayed } = useTypingEffect(TYPING_WORDS);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden grain-overlay"
      style={{ height: "100vh", minHeight: "640px", background: "hsl(var(--navy-dark))" }}
    >
      {/* Background image — right half */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          srcSet="/hero-bg-mobile.webp 640w, /hero-bg-tablet.webp 1280w, /hero-bg.webp 1920w"
          sizes="(max-width: 640px) 640px, (max-width: 1280px) 1280px, 1920px"
          alt="Escritório Fernandez & Fernandes"
          className="w-full h-full object-cover object-center"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
        />
        {/* Strong left vignette to create the split-screen illusion */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/92 to-navy-dark/30" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-transparent to-transparent" />
      </div>

      {/* Content: two-column split layout */}
      <div className="absolute inset-0 z-10 flex items-center" style={{ paddingTop: "96px" }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — Editorial Typography */}
            <div className="flex flex-col justify-center">
              {/* Label */}
              <span className="label-track text-gold/70 mb-6 flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-gold/50" />
                Excelência Jurídica · Desde 2004
              </span>

              {/* Main heading — exaggerated scale */}
              <h1 className="font-serif font-bold text-primary-foreground leading-[0.95] mb-6"
                  style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", letterSpacing: "-0.02em" }}>
                Defendemos
                <br />
                seus direitos
                <br />
                em{" "}
                <span
                  className="inline-block relative pr-4"
                  style={{ contain: "layout", minWidth: "2ch" }}
                >
                  <em className="not-italic text-gold">{displayed}</em>
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 w-[3px] h-full bg-gold rounded-sm"
                    style={{ animation: "blink 1s step-end infinite", willChange: "opacity" }}
                  />
                </span>
              </h1>

              <p className="text-primary-foreground/60 text-base leading-relaxed mb-10 max-w-md font-sans">
                Nossa equipe de advogados especializados oferece soluções jurídicas 
                personalizadas com ética, transparência e comprometimento total com o seu caso.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-14">
                <Button
                  size="lg"
                  className="bg-gold text-navy-dark hover:bg-gold/90 font-semibold shadow-gold rounded-xl px-8"
                  onClick={scrollToContact}
                >
                  Agende sua Consulta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/15 text-primary-foreground/70 hover:text-primary-foreground hover:border-white/30 hover:bg-white/5 rounded-xl px-8"
                  onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Nossas Áreas de Atuação
                </Button>
              </div>

              {/* Stats row */}
              <div className="flex gap-8">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-gold/70" />
                      <p className="font-serif text-2xl font-bold text-primary-foreground">{value}</p>
                    </div>
                    <p className="label-track text-primary-foreground/40 text-[10px]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Floating image frame (desktop only) */}
            <div className="hidden lg:flex justify-end items-center">
              <div
                className="relative animate-float"
                style={{ width: "360px", height: "460px" }}
              >
                {/* Decorative border frame */}
                <div className="absolute -inset-3 rounded-3xl border border-gold/20" />
                <div className="absolute -inset-6 rounded-3xl border border-gold/8" />

                {/* Image */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-luxury group">
                  <img
                    src={heroBg}
                    alt="Advocacia Estratégica"
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                    width={360}
                    height={460}
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Subtle color overlay */}
                  <div className="absolute inset-0 bg-navy-dark/30 mix-blend-multiply" />
                  {/* Gold corner accent */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="glass-card rounded-xl px-4 py-3">
                      <p className="label-track text-gold text-[10px]">Fernandez & Fernandes</p>
                      <p className="font-serif text-sm text-primary-foreground/80 mt-0.5">
                        Advocacia Estratégica
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-5 -right-5 glass-card rounded-2xl px-4 py-3 border border-gold/20 shadow-gold">
                  <p className="label-track text-gold text-[10px]">Taxa de Sucesso</p>
                  <p className="font-serif text-2xl font-bold text-primary-foreground">95%</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
