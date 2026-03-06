import { useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { getCityBySlug } from "@/data/localSEOCities";
import { lazy, Suspense } from "react";

const LocalAdvocaciaPage = lazy(() => import("./LocalAdvocaciaPage"));

const NotFound = () => {
  const location = useLocation();

  // Intercept /escritorio-advocacia-{cidade} pattern
  const advocaciaMatch = location.pathname.match(/^\/escritorio-advocacia-(.+)$/);
  if (advocaciaMatch) {
    const slug = advocaciaMatch[1];
    const city = getCityBySlug(slug);
    if (city) {
      return (
        <Suspense fallback={null}>
          <LocalAdvocaciaPage />
        </Suspense>
      );
    }
  }

  usePageSEO({
    title: "Página não encontrada | Fernandez & Fernandes",
    description: "A página que você procura não foi encontrada.",
    robots: "noindex, nofollow",
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

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
