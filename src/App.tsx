import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { LEGAL_SERVICES } from "@/data/localSEOCities";

// Lazy-load auth/utility components so they don't block FCP on the homepage
const WhatsAppButton = lazy(() => import("./components/WhatsAppButton"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Lazy-loaded pages for code splitting
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
const LocalAdvocaciaPage = lazy(() => import("./pages/LocalAdvocaciaPage"));
const ServiceLocalPage = lazy(() => import("./pages/ServiceLocalPage"));
const GeradorDocumentos = lazy(() => import("./pages/GeradorDocumentos"));
const GeradorDocumentoPage = lazy(() => import("./pages/GeradorDocumentoPage"));
const DocumentosAdmin = lazy(() => import("./pages/DocumentosAdmin"));
const PerguntaJuridica = lazy(() => import("./pages/PerguntaJuridica"));
const SEOLocalManager = lazy(() => import("./pages/SEOLocalManager"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

// Resolve /escritorio-advocacia-{city} for dynamic cities (not in the static list)
// rest = e.g. "pinhais" (the part after /escritorio-advocacia-)
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

// Resolve /advogado-{service}-{city} for dynamic cities (not in the static list)
// rest = e.g. "pensao-alimenticia-pinhais" (the part after /advogado-)
const DynamicServiceCityRoute = () => {
  const { "*": rest } = useParams<{ "*": string }>();
  if (!rest) return <Navigate to="/404" replace />;

  // Try to match the longest service slug first (to avoid partial matches)
  const sortedServices = [...LEGAL_SERVICES].sort((a, b) => b.keyword.length - a.keyword.length);
  const match = sortedServices
    .map((s) => {
      const prefix = s.keyword + "-";
      return rest.startsWith(prefix)
        ? { service: s, city: rest.slice(prefix.length) }
        : null;
    })
    .find((m) => m !== null && m.city.length > 0);

  if (!match) return <Navigate to="/404" replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      {/* @ts-ignore */}
      <ServiceLocalPage serviceSlug={match.service.slug} citySlug={match.city} />
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
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
            {/* Hyper-local SEO Pages – escritório por cidade (estáticas + dinâmicas via catch-all) */}
            {["curitiba","londrina","maringa","cascavel","foz-do-iguacu","ponta-grossa","guarapuava","colombo","apucarana","toledo","arapongas","campo-largo","campo-mourao","paranagua","umuarama","cornelio-procopio","pato-branco","francisco-beltrao","telemacos-borba","irati","palmas","cianorte","castro","dois-vizinhos","guaira"].map((city) => (
              <Route key={city} path={`/escritorio-advocacia-${city}`} element={<LocalAdvocaciaPage citySlugOverride={city} />} />
            ))}
            {/* Catch-all para cidades dinâmicas: /escritorio-advocacia-{qualquer-cidade} */}
            <Route path="/escritorio-advocacia-*" element={<DynamicCityRoute />} />
            {/* Hyper-local SEO Pages – serviço + cidade (5 serviços × 25 cidades = 125 páginas nativas) */}
            {(["pensao-alimenticia","divorcio-consensual","cobranca-aluguel","transferencia-veiculo","direito-agrario"] as const).flatMap((svc) =>
              ["curitiba","londrina","maringa","cascavel","foz-do-iguacu","ponta-grossa","guarapuava","colombo","apucarana","toledo","arapongas","campo-largo","campo-mourao","paranagua","umuarama","cornelio-procopio","pato-branco","francisco-beltrao","telemacos-borba","irati","palmas","cianorte","castro","dois-vizinhos","guaira"].map((city) => (
                <Route key={`${svc}-${city}`} path={`/advogado-${svc}-${city}`} element={<ServiceLocalPage serviceSlug={svc} citySlug={city} />} />
              ))
            )}
            {/* Catch-all para cidades/serviços dinâmicos adicionados via dashboard */}
            {/* Catch-all para cidades/serviços dinâmicos adicionados via dashboard */}
            <Route path="/advogado/*" element={<DynamicServiceCityRoute />} />
            {/* Gerador de Documentos Jurídicos */}
            <Route path="/gerador-documentos" element={<GeradorDocumentos />} />
            {["notificacao-cobranca-aluguel","notificacao-divida","acordo-divorcio","declaracao-uniao-estavel","contrato-arrendamento-rural","declaracao-dependencia-economica","revisao-pensao-alimenticia"].map((slug) => (
              <Route key={slug} path={`/gerador-${slug}`} element={<GeradorDocumentoPage docTypeSlug={slug} />} />
            ))}
            {/* Perguntas Jurídicas — Agente de Descoberta */}
            <Route path="/pergunta/:slug" element={<PerguntaJuridica />} />
            {/* Blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* Lawyer/Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="staff"><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/clients" element={<ProtectedRoute requiredRole="staff"><Clients /></ProtectedRoute>} />
            <Route path="/dashboard/cases" element={<ProtectedRoute requiredRole="staff"><Cases /></ProtectedRoute>} />
            <Route path="/dashboard/appointments" element={<ProtectedRoute requiredRole="staff"><Appointments /></ProtectedRoute>} />
            <Route path="/dashboard/messages" element={<ProtectedRoute requiredRole="staff"><Messages /></ProtectedRoute>} />
            <Route path="/dashboard/chat" element={<ProtectedRoute requiredRole="staff"><Chat /></ProtectedRoute>} />
            <Route path="/dashboard/blog" element={<ProtectedRoute requiredRole="staff"><BlogAdmin /></ProtectedRoute>} />
            <Route path="/dashboard/documentos" element={<ProtectedRoute requiredRole="staff"><DocumentosAdmin /></ProtectedRoute>} />
            <Route path="/dashboard/analyses" element={<ProtectedRoute requiredRole="staff"><AnalysesReceived /></ProtectedRoute>} />
            <Route path="/dashboard/tjpr" element={<ProtectedRoute requiredRole="staff"><TJPRMonitor /></ProtectedRoute>} />
            <Route path="/dashboard/legal-monitor" element={<ProtectedRoute requiredRole="staff"><LegalMonitor /></ProtectedRoute>} />
            <Route path="/dashboard/seo-local" element={<ProtectedRoute requiredRole="staff"><SEOLocalManager /></ProtectedRoute>} />
            {/* Client Portal Routes */}
            <Route path="/client-login" element={<ClientLogin />} />
            <Route path="/client-portal" element={<ProtectedRoute requiredRole="client"><ClientPortal /></ProtectedRoute>}>
              <Route index element={<ClientCases />} />
              <Route path="documents" element={<ClientDocuments />} />
              <Route path="appointments" element={<ClientAppointments />} />
              <Route path="messages" element={<ClientMessages />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
