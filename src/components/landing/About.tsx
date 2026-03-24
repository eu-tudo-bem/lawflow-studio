import { CheckCircle } from "lucide-react";

const values = [
  "Ética e transparência em todas as relações",
  "Comprometimento com resultados",
  "Atendimento personalizado e humanizado",
  "Sigilo profissional absoluto",
  "Atualização jurídica constante",
  "Agilidade no atendimento",
];

const stats = [
  { value: "20+",    label: "Anos de Experiência" },
  { value: "15",     label: "Advogados Especializados" },
  { value: "2.500+", label: "Clientes Satisfeitos" },
  { value: "95%",    label: "Taxa de Sucesso" },
];

const About = () => {
  return (
    <section id="about" className="py-36 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-start">

          {/* LEFT — Content */}
          <div>
            {/* Label */}
            <span className="label-track text-accent/70 flex items-center gap-3 mb-8">
              <span className="inline-block w-8 h-px bg-accent/50" />
              Sobre o Escritório
            </span>

            {/* Title */}
            <h2
              className="font-serif font-bold text-foreground leading-tight mb-8"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              Tradição e modernidade
              <br />
              a serviço da{" "}
              <em className="not-italic text-accent">Justiça</em>
            </h2>

            {/* Divider */}
            <div className="w-16 h-px bg-accent/30 mb-8" />

            <p className="font-sans text-muted-foreground leading-relaxed mb-5 text-[15px]">
              Fundado em 2004, o escritório Fernandez & Fernandes nasceu com a missão 
              de oferecer serviços jurídicos de excelência, combinando a tradição 
              do Direito com soluções inovadoras para os desafios contemporâneos.
            </p>
            <p className="font-sans text-muted-foreground leading-relaxed mb-12 text-[15px]">
              Nossa equipe é formada por advogados especialistas em diversas áreas, 
              comprometidos com a defesa intransigente dos interesses de nossos 
              clientes e com a busca incessante pela justiça.
            </p>

            {/* Values */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {values.map((value) => (
                <div key={value} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-foreground/70 leading-snug">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Stats wall */}
          <div className="lg:pt-8">
            {/* Horizontal rule label */}
            <div className="flex items-center gap-4 mb-10">
              <span className="label-track text-muted-foreground/50 text-[10px]">Nossos Números</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* 2×2 stats grid */}
            <div className="grid grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden shadow-card">
              {stats.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`
                    relative p-10 flex flex-col justify-end
                    ${i % 2 === 0 ? "bg-primary" : "bg-primary/90"}
                    group transition-colors duration-300
                    hover:bg-primary/95
                  `}
                >
                  {/* Subtle top line accent */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-gold/20 group-hover:bg-gold/40 transition-colors duration-300" />

                  <p className="font-serif text-4xl lg:text-5xl font-bold text-gold mb-2 leading-none">
                    {value}
                  </p>
                  <p className="label-track text-primary-foreground/40 text-[10px]">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* OAB Badge */}
            <div className="mt-6 flex items-center gap-4 px-5 py-4 rounded-2xl border border-border bg-muted/40">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="label-track text-foreground/50 text-[10px]">Registro OAB</p>
                <p className="font-sans text-sm text-foreground/80 mt-0.5">
                  Inscritos na OAB/PR — Atuação em todo o território nacional
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
