import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import { LEGAL_SERVICES, PARANA_CITIES } from "@/data/localSEOCities";
import { initWebVitals } from "@/lib/webVitals";

// Imports de componentes e proteção
const WhatsAppButton = lazy(() => import("./components/WhatsAppButton"));
const ExitIntentPopup = lazy(() => import("./components/ExitIntentPopup"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Imports de páginas
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Clients = lazy(() => import("./pages/Clients"));
const Cases = lazy(() => import("./pages/Cases"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Messages = lazy(() => import("./pages/Messages"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Calculadora = lazy(() => import("./pages/Calculadora"));
const SimuladorPensao = lazy(() => import("./pages/SimuladorPensao"));
const SimuladorJuros = lazy(() => import("./pages/SimuladorJuros"));
const SimuladorAposentadoria = lazy(() => import("./pages/SimuladorAposentadoria"));
const SimuladorHorasExtras = lazy(() => import("./pages/SimuladorHorasExtras"));
const ClientLogin = lazy(() => import("./pages/ClientLogin"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const ClientCases = lazy(() => import("./pages/client/ClientCases"));
const ClientAppointments = lazy(() => import("./pages/client/ClientAppointments"));
const ClientMessages = lazy(() => import("./pages/client/ClientMessages"));
const ClientDocuments = lazy(() => import("./pages/client/ClientDocuments"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogAdmin = lazy(() => import("./pages/BlogAdmin"));
const AnalysesReceived = lazy(() => import("./pages/AnalysesReceived"));
const TJPRMonitor = lazy(() => import("./pages/TJPRMonitor"));
const LegalMonitor = lazy(() => import("./pages/LegalMonitor"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const PensaoAlimenticia = lazy(() => import("./pages/PensaoAlimenticia"));
const DivorcioConsensual = lazy(() => import("./pages/DivorcioConsensual"));
const CobrancaAluguel = lazy(() => import("./pages/CobrancaAluguel"));
const DireitoAgrario = lazy(() => import("./pages/DireitoAgrario"));
const TransferenciaVeiculos = lazy(() => import("./pages/TransferenciaVeiculos"));
const RecuperacaoVeiculos = lazy(() => import("./pages/RecuperacaoVeiculos"));
const DefesaAgraria = lazy(() => import("./pages/DefesaAgraria"));
const Naturalizacao = lazy(() => import("./pages/Naturalizacao"));
const ExecucaoPensao = lazy(() => import("./pages/ExecucaoPensao"));
const ReabilitacaoCriminal = lazy(() => import("./pages/ReabilitacaoCriminal"));
const LocalAdvocaciaPage = lazy(() => import("./pages/LocalAdvocaciaPage"));
const ServiceLocalPage = lazy(() => import("./pages/ServiceLocalPage"));
const GeradorDocumentos = lazy(() => import("./pages/GeradorDocumentos"));
const GeradorDocumentoPage = lazy(() => import("./pages/GeradorDocumentoPage"));
const DocumentosAdmin = lazy(() => import("./pages/DocumentosAdmin"));
const PerguntaJuridica = lazy(() => import("./pages/PerguntaJuridica"));
const WebVitalsDashboard = lazy(() => import("./pages/WebVitalsDashboard"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const normalizeRouteSlug = (value: string) => {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }

  return decoded
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/\/+/, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
};

const DynamicCityRoute = () => {
  const { "*": rest } = useParams<{ "*": string }>();
  const citySlug = rest ?? "";
  if (!citySlug) return <Navigate to="/404" replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      <LocalAdvocaciaPage citySlugOverride={citySlug} />
    </Suspense>
  );
};

const DynamicServiceCityRoute = () => {
  const params = useParams<{ serviceAndCity?: string; "*"?: string }>();
  const location = useLocation();
  // React Router v6 does not match params in the middle of a static segment
  // (e.g. /advogado-:serviceAndCity), so the catch-all forwards the full path here.
  let rest = params.serviceAndCity ?? params["*"] ?? "";
  if (!rest) {
    if (location.pathname.startsWith("/advogado-")) rest = location.pathname.slice("/advogado-".length);
    else if (location.pathname.startsWith("/advogado/")) rest = location.pathname.slice("/advogado/".length);
  }
  if (rest.startsWith("advogado-")) rest = rest.slice("advogado-".length);
  if (rest.startsWith("advogado/")) rest = rest.slice("advogado/".length);
  const normalizedRest = normalizeRouteSlug(rest.replace(/\/+$/, ""));
  if (!normalizedRest) return <Navigate to="/404" replace />;

  // First locate the city at the end using the official Paraná city list.
  // This avoids breaking service slugs that also contain hyphens.
  const citiesByLongestSlug = PARANA_CITIES
    .map((city) => ({ city, normalizedSlug: normalizeRouteSlug(city.slug || city.name) }))
    .sort((a, b) => b.normalizedSlug.length - a.normalizedSlug.length);
  const cityMatch = citiesByLongestSlug.find(({ normalizedSlug }) =>
    normalizedRest === normalizedSlug || normalizedRest.endsWith(`-${normalizedSlug}`),
  );
  const serviceToken = cityMatch ? normalizedRest.slice(0, -(cityMatch.normalizedSlug.length + 1)) : "";
  const serviceMatch = serviceToken
    ? LEGAL_SERVICES.find(
        (service) => normalizeRouteSlug(service.slug) === serviceToken || normalizeRouteSlug(service.keyword) === serviceToken,
      )
    : undefined;

  const match = cityMatch && serviceMatch
    ? { service: serviceMatch, city: cityMatch.city.slug }
    : undefined;

  if (!match) return <Navigate to="/404" replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      <ServiceLocalPage serviceSlug={match.service.slug} citySlug={match.city} />
    </Suspense>
  );
};

// Catch-all route: intercepts unmatched paths to detect hyphenated /advogado-... URLs
// (React Router v6 cannot use `:param` inside a static segment, so these would otherwise 404 with noindex)
const CatchAllRoute = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/advogado-")) {
    return <DynamicServiceCityRoute />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <NotFound />
    </Suspense>
  );
};

if (typeof window !== "undefined") {
  initWebVitals();
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
      <BrowserRouter>
        <Suspense fallback={null}>
          <ExitIntentPopup />
        </Suspense>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Rotas Estáticas de Serviços */}
            <Route path="/calculadora" element={<Calculadora />} />
            <Route path="/simulador-pensao" element={<SimuladorPensao />} />
            <Route path="/simulador-juros" element={<SimuladorJuros />} />
            <Route path="/simulador-aposentadoria" element={<SimuladorAposentadoria />} />
            <Route path="/simulador-horas-extras" element={<SimuladorHorasExtras />} />
            <Route path="/pensao-alimenticia" element={<PensaoAlimenticia />} />
            <Route path="/divorcio-consensual" element={<DivorcioConsensual />} />
            <Route path="/cobranca-aluguel" element={<CobrancaAluguel />} />
            <Route path="/direito-agrario" element={<DireitoAgrario />} />
            <Route path="/transferencia-veiculos" element={<TransferenciaVeiculos />} />
            <Route path="/recuperacao-veiculos" element={<RecuperacaoVeiculos />} />
            <Route path="/defesa-agraria" element={<DefesaAgraria />} />
            <Route path="/naturalizacao" element={<Naturalizacao />} />
            <Route path="/execucao-pensao" element={<ExecucaoPensao />} />

            {/* NOVA ROTA AQUI */}
            <Route path="/reabilitacao-criminal" element={<ReabilitacaoCriminal />} />

            {/* Rotas SEO Dinâmicas (Devem ficar abaixo das rotas fixas) */}
            {PARANA_CITIES.map((city) => (
              <Route
                key={city.slug}
                path={`/escritorio-advocacia-${city.slug}`}
                element={<LocalAdvocaciaPage citySlugOverride={city.slug} />}
              />
            ))}
            <Route path="/escritorio-advocacia-*" element={<DynamicCityRoute />} />
            {LEGAL_SERVICES.flatMap((svc) =>
              PARANA_CITIES.flatMap((city) =>
                Array.from(new Set([svc.keyword, svc.slug])).map((serviceToken) => (
                  <Route
                    key={`${serviceToken}-${city.slug}`}
                    path={`/advogado-${serviceToken}-${city.slug}`}
                    element={<ServiceLocalPage serviceSlug={svc.slug} citySlug={city.slug} />}
                  />
                )),
              ),
            )}
            <Route path="/advogado/*" element={<DynamicServiceCityRoute />} />

            {/* Gerador de Documentos */}
            <Route path="/gerador-documentos" element={<GeradorDocumentos />} />
            {[
              "notificacao-cobranca-aluguel",
              "notificacao-divida",
              "acordo-divorcio",
              "declaracao-uniao-estavel",
              "contrato-arrendamento-rural",
              "declaracao-dependencia-economica",
              "revisao-pensao-alimenticia",
            ].map((slug) => (
              <Route key={slug} path={`/gerador-${slug}`} element={<GeradorDocumentoPage docTypeSlug={slug} />} />
            ))}

            <Route path="/pergunta/:slug" element={<PerguntaJuridica />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* Lawyer/Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="staff">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/clients"
              element={
                <ProtectedRoute requiredRole="staff">
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/cases"
              element={
                <ProtectedRoute requiredRole="staff">
                  <Cases />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/appointments"
              element={
                <ProtectedRoute requiredRole="staff">
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/messages"
              element={
                <ProtectedRoute requiredRole="staff">
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/chat"
              element={
                <ProtectedRoute requiredRole="staff">
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/blog"
              element={
                <ProtectedRoute requiredRole="staff">
                  <BlogAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/documentos"
              element={
                <ProtectedRoute requiredRole="staff">
                  <DocumentosAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analyses"
              element={
                <ProtectedRoute requiredRole="staff">
                  <AnalysesReceived />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/tjpr"
              element={
                <ProtectedRoute requiredRole="staff">
                  <TJPRMonitor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/legal-monitor"
              element={
                <ProtectedRoute requiredRole="staff">
                  <LegalMonitor />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard/seo-local" element={<Navigate to="/dashboard/legal-monitor" replace />} />
            <Route
              path="/dashboard/web-vitals"
              element={
                <ProtectedRoute requiredRole="staff">
                  <WebVitalsDashboard />
                </ProtectedRoute>
              }
            />

            {/* Client Portal */}
            <Route path="/client-login" element={<ClientLogin />} />
            <Route
              path="/client-portal"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientPortal />
                </ProtectedRoute>
              }
            >
              <Route index element={<ClientCases />} />
              <Route path="documents" element={<ClientDocuments />} />
              <Route path="appointments" element={<ClientAppointments />} />
              <Route path="messages" element={<ClientMessages />} />
            </Route>

            <Route path="*" element={<CatchAllRoute />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
