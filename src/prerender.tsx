/**
 * Prerender entry point for vite-prerender-plugin.
 *
 * This file exports:
 *  - `prerender()` → static route list + per-route HTML
 *  - default export  → renders a given URL to an HTML string
 *
 * Only public-facing, crawlable routes are pre-rendered.
 * Auth-protected dashboard/client-portal routes are intentionally excluded.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { LEGAL_SERVICES, PARANA_CITIES } from "@/data/localSEOCities";

// ─── Static routes ────────────────────────────────────────────────────────────
const STATIC_ROUTES: string[] = [
  "/",
  "/calculadora",
  "/simulador-pensao",
  "/simulador-juros",
  "/simulador-aposentadoria",
  "/simulador-horas-extras",
  "/pensao-alimenticia",
  "/divorcio-consensual",
  "/cobranca-aluguel",
  "/direito-agrario",
  "/transferencia-veiculos",
  "/recuperacao-veiculos",
  "/defesa-agraria",
  "/naturalizacao",
  "/execucao-pensao",
  "/reabilitacao-criminal",
  "/blog",
  "/gerador-documentos",
  "/gerador-notificacao-cobranca-aluguel",
  "/gerador-notificacao-divida",
  "/gerador-acordo-divorcio",
  "/gerador-declaracao-uniao-estavel",
  "/gerador-contrato-arrendamento-rural",
  "/gerador-declaracao-dependencia-economica",
  "/gerador-revisao-pensao-alimenticia",
];

// ─── SEO local routes ─────────────────────────────────────────────────────────
// escritorio-advocacia-{cidade}
const CITY_ROUTES = PARANA_CITIES.map(
  (city) => `/escritorio-advocacia-${city.slug}`
);

// advogado-{servico}-{cidade}  (top-5 services × all cities = ~135 routes)
const TOP_SERVICES = LEGAL_SERVICES.slice(0, 5);
const SERVICE_CITY_ROUTES = TOP_SERVICES.flatMap((svc) =>
  PARANA_CITIES.map((city) => `/advogado-${svc.keyword}-${city.slug}`)
);

export const ALL_PRERENDER_ROUTES = [
  ...STATIC_ROUTES,
  ...CITY_ROUTES,
  ...SERVICE_CITY_ROUTES,
];

// ─── Render function ──────────────────────────────────────────────────────────
// Lazy imports match App.tsx lazy imports so code-splitting is preserved.
import Index from "@/pages/Index";
const PensaoAlimenticia = lazy(() => import("@/pages/PensaoAlimenticia"));
const DivorcioConsensual = lazy(() => import("@/pages/DivorcioConsensual"));
const CobrancaAluguel = lazy(() => import("@/pages/CobrancaAluguel"));
const DireitoAgrario = lazy(() => import("@/pages/DireitoAgrario"));
const TransferenciaVeiculos = lazy(
  () => import("@/pages/TransferenciaVeiculos")
);
const RecuperacaoVeiculos = lazy(() => import("@/pages/RecuperacaoVeiculos"));
const DefesaAgraria = lazy(() => import("@/pages/DefesaAgraria"));
const Naturalizacao = lazy(() => import("@/pages/Naturalizacao"));
const ExecucaoPensao = lazy(() => import("@/pages/ExecucaoPensao"));
const ReabilitacaoCriminal = lazy(
  () => import("@/pages/ReabilitacaoCriminal")
);
const Calculadora = lazy(() => import("@/pages/Calculadora"));
const SimuladorPensao = lazy(() => import("@/pages/SimuladorPensao"));
const SimuladorJuros = lazy(() => import("@/pages/SimuladorJuros"));
const SimuladorAposentadoria = lazy(
  () => import("@/pages/SimuladorAposentadoria")
);
const SimuladorHorasExtras = lazy(
  () => import("@/pages/SimuladorHorasExtras")
);
const Blog = lazy(() => import("@/pages/Blog"));
const GeradorDocumentos = lazy(() => import("@/pages/GeradorDocumentos"));
const GeradorDocumentoPage = lazy(
  () => import("@/pages/GeradorDocumentoPage")
);
const LocalAdvocaciaPage = lazy(() => import("@/pages/LocalAdvocaciaPage"));
const ServiceLocalPage = lazy(() => import("@/pages/ServiceLocalPage"));

function getRouteComponent(url: string) {
  if (url === "/") return <Index />;
  if (url === "/calculadora") return <Calculadora />;
  if (url === "/simulador-pensao") return <SimuladorPensao />;
  if (url === "/simulador-juros") return <SimuladorJuros />;
  if (url === "/simulador-aposentadoria") return <SimuladorAposentadoria />;
  if (url === "/simulador-horas-extras") return <SimuladorHorasExtras />;
  if (url === "/pensao-alimenticia") return <PensaoAlimenticia />;
  if (url === "/divorcio-consensual") return <DivorcioConsensual />;
  if (url === "/cobranca-aluguel") return <CobrancaAluguel />;
  if (url === "/direito-agrario") return <DireitoAgrario />;
  if (url === "/transferencia-veiculos") return <TransferenciaVeiculos />;
  if (url === "/recuperacao-veiculos") return <RecuperacaoVeiculos />;
  if (url === "/defesa-agraria") return <DefesaAgraria />;
  if (url === "/naturalizacao") return <Naturalizacao />;
  if (url === "/execucao-pensao") return <ExecucaoPensao />;
  if (url === "/reabilitacao-criminal") return <ReabilitacaoCriminal />;
  if (url === "/blog") return <Blog />;
  if (url === "/gerador-documentos") return <GeradorDocumentos />;

  // Gerador doc pages
  const geradorSlugs = [
    "notificacao-cobranca-aluguel",
    "notificacao-divida",
    "acordo-divorcio",
    "declaracao-uniao-estavel",
    "contrato-arrendamento-rural",
    "declaracao-dependencia-economica",
    "revisao-pensao-alimenticia",
  ];
  for (const slug of geradorSlugs) {
    if (url === `/gerador-${slug}`)
      return <GeradorDocumentoPage docTypeSlug={slug} />;
  }

  // City pages: /escritorio-advocacia-{slug}
  if (url.startsWith("/escritorio-advocacia-")) {
    const citySlug = url.replace("/escritorio-advocacia-", "");
    return <LocalAdvocaciaPage citySlugOverride={citySlug} />;
  }

  // Service+city pages: /advogado-{keyword}-{city}
  if (url.startsWith("/advogado-")) {
    const rest = url.replace("/advogado-", "");
    const sortedServices = [...LEGAL_SERVICES].sort(
      (a, b) => b.keyword.length - a.keyword.length
    );
    const match = sortedServices
      .map((s) => {
        const prefix = s.keyword + "-";
        return rest.startsWith(prefix)
          ? { service: s, city: rest.slice(prefix.length) }
          : null;
      })
      .find((m) => m !== null && m.city.length > 0);
    if (match) {
      return (
        // @ts-ignore
        <ServiceLocalPage
          serviceSlug={match.service.slug}
          citySlug={match.city}
        />
      );
    }
  }

  return <Index />;
}

/**
 * Called by vite-prerender-plugin during build for each route.
 * Returns the rendered HTML string.
 */
export default async function render(url: string): Promise<string> {
  const queryClient = new QueryClient();

  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StaticRouter location={url}>
          <Suspense fallback={null}>{getRouteComponent(url)}</Suspense>
        </StaticRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  return html;
}

/**
 * Called by vite-prerender-plugin to discover all routes to prerender.
 */
export async function prerender() {
  return {
    routes: ALL_PRERENDER_ROUTES,
  };
}
