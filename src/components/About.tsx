import { CheckCircle, Code2, Rocket, Shield } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Código Limpo",
    description: "Desenvolvimento com as melhores práticas e tecnologias modernas.",
  },
  {
    icon: Rocket,
    title: "Alta Performance",
    description: "Sites rápidos e otimizados para melhor experiência do usuário.",
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Proteção de dados e implementação de boas práticas de segurança.",
  },
];

const benefits = [
  "Suporte técnico dedicado",
  "Código documentado",
  "Design responsivo",
  "SEO otimizado",
  "Treinamento incluso",
  "Manutenção facilitada",
];

const About = () => {
  return (
    <section id="sobre" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Sobre Nós
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-4 mb-6">
              Por que escolher a
              <span className="text-primary"> LVF_Code</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Somos especialistas em desenvolvimento web com foco em entregar
              soluções que realmente funcionam. Nosso objetivo é transformar suas
              necessidades em sistemas eficientes e sites que convertem.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-2xl bg-card border border-border card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
