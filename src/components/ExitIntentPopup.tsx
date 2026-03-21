import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { X, MessageCircle, Shield } from "lucide-react";
import { trackConversion } from "@/lib/trackConversion";
import { WHATSAPP_NUMBER } from "@/lib/constants";

// Map route paths to city labels (extracted from slug) or service context
const getCityFromPath = (pathname: string): string => {
  // /escritorio-advocacia-curitiba → "Curitiba"
  // /advogado-divorcio-londrina → "Londrina"
  const cityMatch =
    pathname.match(/escritorio-advocacia-([a-z-]+)/) ||
    pathname.match(/advogado-[a-z]+-([a-z-]+)$/);
  if (cityMatch) {
    return cityMatch[1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return "Curitiba";
};

const SESSION_KEY = "exit_intent_shown";

const ExitIntentPopup = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const city = getCityFromPath(location.pathname);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 10 && !sessionStorage.getItem(SESSION_KEY)) {
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    // Skip on dashboard / client portal routes
    if (
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/client")
    ) return;

    if (sessionStorage.getItem(SESSION_KEY)) return;

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [location.pathname, handleMouseLeave]);

  const handleWhatsApp = () => {
    trackConversion("whatsapp_click", "exit_intent");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá! Gostaria de uma análise gratuita do meu caso em ${city}.`)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Oferta de análise gratuita"
      onClick={(e) => e.target === e.currentTarget && setVisible(false)}
    >
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-accent" />

        <div className="px-6 pt-6 pb-7">
          {/* Close */}
          <button
            onClick={() => setVisible(false)}
            aria-label="Fechar"
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4">
            <Shield size={28} className="text-primary" />
          </div>

          {/* Headline */}
          <h2 className="text-xl font-bold text-center text-foreground leading-snug mb-2">
            Aguarde! Quer uma análise gratuita do seu caso?
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            Nossa equipe em{" "}
            <span className="font-semibold text-foreground">{city}</span> está
            disponível agora para avaliar sua situação sem compromisso.
          </p>

          {/* CTA */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-base transition-colors shadow-md"
          >
            <MessageCircle size={20} fill="white" strokeWidth={0} />
            Quero minha análise gratuita
          </button>

          <p className="text-xs text-center text-muted-foreground mt-3">
            Sem compromisso • Resposta em minutos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
