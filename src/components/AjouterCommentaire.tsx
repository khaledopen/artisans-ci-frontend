// src/components/AjouterCommentaire.tsx

import { useState } from "react";
import { Star, Send, Camera, X } from "lucide-react";
import { addCommentaire } from "../api/commentaire.api";
import { Loader2 } from "lucide-react";

interface AjouterCommentaireProps {
  artisanId: number;
  clientId: number;
  demandeId?: number;
  onCommentAdded: () => void;
}

const AjouterCommentaire = ({ artisanId, clientId, demandeId, onCommentAdded }: AjouterCommentaireProps) => {
  const [commentaire, setCommentaire] = useState("");
  const [note, setNote] = useState(0);
  const [photo, setPhoto] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    if (!commentaire.trim()) {
      setError("Veuillez écrire un commentaire");
      return;
    }
    if (note === 0) {
      setError("Veuillez donner une note");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addCommentaire({
        commentaire: commentaire.trim(),
        clientId,
        artisanId,
        photo: photo || undefined,
        demandeId,
      });

      setSuccess("Commentaire ajouté avec succès !");
      setCommentaire("");
      setNote(0);
      setPhoto("");
      onCommentAdded();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout du commentaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Donner votre avis</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* Note par étoiles */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Votre note *</label>
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
                size={28}
                className={`${
                  star <= (hoverRating || note)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {note > 0 ? `${note} étoile${note > 1 ? "s" : ""}` : "Non noté"}
          </span>
        </div>
      </div>

      {/* Commentaire */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire *</label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
          placeholder="Partagez votre expérience avec cet artisan..."
        />
      </div>

      {/* Photo (optionnelle) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Photo (optionnelle)</label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="URL de la photo (optionnel)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 outline-none transition"
          />
          {photo && (
            <button
              type="button"
              onClick={() => setPhoto("")}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">Ajoutez une URL d'image pour illustrer votre avis</p>
      </div>

      {/* Bouton submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send size={18} />
            Publier mon avis
          </>
        )}
      </button>
    </div>
  );
};

export default AjouterCommentaire;