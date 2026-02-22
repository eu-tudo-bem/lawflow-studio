import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Cases from "./pages/Cases";
import Appointments from "./pages/Appointments";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Calculadora from "./pages/Calculadora";
import SimuladorPensao from "./pages/SimuladorPensao";
import SimuladorJuros from "./pages/SimuladorJuros";
import SimuladorAposentadoria from "./pages/SimuladorAposentadoria";
import SimuladorHorasExtras from "./pages/SimuladorHorasExtras";
import ClientLogin from "./pages/ClientLogin";
import ClientPortal from "./pages/ClientPortal";
import ClientCases from "./pages/client/ClientCases";
import ClientAppointments from "./pages/client/ClientAppointments";
import ClientMessages from "./pages/client/ClientMessages";
import ClientDocuments from "./pages/client/ClientDocuments";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdmin from "./pages/BlogAdmin";
import AnalysesReceived from "./pages/AnalysesReceived";
import TJPRMonitor from "./pages/TJPRMonitor";
import PensaoAlimenticia from "./pages/PensaoAlimenticia";
import DivorcioConsensual from "./pages/DivorcioConsensual";
import CobrancaAluguel from "./pages/CobrancaAluguel";
import DireitoAgrario from "./pages/DireitoAgrario";
import WhatsAppButton from "./components/WhatsAppButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WhatsAppButton />
      <BrowserRouter>
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
          {/* Blog */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* Lawyer/Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/clients" element={<Clients />} />
          <Route path="/dashboard/cases" element={<Cases />} />
          <Route path="/dashboard/appointments" element={<Appointments />} />
          <Route path="/dashboard/messages" element={<Messages />} />
          <Route path="/dashboard/chat" element={<Chat />} />
          <Route path="/dashboard/blog" element={<BlogAdmin />} />
          <Route path="/dashboard/analyses" element={<AnalysesReceived />} />
          <Route path="/dashboard/tjpr" element={<TJPRMonitor />} />
          {/* Client Portal Routes */}
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-portal" element={<ClientPortal />}>
            <Route index element={<ClientCases />} />
            <Route path="documents" element={<ClientDocuments />} />
            <Route path="appointments" element={<ClientAppointments />} />
            <Route path="messages" element={<ClientMessages />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
