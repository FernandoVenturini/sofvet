import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";       
import PricingSection from "@/components/PricingSection";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-white-900 text-white overflow-x-hidden">
      <Header />

      <main>
        {/* 1. Impacto imediato */}
        <section id="inicio">
          <Hero />
        </section>

        {/* 2. Mostre o que o SofVet faz (exatamente faz */}
        <section id="funcionalidades">
          <Features />
        </section>

        {/* 3. Planos = momento da venda */}
        <section id="planos">
          <PricingSection />
        </section>

        {/* 4. Credibilidade e confiança */}
        <section id="sobre">
          <About />
        </section>

        {/* 5. Call to action final + contato rápido */}
        <section id="contato">
          <Contact />
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
