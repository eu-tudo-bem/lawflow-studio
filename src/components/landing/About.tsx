import { CheckCircle } from "lucide-react";

const values = [
  "Ética e transparência em todas as relações",
  "Comprometimento com resultados",
  "Atendimento personalizado e humanizado",
  "Sigilo profissional absoluto",
  "Atualização jurídica constante",
  "Agilidade no atendimento",
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-accent/10 text-accent rounded-full">
              Sobre Nós
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Tradição e modernidade a serviço da{" "}
              <span className="text-accent">Justiça</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Fundado em 2004, o escritório Silva & Associados nasceu com a missão 
              de oferecer serviços jurídicos de excelência, combinando a tradição 
              do Direito com soluções inovadoras para os desafios contemporâneos.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nossa equipe é formada por advogados especialistas em diversas áreas, 
              comprometidos com a defesa intransigente dos interesses de nossos 
              clientes e com a busca incessante pela justiça.
            </p>

            {/* Values */}
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((value) => (
                <div key={value} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="relative">
            <div className="bg-primary rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">
                    20+
                  </p>
                  <p className="text-primary-foreground/80 text-sm">
                    Anos de experiência
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">
                    15
                  </p>
                  <p className="text-primary-foreground/80 text-sm">
                    Advogados especializados
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">
                    2.500+
                  </p>
                  <p className="text-primary-foreground/80 text-sm">
                    Clientes satisfeitos
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">
                    95%
                  </p>
                  <p className="text-primary-foreground/80 text-sm">
                    Taxa de sucesso
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-accent/20 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
