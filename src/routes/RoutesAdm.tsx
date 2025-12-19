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
        {/* Adicione mais rotas protegidas aqui */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}