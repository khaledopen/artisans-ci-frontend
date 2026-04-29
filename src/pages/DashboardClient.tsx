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
  Search,
  ChevronRight,
  Loader2,
  LogOut,
  Wrench,
  Star,
  User,
} from "lucide-react";
import { getMe } from "../api/auth.api";
import { getDemandesByClientId } from "../api/demande.api";
import type { DemandeClientResponse } from "../types/demande";

const statutConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
  EN_ATTENTE: { label: "En attente", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
  ACCEPTEE: { label: "Acceptée", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: CheckCircle },
  TERMINEE: { label: "Terminée", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle },
  REFUSEE: { label: "Refusée", bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: XCircle },
};

const DashboardClient = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [demandes, setDemandes] = useState<DemandeClientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("TOUTES");

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        // Récupérer la commune depuis localStorage si absente
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!data.commune && storedUser.commune) {
          data.commune = storedUser.commune;
        }
        setUser(data);
        console.log("👤 Client connecté:", data);
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // Récupérer les demandes du client
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }
        
        const userData = JSON.parse(storedUser);
        const clientId = userData.id;
        
        if (!clientId) {
          console.error("ID client non trouvé");
          setLoading(false);
          return;
        }
        
        const data = await getDemandesByClientId(clientId);
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

  // Afficher la localisation complète (commune + ville)
  const getLocalisation = () => {
    if (user?.commune && user?.localisation) {
      return `${user.commune}, ${user.localisation}`;
    }
    if (user?.commune) {
      return user.commune;
    }
    if (user?.localisation) {
      return user.localisation;
    }
    return "Abidjan";
  };

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Accueil", path: "/" },
          { label: "Trouver un artisan", path: "/artisans" },
          { label: "Mes demandes", path: "/dashboard-client" },
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
                  <p className="text-blue-200 text-sm">Tableau de bord</p>
                  <h1 className="text-white text-2xl font-bold">
                    {user?.prenom} {user?.nom}
                  </h1>
                  <p className="text-blue-200 text-sm flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {getLocalisation()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition"
              >
                <LogOut size={16} /> Déconnexion
              </button>
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
              <h2 className="text-xl font-bold text-gray-800">Mes demandes de service</h2>
              <button
                onClick={() => navigate("/creer-demande")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                <Search size={16} /> Nouvelle demande
              </button>
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
                <p className="text-gray-500">Aucune demande trouvée</p>
                <button
                  onClick={() => navigate("/creer-demande")}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Créer ma première demande →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {demandesFiltrees.map((demande) => {
                  const config = statutConfig[demande.statutDemande] || statutConfig.EN_ATTENTE;
                  const Icon = config.icon;
                  const peutCommenter = demande.statutDemande === "TERMINEE" && !demande.commentaireId;
                  
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
                            {demande.commentaireId && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Star size={10} /> Avis laissé
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-gray-800">{demande.descriptionTravail}</p>
                          {demande.artisanName && (
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                              <Wrench size={14} />
                              Artisan: {demande.artisanName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {peutCommenter && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/laisser-avis/${demande.id}`, { 
                                  state: { artisanId: demande.artisanId, artisanName: demande.artisanName }
                                });
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition"
                            >
                              <Star size={14} /> Laisser un avis
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

export default DashboardClient;