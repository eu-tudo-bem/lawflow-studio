import { Scale, Building2, Users2, FileText, Briefcase, Shield, Gavel, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Building2,
    title: "Direito Empresarial",
    description: "Assessoria completa para empresas, desde a constituição até questões societárias complexas.",
  },
  {
    icon: Users2,
    title: "Direito de Família",
    description: "Divórcios, pensão alimentícia, guarda de filhos e inventários com sensibilidade e eficiência.",
  },
  {
    icon: Scale,
    title: "Direito Civil",
    description: "Contratos, responsabilidade civil, direito do consumidor e questões patrimoniais.",
  },
  {
    icon: Briefcase,
    title: "Direito Trabalhista",
    description: "Defesa de empregados e empregadores em todas as instâncias trabalhistas.",
  },
  {
    icon: FileText,
    title: "Direito Tributário",
    description: "Planejamento tributário, defesas administrativas e judiciais em matéria fiscal.",
  },
  {
    icon: Shield,
    title: "Direito Criminal",
    description: "Defesa criminal em todas as fases processuais, com sigilo e dedicação.",
  },
  {
    icon: Gavel,
    title: "Direito Imobiliário",
    description: "Compra e venda, locações, usucapião e regularização de imóveis.",
  },
  {
    icon: Landmark,
    title: "Direito Administrativo",
    description: "Licitações, contratos públicos e defesa contra atos administrativos.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-accent/10 text-accent rounded-full">
            Áreas de Atuação
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Expertise em diversas áreas do Direito
          </h2>
          <p className="text-muted-foreground">
            Nossa equipe multidisciplinar oferece soluções jurídicas completas 
            para atender às mais diversas necessidades dos nossos clientes.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className="group border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
