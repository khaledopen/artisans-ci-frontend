import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getArtisanById } from "../api/artisan.api";
import { getCommentairesByArtisanId } from "../api/commentaire.api";
import type { Artisan } from "../types/artisan";
import type { Commentaire } from "../types/commentaire";
import { 
  Star, MapPin, Phone, Mail, Briefcase, 
  Calendar, Clock, CheckCircle, User, 
  Loader2, AlertCircle, Navigation, MessageCircle, Flag, ThumbsUp
} from "lucide-react";

const ArtisanProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState("");
  const [averageNote, setAverageNote] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
        const data = await getArtisanById(parseInt(id));
        setArtisan(data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Impossible de charger le profil de l'artisan");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [id]);

  // Charger les commentaires séparément
  useEffect(() => {
    const fetchCommentaires = async () => {
      if (!id) return;
      
      setLoadingComments(true);
      try {
        const data = await getCommentairesByArtisanId(parseInt(id), page, 5);
        setCommentaires(data.content || []);
        setAverageNote(data.averageNote || 0);
        setTotalComments(data.totalComments || data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Erreur chargement commentaires", err);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchCommentaires();
  }, [id, page]);

  const getInitials = () => {
    if (!artisan) return "?";
    return `${artisan.prenom?.charAt(0) || ""}${artisan.nom?.charAt(0) || ""}`.toUpperCase();
  };

  const fullName = artisan ? `${artisan.prenom || ""} ${artisan.nom || ""}`.trim() : "Artisan";
  const location = artisan?.commune 
    ? `${artisan.commune}, ${artisan.localisation || "Abidjan"}`
    : artisan?.localisation || "Abidjan";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
        {/* Header avec photo de couverture */}
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

        {/* Contenu principal */}
        <div className="max-w-5xl mx-auto px-4 -mt-20 pb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Photo de profil */}
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

            {/* Infos principales */}
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

              {/* Note moyenne depuis les commentaires */}
              {totalComments > 0 && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-lg">{averageNote.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{totalComments} avis</span>
                </div>
              )}

              {/* Boutons d'action */}
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

            {/* Description */}
            {artisan.description && (
              <div className="px-6 py-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3">À propos</h3>
                <p className="text-gray-600 leading-relaxed">
                  {artisan.description}
                </p>
              </div>
            )}

            {/* Informations professionnelles */}
            <div className="px-6 py-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Informations professionnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artisan.experience && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-blue-500" />
                    <span>{artisan.experience} ans d'expérience</span>
                  </div>
                )}
                {artisan.prixHoraire && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={18} className="text-blue-500" />
                    <span>{artisan.prixHoraire} €/heure</span>
                  </div>
                )}
                {artisan.disponibilite && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Disponible: {artisan.disponibilite}</span>
                  </div>
                )}
                {artisan.telephone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} className="text-blue-500" />
                    <span>{artisan.telephone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Avis clients (via API commentaires) */}
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-semibold text-gray-800">
                  Avis clients {totalComments > 0 && `(${totalComments})`}
                </h3>
                {averageNote > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-sm">{averageNote.toFixed(1)}/5</span>
                  </div>
                )}
              </div>

              {loadingComments && page === 0 ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : commentaires.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Aucun avis pour le moment</p>
                  <p className="text-sm text-gray-400 mt-1">Soyez le premier à donner votre avis</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commentaires.map((avis) => (
                    <div key={avis.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {avis.client.prenom} {avis.client.nom}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(avis.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= avis.note ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{avis.commentaire}</p>
                      {avis.photo && (
                        <img
                          src={avis.photo}
                          alt="Photo du travail"
                          className="mt-3 w-24 h-24 object-cover rounded-lg border"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                      {avis.reponse && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
                            <ThumbsUp size={12} /> Réponse de l'artisan
                          </p>
                          <p className="text-sm text-gray-700 mt-1">{avis.reponse}</p>
                        </div>
                      )}
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
                    className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    ← Précédent
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-600">
                    Page {page + 1} sur {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ArtisanProfile;