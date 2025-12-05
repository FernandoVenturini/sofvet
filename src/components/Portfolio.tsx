import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Clínicas Veterinárias",
    featured: {
      title: "VetCare Premium",
      description:
        "Sistema completo de gestão com agendamento, prontuário eletrônico e controle financeiro.",
      image:
        "https://plus.unsplash.com/premium_photo-1661915652986-fe818e1973f9?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    projects: [
      {
        title: "PetLife Clínica",
        image:
          "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        title: "Animal Care Center",
        image:
          "https://plus.unsplash.com/premium_photo-1663133493049-bc00ad37a7dc?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        title: "VetMaster Plus",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  {
    name: "Escritórios de Advocacia",
    featured: {
      title: "Silva & Associados",
      description:
        "Site institucional elegante com área do cliente, blog jurídico e sistema de consultas online.",
      image:
        "https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?q=80&w=2611&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    projects: [
      {
        title: "Advocacia Martins",
        image:
          "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        title: "JurisConsult",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        title: "Legal Pro Office",
        image:
          "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  {
    name: "Transfer Aeroporto",
    featured: {
      title: "TransferAero",
      description:
        "Plataforma de reservas online com pagamento integrado, rastreamento em tempo real e app mobile.",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop",
    },
    projects: [
      {
        title: "AeroShuttle",
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop",
      },
      {
        title: "CityTransfer",
        image:
          "https://media.istockphoto.com/id/1195019183/photo/shuttle-bus-brought-people-to-the-airport-for-the-flight.jpg?s=1024x1024&w=is&k=20&c=FFR_8dQdtb-dCJ1TMzuk7iU8QzzBS0CjEJUdFifTIR4=",
      },
      {
        title: "AirportGo",
        image:
          "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&h=250&fit=crop",
      },
    ],
  },
  {
    name: "Consultórios Odontológicos",
    featured: {
      title: "OdontoPlus",
      description:
        "Gestão completa com odontograma digital, agendamento inteligente e prontuário eletrônico.",
      image:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=500&fit=crop",
    },
    projects: [
      {
        title: "Sorriso Perfeito",
        image:
          "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=250&fit=crop",
      },
      {
        title: "DentalCare Pro",
        image:
          "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=250&fit=crop",
      },
      {
        title: "OdontoClin",
        image:
          "https://images.unsplash.com/photo-1445527815219-ecbfec67492e?w=400&h=250&fit=crop",
      },
    ],
  },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Portfólio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-4 mb-6">
            Nossa
            <span className="text-primary"> Vitrine</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Conheça alguns dos projetos que desenvolvemos para nossos clientes
            de diversos segmentos.
          </p>
        </div>

        <div className="space-y-20">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="space-y-6">
              {/* Category Title */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground px-4">
                  {category.name}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              </div>

              {/* Featured Project - Large Image */}
              <div className="group relative overflow-hidden rounded-2xl bg-card border border-border card-hover">
                <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                  <img
                    src={category.featured.image}
                    alt={category.featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4">
                    Destaque
                  </span>
                  <h4 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
                    {category.featured.title}
                  </h4>
                  <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
                    {category.featured.description}
                  </p>
                </div>
              </div>

              {/* Smaller Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {category.projects.map((project, projIndex) => (
                  <div
                    key={projIndex}
                    className="group relative overflow-hidden rounded-xl bg-card border border-border card-hover"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h5 className="text-lg font-heading font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {project.title}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="group">
            <a href="#contato">Orçamento Grátis</a>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
