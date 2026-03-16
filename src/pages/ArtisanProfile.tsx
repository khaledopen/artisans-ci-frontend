import { useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Star, MapPin, Briefcase } from "lucide-react";

const ArtisanProfile = () => {
  const { id } = useParams();

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("En attente");
  const [image, setImage] = useState<File | null>(null);

  const artisan = {
    id,
    name: "Kouassi Pierre",
    role: "Plombier certifié",
    rating: 4.9,
    reviews: 127,
    city: "Abidjan",
    description:
      "Artisan plombier avec plus de 12 ans d'expérience dans la réparation et l'installation sanitaire.",
    experience: 12,
    pricePerHour: 2500,
    avatar: "https://i.pravatar.cc/300?img=12",
  };

  const handleSubmit = () => {
    const request = {
      artisanId: id,
      description,
      date,
      status,
      image,
    };

    console.log("Demande envoyée :", request);

    alert("Votre demande a été envoyée !");
  };

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

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* PROFIL ARTISAN */}
        <div className="bg-white shadow-lg rounded-2xl p-8 grid md:grid-cols-3 gap-10 mb-12">

          <div className="flex flex-col items-center">
            <img
              src={artisan.avatar}
              className="w-40 h-40 rounded-full object-cover mb-4"
            />

            <h2 className="text-xl font-bold">{artisan.name}</h2>

            <p className="text-gray-500">{artisan.role}</p>

            <div className="flex items-center gap-1 text-yellow-500 mt-2">
              <Star size={18} />
              <span>{artisan.rating}</span>
              <span className="text-gray-500 text-sm">
                ({artisan.reviews} avis)
              </span>
            </div>
          </div>

          <div className="md:col-span-2">

            <h3 className="text-2xl font-bold mb-4">À propos</h3>

            <p className="text-gray-600 mb-6">
              {artisan.description}
            </p>

            <div className="grid grid-cols-2 gap-6">

              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" />
                {artisan.city}
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="text-blue-600" />
                {artisan.experience} ans d'expérience
              </div>

            </div>

            <div className="mt-6">
              <span className="text-gray-500">Tarif moyen</span>
              <p className="text-2xl font-bold text-blue-600">
                {artisan.pricePerHour} Francs/h
              </p>
            </div>

          </div>

        </div>

        {/* FORMULAIRE DE DEMANDE */}
        <div className="bg-gray-50 rounded-2xl p-8 shadow">

          <h2 className="text-2xl font-bold mb-6">
            Demander une intervention
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* description */}
            <div className="col-span-2">
              <label className="block mb-2 font-medium">
                Description du problème
              </label>

              <textarea
                className="w-full border rounded-lg p-3"
                rows={4}
                placeholder="Expliquez le problème..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* photo */}
            <div>
              <label className="block mb-2 font-medium">
                Photo du problème
              </label>

              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* date */}
            <div>
              <label className="block mb-2 font-medium">
                Date et heure disponibles
              </label>

              <input
                type="datetime-local"
                className="w-full border rounded-lg p-3"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* statut */}
            <div>
              <label className="block mb-2 font-medium">
                Statut
              </label>

              <select
                className="w-full border rounded-lg p-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>En attente</option>
                <option>Confirmé</option>
                <option>Refusé</option>
              </select>
            </div>

          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
          >
            Envoyer la demande
          </button>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default ArtisanProfile;