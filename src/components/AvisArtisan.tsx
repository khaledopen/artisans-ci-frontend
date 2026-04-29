// src/components/AvisArtisan.tsx

import { useEffect, useState } from "react";
import { Star, User, Flag, Calendar, MessageCircle, ThumbsUp, Trash2 } from "lucide-react";
import { getCommentairesByArtisanId, signalerCommentaire, deleteCommentaire } from "../api/commentaire.api";
import type { Commentaire } from "../types/commentaire";

interface AvisArtisanProps {
  artisanId: number;
  isAdmin?: boolean;
  currentUserId?: number;
}

const AvisArtisan = ({ artisanId, isAdmin = false, currentUserId }: AvisArtisanProps) => {
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageNote, setAverageNote] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCommentaires();
  }, [artisanId, page]);

  const fetchCommentaires = async () => {
    setLoading(true);
    try {
      const data = await getCommentairesByArtisanId(artisanId, page, 5);
      setCommentaires(data.content || []);
      setAverageNote(data.averageNote || 0);
      setTotalComments(data.totalComments || data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Erreur chargement avis", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignaler = async (id: number) => {
    if (confirm("Voulez-vous signaler ce commentaire ?")) {
      try {
        await signalerCommentaire(id);
        alert("Commentaire signalé. Merci pour votre vigilance.");
        await fetchCommentaires();
      } catch (err) {
        console.error(err);
        alert("Erreur lors du signalement");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      try {
        await deleteCommentaire(id);
        alert("Commentaire supprimé avec succès");
        await fetchCommentaires();
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading && page === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-gray-400">Chargement des avis...</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* En-tête des avis */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Avis des clients</h3>
          <p className="text-sm text-gray-500">
            {totalComments} avis • Note moyenne
          </p>
        </div>
        {averageNote > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={star <= averageNote ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="font-bold text-lg">{averageNote.toFixed(1)}/5</span>
          </div>
        )}
      </div>

      {/* Liste des commentaires */}
      {commentaires.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun avis pour le moment</p>
          <p className="text-sm text-gray-400">Soyez le premier à donner votre avis</p>
        </div>
      ) : (
        <div className="space-y-4">
          {commentaires.map((avis) => (
            <div key={avis.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
              {/* En-tête du commentaire */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {avis.client.photoprofil ? (
                      <img src={avis.client.photoprofil} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <User size={18} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {avis.client.prenom} {avis.client.nom}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      {formatDate(avis.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= avis.note ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>

              {/* Contenu du commentaire */}
              <p className="text-gray-700 leading-relaxed mb-3">{avis.commentaire}</p>

              {/* Photo */}
              {avis.photo && (
                <div className="mb-3">
                  <img
                    src={avis.photo}
                    alt="Photo du travail"
                    className="w-32 h-32 object-cover rounded-xl border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Réponse de l'artisan */}
              {avis.reponse && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                  <p className="text-sm font-medium text-blue-700 flex items-center gap-1">
                    <ThumbsUp size={14} /> Réponse de l'artisan
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{avis.reponse}</p>
                  {avis.reponseAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Répondu le {formatDate(avis.reponseAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleSignaler(avis.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1"
                >
                  <Flag size={12} /> Signaler
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(avis.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
          >
            ← Précédent
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            Page {page + 1} sur {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
};

export default AvisArtisan;