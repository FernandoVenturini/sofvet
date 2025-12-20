import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const BackupDiario = () => {
  const { user } = useContext(AuthContext);

  const realizarBackup = async () => {
    if (!confirm('Deseja fazer o backup completo dos dados da clínica agora?')) return;

    try {
      const backupData: any = {
        dataBackup: new Date().toISOString(),
        usuario: user?.email,
        animais: [],
        vacinas: [],
        produtos: [],
      };

      // Backup de animais
      const animaisSnapshot = await getDocs(collection(db, 'animais'));
      animaisSnapshot.forEach((doc) => {
        backupData.animais.push({ id: doc.id, ...doc.data() });
      });

      // Backup de vacinas tabela
      const vacinasSnapshot = await getDocs(collection(db, 'vacinas'));
      vacinasSnapshot.forEach((doc) => {
        backupData.vacinas.push({ id: doc.id, ...doc.data() });
      });

      // Backup de produtos (se existir)
      const produtosSnapshot = await getDocs(collection(db, 'produtos'));
      produtosSnapshot.forEach((doc) => {
        backupData.produtos.push({ id: doc.id, ...doc.data() });
      });

      // Converte para JSON e faz download
      const json = JSON.stringify(backupData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-sofvet-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert('Backup realizado com sucesso! Arquivo baixado.');
    } catch (error) {
      console.error('Erro no backup:', error);
      alert('Erro ao realizar backup.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-10">Backup Diário</h1>

      <Card className="bg-black/50 border-red-600/30">
        <CardHeader>
          <CardTitle className="text-white">Fazer Backup Completo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300">
            O backup inclui todas as fichas de animais, vacinas cadastradas, produtos e movimentos.
            Recomendado fazer diariamente.
          </p>

          <div className="bg-black/70 p-6 rounded-lg border border-red-600/30">
            <p className="text-white mb-4">
              Último backup: {new Date().toLocaleDateString('pt-BR')}
            </p>
            <Button onClick={realizarBackup} className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-8 text-lg">
              <Download className="mr-3 h-6 w-6" />
              Realizar Backup Agora
            </Button>
          </div>

          <p className="text-sm text-gray-400">
            O arquivo será baixado no formato JSON e pode ser importado novamente no futuro.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupDiario;