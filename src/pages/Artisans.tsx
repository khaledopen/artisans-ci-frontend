import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/ArtisanCard";
import type { Artisan } from "../types/artisan";

const Artisans = () => {
  const [params] = useSearchParams();
  const serviceParam = params.get("service") || "";
  const searchParam = params.get("search") || "";

  const [search, setSearch] = useState(searchParam);

  const artisans: Artisan[] = [
    {
      id: 1,
      name: "Pierre Martin",
      role: "Plombier certifié",
      rating: 4.9,
      reviews: 127,
      city: "Paris",
      description: "Réparation et installation sanitaire",
      experience: 12,
      pricePerHour: 55,
      verified: true,
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      name: "Julie Moreau",
      role: "Peintre décorateur",
      rating: 4.8,
      reviews: 143,
      city: "Bordeaux",
      description: "Peinture et rénovation",
      experience: 10,
      pricePerHour: 50,
      verified: true,
      avatar: "https://i.pravatar.cc/150?img=32",
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
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Nos artisans</h1>

      <input
        className="w-full bg-gray-100 px-4 py-3 rounded-xl mb-6"
        placeholder="Rechercher par nom, spécialité ou ville..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((artisan) => (
          <ArtisanCard key={artisan.id} artisan={artisan} />
        ))}
      </div>
    </div>
  );
};

export default Artisans;
