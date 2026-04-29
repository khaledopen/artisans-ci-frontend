// src/components/ModifierCommentaire.tsx

import { useState } from "react";
import { Star, Save, X, Loader2 } from "lucide-react";
import { updateCommentaire } from "../api/commentaire.api";
import type { Commentaire } from "../types/commentaire";

interface ModifierCommentaireProps {
  commentaire: Commentaire;
  onClose: () => void;
  onUpdated: () => void;
}

const ModifierCommentaire = ({ commentaire, onClose, onUpdated }: ModifierCommentaireProps) => {
  const [text, setText] = useState(commentaire.commentaire);
  const [photo, setPhoto] = useState(commentaire.photo || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Le commentaire ne peut pas être vide");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateCommentaire(commentaire.id, {
        commentaire: text.trim(),
        photo: photo || undefined,
      });
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Modifier mon avis</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Votre commentaire
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo (URL)
            </label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://exemple.com/photo.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 outline-none transition"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Enregistrer
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierCommentaire;