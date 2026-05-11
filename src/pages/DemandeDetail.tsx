// src/pages/DemandeDetail.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getDemandeById } from "../api/demande.api";

import type { DemandeResponse } from "../types/demande";
import {
  Calendar, Clock, FileText, User, Briefcase, MapPin,
  Loader2, AlertCircle, CheckCircle, XCircle,
  Clock as ClockIcon, RefreshCw, Phone, Play, Check
} from "lucide-react";
import { accepterDemande, updateDemandeStatut, getDemandePhotoUrl, fetchDemandePhotoBlob } from "../api/demande.api";

const statutConfig: Record<string, { label: string; color: string; icon: any }> = {
  EN_ATTENTE: { label: "En attente", color: "text-amber-600 bg-amber-50", icon: ClockIcon },
  ACCEPTEE: { label: "Acceptée", color: "text-blue-600 bg-blue-50", icon: CheckCircle },
  EN_COURS: { label: "En cours", color: "text-purple-600 bg-purple-50", icon: ClockIcon },
  TERMINEE: { label: "Terminée", color: "text-green-600 bg-green-50", icon: CheckCircle },
  REFUSEE: { label: "Refusée", color: "text-red-600 bg-red-50", icon: XCircle },
};

const ProtectedImage = ({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: (url: string) => void }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Si c'est une URL Cloudinary ou déjà un blob, on l'utilise directement
    if (src.includes("cloudinary") || src.startsWith("blob:") || src.startsWith("data:")) {
      setImgSrc(src);
      return;
    }

    // Sinon, on tente de récupérer le blob avec authentification (via axios)
    const loadProtectedImage = async () => {
      try {
        // On extrait l'ID de l'URL si possible, ou on utilise l'URL telle quelle si fetchDemandePhotoBlob était plus générique
        // Ici on sait que nos URLs internes sont /demandes/{id}/photo
        const match = src.match(/\/demandes\/(\d+)\/photo/);
        if (match) {
          const id = parseInt(match[1]);
          const blobUrl = await fetchDemandePhotoBlob(id);
          setImgSrc(blobUrl);
        } else {
          setImgSrc(src);
        }
      } catch (err) {
        console.error("Erreur chargement image protégée:", err);
        setError(true);
      }
    };

    loadProtectedImage();
  }, [src]);

  if (error) return <div className={`${className} flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center p-2`}>Image non accessible</div>;
  if (!imgSrc) return <div className={`${className} flex items-center justify-center bg-gray-50`}><Loader2 className="animate-spin text-gray-300" size={20} /></div>;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onClick={() => onClick ? onClick(imgSrc) : window.open(imgSrc, "_blank")}
    />
  );
};

const DemandeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [demande, setDemande] = useState<DemandeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = localStorage.getItem("role");

  const fetchDemande = async () => {
    if (!id) { setError("ID de demande manquant"); setLoading(false); return; }
    setLoading(true);
    try {
      const demandeData = await getDemandeById(parseInt(id));
      console.log("🔍 Données brutes de la demande reçues:", demandeData);
      setDemande(demandeData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de charger la demande");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDemande(); }, [id]);

  const handleManualRefresh = async () => { setRefreshing(true); await fetchDemande(); setRefreshing(false); };

  const handleAction = async (action: string) => {
    if (!id || !demande) return;
    setActionLoading(true);
    try {
      if (action === "ACCEPTER") {
        const artisanId = currentUser.id;
        // Si déjà assigné, update statut simple
        if (demande.artisanId === artisanId || demande.artisan?.id === artisanId) {
          await updateDemandeStatut(parseInt(id), "ACCEPTEE");
        } else {
          await accepterDemande(parseInt(id), artisanId);
        }
        alert("✅ Mission acceptée !");
      } else if (action === "DEMARRER") {
        await updateDemandeStatut(parseInt(id), "EN_COURS");
        alert("🚀 Travaux démarrés !");
      } else if (action === "TERMINER") {
        await updateDemandeStatut(parseInt(id), "TERMINEE");
        alert("✅ Travaux terminés !");
      }
      await fetchDemande();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'action");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatutConfig = () => {
    const statut = demande?.statutDemande || demande?.statut_demande || (demande as any).statut || "EN_ATTENTE";
    return statutConfig[statut] || statutConfig.EN_ATTENTE;
  };

  const getDate = () => demande?.dateRendezVous || demande?.date_rendez_vous || (demande as any).date || "";
  const getDescription = () => demande?.descriptionTravail || demande?.description_travail || (demande as any).description || "";
  const getClientName = () => demande?.clientName || (demande?.client ? `${demande.client.prenom} ${demande.client.nom}` : "Client");

  // 📞 Détection du numéro : clientNumero est toujours présent dans le nouveau DTO
  const getClientPhone = () => {
    return demande?.clientNumero ||
      (demande as any).clientTelephone ||
      (demande as any).telephone ||
      demande?.client?.telephone ||
      null;
  };

  const getArtisanPhone = () => {
    return (demande as any).artisanNumero ||
      demande?.artisanTelephone ||
      (demande as any).telephoneArtisan ||
      demande?.artisan?.telephone ||
      null;
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (error || !demande) return <div className="text-center text-red-500 mt-10">{error || "Demande non trouvée"}</div>;

  const statut = getStatutConfig();
  const StatutIcon = statut.icon;

  return (
    <>
      <Navbar brand="ArtisanCI" links={[{ label: "Accueil", path: "/" }, { label: "Artisans", path: "/artisans" }]} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8 flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">← Retour</button>
            <button onClick={handleManualRefresh} disabled={refreshing} className="flex items-center gap-2 text-sm text-blue-600"><RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Actualiser</button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 flex justify-between items-center">
              <h2 className="text-white text-xl font-semibold">Détail de la demande</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statut.color}`}><StatutIcon size={14} /> {statut.label}</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div><p className="text-xs text-gray-400">Date</p><p className="font-medium">{getDate()}</p></div>
                <div><p className="text-xs text-gray-400">Heure</p><p className="font-medium">{demande.heure || "Non spécifiée"}</p></div>
              </div>
              <div><p className="font-medium">Description</p><p className="text-gray-700">{getDescription()}</p></div>
              <div>
                <p className="font-medium">Client</p>
                <p>{getClientName()}</p>
                {getClientPhone() && (
                  <a
                    href={`tel:${getClientPhone()}`}
                    className="text-blue-600 font-medium flex items-center gap-1 mt-1 hover:underline"
                  >
                    <Phone size={14} /> {getClientPhone()}
                  </a>
                )}
              </div>

              {demande.artisan && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {demande.artisan.photoprofil || (demande as any).artisanPhoto ? (
                      <img
                        src={demande.artisan.photoprofil || (demande as any).artisanPhoto}
                        alt="artisan"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                        {demande.artisan.prenom?.charAt(0)}{demande.artisan.nom?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Artisan assigné</p>
                    <p className="font-bold text-gray-800 text-lg">{demande.artisan.prenom} {demande.artisan.nom}</p>
                    {getArtisanPhone() && (
                      <a
                        href={`tel:${getArtisanPhone()}`}
                        className="text-green-600 font-medium flex items-center gap-1 mt-0.5 hover:underline"
                      >
                        <Phone size={14} /> {getArtisanPhone()}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Photos - Priorité au champ photoUrl (Cloudinary) */}
              {(() => {
                // 1. On prend photoUrl ou photo_url du DTO en priorité (URL Cloudinary)
                const photoUrlFromDto = demande.photoUrl || (demande as any).photo_url;
                // 2. Fallback sur l'ancien tableau photo_endommage
                const legacyPhotos = demande.photo_endommage || [];

                const allPhotos: string[] = [];
                // 1. Endpoint direct (nouveau)
                if (demande.id) allPhotos.push(getDemandePhotoUrl(demande.id));
                // 2. Cloudinary (si présent)
                if (photoUrlFromDto) allPhotos.push(photoUrlFromDto);
                // 3. Anciens champs
                allPhotos.push(...legacyPhotos.filter(p => p && p.length > 5));
                const uniquePhotos = Array.from(new Set(allPhotos));

                if (uniquePhotos.length === 0) return (
                  <div className="p-4 bg-gray-50 rounded-xl text-gray-400 text-sm italic text-center">
                    Aucune photo jointe à cette demande
                  </div>
                );

                return (
                  <div>
                    <p className="font-medium mb-3">Photos de la panne</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {uniquePhotos.map((p, i) => (
                        <ProtectedImage
                          key={i}
                          src={p}
                          alt={`panne-${i}`}
                          className="w-full h-40 object-cover rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
                          onClick={(url) => window.open(url, "_blank")}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Actions Artisan */}
              {userRole === "ARTISAN" && (
                <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                  {(demande.statutDemande || demande.statut_demande) === "EN_ATTENTE" && (
                    <button
                      onClick={() => handleAction("ACCEPTER")}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                      Accepter la mission
                    </button>
                  )}
                  {(demande.statutDemande || demande.statut_demande) === "ACCEPTEE" && (
                    <button
                      onClick={() => handleAction("DEMARRER")}
                      disabled={actionLoading}
                      className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                      Démarrer les travaux
                    </button>
                  )}
                  {(demande.statutDemande || demande.statut_demande) === "EN_COURS" && (
                    <button
                      onClick={() => handleAction("TERMINER")}
                      disabled={actionLoading}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                      Terminer les travaux
                    </button>
                  )}
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

export default DemandeDetail;