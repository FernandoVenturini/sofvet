import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Usuarios = () => {
  const { user } = useContext(AuthContext);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const alterarSenha = () => {
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    if (novaSenha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    alert('Funcionalidade de troca de senha será integrada com Firebase Auth em breve.\nPor enquanto, use o "Esqueci minha senha" no login.');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-10">Usuários e Senhas</h1>

      <Card className="bg-black/50 border-red-600/30">
        <CardHeader>
          <CardTitle className="text-white">Alterar Senha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Senha Atual</Label>
            <Input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="bg-black/50 border-red-600/50 text-white"
              disabled // Firebase não permite verificar senha atual no frontend
            />
            <p className="text-sm text-gray-400">Use "Esqueci minha senha" no login para redefinir</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Nova Senha</Label>
            <Input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="bg-black/50 border-red-600/50 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Confirmar Nova Senha</Label>
            <Input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="bg-black/50 border-red-600/50 text-white"
            />
          </div>

          <Button onClick={alterarSenha} className="bg-red-600 hover:bg-red-700">
            Alterar Senha
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-black/50 border-red-600/30 mt-8">
        <CardHeader>
          <CardTitle className="text-white">Usuários do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Perfil</TableHead>
                <TableHead className="text-white">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-white">{user?.email}</TableCell>
                <TableCell className="text-white">Administrador</TableCell>
                <TableCell className="text-green-400">Ativo</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="text-sm text-gray-400 mt-4">
            Multi-usuário completo (veterinários, recepcionistas) será implementado na versão Pro.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;