import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    { label: "📄 Gerador de Documentos Jurídicos", href: "/gerador-documentos" },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <header
        className={`
          mx-auto max-w-7xl rounded-2xl transition-all duration-500
          backdrop-blur-xl border
          ${scrolled
            ? "bg-navy-dark/80 border-white/10 shadow-luxury"
            : "bg-navy-dark/60 border-white/6 shadow-none"
          }
        `}
        style={{ willChange: "background-color, box-shadow" }}
      >
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img
                src={logoImg}
                alt="Fernandez & Fernandes Logo"
                className="h-9 w-9"
                width={36}
                height={36}
                fetchPriority="high"
                decoding="async"
              />
              <div>
                <span className="font-serif text-lg font-semibold text-primary-foreground tracking-tight">
                  Fernandez & Fernandes
                </span>
                <p className="label-track text-primary-foreground/40 text-[10px]">
                  Advocacia Estratégica
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="label-track text-primary-foreground/55 hover:text-gold transition-colors duration-200 text-[11px]"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/blog#conteudo"
                className="label-track text-primary-foreground/55 hover:text-gold transition-colors duration-200 text-[11px]"
              >
                Blog
              </Link>
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="flex items-center gap-1 label-track text-primary-foreground/55 hover:text-gold transition-colors duration-200 text-[11px]"
                >
                  Ferramentas
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isToolsOpen ? "rotate-180" : ""}`} />
                </button>
                {isToolsOpen && (
                  <div className="absolute top-full left-0 mt-3 w-72 glass-card rounded-xl shadow-luxury py-2 animate-fade-in border border-white/8">
                    {toolsLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => { setIsToolsOpen(false); navigate(link.href); }}
                        className="block w-full text-left px-5 py-2.5 text-xs text-primary-foreground/60 hover:text-gold hover:bg-white/4 transition-colors"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/8 text-xs h-8"
                onClick={() => navigate("/login")}
              >
                Área Restrita
              </Button>
              <Button
                size="sm"
                className="text-xs h-8 px-4 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg"
                onClick={() => navigate("/client-login")}
              >
                Portal Cliente
              </Button>
              <Button
                size="sm"
                className="text-xs h-8 px-4 bg-gold text-navy-dark hover:bg-gold/90 font-semibold rounded-lg shadow-gold"
                onClick={() => handleNavClick("#contact")}
              >
                Agendar Consulta
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-primary-foreground/70 hover:text-primary-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/8 animate-fade-in">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left py-2.5 px-2 label-track text-primary-foreground/60 hover:text-gold transition-colors text-[11px]"
                  >
                    {link.label}
                  </button>
                ))}
                <Link
                  to="/blog#conteudo"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left py-2.5 px-2 label-track text-primary-foreground/60 hover:text-gold transition-colors text-[11px]"
                >
                  Blog
                </Link>
                <button
                  onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                  className="flex items-center justify-between py-2.5 px-2 label-track text-primary-foreground/60 hover:text-gold transition-colors text-[11px]"
                >
                  Ferramentas
                  <ChevronDown className={`h-3 w-3 transition-transform ${isMobileToolsOpen ? "rotate-180" : ""}`} />
                </button>
                {isMobileToolsOpen && (
                  <div className="pl-4 flex flex-col gap-1">
                    {toolsLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => { setIsMenuOpen(false); setIsMobileToolsOpen(false); navigate(link.href); }}
                        className="text-left py-2 text-xs text-primary-foreground/50 hover:text-gold transition-colors"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-white/8">
                  <Button variant="ghost" className="text-primary-foreground/60 hover:text-primary-foreground" onClick={() => navigate("/login")}>
                    Área Restrita
                  </Button>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate("/client-login")}>
                    Portal do Cliente
                  </Button>
                  <Button className="bg-gold text-navy-dark hover:bg-gold/90 font-semibold shadow-gold" onClick={() => handleNavClick("#contact")}>
                    Agendar Consulta
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
