import { Scale, Building2, Users2, FileText, Briefcase, Shield, Gavel, Landmark } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Direito Empresarial",
    description: "Assessoria completa para empresas, desde a constituição até questões societárias complexas.",
    size: "large",   // spans 2 cols
    accent: true,
  },
  {
    icon: Users2,
    title: "Direito de Família",
    description: "Divórcios, pensão alimentícia, guarda de filhos e inventários com sensibilidade.",
    size: "normal",
  },
  {
    icon: Scale,
    title: "Direito Civil",
    description: "Contratos, responsabilidade civil e questões patrimoniais.",
    size: "normal",
  },
  {
    icon: Briefcase,
    title: "Direito Trabalhista",
    description: "Defesa de empregados e empregadores em todas as instâncias trabalhistas.",
    size: "normal",
  },
  {
    icon: FileText,
    title: "Direito Tributário",
    description: "Planejamento tributário, defesas administrativas e judiciais em matéria fiscal.",
    size: "large",   // spans 2 cols
  },
  {
    icon: Shield,
    title: "Direito Criminal",
    description: "Defesa criminal em todas as fases processuais, com sigilo e dedicação.",
    size: "normal",
  },
  {
    icon: Gavel,
    title: "Direito Imobiliário",
    description: "Compra e venda, locações, usucapião e regularização de imóveis.",
    size: "normal",
  },
  {
    icon: Landmark,
    title: "Direito Administrativo",
    description: "Licitações, contratos públicos e defesa contra atos administrativos.",
    size: "normal",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-32 grain-overlay" style={{ background: "hsl(var(--navy-dark))" }}>
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="mb-16 max-w-xl">
          <span className="label-track text-gold/70 flex items-center gap-3 mb-5">
            <span className="inline-block w-8 h-px bg-gold/50" />
            Áreas de Atuação
          </span>
          <h2 className="font-serif font-bold text-primary-foreground leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.02em" }}>
            Expertise em diversas{" "}
            <em className="not-italic text-gold">áreas do Direito</em>
          </h2>
          <p className="text-primary-foreground/45 font-sans text-sm leading-relaxed max-w-md">
            Nossa equipe multidisciplinar oferece soluções jurídicas completas 
            para as mais diversas necessidades.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 auto-rows-[180px]">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isLarge = service.size === "large";
            const isAccent = service.accent;

            return (
              <div
                key={service.title}
                className={`
                  relative group rounded-2xl p-6 cursor-default overflow-hidden
                  transition-all duration-500 hover:-translate-y-1
                  ${isLarge ? "md:col-span-2" : "md:col-span-1"}
                  ${isAccent
                    ? "bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/20 hover:border-gold/40"
                    : "glass-card hover:border-white/14"
                  }
                `}
                style={{
                  animationDelay: `${index * 0.06}s`,
                }}
              >
                {/* Subtle background glow on hover */}
                <div className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  ${isAccent
                    ? "bg-gradient-to-br from-gold/10 to-transparent"
                    : "bg-gradient-to-br from-white/3 to-transparent"
                  }
                `} />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Icon */}
                  <div className={`
                    p-2.5 rounded-lg w-fit mb-3
                    ${isAccent ? "bg-gold/20" : "bg-white/6"}
                  `}>
                    <Icon className={`h-5 w-5 ${isAccent ? "text-gold" : "text-gold/70"}`} />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="font-serif text-base font-semibold text-primary-foreground mb-1.5 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-primary-foreground/45 text-xs leading-relaxed font-sans">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Large number watermark for large cards */}
                {isLarge && (
                  <span className="absolute bottom-4 right-5 font-serif text-6xl font-bold text-white/4 select-none leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
