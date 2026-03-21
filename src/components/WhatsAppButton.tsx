import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { whatsappUrl } from "@/lib/constants";
import { trackGoogleAdsConversion } from "@/lib/trackConversion";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setShowTooltip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      <div
        className={`
          flex items-start gap-2 max-w-[220px] bg-white text-gray-800 text-sm
          rounded-xl shadow-lg px-3 py-2.5 border border-gray-100
          transition-all duration-500
          ${showTooltip ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}
        `}
      >
        <span className="leading-snug">
          Dúvida jurídica?{" "}
          <span className="font-semibold text-[#25D366]">Fale com um advogado agora.</span>
        </span>
        <button
          onClick={handleDismiss}
          aria-label="Fechar"
          className="mt-0.5 shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* WhatsApp button */}
      <a
        href={whatsappUrl("Olá! Gostaria de mais informações sobre os serviços jurídicos.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        onClick={() => {
            trackGoogleAdsConversion("WHATSAPP_LEAD");
            setShowTooltip(false);
          }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <MessageCircle size={28} fill="white" strokeWidth={0} className="relative z-10" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
