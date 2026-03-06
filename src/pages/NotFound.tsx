import { useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { getCityBySlug } from "@/data/localSEOCities";

const LocalAdvocaciaPage = lazy(() => import("./LocalAdvocaciaPage"));

const NotFound = () => {
  const location = useLocation();

  // Check if this matches the /escritorio-advocacia-{cidade} pattern
  const advocaciaMatch = location.pathname.match(/^\/escritorio-advocacia-(.+)$/);
  const matchedCity = advocaciaMatch ? getCityBySlug(advocaciaMatch[1]) : null;

  usePageSEO(
    matchedCity
      ? { title: `Escritório de Advocacia em ${matchedCity.name} | Advogado Especialista`, description: "", robots: "index, follow" }
      : { title: "Página não encontrada | Fernandez & Fernandes", description: "A página que você procura não foi encontrada.", robots: "noindex, nofollow" }
  );

  useEffect(() => {
    if (!matchedCity) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname, matchedCity]);

  if (matchedCity) {
    return (
      <Suspense fallback={null}>
        <LocalAdvocaciaPage />
      </Suspense>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Página não encontrada</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
