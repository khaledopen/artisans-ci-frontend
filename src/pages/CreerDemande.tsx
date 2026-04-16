// src/pages/CreerDemande.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createDemande } from "../api/demande.api";
import { Loader2, AlertCircle, Plus, X, Image } from "lucide-react";

const CreerDemande = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    date_rendez_vous: "",
    heure: "",
    description_travail: "",
    photo_endommage: [] as string[],
    photo_content_type: "image/jpeg",
  });

  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState("");

  const clientId = JSON.parse(localStorage.getItem("user") || "{}").id;

  const handleAddPhoto = () => {
    if (photoInput && !photoUrls.includes(photoInput)) {
      setPhotoUrls([...photoUrls, photoInput]);
      setPhotoInput("");
    }
  };

  const handleRemovePhoto = (url: string) => {
    setPhotoUrls(photoUrls.filter((u) => u !== url));
  };

  const handleSubmit = async () => {
    if (!form.date_rendez_vous || !form.heure || !form.description_travail) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createDemande({
        date_rendez_vous: form.date_rendez_vous,
        heure: form.heure,
        description_travail: form.description_travail,
        photo_endommage: photoUrls,
        photo_content_type: form.photo_content_type,
        client: { id: clientId },
      });
      
      // Redirection vers le dashboard client
      navigate("/dashboard-client");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Accueil", path: "/" },
          { label: "Artisans", path: "/artisans" },
          { label: "Dashboard", path: "/dashboard-client" },
        ]}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Nouvelle demande de service</h1>
            <p className="text-gray-500 mt-1">Décrivez précisément les travaux à réaliser</p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
              <h2 className="text-white text-xl font-semibold">Informations de la demande</h2>
              <p className="text-blue-100 text-sm mt-1">Remplissez tous les champs obligatoires</p>
            </div>

            <div className="p-6">
              {/* Messages d'erreur */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                {/* Date et heure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date du rendez-vous *
                    </label>
                    <input
                      type="date"
                      value={form.date_rendez_vous}
                      onChange={(e) => setForm({ ...form, date_rendez_vous: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure *
                    </label>
                    <input
                      type="date"
                      value={form.heure}
                      onChange={(e) => setForm({ ...form, heure: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description des travaux *
                  </label>
                  <textarea
                    value={form.description_travail}
                    onChange={(e) => setForm({ ...form, description_travail: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
                    placeholder="Décrivez précisément les travaux à réaliser..."
                    required
                  />
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photos (URLs)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={photoInput}
                      onChange={(e) => setPhotoInput(e.target.value)}
                      placeholder="https://exemple.com/photo.jpg"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Ajouter
                    </button>
                  </div>

                  {/* Liste des photos */}
                  {photoUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {photoUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Erreur+chargement";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(url)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Ajoutez des URLs de photos pour illustrer votre demande
                  </p>
                </div>

                {/* Bouton submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer la demande"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CreerDemande;