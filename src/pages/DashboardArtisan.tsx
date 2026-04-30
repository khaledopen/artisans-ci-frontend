// src/pages/DashboardArtisan.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  ChevronRight,
  Loader2,
  LogOut,
  Briefcase,
  Users,
  Settings,
  Check,
  Phone,
} from "lucide-react";
import { getMe } from "../api/auth.api";
import { getDemandesByArtisanId, accepterDemande, updateDemandeStatutArtisan } from "../api/demande.api";
import type { DemandeArtisanResponse } from "../types/demande";

const statutConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
  EN_ATTENTE: { label: "En attente", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
  ACCEPTEE: { label: "Acceptée", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: CheckCircle },
  EN_COURS: { label: "En cours", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: Clock },
  TERMINEE: { label: "Terminée", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle },
  REFUSEE: { label: "Refusée", bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: XCircle },
};

const DashboardArtisan = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [demandes, setDemandes] = useState<DemandeArtisanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("TOUTES");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const commune = data.commune || storedUser.commune || "Cocody";
        setUser({ ...data, commune });
        console.log("👨‍🔧 Artisan connecté:", { ...data, commune });
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const fetchDemandes = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }
      const userData = JSON.parse(storedUser);
      const artisanId = userData.id;
      if (!artisanId) {
        setLoading(false);
        return;
      }
      console.log("📡 Appel API: /demandes/artisan/" + artisanId);
      const data = await getDemandesByArtisanId(artisanId);
      console.log("📋 Demandes reçues:", data);
      setDemandes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement demandes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  // ✅ ACCEPTER UNE DEMANDE
  const handleAccepter = async (demandeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(demandeId);
    
    try {
      const storedUser = localStorage.getItem("user");
      const userData = JSON.parse(storedUser || "{}");
      const artisanId = userData.id;
      
      console.log(`🔍 Acceptation: demande=${demandeId}, artisan=${artisanId}`);
      
      const response = await accepterDemande(demandeId, artisanId);
      console.log("✅ Demande acceptée:", response);
      
      // Rafraîchir la liste
      await fetchDemandes();
      alert("✅ Demande acceptée avec succès !");
      
    } catch (err: any) {
      console.error("❌ Erreur:", err);
      alert(err.response?.data?.message || "Erreur lors de l'acceptation");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ METTRE À JOUR LE STATUT
  const handleUpdateStatut = async (demandeId: number, nouveauStatut: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(demandeId);
    
    try {
      await updateDemandeStatutArtisan(demandeId, nouveauStatut as "EN_COURS" | "TERMINEE");
      console.log(`✅ Demande ${demandeId} passée en ${nouveauStatut}`);
      await fetchDemandes();
      alert(`✅ Demande ${nouveauStatut === "EN_COURS" ? "en cours" : "terminée"}`);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const stats = {
    total: demandes.length,
    enAttente: demandes.filter((d) => d.statutDemande === "EN_ATTENTE").length,
    acceptees: demandes.filter((d) => d.statutDemande === "ACCEPTEE").length,
    enCours: demandes.filter((d) => d.statutDemande === "EN_COURS").length,
    terminees: demandes.filter((d) => d.statutDemande === "TERMINEE").length,
  };

  const demandesFiltrees = activeFilter === "TOUTES" ? demandes : demandes.filter((d) => d.statutDemande === activeFilter);
  const initiales = user ? `${user.prenom?.charAt(0) || ""}${user.nom?.charAt(0) || ""}` : "?";
  const getLocalisation = () => {
    if (user?.commune && user?.localisation) return `${user.commune}, ${user.localisation}`;
    if (user?.commune) return user.commune;
    if (user?.localisation) return user.localisation;
    return "Abidjan";
  };

  const formatHeure = (heure: any) => {
    if (!heure) return "Non spécifiée";
    if (typeof heure === "object" && heure.hour !== undefined) {
      return `${heure.hour.toString().padStart(2, "0")}:${heure.minute.toString().padStart(2, "0")}`;
    }
    return heure;
  };

  return (
    <>
      <Navbar brand="ArtisanCI" links={[
        { label: "Accueil", path: "/" },
        { label: "Mes demandes", path: "/dashboard-artisan" },
        { label: "Mon profil", path: "/profile-artisan" },
      ]} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 pt-10 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  {user?.photoprofil ? <img src={user.photoprofil} className="w-16 h-16 rounded-2xl object-cover" alt="profil" /> : <span className="text-white font-bold text-2xl">{initiales}</span>}
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Espace Artisan</p>
                  <h1 className="text-white text-2xl font-bold">{user?.prenom} {user?.nom}</h1>
                  <p className="text-blue-200 text-sm flex items-center gap-1 mt-1"><Briefcase size={14} /> {user?.metier?.nom || "Artisan"}</p>
                  <p className="text-blue-200 text-xs flex items-center gap-1 mt-0.5"><MapPin size={12} /> {getLocalisation()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => navigate("/profile-artisan")} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition"><Settings size={16} /> Profil</button>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition"><LogOut size={16} /> Déconnexion</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"><p className="text-blue-200 text-sm">Total demandes</p><p className="text-white text-3xl font-bold">{stats.total}</p></div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"><p className="text-blue-200 text-sm">En attente</p><p className="text-amber-300 text-3xl font-bold">{stats.enAttente}</p></div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"><p className="text-blue-200 text-sm">Acceptées</p><p className="text-green-300 text-3xl font-bold">{stats.acceptees}</p></div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"><p className="text-blue-200 text-sm">Terminées</p><p className="text-blue-300 text-3xl font-bold">{stats.terminees}</p></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-8 pb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div><h2 className="text-xl font-bold text-gray-800">Mes demandes</h2></div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{demandesFiltrees.length} demande(s)</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {["TOUTES", "EN_ATTENTE", "ACCEPTEE", "EN_COURS", "TERMINEE"].map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${activeFilter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {f === "TOUTES" ? "Toutes" : statutConfig[f]?.label || f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
            ) : demandesFiltrees.length === 0 ? (
              <div className="text-center py-16"><ClipboardList size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">Aucune demande</p></div>
            ) : (
              <div className="space-y-4">
                {demandesFiltrees.map((demande) => {
                  const config = statutConfig[demande.statutDemande] || statutConfig.EN_ATTENTE;
                  const Icon = config.icon;
                  const isActionLoading = actionLoading === demande.id;
                  
                  return (
                    <div key={demande.id} className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/demande/${demande.id}`)}>
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
                              <Icon size={12} className="inline mr-1" />{config.label}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar size={12} />{new Date(demande.dateRendezVous).toLocaleDateString("fr-FR")}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} />{formatHeure(demande.heure)}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800">{demande.descriptionTravail}</p>
                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Users size={14} />Client: {demande.clientName} - {demande.clientCommune}</span>
                            {demande.statutDemande === "ACCEPTEE" && demande.clientNumero && (
                              <span className="flex items-center gap-1 text-green-600"><Phone size={12} />{demande.clientNumero}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {demande.statutDemande === "EN_ATTENTE" && (
                            <button
                              onClick={(e) => handleAccepter(demande.id, e)}
                              disabled={isActionLoading}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                            >
                              {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              Accepter
                            </button>
                          )}
                          {demande.statutDemande === "ACCEPTEE" && (
                            <button
                              onClick={(e) => handleUpdateStatut(demande.id, "EN_COURS", e)}
                              disabled={isActionLoading}
                              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                            >
                              Démarrer
                            </button>
                          )}
                          {demande.statutDemande === "EN_COURS" && (
                            <button
                              onClick={(e) => handleUpdateStatut(demande.id, "TERMINEE", e)}
                              disabled={isActionLoading}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                              Terminer
                            </button>
                          )}
                          <ChevronRight className="text-gray-300" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardArtisan;