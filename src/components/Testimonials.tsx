import { Card } from "./ui/card";
import { CardContent } from "./ui/card";


const Testimonials = () => {
    return (
        <section className="py-20 px-4 bg-black/50">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-12">O que dizem nossos clientes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="bg-black/70 border-red-600/30">
                        <CardContent className="pt-6">
                            <p className="text-gray-300 italic">"O SofVet mudou completamente a gestão da minha clínica. Recomendo!"</p>
                            <p className="mt-4 font-semibold text-white">- Dr. João Silva</p>
                        </CardContent>
                    </Card>
                    {/* Mais depoimentos */}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;