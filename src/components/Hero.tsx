import { ArrowRight, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20 md:pt-24 lg:pt-28"
    >
      {/* Background sutil vermelho */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-black" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-red-700/10 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-5xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600/10 border border-red-600/30 text-red-400 text-sm font-bold mb-7">
            <HeartHandshake className="w-5 h-5" />
            Feito por quem já atuou na área.
          </div>

          {/* Título principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
            <span className="text-white">Sof</span>
            <span className="text-red-600">Vet</span>
          </h1>

          <p className="text-2xl md:text-4xl font-bold text-gray-300 mt-6">
            O software que sua clínica <span className="text-red-500">realmente</span> merece!
          </p>

          <p className="text-xl text-gray-400 mt-8 max-w-3xl mx-auto">
            Agenda, prontuário, financeiro, estoque, multi-clínica — tudo simples, rápido e 100% na nuvem.
            <br />
            <span className="text-red-400 font-bold">Chega de planilha e sistema travando.</span>
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 transition-all"
              asChild
            >
              <a href="#planos" className="flex items-center gap-3">
                Testar 14 dias grátis
                <ArrowRight className="w-6 h-6" />
              </a>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-bold text-xl px-12 py-8 rounded-2xl"
              asChild
            >
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener">
                Falar no WhatsApp
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-11 pb-10
		  ">
            {[
              { value: "2.400+", label: "Clínicas ativas" },
              { value: "24/7", label: "Suporte veterinário" },
              { value: "0", label: "Fidelidade" },
              { value: "100%", label: "Na nuvem" },
            ].map((stat) => (
              <div key={stat.value}>
                <div className="text-4xl md:text-5xl font-black text-red-500">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;