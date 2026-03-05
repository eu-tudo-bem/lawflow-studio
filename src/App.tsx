import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

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
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const PensaoAlimenticia = lazy(() => import("./pages/PensaoAlimenticia"));
const DivorcioConsensual = lazy(() => import("./pages/DivorcioConsensual"));
const CobrancaAluguel = lazy(() => import("./pages/CobrancaAluguel"));
const DireitoAgrario = lazy(() => import("./pages/DireitoAgrario"));
const TransferenciaVeiculos = lazy(() => import("./pages/TransferenciaVeiculos"));
const LocalAdvocaciaPage = lazy(() => import("./pages/LocalAdvocaciaPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

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
            {/* Hyper-local SEO Pages – Paraná Cities */}
            <Route path="/escritorio-advocacia-:cidade" element={<LocalAdvocaciaPage />} />
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
            <Route path="/dashboard/analyses" element={<ProtectedRoute requiredRole="staff"><AnalysesReceived /></ProtectedRoute>} />
            <Route path="/dashboard/tjpr" element={<ProtectedRoute requiredRole="staff"><TJPRMonitor /></ProtectedRoute>} />
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
