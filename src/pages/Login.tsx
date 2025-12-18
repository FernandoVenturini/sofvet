import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema, LoginFormData } from '@/lib/authSchema'; // Ajuste o path se necessário
import { AuthContext } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react'; // Ícone de loading (já vem com shadcn)

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Dentro do componente Login, substitua a função onSubmit por isso:
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);  // Chama o login real do contexto
      navigate('/dashboard');
    } catch (error: any) {
      // Tratamento de erros do Firebase
      let message = 'Erro no login';
      if (error.code === 'auth/user-not-found') message = 'Usuário não encontrado';
      else if (error.code === 'auth/wrong-password') message = 'Senha incorreta';
      else if (error.code === 'auth/invalid-email') message = 'Email inválido';
      // Adicione toast aqui: toast.error(message);
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border-red-600/30 bg-black/90 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-white">Bem-vindo ao SofVet</CardTitle>
          <CardDescription className="text-gray-400">
            Faça login para acessar o painel veterinário
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        className="border-red-600/50 bg-black/50 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Campo Senha */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        className="border-red-600/50 bg-black/50 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Botão de Login */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
              <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                  Não tem conta?{' '}
                  <a href="/signup" className="text-red-500 hover:underline font-medium">
                    Cadastre-se aqui
                  </a>
                </p>
              </div>
            </form>
          </Form>

          {/* Links adicionais */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <a href="#" className="text-red-500 hover:underline">
              Esqueci minha senha
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;