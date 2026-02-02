import { ArrowRight, Shield, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Escritório de Advocacia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/85 to-navy-dark/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-accent/20 text-gold-light rounded-full animate-fade-up">
            Excelência Jurídica há mais de 20 anos
          </span>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Defendemos seus{" "}
            <span className="text-gold">direitos</span> com{" "}
            <span className="text-gold">dedicação</span> e expertise
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Nossa equipe de advogados especializados está pronta para oferecer 
            soluções jurídicas personalizadas, com ética, transparência e 
            comprometimento com seu caso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
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
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
            >
              Conheça nossos Serviços
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
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
