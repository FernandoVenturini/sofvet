import {
  Lightbulb,
  ShieldPlus,
  Percent,
  Building2,
  Globe,
  Smartphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const planos = [
  {
    icon: Lightbulb,
    title: "Light",
    description:
      "Ideal para clínicas e consultórios de pequeno porte que desejam uma solução básica e eficiente. Inclui agendamento de consultas, prontuário eletrônico, cadastro de pacientes e controle de atendimentos.",
    features: ["Agendamento", "Prontuário", "Gestão"],
  },
  {
    icon: ShieldPlus,
    title: "Full",
    description:
      "Perfeito para clínicas e consultórios que buscam uma gestão completa. Inclui todos os recursos do plano Light, além de controle financeiro, estoque, emissão de notas fiscais, relatórios avançados e integração com laboratórios parceiros.",
    features: [
      "Controle Financeiro",
      "Gestão",
      "Emissão de notas",
    ],
  },
  {
    icon: Percent,
    title: "Fiscal",
    description:
      "Voltado para empresas que necessitam de soluções fiscais e contábeis robustas. Oferece integração com sistemas de contabilidade, emissão de notas fiscais eletrônicas, gestão tributária e relatórios financeiros detalhados.",
    features: ["Nota FIscal Eletrônica", "Relatorios", "Pagamentos"],
  },
];

const Planos = () => {
  return (
    <section id="servicos" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-3xl uppercase tracking-wider">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-4 mb-6">
            "Tudo o Que Você Precisa em um Único
            <span className="text-primary"> Sistema"</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Escolha o plano ideal para sua clinica e impulsione seu crescimento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planos.map((plano, index) => (
            <Card
              key={index}
              className="bg-card border-border card-hover group cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <plano.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                  {plano.title}
                </h3>

                <p className="text-muted-foreground mb-4">
                  {plano.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {plano.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Planos;
