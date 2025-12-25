import { CheckCircle2, Heart, Stethoscope, Users } from "lucide-react";

const About = () => {
  return (
    <section id="sobre" className="py-28 bg-zinc-950 border-t border-red-900/20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-5xl font-black text-white">
            Construido por quem <span className="text-red-600">possui experiência prática</span> em clínica veterinária
          </h2>
          <p className="text-xl text-gray-400 mt-6 max-w-3xl mx-auto">
            Cansados de sistemas ineficientes, veterinários e desenvolvedores se uniram para construir a solução que o mercado precisa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: Stethoscope,
              title: "Criado por veterinários",
              desc: "Sabemos exatamente o que você precisa no dia a dia corrido da clínica."
            },
            {
              icon: Heart,
              title: "Foco no que importa",
              desc: "Nada de função inútil. Só o que gera resultado: mais consultas, mais lucro, menos estresse."
            },
            {
              icon: Users,
              title: "Comunidade que cresce junto",
              desc: "Atualizações semanais baseadas no que vocês, vets, pedem no grupo do WhatsApp."
            },
          ].map((item) => (
            <div key={item.title} className="bg-black border border-red-900/30 rounded-2xl p-8 hover:border-red-600 transition-all hover:-translate-y-2">
              <item.icon className="w-12 h-12 text-red-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-3xl font-bold text-white pt-11">
            Junte-se às <span className="text-red-500">2.400+</span> clínicas que já escolheram o <span className="text-red-500">SofVet</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;