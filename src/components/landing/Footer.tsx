import { Instagram, Linkedin, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[hsl(220_50%_12%)] text-[hsl(45_20%_95%)] border-t border-[hsl(220_30%_20%)]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImg} alt="Fernandez & Fernandes Logo" className="h-10 w-10" />
              <div>
                <span className="font-serif text-xl font-semibold">
                  Fernandez & Fernandes
                </span>
                <p className="text-xs text-[hsl(45_20%_95%)]/60">Advocacia & Consultoria</p>
              </div>
            </div>
            <p className="text-[hsl(45_20%_95%)]/70 leading-relaxed max-w-md">
              Há mais de 20 anos oferecendo soluções jurídicas de excelência, 
              com ética, transparência e comprometimento com nossos clientes.
            </p>
            <p className="text-sm text-[hsl(45_20%_95%)]/50 mt-4">
              OAB/SP 12.345
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Conteúdo & Ferramentas</h4>
            <ul className="space-y-2 text-[hsl(45_20%_95%)]/70 text-sm">
              <li>
                <Link to="/blog#conteudo" className="hover:text-[hsl(45_20%_95%)] transition-colors font-medium text-[hsl(45_20%_95%)]/90">
                  📚 Blog Jurídico
                </Link>
              </li>
              <li>
                <Link to="/blog?categoria=direito-trabalhista#conteudo" className="hover:text-[hsl(45_20%_95%)] transition-colors">
                  Direito Trabalhista
                </Link>
              </li>
              <li>
                <Link to="/blog?categoria=direito-previdenciario#conteudo" className="hover:text-[hsl(45_20%_95%)] transition-colors">
                  Direito Previdenciário
                </Link>
              </li>
              <li>
                <Link to="/blog?categoria=direito-de-familia#conteudo" className="hover:text-[hsl(45_20%_95%)] transition-colors">
                  Direito de Família
                </Link>
              </li>
            </ul>
            <h4 className="font-semibold mb-4 mt-6">Ferramentas Gratuitas</h4>
            <ul className="space-y-2 text-[hsl(45_20%_95%)]/70 text-sm">
              <li>
                <Link to="/gerador-documentos" className="hover:text-[hsl(45_20%_95%)] transition-colors font-medium text-[hsl(45_20%_95%)]/90">
                  📄 Gerador de Documentos Jurídicos
                </Link>
              </li>
              <li>
                <Link to="/calculadora#simulador" className="hover:text-[hsl(45_20%_95%)] transition-colors">
                  Calculadora de Rescisão
                </Link>
              </li>
              <li>
                <Link to="/simulador-pensao#simulador" className="hover:text-[hsl(45_20%_95%)] transition-colors">
                  Simulador de Pensão Alimentícia
                </Link>
              </li>
              <li>
                <Link to="/simulador-juros#simulador" className="hover:text-[hsl(45_20%_95%)] transition-colors">
                  Simulador de Juros Abusivos
                </Link>
              </li>
              <li>
                <Link to="/simulador-aposentadoria#simulador" className="hover:text-[hsl(45_20%_95%)] transition-colors">
                  Simulador de Aposentadoria
                </Link>
              </li>
              <li>
                <Link to="/simulador-horas-extras#simulador" className="hover:text-[hsl(45_20%_95%)] transition-colors">
                  Simulador de Horas Extras
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-[hsl(45_20%_95%)]/70 text-sm">
              <li>Rua Franz J. Hoch 283   </li>
              <li>​CURITIBA-PR</li>
              <li>(41) 99580-8145</li>
              <li>contato@fernandezfernandes.adv.br</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="p-2 bg-[hsl(220_50%_20%)] rounded-full hover:bg-[hsl(220_50%_25%)] transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-[hsl(220_50%_20%)] rounded-full hover:bg-[hsl(220_50%_25%)] transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-[hsl(220_50%_20%)] rounded-full hover:bg-[hsl(220_50%_25%)] transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Áreas de Atendimento — interlinking para cidades-polo do Paraná (SEO hiperlocal) */}
        <div className="mt-12 pt-8 border-t border-[hsl(220_30%_20%)]">
          <h4 className="font-semibold mb-4">Áreas de Atendimento no Paraná</h4>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[hsl(45_20%_95%)]/70">
            {[
              { slug: "curitiba", name: "Curitiba" },
              { slug: "londrina", name: "Londrina" },
              { slug: "maringa", name: "Maringá" },
              { slug: "cascavel", name: "Cascavel" },
              { slug: "toledo", name: "Toledo" },
              { slug: "sao-jose-dos-pinhais", name: "São José dos Pinhais" },
              { slug: "colombo", name: "Colombo" },
              { slug: "ponta-grossa", name: "Ponta Grossa" },
              { slug: "foz-do-iguacu", name: "Foz do Iguaçu" },
            ].map((city) => (
              <li key={city.slug}>
                <Link
                  to={`/escritorio-advocacia-${city.slug}`}
                  className="hover:text-[hsl(45_20%_95%)] transition-colors"
                  title={`Advocacia em ${city.name} - PR`}
                >
                  Advocacia em {city.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link
              to="/casos-com-documentos-prontos-parana"
              className="text-sm text-[hsl(45_60%_55%)] hover:underline font-medium"
              title="Casos com documentos prontos no Paraná"
            >
              📄 Casos com documentos prontos para análise no Paraná →
            </Link>
          </div>
        </div>



        {/* Bottom */}
        <div className="border-t border-[hsl(220_30%_20%)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[hsl(45_20%_95%)]/50">
            © {currentYear} Fernandez & Fernandes. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-[hsl(45_20%_95%)]/50">
            <Link to="/blog#conteudo" className="hover:text-[hsl(45_20%_95%)] transition-colors">
              Blog Jurídico
            </Link>
            <Link to="/login" className="hover:text-[hsl(45_20%_95%)] transition-colors">
              Área Restrita
            </Link>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;