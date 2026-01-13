import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";

import type { Service } from "../types/service";


// Icônes
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
} from "lucide-react";

const Home = () => {
  // 🔹 Données des services (plus tard : API backend)
  const services: Service[] = [
    {
      id: 1,
      name: "Plomberie",
      artisansCount: 234,
      icon: <Droplet size={22} color="white" />,
      color: "#3B82F6",
    },
    {
      id: 2,
      name: "Serrurerie",
      artisansCount: 156,
      icon: <Key size={22} color="white" />,
      color: "#F59E0B",
    },
    {
      id: 3,
      name: "Électricité",
      artisansCount: 198,
      icon: <Zap size={22} color="white" />,
      color: "#EAB308",
    },
    {
      id: 4,
      name: "Peinture",
      artisansCount: 312,
      icon: <Paintbrush size={22} color="white" />,
      color: "#A855F7",
    },
    {
      id: 5,
      name: "Menuiserie",
      artisansCount: 167,
      icon: <Hammer size={22} color="white" />,
      color: "#F97316",
    },
    {
      id: 6,
      name: "Chauffage",
      artisansCount: 145,
      icon: <Wind size={22} color="white" />,
      color: "#EF4444",
    },
    {
      id: 7,
      name: "Rénovation",
      artisansCount: 289,
      icon: <HomeIcon size={22} color="white" />,
      color: "#22C55E",
    },
    {
      id: 8,
      name: "Maçonnerie",
      artisansCount: 178,
      icon: <HardHat size={22} color="white" />,
      color: "#4B5563",
    },
    {
      id: 9,
      name: "Jardinage",
      artisansCount: 203,
      icon: <Trees size={22} color="white" />,
      color: "#10B981",
    },
    {
      id: 10,
      name: "Électroménager",
      artisansCount: 134,
      icon: <Tv size={22} color="white" />,
      color: "#6366F1",
    },
    {
      id: 11,
      name: "Dépannage",
      artisansCount: 267,
      icon: <Wrench size={22} color="white" />,
      color: "#06B6D4",
    },
    {
      id: 12,
      name: "Nettoyage",
      artisansCount: 198,
      icon: <Sparkles size={22} color="white" />,
      color: "#EC4899",
    },
  ];

  return (
    <>
      {/* NAVBAR */}
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Services", path: "/services" },
          { label: "Trouver un artisan", path: "/artisans" },
          { label: "Comment ça marche", path: "/how-it-works" },
          { label: "Contact", path: "/contact" },
        ]}
      />

      {/* HERO */}
      <Hero
        title="Trouvez l’artisan qu’il vous faut"
        subtitle="Plombiers, serruriers, électriciens, peintres… Des professionnels qualifiés près de chez vous"
        popularSearches={[
          "Plomberie",
          "Serrurerie",
          "Électricité",
          "Peinture",
        ]}
      />

      {/* SERVICES */}
      <ServicesSection
        title="Tous les services dont vous avez besoin"
        subtitle="Parcourez nos catégories et trouvez le bon professionnel"
        services={services}
        onServiceClick={(service) => {
          console.log("Service sélectionné :", service.name);
          // plus tard : navigation vers /artisans?service=...
        }}
      />
    </>
  );
};

export default Home;
