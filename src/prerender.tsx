/**
 * Prerender entry point para vite-prerender-plugin.
 *
 * A função `prerender(data)` é chamada pelo plugin durante o build de produção
 * para cada rota descoberta. Ela retorna:
 *   - `html`  → conteúdo renderizado para injetar no #root
 *   - `links` → novas rotas que o plugin deve continuar pré-renderizando
 *   - `head`  → metadados opcionais (lang, title)
 *
 * Rotas pré-renderizadas:
 *   ✅ Landing page (/)
 *   ✅ Páginas de serviços estáticos (pensao-alimenticia, divorcio-consensual…)
 *   ✅ Simuladores / Geradores de documentos
 *   ✅ Blog (listagem)
 *   ✅ Páginas de cidade (/escritorio-advocacia-{cidade})
 *   ✅ Top-5 serviços × todas as cidades (/advogado-{servico}-{cidade})
 *
 * ❌ Rotas autenticadas (dashboard, client-portal) NÃO são pré-renderizadas.
 */

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import { LEGAL_SERVICES, PARANA_CITIES } from "@/data/localSEOCities";
import Index from "@/pages/Index";

// ─── Lazy imports (espelham App.tsx) ─────────────────────────────────────────
import { lazy } from "react";

const PensaoAlimenticia = lazy(() => import("@/pages/PensaoAlimenticia"));
const DivorcioConsensual = lazy(() => import("@/pages/DivorcioConsensual"));
const CobrancaAluguel = lazy(() => import("@/pages/CobrancaAluguel"));
const DireitoAgrario = lazy(() => import("@/pages/DireitoAgrario"));
const TransferenciaVeiculos = lazy(() => import("@/pages/TransferenciaVeiculos"));
const RecuperacaoVeiculos = lazy(() => import("@/pages/RecuperacaoVeiculos"));
const DefesaAgraria = lazy(() => import("@/pages/DefesaAgraria"));
const Naturalizacao = lazy(() => import("@/pages/Naturalizacao"));
const ExecucaoPensao = lazy(() => import("@/pages/ExecucaoPensao"));
const ReabilitacaoCriminal = lazy(() => import("@/pages/ReabilitacaoCriminal"));
const Calculadora = lazy(() => import("@/pages/Calculadora"));
const SimuladorPensao = lazy(() => import("@/pages/SimuladorPensao"));
const SimuladorJuros = lazy(() => import("@/pages/SimuladorJuros"));
const SimuladorAposentadoria = lazy(() => import("@/pages/SimuladorAposentadoria"));
const SimuladorHorasExtras = lazy(() => import("@/pages/SimuladorHorasExtras"));
const Blog = lazy(() => import("@/pages/Blog"));
const GeradorDocumentos = lazy(() => import("@/pages/GeradorDocumentos"));
const GeradorDocumentoPage = lazy(() => import("@/pages/GeradorDocumentoPage"));
const LocalAdvocaciaPage = lazy(() => import("@/pages/LocalAdvocaciaPage"));
const ServiceLocalPage = lazy(() => import("@/pages/ServiceLocalPage"));

// ─── Roteador de componente por URL ──────────────────────────────────────────
function getComponent(url: string) {
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
    if (url === `/gerador-${slug}`) {
      return <GeradorDocumentoPage docTypeSlug={slug} />;
    }
  }

  // /escritorio-advocacia-{cidade}
  if (url.startsWith("/escritorio-advocacia-")) {
    const citySlug = url.replace("/escritorio-advocacia-", "");
    return <LocalAdvocaciaPage citySlugOverride={citySlug} />;
  }

  // /advogado-{servico}-{cidade}
  if (url.startsWith("/advogado-")) {
    const rest = url.replace("/advogado-", "");
    const sorted = [...LEGAL_SERVICES].sort((a, b) => b.keyword.length - a.keyword.length);
    const match = sorted
      .map((s) => {
        const prefix = s.keyword + "-";
        return rest.startsWith(prefix)
          ? { service: s, city: rest.slice(prefix.length) }
          : null;
      })
      .find((m) => m !== null && m!.city.length > 0);

    if (match) {
      return (
        // @ts-ignore
        <ServiceLocalPage serviceSlug={match.service.slug} citySlug={match.city} />
      );
    }
  }

  // Fallback: home
  return <Index />;
}

// ─── Rotas iniciais injetadas via `additionalPrerenderRoutes` + links ─────────
// As páginas de serviços locais são adicionadas como `links` no primeiro render
// para que o plugin descubra e pré-renderize todas sem puppeteer.

/** Conjunto completo de rotas SEO locais pré-definidas */
function buildSEOLinks(): Set<string> {
  const links = new Set<string>();

  // Páginas de cidade
  for (const city of PARANA_CITIES) {
    links.add(`/escritorio-advocacia-${city.slug}`);
  }

  // Top-5 serviços × todas as cidades
  const topServices = LEGAL_SERVICES.slice(0, 5);
  for (const svc of topServices) {
    for (const city of PARANA_CITIES) {
      links.add(`/advogado-${svc.keyword}-${city.slug}`);
    }
  }

  return links;
}

// ─── Função principal exportada ───────────────────────────────────────────────
export async function prerender(data: { url: string }) {
  const url = data?.url ?? "/";

  const qc = new QueryClient();

  const html = renderToString(
    <QueryClientProvider client={qc}>
      <TooltipProvider>
        <StaticRouter location={url}>
          <Suspense fallback={null}>{getComponent(url)}</Suspense>
        </StaticRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  // Na primeira rota ("/") devolvemos todos os links SEO para o plugin descobrir
  const links = url === "/" ? buildSEOLinks() : new Set<string>();

  return {
    html,
    links,
    head: {
      lang: "pt-BR",
    },
  };
}
