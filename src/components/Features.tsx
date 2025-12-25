// src/components/Features.tsx
import {
    Calendar,
    FileText,
    DollarSign,
    Package,
    Users,
    Cloud,
    Smartphone,
    Shield,
    Zap,
    Heart
} from "lucide-react";

const features = [
    {
        icon: Calendar,
        title: "Agenda com lembretes automáticos",
        desc: "Confirmação e lembretes por WhatsApp. Menos no-show, mais consultas."
    },
    {
        icon: FileText,
        title: "Prontuário eletrônico rápido",
        desc: "Acesse histórico completo em 2 cliques. Anamnese, exames, vacinas tudo em um lugar."
    },
    {
        icon: DollarSign,
        title: "Financeiro que não vaza dinheiro",
        desc: "Contas a receber/pagar, comissão de vets, relatórios diários automáticos."
    },
    {
        icon: Package,
        title: "Controle total de estoque e vacinas",
        desc: "Validade, lote, alerta de reposição e custo médio atualizado na hora."
    },
    {
        icon: Users,
        title: "Multi-usuário e multi-clínica",
        desc: "Um sistema para todas as suas filiais. Controle centralizado ou por unidade."
    },
    {
        icon: Smartphone,
        title: "Acesse do celular ou computador",
        desc: "100% na nuvem. Funciona até no consultório sem internet por até 24h (sync depois)."
    },
    {
        icon: Shield,
        title: "Dados criptografados e backup diário",
        desc: "Segurança nível banco. Seus dados nunca se perdem nunca."
    },
    {
        icon: Zap,
        title: "Rápido e Agil",
        desc: "Abriu o SofVet abre em 2 segundos. Mesmo com 10 mil pacientes."
    },
];

const Features = () => {
    return (
        <section id="funcionalidades" className="py-24 bg-black border-t border-red-900/20">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Título */}
                <div className="text-center mb-16">
                    <span className="text-red-500 font-bold text-sm uppercase tracking-wider">
                        Tudo que sua clínica precisa
                    </span>
                    <h2 className="text-5xl md:text-6xl font-black mt-4 text-white">
                        Simples.
                        <span className="text-red-600"> Rápido.</span> Fácil.
                    </h2>
                    <p className="text-gray-400 text-lg mt-6 max-w-3xl mx-auto">
                        Feito por quem vive o dia a dia da clínica. Nada de função inútil. Só o que realmente importa.
                    </p>
                </div>

                {/* Grid de funcionalidades */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-zinc-950 to-black border border-red-900/30 rounded-2xl p-8 
                         hover:border-red-600 hover:bg-zinc-950/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-600/10"
                        >
                            <div className="absolute inset-0 bg-red-600/5 rounded-2xl blur-3xl group-hover:bg-red-600/10 transition" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 
                                group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300">
                                    <feature.icon className="w-7 h-7 text-red-500 group-hover:text-white transition" />
                                </div>

                                <h3 className="text-xl font-bold text-white mt-6 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>

                            {/* Efeito canto vermelho */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-3xl -z-10 
                              group-hover:bg-red-600/20 transition" />
                        </div>
                    ))}
                </div>

                {/* Call to action no final */}
                <div className="text-center mt-20">
                    <p className="text-5xl font-bold text-white mb-6">
                        Chega de planilha e <span className="text-red-600"> sistema travando</span>!!!
                    </p>
                    <a
                        href="#planos"
                        className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-5 
                       rounded-xl text-lg shadow-2xl shadow-red-600/30 hover:shadow-red-600/50 transition-all hover:scale-105"
                    >
                        Testar 14 dias grátis agora
                        <Heart className="w-6 h-6 animate-pulse" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Features;