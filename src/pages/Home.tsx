import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";


import type { Service } from "../types/service";
import type { Step } from "../types/step";
import type { Stat } from "../types/stat";

import {
  Droplet,
  Key,
  Zap,
  Paintbrush,
  Hammer,
  Wind,
  Home as HomeIcon,
  HardHat,
  Trees,
  Tv,
  Wrench,
  Sparkles,
  Search,
  Users,
  MessageSquare,
  CheckCircle,
  Briefcase,
  Star,
  MapPin,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const services: Service[] = [
    { id: 1, name: "Plomberie", artisansCount: 234, icon: <Droplet color="white" />, color: "#3B82F6" },
    { id: 2, name: "Serrurerie", artisansCount: 156, icon: <Key color="white" />, color: "#F59E0B" },
    { id: 3, name: "Électricité", artisansCount: 198, icon: <Zap color="white" />, color: "#EAB308" },
    { id: 4, name: "Peinture", artisansCount: 312, icon: <Paintbrush color="white" />, color: "#A855F7" },
    { id: 5, name: "Menuiserie", artisansCount: 167, icon: <Hammer color="white" />, color: "#F97316" },
    { id: 6, name: "Chauffage", artisansCount: 145, icon: <Wind color="white" />, color: "#EF4444" },
    { id: 7, name: "Rénovation", artisansCount: 289, icon: <HomeIcon color="white" />, color: "#22C55E" },
    { id: 8, name: "Maçonnerie", artisansCount: 178, icon: <HardHat color="white" />, color: "#4B5563" },
    { id: 9, name: "Jardinage", artisansCount: 203, icon: <Trees color="white" />, color: "#10B981" },
    { id: 10, name: "Électroménager", artisansCount: 134, icon: <Tv color="white" />, color: "#6366F1" },
    { id: 11, name: "Dépannage", artisansCount: 267, icon: <Wrench color="white" />, color: "#06B6D4" },
    { id: 12, name: "Nettoyage", artisansCount: 198, icon: <Sparkles color="white" />, color: "#EC4899" },
  ];

  const steps: Step[] = [
    { id: 1, title: "Recherchez", description: "Trouvez l'artisan qui correspond à vos besoins parmi notre réseau de professionnels qualifiés.", icon: <Search color="white" />, color: "#3B82F6" },
    { id: 2, title: "Comparez", description: "Consultez les profils, les avis clients et les tarifs pour choisir le meilleur artisan.", icon: <Users color="white" />, color: "#A855F7" },
    { id: 3, title: "Contactez", description: "Envoyez une demande de devis gratuite et recevez une réponse rapide sous 24-48h.", icon: <MessageSquare color="white" />, color: "#F97316" },
    { id: 4, title: "Réalisez", description: "L'artisan intervient chez vous et réalise vos travaux dans les meilleurs délais.", icon: <CheckCircle color="white" />, color: "#22C55E" },
  ];

  const stats: Stat[] = [
    { id: 1, label: "Artisans qualifiés", value: 15000, suffix: "+", icon: <Users color="white" /> },
    { id: 2, label: "Projets réalisés", value: 50000, suffix: "+", icon: <Briefcase color="white" /> },
    { id: 3, label: "Satisfaction client", value: 4.8, suffix: "/5", icon: <Star color="white" /> },
    { id: 4, label: "Villes couvertes", value: 100, suffix: "+", icon: <MapPin color="white" /> },
  ];

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Services", path: "/" },
          { label: "Trouver un artisan", path: "/artisans" },
        ]}
      />

      <Hero
        title="Trouvez l’artisan qu’il vous faut"
        subtitle="Plombiers, serruriers, électriciens, peintres... Des professionnels qualifiés près de chez vous"
        popularSearches={["Plomberie", "Serrurerie", "Électricité"]}
        onSearch={(value) => navigate(`/artisans?search=${value}`)}
      />

      <ServicesSection
        title="Tous les services dont vous avez besoin"
        services={services}
        onServiceClick={(s) => navigate(`/artisans?service=${s.name}`)}
      />

      <HowItWorksSection
        title="Comment ça marche ?"
        steps={steps}
      />

      <StatsSection stats={stats} />

      <div className="h-24 bg-white" />

      <Footer />
    </>
  );
};

export default Home;
