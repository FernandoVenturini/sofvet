import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";
import Layout from "../components/Layout";
import NovaFicha from "../pages/fichas/NovaFicha";
import ListaFichas from "../pages/fichas/ListaFichas";
import EditarFicha from "../pages/fichas/EditarFicha";
import TabelaVacinas from '../pages/tabelas/TabelaVacinas';
import AgendaRetornos from '@/pages/agenda/AgendaRetornos';
import Movimento from '@/pages/movimentos/Movimento';
import Relatorios from '@/pages/relatorios/Relatorios';
import BackupDiario from '@/pages/diversos/BackupDiario';
import Usuarios from '@/pages/diversos/Usuarios';
import NovaConsulta from "@/pages/movimentos/NovaConsulta";
import TabelaProdutos from "@/pages/tabelas/TabelaProdutos";
import ListaConsultas from "@/pages/movimentos/ListaConsultas";
import AgendaCompleta from "@/pages/agenda/AgendaCompleta";
import TabelaEspecieRacaPelagem from '../pages/tabelas/TabelaEspecieRacaPelagem';
import Retorno from '../pages/fichas/Retorno';
import TabelaFuncionarios from '../pages/tabelas/TabelaFuncionarios';
import TabelaProdutosServicos from '../pages/tabelas/TabelaProdutosServicos';

export default function RoutesAdm() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Rotas protegidas com Layout (sidebar + header) */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/fichas/nova" element={<PrivateRoute><NovaFicha /></PrivateRoute>} />
        <Route path="/fichas/lista" element={<PrivateRoute><ListaFichas /></PrivateRoute>} />
        <Route path="/fichas/editar/:id" element={<PrivateRoute><EditarFicha /></PrivateRoute>} />
        <Route path="/tabelas/vacinas" element={<PrivateRoute><TabelaVacinas /></PrivateRoute>} />
        <Route path="/agenda/retornos" element={<PrivateRoute><AgendaRetornos /></PrivateRoute>} />
        <Route path="/movimento" element={<PrivateRoute><Movimento /></PrivateRoute>} />
        <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
        <Route path="/diversos/backup" element={<PrivateRoute><BackupDiario /></PrivateRoute>} />
        <Route path="/diversos/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        <Route path="movimento/nova" element={<PrivateRoute><NovaConsulta /></PrivateRoute>} />
        <Route path="tabelas/produtos" element={<PrivateRoute><TabelaProdutos/></PrivateRoute>} />
        <Route path="/movimento/lista" element={<PrivateRoute><ListaConsultas/></PrivateRoute>} />
        <Route path="/agenda/completa" element={<PrivateRoute><AgendaCompleta/></PrivateRoute>} />
        <Route path="/tabelas/especie-raca" element={<PrivateRoute><TabelaEspecieRacaPelagem /></PrivateRoute>} />
        <Route path="/fichas/retorno" element={<PrivateRoute><Retorno /></PrivateRoute>} />
        <Route path="/tabelas/funcionarios" element={<PrivateRoute><TabelaFuncionarios /></PrivateRoute>} />
        <Route path="/tabelas/produtos" element={<PrivateRoute><TabelaProdutosServicos /></PrivateRoute>} />
        {/* Adicione mais rotas protegidas aqui */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}