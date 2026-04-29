// src/pages/DemandeDetail.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getDemandeById } from "../api/demande.api";
import type { DemandeResponse } from "../types/demande";
import { Calendar, Clock, FileText, User, Briefcase, MapPin, Loader2, AlertCircle, CheckCircle, XCircle, Clock as ClockIcon, RefreshCw, Phone } from "lucide-react";

const statutConfig: Record<string, { label: string; color: string; icon: any }> = {
  EN_ATTENTE: { label: "En attente", color: "text-amber-600 bg-amber-50", icon: ClockIcon },
  ACCEPTEE: { label: "Acceptée", color: "text-blue-600 bg-blue-50", icon: CheckCircle },
  EN_COURS: { label: "En cours", color: "text-purple-600 bg-purple-50", icon: ClockIcon },
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

  const fetchDemande = async () => {
    if (!id) { setError("ID de demande manquant"); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getDemandeById(parseInt(id));
      setDemande(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de charger la demande");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDemande(); }, [id]);

  const handleManualRefresh = async () => { setRefreshing(true); await fetchDemande(); setRefreshing(false); };

  const getStatutConfig = () => {
    const statut = demande?.statutDemande || demande?.statut_demande || "EN_ATTENTE";
    return statutConfig[statut] || statutConfig.EN_ATTENTE;
  };

  const getDate = () => demande?.dateRendezVous || demande?.date_rendez_vous || "";
  const getDescription = () => demande?.descriptionTravail || demande?.description_travail || "";
  const getClientName = () => demande?.clientName || (demande?.client ? `${demande.client.prenom} ${demande.client.nom}` : "Client");
  const getClientPhone = () => demande?.clientNumero || demande?.client?.telephone;
  const getArtisanPhone = () => demande?.artisanNumero || demande?.artisan?.telephone;

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
              <div><p className="font-medium">Client</p><p>{getClientName()}</p>{getClientPhone() && <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone size={12} />{getClientPhone()}</p>}</div>
              {demande.artisan && <div><p className="font-medium">Artisan</p><p>{demande.artisan.prenom} {demande.artisan.nom}</p>{getArtisanPhone() && <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone size={12} />{getArtisanPhone()}</p>}</div>}
              {demande.photo_endommage && demande.photo_endommage.length > 0 && <div><p className="font-medium mb-2">Photos</p><div className="grid grid-cols-3 gap-3">{demande.photo_endommage.map((p, i) => <img key={i} src={p} className="w-full h-24 object-cover rounded-lg" />)}</div></div>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DemandeDetail;