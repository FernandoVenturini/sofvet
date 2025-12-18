import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Dog } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, clinicName: contextClinicName } = useContext(AuthContext);
  const [clinicName, setClinicName] = useState(contextClinicName);

  useEffect(() => {
    setClinicName(contextClinicName || localStorage.getItem('sofvet-clinic-name') || '');
  }, [contextClinicName]);

  useEffect(() => {
    const handler = () => {
      setClinicName(localStorage.getItem('sofvet-clinic-name') || '');
    };
    window.addEventListener('clinicNameUpdated', handler);
    return () => window.removeEventListener('clinicNameUpdated', handler);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Dog className="h-12 w-12 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">
            Bem-vindo ao SofVet,
            <br />
            {clinicName || user?.displayName || user?.email}!
          </h1>
          <p className="text-md text-gray-400 mt-2">
            {'Sistema de Gerenciamento de Clínica Veterinária'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <CardTitle className="text-white">Fichas de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Acesse ou crie novas fichas de animais.</p>
            <Button className="mt-4 bg-red-600 hover:bg-red-700 w-full">Ir para Fichas</Button>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <CardTitle className="text-white">Movimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Registre operações e consultas.</p>
            <Button className="mt-4 bg-red-600 hover:bg-red-700 w-full">Nova Operação</Button>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <CardTitle className="text-white">Tabelas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Gerencie vacinas, produtos, etc.</p>
            <Button className="mt-4 bg-red-600 hover:bg-red-700 w-full">Acessar Tabelas</Button>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <CardTitle className="text-white">Mensagens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">0 mensagens novas.</p>
            <Button className="mt-4 bg-red-600 hover:bg-red-700 w-full">Ver Mensagens</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/50 border-red-600/30">
        <CardHeader>
          <CardTitle className="text-white">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="border-red-600 text-red-500 hover:bg-red-600/20">Backup Diário</Button>
          <Button variant="outline" className="border-red-600 text-red-500 hover:bg-red-600/20">Relatórios</Button>
          <Button variant="outline" className="border-red-600 text-red-500 hover:bg-red-600/20">Configurações</Button>
          <Button variant="outline" className="border-red-600 text-red-500 hover:bg-red-600/20">Ajuda</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;