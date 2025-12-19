import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PawPrint, Heart, Calendar, Users, Shield, Clock, Stethoscope, FileText } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-red-600/30">
                <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src="/assets/logo-sofvet.png"
                            alt="SofVet Logo"
                            className="h-16 w-auto object-contain brightness-125 contrast-125 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                        />
                        <div>
                            <h1 className="text-3xl font-bold">SofVet</h1>
                            <p className="text-sm text-gray-400">Software Veterinário</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="hover:text-red-500 transition">Recursos</a>
                        <a href="#pricing" className="hover:text-red-500 transition">Preços</a>
                        <a href="#contact" className="hover:text-red-500 transition">Contato</a>
                        <Button asChild className="bg-red-600 hover:bg-red-700">
                            <a href="/signup">Teste Grátis por 7 Dias</a>
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <Badge className="mb-4 bg-red-600/20 text-red-400 border-red-600/50">Sistema Veterinário Moderno</Badge>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        SofVet
                        <br />
                        <span className="text-red-500">Gestão Completa para Sua Clínica</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                        O sistema mais completo para gerenciar fichas de pacientes, vacinas, consultas, estoque e financeiro da sua clínica veterinária.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6">
                            <a href="/signup">Teste Grátis por 7 Dias</a>
                        </Button>
                        <Button size="lg" variant="outline" className="border-red-600 text-red-500 hover:bg-red-600/20 text-lg px-8 py-6">
                            Ver Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-4 bg-black/50">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12">Tudo que sua clínica precisa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-black/70 border-red-600/30">
                            <CardHeader>
                                <PawPrint className="h-12 w-12 text-red-500 mb-4" />
                                <CardTitle>Fichas de Pacientes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">
                                    Cadastro completo de animais com histórico, vacinas, patologias, imagens e observações.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/70 border-red-600/30">
                            <CardHeader>
                                <Calendar className="h-12 w-12 text-red-500 mb-4" />
                                <CardTitle>Agenda e Retornos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">
                                    Controle de consultas, retornos e revacinações com alertas automáticos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/70 border-red-600/30">
                            <CardHeader>
                                <Stethoscope className="h-12 w-12 text-red-500 mb-4" />
                                <CardTitle>Consultas e Movimento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">
                                    Registro de atendimentos, prescrições, exames e controle financeiro completo.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/70 border-red-600/30">
                            <CardHeader>
                                <FileText className="h-12 w-12 text-red-500 mb-4" />
                                <CardTitle>Relatórios</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">
                                    Relatórios de faturamento, clientes devedores, vacinas pendentes e mais.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/70 border-red-600/30">
                            <CardHeader>
                                <Shield className="h-12 w-12 text-red-500 mb-4" />
                                <CardTitle>Seguro e Confiável</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">
                                    Dados na nuvem com backup automático e acesso de qualquer lugar.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/70 border-red-600/30">
                            <CardHeader>
                                <Clock className="h-12 w-12 text-red-500 mb-4" />
                                <CardTitle>Suporte 24h</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">
                                    Equipe especializada pronta para ajudar sua clínica a qualquer momento.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-12">Planos Simples e Transparentes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="bg-black/70 border-red-600/30">
                            <CardHeader>
                                <CardTitle className="text-2xl">Básico</CardTitle>
                                <p className="text-4xl font-bold mt-4">R$ 99<span className="text-lg text-gray-400">/mês</span></p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-gray-400">
                                    <li>Até 500 fichas</li>
                                    <li>Agenda básica</li>
                                    <li>Relatórios essenciais</li>
                                    <li>Suporte por e-mail</li>
                                </ul>
                                <Button className="w-full mt-8 bg-red-600 hover:bg-red-700">Começar</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-red-600/20 border-red-600">
                            <CardHeader>
                                <Badge className="mb-4">Mais Popular</Badge>
                                <CardTitle className="text-2xl">Profissional</CardTitle>
                                <p className="text-4xl font-bold mt-4">R$ 199<span className="text-lg text-gray-400">/mês</span></p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-gray-300">
                                    <li>Fichas ilimitadas</li>
                                    <li>Agenda completa</li>
                                    <li>Todos os relatórios</li>
                                    <li>Suporte prioritário</li>
                                    <li>Multi-usuário</li>
                                </ul>
                                <Button className="w-full mt-8 bg-red-600 hover:bg-red-700">Começar</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/70 border-red-600/30">
                            <CardHeader>
                                <CardTitle className="text-2xl">Enterprise</CardTitle>
                                <p className="text-4xl font-bold mt-4">R$ 399,00<span className="text-lg text-gray-400">/mês</span></p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-gray-400">
                                    <li>Tudo do Profissional</li>
                                    <li>Multi-clínicas</li>
                                    <li>API e integrações</li>
                                    <li>Suporte dedicado</li>
                                    <li>Treinamento personalizado</li>
                                </ul>
                                <Button className="w-full mt-8 bg-red-600 hover:bg-red-700">Falar com vendas</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-red-600/30 py-12 px-4">
                <div className="container mx-auto text-center">
                    <img
                        src="/assets/logo-sofvet.png"
                        alt="SofVet Logo"
                        className="mx-auto h-24 w-auto object-contain mb-8 brightness-125 contrast-125 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                    />
                    <p className="text-gray-400 mb-4">
                        SofVet © 2025 - Todos os direitos reservados
                    </p>
                    <p className="text-sm text-gray-500">
                        Sistema de gerenciamento para clínicas veterinárias
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;