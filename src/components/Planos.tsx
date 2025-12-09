import {
  Stethoscope,
  Scale,
  Plane,
  Building2,
  Globe,
  Smartphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const planos = [
  {
    icon: Stethoscope,
    title: "Clínicas e Consultórios",
    description:
      "Sistemas completos para clínicas veterinárias, médicas e odontológicas com agendamento online.",
    features: ["Agendamento", "Prontuário", "Gestão"],
  },
  {
    icon: Scale,
    title: "Escritórios de Advocacia",
    description:
      "Sites institucionais e sistemas de gestão de processos para advogados e escritórios jurídicos.",
    features: ["Site Institucional", "Gestão de Processos", "CRM"],
  },
  {
    icon: Plane,
    title: "Transfer e Turismo",
    description:
      "Plataformas de reserva e sistemas de gestão para empresas de translado e agências de viagem.",
    features: ["Reservas Online", "Gestão de Frota", "Pagamentos"],
  },
  {
    icon: Building2,
    title: "Empresas em Geral",
    description:
      "Soluções web personalizadas para qualquer tipo de negócio. Do site institucional ao e-commerce.",
    features: ["Sites", "E-commerce", "Sistemas"],
  },
  {
    icon: Globe,
    title: "Landing Pages",
    description:
      "Páginas de alta conversão para campanhas de marketing, lançamentos e captação de leads.",
    features: ["Alta Conversão", "SEO", "Responsivo"],
  },
  {
    icon: Smartphone,
    title: "Aplicações Web",
    description:
      "Sistemas web modernos e responsivos que funcionam em qualquer dispositivo.",
    features: ["PWA", "Dashboard", "APIs"],
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
            Escolha o plano ideal para sua empresa e impulsione seu crescimento.
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
