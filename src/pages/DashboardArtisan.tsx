// src/pages/DashboardArtisan.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMe } from "../api/auth.api";
import { getDemandesByArtisanId, accepterDemande, updateDemandeStatut, getDemandesDisponiblesByArtisanId, getDemandePhotoUrl, fetchDemandePhotoBlob } from "../api/demande.api";
import type { DemandeArtisanResponse } from "../types/demande";
import { 
  ClipboardList, 
  Calendar, 
  MapPin, 
  Users, 
  Loader2, 
  LogOut, 
  Briefcase, 
  Settings, 
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  ChevronRight,
  RefreshCw,
  TrendingUp
} from "lucide-react";

const statutConfig: Record<string, { label: string; color: string; icon: any; actions: string[] }> = {
  EN_ATTENTE: { 
    label: "En attente", 
    color: "bg-amber-100 text-amber-700", 
    icon: Clock,
    actions: ["accepter"]
  },
  ACCEPTEE: { 
    label: "Acceptée", 
    color: "bg-blue-100 text-blue-700", 
    icon: CheckCircle,
    actions: ["demarrer"]
  },
  EN_COURS: { 
    label: "En cours", 
    color: "bg-purple-100 text-purple-700", 
    icon: Clock,
    actions: ["terminer"]
  },
  TERMINEE: { 
    label: "Terminée", 
    color: "bg-green-100 text-green-700", 
    icon: CheckCircle,
    actions: []
  },
  REFUSEE: { 
    label: "Refusée", 
    color: "bg-red-100 text-red-600", 
    icon: XCircle,
    actions: []
  },
};

const ProtectedImage = ({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: (url: string) => void }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (src.includes("cloudinary") || src.startsWith("blob:") || src.startsWith("data:")) {
      setImgSrc(src);
      return;
    }

    const loadProtectedImage = async () => {
      try {
        const match = src.match(/\/demandes\/(\d+)\/photo/);
        if (match) {
          const id = parseInt(match[1]);
          const blobUrl = await fetchDemandePhotoBlob(id);
          setImgSrc(blobUrl);
        } else {
          setImgSrc(src);
        }
      } catch (err) {
        setError(true);
      }
    };

    loadProtectedImage();
  }, [src]);

  if (error || !imgSrc) return <div className={`${className} bg-gray-100 flex items-center justify-center`}><ClipboardList size={24} className="text-gray-300" /></div>;

  return <img src={imgSrc} alt={alt} className={className} onClick={() => onClick && onClick(imgSrc)} />;
};

