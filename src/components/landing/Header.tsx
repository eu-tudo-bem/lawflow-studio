import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logoImg from "@/assets/logo.png";
import logoWebp from "@/assets/logo.png"; // will stay PNG until WebP is available
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Início", href: "#home" },
    { label: "Sobre", href: "#about" },
    { label: "Áreas de Atuação", href: "#services" },
    { label: "Depoimentos", href: "#testimonials" },
  ];

  const toolsLinks = [
    { label: "Calculadora de Rescisão", href: "/calculadora#simulador" },
    { label: "Simulador de Pensão Alimentícia", href: "/simulador-pensao#simulador" },
    { label: "Simulador de Juros Abusivos", href: "/simulador-juros#simulador" },
    { label: "Simulador de Aposentadoria", href: "/simulador-aposentadoria#simulador" },
    { label: "Simulador de Horas Extras", href: "/simulador-horas-extras#simulador" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setIsMenuOpen(false);
    if (isRoute) {
      navigate(href);
    } else if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(220_50%_12%)] backdrop-blur-sm border-b border-[hsl(220_30%_20%)] text-[hsl(45_20%_95%)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="Fernandez & Fernandes Logo" className="h-10 w-10" />
            <div>
              <span className="font-serif text-xl font-semibold text-[hsl(45_20%_95%)]">
                Fernandez & Fernandes
              </span>
              <p className="text-xs text-[hsl(45_20%_95%)]/60">Advocacia & Consultoria</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-[hsl(45_20%_95%)]/70 hover:text-[hsl(45_20%_95%)] transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/blog#conteudo"
              className="text-sm font-medium text-[hsl(45_20%_95%)]/70 hover:text-[hsl(45_20%_95%)] transition-colors"
            >
              Blog Jurídico
            </Link>
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center gap-1 text-sm font-medium text-[hsl(45_20%_95%)]/70 hover:text-[hsl(45_20%_95%)] transition-colors"
              >
                Ferramentas Gratuitas
                <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
              </button>
              {isToolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[hsl(220_50%_16%)] border border-[hsl(220_30%_25%)] rounded-lg shadow-lg py-2 animate-fade-in">
                  {toolsLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => { setIsToolsOpen(false); navigate(link.href); }}
                      className="block w-full text-left px-4 py-2 text-sm text-[hsl(45_20%_95%)]/70 hover:text-[hsl(45_20%_95%)] hover:bg-[hsl(220_50%_20%)] transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Área Restrita
            </Button>
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate("/client-login")}
            >
              Portal do Cliente
            </Button>
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => handleNavClick("#contact")}
            >
              Agendar Consulta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[hsl(220_30%_20%)] animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left py-2 text-[hsl(45_20%_95%)]/70 hover:text-[hsl(45_20%_95%)] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/blog#conteudo"
                onClick={() => setIsMenuOpen(false)}
                className="text-left py-2 text-[hsl(45_20%_95%)]/70 hover:text-[hsl(45_20%_95%)] transition-colors"
              >
                Blog Jurídico
              </Link>
              <button
                onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                className="flex items-center justify-between py-2 text-[hsl(45_20%_95%)]/70 hover:text-[hsl(45_20%_95%)] transition-colors"
              >
                Ferramentas Gratuitas
                <ChevronDown className={`h-4 w-4 transition-transform ${isMobileToolsOpen ? "rotate-180" : ""}`} />
              </button>
              {isMobileToolsOpen && (
                <div className="pl-4 flex flex-col gap-2">
                  {toolsLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => { setIsMenuOpen(false); setIsMobileToolsOpen(false); navigate(link.href); }}
                      className="text-left py-1 text-sm text-[hsl(45_20%_95%)]/70 hover:text-[hsl(45_20%_95%)] transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-[hsl(220_30%_20%)]">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                >
                  Área Restrita
                </Button>
                <Button
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => navigate("/client-login")}
                >
                  Portal do Cliente
                </Button>
                <Button
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => handleNavClick("#contact")}
                >
                  Agendar Consulta
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
