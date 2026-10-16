import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // ← ADICIONEI: Import necessário para navegação interna

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#inicio", label: "Início" },
    { href: "#funcionalidades", label: "Funcionalidades" },
    { href: "#planos", label: "Planos" },
    { href: "#sobre", label: "Sobre" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-red-900/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">

          {/* Logo SofVet com texto embaixo */}
          <a href="#inicio" className="flex flex-col items-start group">
            <div className="text-3xl md:text-4xl font-black tracking-tighter leading-none">
              <span className="text-white">Sof</span>
              <span className="text-red-600">Vet</span>
            </div>
            <span className="text-xs text-gray-500 tracking-widest mt-1 hidden sm:block">
              SOFTWARE VETERINÁRIO
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-red-500 font-medium transition-all duration-300 hover:scale-105"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* ← ALTEREI: Botão "Login Nuvem" agora leva para /login do nosso sistema web */}
            <Button variant="ghost" size="lg" asChild>
              <Link to="/login">Acessar Sistema</Link>
            </Button>
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 shadow-lg hover:shadow-red-600/50"
              asChild
            >
              <a href="#planos">Testar 7 dias grátis</a>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-red-900/30 bg-black/95">
            <nav className="flex flex-col gap-5 px-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-red-500 font-medium text-lg py-2 transition"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                {/* ← ALTERADO: No mobile também leva para /login do nosso sistema */}
                <Button variant="ghost" className="w-full text-white" asChild>
                  <Link to="/login">Login Nuvem</Link>
                </Button>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg h-12"
                  asChild
                >
                  <a href="#planos">Testar 7 dias grátis</a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;