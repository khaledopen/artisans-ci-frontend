// src/pages/LaisserAvis.tsx

import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addCommentaire } from "../api/commentaire.api";
import { getDemandeById } from "../api/demande.api";
import { Loader2, Star, Send, AlertCircle, CheckCircle, User, Briefcase, Calendar } from "lucide-react";

const LaisserAvis = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [demande, setDemande] = useState<any>(null);
  const [commentaire, setCommentaire] = useState("");
  const [note, setNote] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [photo, setPhoto] = useState("");

  // Récupérer les infos de la demande
  useEffect(() => {
    const fetchDemande = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getDemandeById(parseInt(id));
        setDemande(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger la demande");
      } finally {
        setLoading(false);
      }
    };
    fetchDemande();
  }, [id]);

  // Récupérer l'ID du client connecté
  const clientId = JSON.parse(localStorage.getItem("user") || "{}").id;

  const handleSubmit = async () => {
    if (!commentaire.trim()) {
      setError("Veuillez écrire un commentaire");
      return;
    }
    if (note === 0) {
      setError("Veuillez donner une note (1 à 5 étoiles)");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await addCommentaire({
        commentaire: commentaire.trim(),
        clientId: clientId,
        artisanId: demande?.artisanId || demande?.artisan?.id,
        photo: photo || undefined,
        demandeId: parseInt(id!),
      });

      setSuccess("Merci pour votre avis ! Votre commentaire a été publié.");
      
      setTimeout(() => {
        navigate("/dashboard-client");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar brand="ArtisanCI" links={[]} />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
        <Footer />
      </>
    );
  }

  const artisanName = demande?.artisanName || demande?.artisan?.prenom + " " + demande?.artisan?.nom || "l'artisan";
  const artisanId = demande?.artisanId || demande?.artisan?.id;

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Accueil", path: "/" },
          { label: "Mes demandes", path: "/dashboard-client" },
        ]}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard-client")}
              className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2"
            >
              ← Retour au tableau de bord
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Donner mon avis</h1>
            <p className="text-gray-500 mt-1">Partagez votre expérience avec {artisanName}</p>
          </div>

          {/* Carte principale */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-6">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                <Star size={24} className="fill-white" />
                Votre avis compte !
              </h2>
              <p className="text-yellow-100 text-sm mt-1">
                Votre retour aide les autres clients et valorise le travail des artisans
              </p>
            </div>

            <div className="p-6">
              {/* Infos de la demande */}
              {demande && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-2">Travaux réalisés :</p>
                  <p className="font-medium text-gray-800">{demande.descriptionTravail || demande.descriptionTravail}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    <Calendar size={12} className="inline mr-1" />
                    {new Date(demande.dateRendezVous || demande.dateRendezVous).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              )}

              {/* Messages */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle size={16} />
                  {success}
                </div>
              )}

              {/* Note par étoiles */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre note *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNote(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={36}
                        className={`${
                          star <= (hoverRating || note)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-lg font-medium text-gray-700">
                    {note > 0 ? `${note}/5` : "Non noté"}
                  </span>
                </div>
              </div>

              {/* Commentaire */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre commentaire *
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition resize-none"
                  placeholder="Décrivez votre expérience : qualité du travail, ponctualité, professionnalisme..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 10 caractères maximum 500
                </p>
              </div>

              {/* Photo optionnelle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo du travail réalisé (optionnelle)
                </label>
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://exemple.com/photo-travaux.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Ajoutez une URL d'image pour illustrer les travaux réalisés
                </p>
              </div>

              {/* Bouton submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Publier mon avis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LaisserAvis;