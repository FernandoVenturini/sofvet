import { Routes, Route, Navigate } from "react-router-dom";

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
import ListaConsultas from "@/pages/movimentos/ListaConsultas";
import AgendaCompleta from '@/pages/tabelas/AgendaCompleta';
import TabelaEspecieRacaPelagem from '../pages/tabelas/TabelaEspecieRacaPelagem';
import Retorno from '../pages/fichas/Retorno';
import TabelaFuncionarios from '../pages/tabelas/TabelaFuncionarios';
import TabelaProprietarios from '../pages/tabelas/TabelaProprietarios';
import TabelaProdutosServicos from '../pages/tabelas/TabelaProdutosServicos';
import TabelaFornecedores from '../pages/tabelas/TabelaFornecedores';
import Patologias from "@/pages/tabelas/Patologias";
import BackupMedicamentos from '@/pages/medicamentos/BackupMedicamentos';
import RelatoriosMedicamentos from '@/pages/medicamentos/RelatoriosMedicamentos';
import Medicamentos from '@/pages/Medicamentos';
import Mensagens from '@/pages/diversos/Mensagens';
import Configuracoes from '@/pages/diversos/Configuracoes';
import Utilitarios from '@/pages/Utilitarios';
import Ajuda from "@/pages/Ajuda";

export default function RoutesAdm() {
	return (
		<Routes>
			{/* Rotas públicas */}
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />

			{/* Rotas protegidas com Layout (sidebar + header) - ÚNICA SEÇÃO */}
			<Route element={<Layout />}>
				<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
				<Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />

				{/* Fichas */}
				<Route path="/fichas/nova" element={<PrivateRoute><NovaFicha /></PrivateRoute>} />
				<Route path="/fichas/lista" element={<PrivateRoute><ListaFichas /></PrivateRoute>} />
				<Route path="/fichas/editar/:id" element={<PrivateRoute><EditarFicha /></PrivateRoute>} />
				<Route path="/fichas/retorno" element={<PrivateRoute><Retorno /></PrivateRoute>} />

				{/* Agenda - DUAS ROTAS PARA MESMA PÁGINA */}
				<Route path="/agenda/retornos" element={<PrivateRoute><AgendaRetornos /></PrivateRoute>} />
				<Route path="/agenda/completa" element={<PrivateRoute><AgendaCompleta /></PrivateRoute>} />
				<Route path="/tabelas/agendas" element={<PrivateRoute><AgendaCompleta /></PrivateRoute>} />
				<Route path="/tabelas/agenda/completa" element={<PrivateRoute><AgendaCompleta /></PrivateRoute>} />

				{/* Movimento/Consultas */}
				<Route path="/movimento" element={<PrivateRoute><Movimento /></PrivateRoute>} />
				<Route path="/movimento/nova" element={<PrivateRoute><NovaConsulta /></PrivateRoute>} />
				<Route path="/movimento/lista" element={<PrivateRoute><ListaConsultas /></PrivateRoute>} />

				{/* Relatórios */}
				<Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />

				{/* Utilitários */}
				<Route path="/utilitarios" element={<PrivateRoute><Utilitarios /></PrivateRoute>} />

				{/* Ajuda */}
				<Route path="/ajuda" element={<PrivateRoute><Ajuda /></PrivateRoute>} />

				{/* Diversos */}
				<Route path="/diversos/backup" element={<PrivateRoute><BackupDiario /></PrivateRoute>} />
				<Route path="/diversos/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
				<Route path="/diversos/mensagens" element={<PrivateRoute><Mensagens /></PrivateRoute>} />
				<Route path="/config" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />
				{/* Redirecionamento para compatibilidade */}
				<Route path="/mensagens" element={<Navigate to="/diversos/mensagens" replace />} />

				{/* Tabelas */}
				<Route path="/tabelas/vacinas" element={<PrivateRoute><TabelaVacinas /></PrivateRoute>} />
				<Route path="/tabelas/especie-raca" element={<PrivateRoute><TabelaEspecieRacaPelagem /></PrivateRoute>} />
				<Route path="/tabelas/funcionarios" element={<PrivateRoute><TabelaFuncionarios /></PrivateRoute>} />
				<Route path="/tabelas/produtos" element={<PrivateRoute><TabelaProdutosServicos /></PrivateRoute>} />
				<Route path="/tabelas/proprietarios" element={<PrivateRoute><TabelaProprietarios /></PrivateRoute>} />
				<Route path="/tabelas/fornecedores" element={<PrivateRoute><TabelaFornecedores /></PrivateRoute>} />
				<Route path="/tabelas/patologias" element={<PrivateRoute><Patologias /></PrivateRoute>} />

				{/* Medicamentos (DEF) */}
				<Route path="/medicamentos" element={<PrivateRoute><Medicamentos /></PrivateRoute>} />
				<Route path="/medicamentos/backup" element={<PrivateRoute><BackupMedicamentos /></PrivateRoute>} />
				<Route path="/medicamentos/relatorios" element={<PrivateRoute><RelatoriosMedicamentos /></PrivateRoute>} />

				{/* Redirecionamento para manter compatibilidade */}
				<Route path="/tabelas/def" element={<Navigate to="/medicamentos" replace />} />
			</Route>

			{/* Rota 404 */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}