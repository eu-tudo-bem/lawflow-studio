import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
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
const LocalAdvocaciaPage = lazy(() => import("./pages