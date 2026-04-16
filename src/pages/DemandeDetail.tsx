import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  getDemandeById, 
  getDemandeStatut, 
  getDemandeHeure,
  getDemandeDescription,
  getDemandeDateRendezVous
} from "../api/demande.api";
import type { DemandeResponse } from "../types/demande";
import { 
  Calendar, Clock, FileText, User, Briefcase, 
  MapPin, Loader2, AlertCircle, CheckCircle, 
  XCircle, Clock as ClockIcon, RefreshCw 
} from "lucide-react";

const statutConfig: Record<string, { label: string; color: string; icon: any }> = {
  EN_ATTENTE: { label: "En attente", color: "text-amber-600 bg-amber-50", icon: ClockIcon },
  ACCEPTEE: { label: "Acceptée", color: "text-blue-600 bg-blue-50", icon: CheckCircle },
  TERMINEE: { label: "Terminée", color: "text-green-600 bg-green-50", icon: CheckCircle },
  REFUSEE: { label: "Refusée", color: "text-red-600 bg-red-50", icon: XCircle },
};

const DemandeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [demande, setDemande] = useState<DemandeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  // États pour les champs en temps réel
  const [currentStatut, setCurrentStatut] = useState<string>("");
  const [currentHeure, setCurrentHeure] = useState<string>("");
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  // Charger la demande complète
  const fetchDemande = async () => {
    if (!id) {
      setError("ID de demande manquant");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getDemandeById(parseInt(id));
      setDemande(data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Impossible de charger la demande");
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir tous les champs indépendants
  const refreshAllFields = async () => {
    if (!id) return;
    
    try {
      const [statutData, heureData, descriptionData, dateData] = await Promise.all([
        getDemandeStatut(parseInt(id)),
        getDemandeHeure(parseInt(id)),
        getDemandeDescription(parseInt(id)),
        getDemandeDateRendezVous(parseInt(id))
      ]);
      setCurrentStatut(statutData.statut);
      setCurrentHeure(heureData.heure);
      setCurrentDescription(descriptionData.description);
      setCurrentDate(dateData.date);
    } catch (err) {
      console.error("Erreur rafraîchissement:", err);
    }
  };

  // Rafraîchissement manuel (bouton)
  const handleManualRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDemande(), refreshAllFields()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDemande();
    refreshAllFields();
  }, [id]);

  // Rafraîchissement automatique toutes les 10 secondes (si la demande est en attente)
  useEffect(() => {
    if (!demande) return;
    
    const statut = demande.statutDemande || demande.statut_demande || "";
    if (statut === "EN_ATTENTE") {
      const interval = setInterval(() => {
        refreshAllFields();
      }, 10000); // Toutes les 10 secondes
      
      return () => clearInterval(interval);
    }
  }, [demande]);

  const getStatutConfig = () => {
    const statut = currentStatut || demande?.statutDemande || demande?.statut_demande || "EN_ATTENTE";
    return statutConfig[statut] || statutConfig.EN_ATTENTE;
  };

  const getDate = () => {
    return currentDate || demande?.dateRendezVous || demande?.date_rendez_vous || "";
  };

  const getDescription = () => {
    return currentDescription || demande?.descriptionTravail || demande?.description_travail || "";
  };

  const getClientName = () => {
    if (demande?.clientName) return demande.clientName;
    if (demande?.client) return `${demande.client.prenom} ${demande.client.nom}`;
    return "Client";
  };

  const getHeureAffichee = () => {
    return currentHeure || demande?.heure || "Non spécifiée";
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

  if (error || !demande) {
    return (
      <>
        <Navbar brand="ArtisanCI" links={[]} />
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="text-red-500 text-center mb-4">{error || "Demande non trouvée"}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const statut = getStatutConfig();
  const StatutIcon = statut.icon;

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Accueil", path: "/" },
          { label: "Artisans", path: "/artisans" },
        ]}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Header avec bouton refresh */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
              >
                ← Retour
              </button>
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                Actualiser
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Détail de la demande</h1>
            <p className="text-gray-500 mt-1">Demande n° {demande.id}</p>
          </div>

          {/* Carte principale */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* En-tête avec statut */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-white text-xl font-semibold">Informations générales</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statut.color}`}>
                  <StatutIcon size={14} />
                  {statut.label}
                </span>
              </div>
            </div>

            {/* Corps */}
            <div className="p-6 space-y-6">
              {/* Date et heure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={18} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Date du rendez-vous</p>
                    <p className="font-medium">{getDate()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock size={18} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Heure</p>
                    <p className="font-medium">{getHeureAffichee()}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3 text-gray-600 mb-3">
                  <FileText size={18} className="text-blue-500" />
                  <p className="font-medium">Description des travaux</p>
                </div>
                <p className="text-gray-700 leading-relaxed ml-8">
                  {getDescription()}
                </p>
              </div>

              {/* Client */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3 text-gray-600 mb-3">
                  <User size={18} className="text-blue-500" />
                  <p className="font-medium">Client</p>
                </div>
                <div className="ml-8">
                  <p className="font-medium text-gray-800">{getClientName()}</p>
                  <p className="text-sm text-gray-500">ID: {demande.clientId || demande.client?.id}</p>
                </div>
              </div>

              {/* Artisan (si assigné) */}
              {demande.artisan && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3 text-gray-600 mb-3">
                    <Briefcase size={18} className="text-blue-500" />
                    <p className="font-medium">Artisan assigné</p>
                  </div>
                  <div className="ml-8">
                    <p className="font-medium text-gray-800">
                      {demande.artisan.prenom} {demande.artisan.nom}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin size={12} />
                      {demande.artisan.localisation}, {demande.artisan.commune}
                    </p>
                    <p className="text-sm text-gray-500">{demande.artisan.metier?.nom}</p>
                  </div>
                </div>
              )}

              {/* Photos (si disponibles) */}
              {demande.photo_endommage && demande.photo_endommage.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-medium text-gray-700 mb-3">Photos jointes</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {demande.photo_endommage.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Erreur";
                        }}
                      />
                    ))}
                  </div>
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