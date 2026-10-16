import { Check } from "lucide-react";

export default function PricingSection() {
    const plans = [
        {
            name: "Básico",
            price: "R$ 99",
            period: "/mês",
            description: "Perfeito para clínicas iniciantes ou pequenos consultórios",
            features: [
                "Até 300 atendimentos/mês",
                "1 usuário",
                "Agenda + prontuário eletrônico",
                "Relatórios básicos",
                "Suporte por e-mail",
            ],
            cta: "Testar 7 dias grátis",
            popular: false,
        },
        {
            name: "Profissional",
            price: "R$ 199",
            period: "/mês",
            description: "O mais escolhido por clínicas que querem crescer rápido",
            features: [
                "Atendimentos ilimitados",
                "Até 5 usuários",
                "Financeiro completo",
                "Estoque e vacinas",
                "WhatsApp integrado",
                "Relatórios avançados",
                "Suporte prioritário",
            ],
            cta: "Testar 7 dias grátis",
            popular: true,
        },
        {
            name: "Premium",
            price: "R$ 399",
            period: "/mês",
            description: "Para clínicas 24h, redes e hospitais veterinários",
            features: [
                "Tudo do Profissional",
                "Usuários ilimitados",
                "Multi-clínicas",
                "Telemedicina nativa",
                "Dashboard em tempo real",
                "API e integrações",
                "Suporte VIP 24h",
            ],
            cta: "Testar 7 dias grátis",
            popular: false,
        },
    ];

    return (
        <section className="py-20 bg-black scroll-mt-24" id="planos">
            {" "}            
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        Escolha o plano <span className="text-red-600">ideal</span> para sua
                        clínica.
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Sem pegadinha. Cancele quando quiser.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`
            relative flex flex-col h-full rounded-2xl transition-all duration-300
            hover:z-10 hover:-translate-y-2 lg:hover:-translate-y-4
            ${plan.popular
                                    ? 
                                    "bg-white text-black lg:scale-105 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.35)] hover:shadow-[0_25px_70px_-5px_rgba(220,38,38,0.6)]"
                                    : 
                                    "bg-[#1a1a1a] border border-gray-800 hover:shadow-[0_25px_60px_-10px_rgba(220,38,38,0.45)]"
                                }
          `}          
                        >
                            {/* Badge "Mais Popular" */}
                            {plan.popular && (                                
                                <div className="absolute top-4 right-4">
                                    <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                        MAIS POPULAR
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex flex-col flex-1 p-6 sm:p-8 text-left">
                                <h3
                                    className={`text-2xl font-bold ${plan.popular ? "text-black" : "text-white"}`}
                                >
                                    {plan.name}
                                </h3>

                                <div className="mt-6">
                                    <span
                                        className={`text-4xl sm:text-5xl font-bold ${plan.popular ? "text-black" : "text-white"}`}
                                    >
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-500 ml-1">{plan.period}</span>
                                </div>

                                <p
                                    className={`mt-4 text-sm ${plan.popular ? "text-gray-700" : "text-gray-400"}`}
                                >
                                    {plan.description}
                                </p>

                                <ul className="mt-8 space-y-4 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <Check
                                                className={`w-5 h-5 shrink-0 mt-0.5 ${plan.popular ? "text-red-600" : "text-red-500"}`}
                                            />
                                            <span
                                                className={`text-sm ${plan.popular ? "text-gray-800" : "text-gray-300"}`}
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto pt-10">
                                    <button
                                        className={`
                  w-full py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300
                  hover:scale-105 active:scale-95
                  ${plan.popular
                                                ? "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-600/50"
                                                : "bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                                            }
                `}
                                    >
                                        {plan.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center text-gray-500 mt-12 text-sm">
                    Todos os planos incluem: atualizações grátis · backup diário · 100% na
                    nuvem · sem fidelidade
                </p>
            </div>
        </section>
    );
}
