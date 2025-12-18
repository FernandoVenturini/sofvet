import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from "./components/PrivateRoute";
import Layout from './components/Layout';
import NovaFicha from './pages/fichas/NovaFicha';
import ListaFichas from './pages/fichas/ListaFichas';
import EditarFicha from './pages/fichas/EditarFicha';


// ← ADICIONEI A DEFINIÇÃO DO queryClient
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Todas as rotas protegidas dentro do Layout (sidebar + header) */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/fichas/nova" element={<PrivateRoute><NovaFicha /></PrivateRoute>} />
              <Route path="/fichas/lista" element={<PrivateRoute><ListaFichas /></PrivateRoute>} />
              <Route path="/fichas/editar/:id" element={<PrivateRoute><EditarFicha /></PrivateRoute>} />
              {/* Adicione mais rotas protegidas aqui no futuro */}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;