const DashboardArtisan = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [demandes, setDemandes] = useState<DemandeArtisanResponse[]>([]);
  const [demandesDisponibles, setDemandesDisponibles] = useState<DemandeArtisanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("TOUTES");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const commune = data.commune || storedUser.commune;
        const artisanId = data.id || storedUser.id;
        setUser({ ...data, commune, artisanId });
        console.log("👨‍🔧 Artisan connecté - ID:", artisanId, "Commune:", commune);
        
        if (artisanId) {
          await fetchDemandesByArtisan(artisanId);
        } else {
          setLoading(false);
          setError("ID artisan non trouvé");
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const fetchDemandesByArtisan = async (artisanId: number) => {
    setLoading(true);
    setError("");
    try {
      // ✅ Récupérer en parallèle mes missions et les demandes disponibles
      const [mesMissions, dispos] = await Promise.all([
        getDemandesByArtisanId(artisanId),
        getDemandesDisponiblesByArtisanId(artisanId)
      ]);

      console.log("📋 Missions assignées:", mesMissions);
      console.log("📋 Demandes disponibles:", dispos);

      setDemandes(Array.isArray(mesMissions) ? mesMissions : []);
      setDemandesDisponibles(Array.isArray(dispos) ? dispos : []);
      
    } catch (err: any) {
      console.error("❌ Erreur chargement demandes:", err);
      setError(err.response?.data?.message || "Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!user?.artisanId) return;
    setRefreshing(true);
    await fetchDemandesByArtisan(user.artisanId);
    setRefreshing(false);
  };

  const handleAccepter = async (demandeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(demandeId);
    try {
      const artisanId = user?.artisanId;
      
      // ✅ Trouver si la demande est déjà assignée ou si elle est dans "disponibles"
      const isAssigned = demandes.find(d => d.id === demandeId);
      
      if (isAssigned && isAssigned.artisanId === artisanId) {
        // Si elle est déjà assignée, on change juste le statut
        await updateDemandeStatut(demandeId, "ACCEPTEE");
        setDemandes(prev => prev.map(d => d.id === demandeId ? { ...d, statutDemande: "ACCEPTEE" as any } : d));
      } else {
        // Sinon on utilise l'endpoint d'acceptation (pour les opportunités)
        await accepterDemande(demandeId, artisanId);
        const acceptedDemande = demandesDisponibles.find(d => d.id === demandeId);
        if (acceptedDemande) {
          setDemandesDisponibles(prev => prev.filter(d => d.id !== demandeId));
          setDemandes(prev => [...prev, { ...acceptedDemande, statutDemande: "ACCEPTEE" as any, artisanId }]);
        }
      }
      
      alert("✅ Demande acceptée avec succès !");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'acceptation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemarrer = async (demandeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(demandeId);
    try {
      await updateDemandeStatut(demandeId, "EN_COURS");
      setDemandes(prevDemandes => 
        prevDemandes.map(d => 
          d.id === demandeId ? { ...d, statutDemande: "EN_COURS" } : d
        )
      );
      alert("✅ Travaux démarrés !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors du démarrage");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTerminer = async (demandeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(demandeId);
    try {
      await updateDemandeStatut(demandeId, "TERMINEE");
      setDemandes(prevDemandes => 
        prevDemandes.map(d => 
          d.id === demandeId ? { ...d, statutDemande: "TERMINEE" } : d
        )
      );
      alert("✅ Travaux terminés !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la finalisation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const stats = {
    total: demandes.length,
    disponibles: demandesDisponibles.length,
    enAttente: demandes.filter((d) => d.statutDemande === "EN_ATTENTE").length,
    acceptees: demandes.filter((d) => d.statutDemande === "ACCEPTEE").length,
    enCours: demandes.filter((d) => d.statutDemande === "EN_COURS").length,
    terminees: demandes.filter((d) => d.statutDemande === "TERMINEE").length,
  };

  const demandesFiltrees = activeFilter === "TOUTES"
    ? demandes
    : demandes.filter((d) => d.statutDemande === activeFilter);

  const initiales = user ? `${user.prenom?.charAt(0) || ""}${user.nom?.charAt(0) || ""}`.toUpperCase() : "?";
  const getLocalisation = () => {
    if (user?.commune && user?.localisation) return `${user.commune}, ${user.localisation}`;
    if (user?.commune) return user.commune;
    if (user?.localisation) return user.localisation;
    return "Abidjan";
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
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
                  <span className="text-white font-bold text-2xl">{initiales}</span>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Espace Artisan</p>
                  <h1 className="text-white text-2xl font-bold">{user?.prenom} {user?.nom}</h1>
                  <p className="text-blue-200 text-sm flex items-center gap-1 mt-1">
                    <Briefcase size={14} /> {user?.metier?.nom || "Artisan"}
                  </p>
                  <p className="text-blue-200 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {getLocalisation()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                >
                  <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                  Actualiser
                </button>
                <button
                  onClick={() => navigate("/profile-artisan")}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                >
                  <Settings size={16} /> Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-blue-200 text-xs">Mes Missions</p>
                <p className="text-white text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white/20 border border-white/30 rounded-2xl p-4">
                <p className="text-amber-200 text-xs font-bold">Opportunités</p>
                <p className="text-white text-2xl font-bold">{stats.disponibles}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-blue-200 text-xs font-medium">Acceptées</p>
                <p className="text-green-300 text-2xl font-bold">{stats.acceptees}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-blue-200 text-xs font-medium">En cours</p>
                <p className="text-purple-300 text-2xl font-bold">{stats.enCours}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-blue-200 text-xs font-medium">Terminées</p>
                <p className="text-blue-300 text-2xl font-bold">{stats.terminees}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-8 pb-12">
          {/* 🎯 SECTION OPPORTUNITÉS DISPONIBLES */}
          {demandesDisponibles.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 mb-8 border border-amber-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                    <TrendingUp size={24} className="text-orange-500" />
                    Nouvelles opportunités à {user?.commune || "proximité"}
                  </h2>
                  <p className="text-sm text-amber-600 mt-1">
                    Ces clients cherchent un artisan dans votre zone. Soyez le premier à accepter !
                  </p>
                </div>
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  {demandesDisponibles.length} disponible(s)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demandesDisponibles.map((demande) => (
                  <div
                    key={demande.id}
                    className="bg-white border-2 border-amber-100 rounded-xl p-4 hover:border-orange-300 transition shadow-sm cursor-pointer"
                    onClick={() => navigate(`/demande/${demande.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg uppercase">
                        Nouveau
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(demande.dateRendezVous)}
                      </span>
                    </div>

                    {/* Photo de la panne */}
                    <ProtectedImage
                      src={demande.photoUrl || (demande as any).photo_url || getDemandePhotoUrl(demande.id)}
                      alt="photo dommage"
                      className="w-full h-32 object-cover rounded-lg mb-3 border border-amber-100 cursor-pointer"
                      onClick={(url) => window.open(url, "_blank")}
                    />

                    <p className="font-bold text-gray-800 line-clamp-2 mb-3">{demande.descriptionTravail}</p>
                    <div className="flex flex-col gap-1 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Users size={14} /> {demande.clientName}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {demande.clientCommune}</span>
                      {/* clientNumero toujours présent dans le nouveau DTO */}
                      {demande.clientNumero && (
                        <a
                          href={`tel:${demande.clientNumero}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-green-600 font-medium hover:underline"
                        >
                          <Phone size={14} /> {demande.clientNumero}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAccepter(demande.id, e)}
                      disabled={actionLoading === demande.id}
                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition flex items-center justify-center gap-2"
                    >
                      {actionLoading === demande.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      Accepter cette mission
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Mes missions en cours</h2>
                {user?.commune && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                    <MapPin size={14} />
                    Commune: {user.commune}
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {demandesFiltrees.length} demande(s)
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {["TOUTES", "EN_ATTENTE", "ACCEPTEE", "EN_COURS", "TERMINEE"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    activeFilter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f === "TOUTES" ? "Toutes" : statutConfig[f]?.label || f}
                </button>
              ))}
            </div>

            {demandesFiltrees.length === 0 ? (
              <div className="text-center py-16">
                <ClipboardList size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Aucune demande</p>
                <p className="text-sm text-gray-400 mt-1">
                  Les demandes des clients apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {demandesFiltrees.map((demande) => {
                  const config = statutConfig[demande.statutDemande] || statutConfig.EN_ATTENTE;
                  const Icon = config.icon;
                  const isActionLoading = actionLoading === demande.id;

                  return (
                    <div
                      key={demande.id}
                      className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => navigate(`/demande/${demande.id}`)}
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1`}>
                              <Icon size={12} />
                              {config.label}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(demande.dateRendezVous)}
                            </span>
                          </div>

                          {/* Photo miniature */}
                          <ProtectedImage
                            src={demande.photoUrl || (demande as any).photo_url || getDemandePhotoUrl(demande.id)}
                            alt="photo dommage"
                            className="w-24 h-20 object-cover rounded-lg mb-2 border border-gray-100 shadow-sm cursor-pointer"
                            onClick={(url) => window.open(url, "_blank")}
                          />

                          <p className="font-semibold text-gray-800">{demande.descriptionTravail}</p>
                          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Users size={14} /> Client: {demande.clientName}</span>
                            <span className="flex items-center gap-1"><MapPin size={14} /> {demande.clientCommune}</span>
                            {/* clientNumero toujours présent dans le nouveau DTO */}
                            {demande.clientNumero && (
                              <a
                                href={`tel:${demande.clientNumero}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-green-600 font-medium hover:underline"
                              >
                                <Phone size={14} /> {demande.clientNumero}
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 items-start">
                          {config.actions.includes("accepter") && (
                            <button
                              onClick={(e) => handleAccepter(demande.id, e)}
                              disabled={isActionLoading}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                            >
                              {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                              Accepter
                            </button>
                          )}
                          {config.actions.includes("demarrer") && (
                            <button onClick={(e) => handleDemarrer(demande.id, e)} disabled={isActionLoading} className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition">
                              Démarrer
                            </button>
                          )}
                          {config.actions.includes("terminer") && (
                            <button onClick={(e) => handleTerminer(demande.id, e)} disabled={isActionLoading} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
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