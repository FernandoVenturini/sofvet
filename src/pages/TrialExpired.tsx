import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TrialExpired = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-black/80 border-red-600/30">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl text-red-500">Período de Teste Expirado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-xl text-gray-300">
            Seu teste gratuito de 7 dias acabou.
          </p>
          <p className="text-lg text-gray-400">
            Para continuar usando o SofVet, escolha um dos nossos planos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-black/70 border-red-600/30">
              <CardHeader>
                <CardTitle className="text-2xl">Básico</CardTitle>
                <p className="text-3xl font-bold mt-4">R$ 99/mês</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">Escolher Plano</Button>
              </CardContent>
            </Card>

            <Card className="bg-red-600/20 border-red-600">
              <CardHeader>
                <CardTitle className="text-2xl">Profissional</CardTitle>
                <p className="text-3xl font-bold mt-4">R$ 199/mês</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">Escolher Plano</Button>
              </CardContent>
            </Card>

            <Card className="bg-black/70 border-red-600/30">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <p className="text-3xl font-bold mt-4">R$ 399/mês</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">Falar com Vendas</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialExpired;