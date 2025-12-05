import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "4407470534807"; // Replace with actual number
  const message = encodeURIComponent(
    "Olá! Precisa de um site ou sistema? Fale comigo pelo WhatsApp para um orçamento gratuito! Conte-me sua ideia e vamos juntos transformá-la em realidade."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 bg-[#25D366] text-white px-3 py-3 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 animate-pulse-glow group"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="text-xs font-semibold">Fale conosco</span>
    </a>
  );
};

export default WhatsAppButton;
