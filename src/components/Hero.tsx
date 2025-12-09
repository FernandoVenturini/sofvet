import { ArrowRight, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8 mt-8 animate-fade-up">
            <span className="text-sm text-muted-foreground">
              Tudo que sua clínica precisa, num só lugar
            </span>
          </div>

          <h1 className="text-2xl md:text-5xl lg:text-5xl font-heading font-bold mb-6 animate-fade-up-delay-1">
            Gestão simples, rápida e 100%
            <span className="text-gradient block mt-2">na nuvem.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up-delay-2">
            Com o <span className="text-gradient mt-2">SofVet</span>, você
            gerencia sua clínica de qualquer lugar, a qualquer hora — com todos
            os dados 100% seguros na nuvem e sempre na palma da sua mão.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3">
            <Button variant="hero" size="xl" className="group">
              <a href="#teste_gratis">Teste Grátis</a>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl">
              <Code className="w-5 h-5" />
              <a href="#planos">Planos</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border">
            {[
              { value: "", label: "100% na nuvem" },
              { value: "", label: "Já usado por mais de 1000 clínicas" },
              { value: "", label: "Sua clínica cabe no bolso" },
              { value: "", label: "Acesse de qualquer lugar, a qualquer hora" },
              { value: "", label: "Mais organização = mais faturamento" },
              { value: "", label: "Transforme caos em lucro" },
              { value: "", label: "Sua clínica no bolso" },
              { value: "", label: "Comissão" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-2xl text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
