import { useState } from 'react';
import { Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.service) {
      newErrors.service = 'Selecione um serviço';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="contact" className="py-20 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Entre em Contato
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Pronto para transformar sua ideia em realidade? Vamos conversar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Informações de Contato</h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-red-600 transition-colors duration-300">
                <div className="p-3 bg-red-600/10 rounded-lg">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-gray-400">contato@lvfcode.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-red-600 transition-colors duration-300">
                <div className="p-3 bg-red-600/10 rounded-lg">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Telefone</h4>
                  <p className="text-gray-400">+55 (11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-red-600 transition-colors duration-300">
                <div className="p-3 bg-red-600/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Localização</h4>
                  <p className="text-gray-400">São Paulo, Brasil</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white">
              <h4 className="text-xl font-bold mb-3">Por que escolher LVF_Code?</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Código limpo e otimizado
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Design responsivo e moderno
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Suporte pós-entrega
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Prazos garantidos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Soluções personalizadas para seu negócio
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Fazemos a manutenção do seu site e sistema
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Mensagem Enviada!</h3>
                <p className="text-gray-400">Retornarei seu contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-semibold mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors duration-300`}
                    placeholder="Seu nome"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors duration-300`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-white font-semibold mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.phone ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors duration-300`}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="service" className="block text-white font-semibold mb-2">
                    Serviço de Interesse *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.service ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors duration-300`}
                  >
                    <option value="">Selecione um serviço</option>
                    <option value="landing">Landing Page</option>
                    <option value="website">Website Completo</option>
                    <option value="sistema">Sistema para Clínica Veterinária</option>
                    <option value="outro">Outro</option>
                  </select>
                  {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-semibold mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.message ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors duration-300 resize-none`}
                    placeholder="Conte-me sobre seu projeto..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-red-600 text-white font-semibold rounded-lg
                           hover:bg-red-700 transition-all duration-300 transform hover:scale-105
                           hover:shadow-2xl hover:shadow-red-600/50 flex items-center justify-center gap-2"
                >
                  Enviar Mensagem
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
