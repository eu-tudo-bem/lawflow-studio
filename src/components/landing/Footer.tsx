import { Scale, Instagram, Linkedin, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-8 w-8 text-gold" />
              <div>
                <span className="font-serif text-xl font-semibold">
                  Fernandez & Fernandes
                </span>
                <p className="text-xs text-primary-foreground/60">Advocacia & Consultoria</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed max-w-md">
              Há mais de 20 anos oferecendo soluções jurídicas de excelência, 
              com ética, transparência e comprometimento com nossos clientes.
            </p>
            <p className="text-sm text-primary-foreground/50 mt-4">
              OAB/SP 12.345
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Áreas de Atuação</h4>
            <ul className="space-y-2 text-primary-foreground/70 text-sm">
              <li>Direito Empresarial</li>
              <li>Direito de Família</li>
              <li>Direito Civil</li>
              <li>Direito Trabalhista</li>
              <li>Direito Tributário</li>
            </ul>
            <h4 className="font-semibold mb-4 mt-6">Ferramentas Gratuitas</h4>
            <ul className="space-y-2 text-primary-foreground/70 text-sm">
              <li>
                <Link to="/calculadora" className="hover:text-primary-foreground transition-colors">
                  Calculadora de Rescisão
                </Link>
              </li>
              <li>
                <Link to="/simulador-pensao" className="hover:text-primary-foreground transition-colors">
                  Simulador de Pensão Alimentícia
                </Link>
              </li>
              <li>
                <Link to="/simulador-juros" className="hover:text-primary-foreground transition-colors">
                  Simulador de Juros Abusivos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-primary-foreground/70 text-sm">
              <li>Av. Paulista, 1000 - Sala 1501</li>
              <li>São Paulo - SP</li>
              <li>(11) 3000-0000</li>
              <li>contato@fernandezfernandes.adv.br</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {currentYear} Fernandez & Fernandes. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <Link to="/login" className="hover:text-primary-foreground transition-colors">
              Área Restrita
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
