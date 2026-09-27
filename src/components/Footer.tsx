import { Instagram, Facebook, Heart } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-red-900/30 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Logo + descrição */}
          <div className="md:col-span-2">
            <a href="#inicio" className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-black">
                <span className="text-white">Sof</span>
                <span className="text-red-600">Vet</span>
              </span>
            </a>
            <p className="text-gray-400 max-w-md">
              O software veterinário mais amado do Brasil. Simples, rápido e feito para quem realmente cuida.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-red-500 transition"><Instagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition"><Facebook size={24} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Navegação</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#inicio" className="hover:text-red-500 transition">Início</a></li>
              <li><a href="#funcionalidades" className="hover:text-red-500 transition">Funcionalidades</a></li>
              <li><a href="#planos" className="hover:text-red-500 transition">Planos</a></li>
              <li><a href="#contato" className="hover:text-red-500 transition">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Suporte</h4>
            <ul className="space-y-3 text-gray-400">
              <li>WhatsApp: +44 7747 843073</li>
              <li>suportesofvet@gmail.com</li>
              <li>Seg a Sex - 8h às 17h</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-red-900/20 text-center text-gray-500 text-sm">
          <p>© {year} <span className="text-red-500 font-bold">SofVet</span> • Todos os direitos reservados • Feito com <Heart className="inline w-4 h-4 text-red-500" />. Desenvolvido por &lt;LVF_Code/&gt;</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;