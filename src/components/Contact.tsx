import { useState } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

// Contact component
const Contact = () => {
  const { toast } = useToast(); // Toast hook for notifications
  const [formData, setFormData] = useState({
    // Form data state
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // 🔧 NOVA FUNÇÃO: Abrir WhatsApp com mensagem pré-definida
  const openWhatsApp = () => {
    // Mensagem padrão que aparecerá quando usuário clicar
    const defaultMessage = "Olá Fernando! Vi seu site e gostaria de solicitar um orçamento.";
    
    // Codifica a mensagem para URL (remove espaços e caracteres especiais)
    const encodedMessage = encodeURIComponent(defaultMessage);
    
    // Número no formato internacional SEM o '+' inicial e SEM espaços
    const phoneNumber = "447470534807";
    
    // Cria a URL do WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abre em nova aba
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      // Check required fields
      // Show error toast
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return; // Exit if validation fails
    }

    // Show success toast
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });

    // EmailJS service to send email
    emailjs
      .send(
        "service_q91p5si", // Your EmailJS service ID
        "template_nd3pvdf", // Your EmailJS template ID
        formData, // Form data
        "x4oNoCRr552KYLeni" // Your EmailJS user ID
      )
      .then(
        (response) => {
          // Success callback
          console.log("Email Enviado!", response.status, response.text); // Log success message
          setFormData({ name: "", email: "", phone: "", message: "" }); // Clear form after successful submission
        },
        (error) => {
          // Error callback
          console.log("Error", error.status, error.text); // Log error message
        }
      );
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data state
  };

  return (
    <section id="contato" className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Contato
          </span>
          <h2 className="text-6xl font-bold text-center mb-8">
            Fale com a gente <span className="text-red-600">agora</span> e <span className="text-red-600">teste grátis</span> por 14 dias...
          </h2>
		  <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 shadow-lg hover:shadow-red-600/50"
              asChild
            >
              <a href="#planos">Testar 14 dias grátis</a>
            </Button>
          <p className="text-muted-foreground text-lg pt-5">
            Nao perca essa oportunidade!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-8">
            {/* 📧 Seção Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  E-mail
                </h3>
                <p className="text-muted-foreground">
					suportesofvet@gmail.com

                </p>
              </div>
            </div>

            {/* 📱 SEÇÃO WHATSAPP MODIFICADA */}
            {/* 🔧 IMPLEMENTAÇÃO: Adicionamos onClick, cursor-pointer e efeitos hover */}
            <div
              onClick={openWhatsApp} // 🔧 NOVO: Chama função ao clicar
              className="flex items-start gap-4 cursor-pointer group hover:opacity-80 transition-opacity"
              role="button" // 🔧 NOVO: Melhora acessibilidade
              tabIndex={0} // 🔧 NOVO: Permite navegação por teclado
              onKeyDown={(e) => {
                // 🔧 NOVO: Permite ativar com Enter ou Espaço
                if (e.key === "Enter" || e.key === " ") {
                  openWhatsApp();
                }
              }}
              aria-label="Abrir conversa no WhatsApp" // 🔧 NOVO: Descrição para acessibilidade
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  WhatsApp
                </h3>
                <p className="text-muted-foreground">+44 7470 534807</p>
                {/* 🔧 NOVO: Texto indicativo de ação */}
                <p className="text-sm text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Clique para conversar
                </p>
              </div>
            </div>

            {/* 📍 Seção Localização */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  Localização
                </h3>
                <p className="text-muted-foreground">Sao Paulo - SP</p>
              </div>
            </div>
          </div>

          {/* 📋 Formulário de Contato */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-6 p-8 rounded-2xl bg-card border border-border"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nome *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  E-mail *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Telefone
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="bg-secondary border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Mensagem *
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Descreva seu projeto..."
                rows={5}
                className="bg-secondary border-border resize-none"
              />
            </div>

            <Button variant="hero" size="lg" className="w-full group">
              Enviar Mensagem
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;