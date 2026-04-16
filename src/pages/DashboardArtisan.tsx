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
} from "lucide-react";
import { getMe } from "../api/auth.api";
import { getDemandesByArtisanId } from "../api/demande.api";
import type { DemandeArtisanResponse } from "../types/demande";

const statutConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
  EN_ATTENTE: { label: "En attente", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
  ACCEPTEE: { label: "Acceptée", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: CheckCircle },
  TERMINEE: { label: "Terminée", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle },
  REFUSEE: { label: "Refusée", bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: XCircle },
};

const DashboardArtisan = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [demandes, setDemandes] = useState<DemandeArtisanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("TOUTES");

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // Récupérer les demandes de l'artisan via la nouvelle API
  useEffect(() => {
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
          console.error("ID artisan non trouvé");
          setLoading(false);
          return;
        }
        
        const data = await getDemandesByArtisanId(artisanId);
        setDemandes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur chargement demandes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const stats = {
    total: demandes.length,
    enAttente: demandes.filter((d) => d.statutDemande === "EN_ATTENTE").length,
    acceptees: demandes.filter((d) => d.statutDemande === "ACCEPTEE").length,
    terminees: demandes.filter((d) => d.statutDemande === "TERMINEE").length,
  };

  const demandesFiltrees =
    activeFilter === "TOUTES"
      ? demandes
      : demandes.filter((d) => d.statutDemande === activeFilter);

  const initiales = user ? `${user.prenom?.charAt(0) || ""}${user.nom?.charAt(0) || ""}` : "?";

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Accueil", path: "/" },
          { label: "Mes demandes", path: "/dashboard-artisan" },
          { label: "Mon profil", path: "/profile-artisan" },
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 pt-10 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  {user?.photoprofil ? (
                    <img src={user.photoprofil} className="w-16 h-16 rounded-2xl object-cover" alt="profil" />
                  ) : (
                    <span className="text-white font-bold text-2xl">{initiales}</span>
                  )}
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Espace Artisan</p>
                  <h1 className="text-white text-2xl font-bold">
                    {user?.prenom} {user?.nom}
                  </h1>
                  <p className="text-blue-200 text-sm flex items-center gap-1 mt-1">
                    <Briefcase size={14} /> {user?.metier?.nom || "Artisan"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/profile-artisan")}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition"
                >
                  <Settings size={16} /> Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-blue-200 text-sm">Total demandes</p>
                <p className="text-white text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-blue-200 text-sm">En attente</p>
                <p className="text-amber-300 text-3xl font-bold">{stats.enAttente}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-blue-200 text-sm">Acceptées</p>
                <p className="text-green-300 text-3xl font-bold">{stats.acceptees}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-blue-200 text-sm">Terminées</p>
                <p className="text-blue-300 text-3xl font-bold">{stats.terminees}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-6xl mx-auto px-4 -mt-8 pb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Demandes reçues</h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {demandesFiltrees.length} demande(s)
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["TOUTES", "EN_ATTENTE", "ACCEPTEE", "TERMINEE", "REFUSEE"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    activeFilter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f === "TOUTES"
                    ? "Toutes"
                    : f === "EN_ATTENTE"
                    ? "En attente"
                    : f === "ACCEPTEE"
                    ? "Acceptées"
                    : f === "TERMINEE"
                    ? "Terminées"
                    : "Refusées"}
                </button>
              ))}
            </div>

            {/* Liste des demandes */}
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : demandesFiltrees.length === 0 ? (
              <div className="text-center py-16">
                <ClipboardList size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Aucune demande reçue</p>
                <p className="text-sm text-gray-400 mt-1">Les clients vous contacteront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {demandesFiltrees.map((demande) => {
                  const config = statutConfig[demande.statutDemande] || statutConfig.EN_ATTENTE;
                  const Icon = config.icon;
                  return (
                    <div
                      key={demande.id}
                      className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => navigate(`/demande/${demande.id}`)}
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
                              <Icon size={12} className="inline mr-1" />
                              {config.label}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(demande.dateRendezVous).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800">{demande.descriptionTravail}</p>
                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {demande.clientName}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {demande.statutDemande === "EN_ATTENTE" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Accepter la demande
                                  console.log("Accepter demande", demande.id);
                                }}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                              >
                                Accepter
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Refuser la demande
                                  console.log("Refuser demande", demande.id);
                                }}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                              >
                                Refuser
                              </button>
                            </>
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