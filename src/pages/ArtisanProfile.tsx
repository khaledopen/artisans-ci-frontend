// src/pages/ArtisanProfile.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getArtisanByIdAuto } from "../api/artisan.api";
import type { Artisan } from "../types/artisan";
import { 
  Star, MapPin, Phone, Mail, Briefcase, 
  Calendar, Clock, CheckCircle, User, 
  Loader2, AlertCircle 
} from "lucide-react";

const ArtisanProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtisan = async () => {
      if (!id) {
        setError("ID d'artisan manquant");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const artisanId = parseInt(id);
        
        if (isNaN(artisanId)) {
          setError("ID d'artisan invalide");
          setLoading(false);
          return;
        }
        
        console.log("🆔 ID récupéré:", artisanId);
        const data = await getArtisanByIdAuto(artisanId);
        console.log("✅ Artisan reçu:", data);
        setArtisan(data);
      } catch (err: any) {
        console.error("❌ Erreur:", err);
        setError(err.response?.data?.message || "Impossible de charger le profil de l'artisan");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [id]);

  const getInitials = () => {
    if (!artisan) return "?";
    return `${artisan.prenom?.charAt(0) || ""}${artisan.nom?.charAt(0) || ""}`.toUpperCase();
  };

  const fullName = artisan ? `${artisan.prenom || ""} ${artisan.nom || ""}`.trim() : "Artisan";
  const location = artisan?.commune 
    ? `${artisan.commune}, ${artisan.localisation || "Abidjan"}`
    : artisan?.localisation || "Abidjan";

  if (loading) {
    return (
      <>
        <Navbar brand="ArtisanCI" links={[]} />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !artisan) {
    return (
      <>
        <Navbar brand="ArtisanCI" links={[]} />
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="text-red-500 text-center mb-4">{error || "Artisan non trouvé"}</p>
          <button
            onClick={() => navigate("/artisans")}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
          >
            Retour à la liste
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Accueil", path: "/" },
          { label: "Artisans", path: "/artisans" },
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 pt-12 pb-24 px-4">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => navigate("/artisans")}
              className="text-white/80 hover:text-white mb-6 flex items-center gap-2 text-sm"
            >
              ← Retour aux artisans
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-20 pb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            <div className="flex justify-center -mt-16 mb-6">
              {artisan.photoprofil ? (
                <img
                  src={artisan.photoprofil}
                  alt={fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                  {getInitials()}
                </div>
              )}
            </div>

            <div className="text-center px-6 pb-6 border-b border-gray-100">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {fullName}
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-3">
                <Briefcase size={16} />
                <span>{artisan.metier?.nom || "Artisan"}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                <MapPin size={16} />
                <span>{location}</span>
              </div>

              {artisan.note && artisan.note > 0 && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-lg">{artisan.note.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{artisan.avis || 0} avis</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-4">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition font-medium">
                  <Phone size={18} />
                  Contacter
                </button>
                <button className="flex-1 border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition font-medium text-gray-700">
                  <Mail size={18} />
                  Demander un devis
                </button>
              </div>
            </div>

            {artisan.description && (
              <div className="px-6 py-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3">À propos</h3>
                <p className="text-gray-600 leading-relaxed">
                  {artisan.description}
                </p>
              </div>
            )}

            <div className="px-6 py-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Informations professionnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artisan.experience && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-blue-500" />
                    <span>{artisan.experience} ans d'expérience</span>
                  </div>
                )}
                {artisan.pricePerHour && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={18} className="text-blue-500" />
                    <span>{artisan.pricePerHour} €/heure</span>
                  </div>
                )}
                {artisan.numero && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} className="text-blue-500" />
                    <span>{artisan.numero}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ArtisanProfile;