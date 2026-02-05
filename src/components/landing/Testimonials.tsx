import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Maria Fernanda Costa",
    role: "Empresária",
    content: "O escritório Fernandez & Fernandes foi fundamental para a reestruturação da minha empresa. Profissionais competentes e atenciosos que realmente se importam com seus clientes.",
    rating: 5,
  },
  {
    name: "Carlos Eduardo Santos",
    role: "Médico",
    content: "Excelente atendimento em uma causa trabalhista complexa. A equipe demonstrou conhecimento técnico e sensibilidade ao lidar com a situação. Recomendo fortemente.",
    rating: 5,
  },
  {
    name: "Ana Paula Oliveira",
    role: "Professora",
    content: "Gratidão eterna pela condução do meu processo de família. Em um momento tão difícil, encontrei profissionais humanos e dedicados que me deram todo suporte necessário.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-accent/10 text-accent rounded-full">
            Depoimentos
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground">
            A satisfação dos nossos clientes é o nosso maior patrimônio. 
            Confira alguns depoimentos de quem confiou em nosso trabalho.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name} 
              className="border-0 shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-accent/30 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
