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
import ClientLogin from "./pages/ClientLogin";
import ClientPortal from "./pages/ClientPortal";
import ClientCases from "./pages/client/ClientCases";
import ClientAppointments from "./pages/client/ClientAppointments";
import ClientMessages from "./pages/client/ClientMessages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calculadora" element={<Calculadora />} />
          <Route path="/simulador-pensao" element={<SimuladorPensao />} />
          {/* Lawyer/Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/clients" element={<Clients />} />
          <Route path="/dashboard/cases" element={<Cases />} />
          <Route path="/dashboard/appointments" element={<Appointments />} />
          <Route path="/dashboard/messages" element={<Messages />} />
          <Route path="/dashboard/chat" element={<Chat />} />
          {/* Client Portal Routes */}
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-portal" element={<ClientPortal />}>
            <Route index element={<ClientCases />} />
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
