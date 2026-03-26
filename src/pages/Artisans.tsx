import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArtisanCard from "../components/ArtisanCard";
import type { Artisan } from "../types/artisan";

const Artisans = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const serviceParam = params.get("service") || "";
  const searchParam = params.get("search") || "";

  const [search, setSearch] = useState(searchParam);

  // 🔥 GEOLOCALISATION
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [error, setError] = useState("");

  // 🔥 ADRESSE (ville + commune)
  const [address, setAddress] = useState<{
    city: string;
    commune: string;
  } | null>(null);

  // 🔥 API reverse geocoding
  const getAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      return {
        city:
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "",
        commune:
          data.address.suburb ||
          data.address.neighbourhood ||
          "",
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation({ lat, lng });
        setError("");

        // 🔥 récupérer ville + commune
        const addr = await getAddress(lat, lng);
        if (addr) setAddress(addr);
      },
      () => {
        setError("📍 Activez votre localisation pour voir les artisans proches");
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // 🔍 FILTRE RECHERCHE
  const artisans: Artisan[] = [
    {
      id: 1,
      name: "Kouassi Pierre",
      role: "Plombier certifié",
      rating: 4.9,
      reviews: 127,
      city: "Abidjan",
      description: "Réparation et installation sanitaire",
      experience: 12,
      pricePerHour: 2500,
      verified: true,
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      name: "Diaby Moussa",
      role: "Peintre décorateur",
      rating: 4.8,
      reviews: 143,
      city: "Abidjan",
      description: "Peinture et rénovation",
      experience: 10,
      pricePerHour: 3000,
      verified: true,
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: 3,
      name: "Koffi Kouassi",
      role: "Électricien",
      rating: 4.7,
      reviews: 98,
      city: "Abidjan",
      description: "Installation électrique et dépannage",
      experience: 8,
      pricePerHour: 4500,
      verified: true,
      avatar: "https://i.pravatar.cc/150?img=25",
    },
  ];

  const filtered = useMemo(() => {
    return artisans.filter((a) =>
      `${a.name} ${a.role} ${a.city}`
        .toLowerCase()
        .includes((search || serviceParam).toLowerCase())
    );
  }, [search, serviceParam]);

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Services", targetId: "services" },
          { label: "Trouver un artisan", path: "/artisans" },
          { label: "Comment ça marche", targetId: "how-it-works" },
          { label: "Contact", targetId: "contact" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TITRE */}
        <h1 className="text-3xl font-bold mb-6">
          Nos artisans
        </h1>

        {/* 📍 LOCALISATION */}
        {address && (
          <p className="mb-6 text-sm text-gray-500">
            📍 {address.commune || address.city}, {address.city}
          </p>
        )}

        {/* ❌ ERREUR */}
        {error && (
          <div className="mb-6 text-center">
            <p className="text-red-500 mb-3">{error}</p>
            <button
              onClick={getLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* 🔄 LOADING */}
        {!location && !error && (
          <p className="mb-6">📡 Récupération de votre position...</p>
        )}

        {/* 🔎 SEARCH */}
        <input
          className="w-full bg-gray-100 px-4 py-3 rounded-xl mb-10"
          placeholder="Rechercher par nom, spécialité ou ville..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 📋 LISTE */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((artisan) => (
            <div
              key={artisan.id}
              onClick={() => navigate(`/artisan/${artisan.id}`)}
              className="cursor-pointer"
            >
              <ArtisanCard artisan={artisan} />
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </>
  );
};

export default Artisans;