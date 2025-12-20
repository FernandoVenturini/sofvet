import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import PricingSection from '@/components/PricingSection';
import Testimonials from '@/components/Testimonials';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Landing = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <Hero />
            <Features />
            <PricingSection />
            {/* Se Testimonials der erro, comente temporariamente */}
            <Testimonials />
            <About />
            <Contact />
            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default Landing;