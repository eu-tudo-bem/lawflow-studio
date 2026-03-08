import { useState, useEffect, useCallback } from "react";
import { MapPin, X, Sparkles } from "lucide-react";

interface Props {
  pageCityName: string;
  pageRegion: string;
  serviceName: string;
  whatsappLink: string;
}

const SESSION_KEY = "geo_detected_city";

const normalizeStr = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const GeoPersonalizationBanner = ({ pageCityName, pageRegion, serviceName, whatsappLink }: Props) => {
  const [userCity, setUserCity] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const evaluate = useCallback(
    (city: string) => {
      if (normalizeStr(city) !== normalizeStr(pageCityName)) {
        setUserCity(city);
        setVisible(true);
      }
    },
    [pageCityName],
  );

  useEffect(() => {
    // Check sessionStorage first to avoid redundant requests
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      evaluate(cached);
      return;
    }

    // Free IP geolocation — no API key required, HTTPS
    fetch("https://ipwho.is/")
      .then((r) => r.json())
      .then((data) => {
        const city: string | undefined = data?.city;
        if (city && data?.success) {
          sessionStorage.setItem(SESSION_KEY, city);
          evaluate(city);
        }
      })
      .catch(() => {
        // Fail silently — banner is a progressive enhancement
      });
  }, [evaluate]);

  if (!visible || !userCity) return null;

  return (
    <div className="bg-accent/10 border-b border-accent/25 animate-in slide-in-from-top-2 duration-300">
      <div className="container mx-auto px-4 py-3 max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="shrink-0 p-1.5 bg-accent/20 rounded-full mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
            </div>
            <div className="text-sm leading-snug">
              <p className="text-foreground">
                <span className="font-semibold text-accent">
                  Olá, {userCity}!
                </span>{" "}
                Atendemos moradores de{" "}
                <strong>{userCity}</strong> com suporte especializado em{" "}
                <strong>{pageCityName}</strong> — e 100% online direto para você.
                Não precisa sair de casa para resolver seu caso de{" "}
                <span className="font-medium">{serviceName}</span>.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-accent hover:underline"
              >
                <MapPin className="h-3 w-3" />
                Falar com advogado — atendemos {userCity} e região de {pageRegion}
              </a>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            aria-label="Fechar aviso"
            className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeoPersonalizationBanner;
