import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Schema de validação com Zod
const signupSchema = z
    .object({
        name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
        email: z.string().email({ message: 'Email inválido' }),
        password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    });

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            // Usuário criado com sucesso → Firebase faz login automático
            navigate('/dashboard');
        } catch (error: any) {
            let message = 'Erro ao criar conta';
            if (error.code === 'auth/email-already-in-use') {
                message = 'Este email já está cadastrado';
            } else if (error.code === 'auth/weak-password') {
                message = 'Senha muito fraca';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Email inválido';
            }
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4">
            <Card className="w-full max-w-md border-red-600/30 bg-black/90 shadow-2xl backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-white">
                        Criar conta no SofVet
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Preencha os dados para começar a usar o sistema
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Nome */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Nome completo</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Dr. João Silva"
                                                className="border-red-600/50 bg-black/50 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="joao@clinica.com"
                                                type="email"
                                                className="border-red-600/50 bg-black/50 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            {/* Senha */}
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

                            {/* Confirmar Senha */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Confirmar senha</FormLabel>
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

                            {/* Mensagem de erro geral */}
                            {errorMessage && (
                                <p className="text-red-400 text-center font-medium">{errorMessage}</p>
                            )}

                            {/* Botão */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Criando conta...
                                    </>
                                ) : (
                                    'Criar conta'
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Link para login */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Já tem conta?{' '}
                            <a href="/login" className="text-red-500 hover:underline font-medium">
                                Faça login aqui
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;