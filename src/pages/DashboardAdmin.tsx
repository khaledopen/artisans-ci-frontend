import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Users, Briefcase, ClipboardList, Loader2, LogOut,
  TrendingUp, CheckCircle, XCircle, Clock, Eye, Trash2,
  Shield, UserCheck, UserX, Search, ChevronLeft, ChevronRight,
  Star, MapPin, Mail, Phone, Calendar, AlertCircle
} from "lucide-react";
import {
  getAdminArtisans,
  getAdminClients,
  getAdminDemandes,
  blockArtisan,
  unblockArtisan,
  verifyArtisan,
  deleteArtisan,
  blockClient,
  unblockClient,
  deleteClient,
  updateDemandeStatut,
  deleteAdminDemande
} from "../api/admin.api";
import type { AdminArtisan, AdminClient, AdminDemande } from "../types/admin";

type TabType = "overview" | "artisans" | "clients" | "demandes";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  
  // États pour les données
  const [artisans, setArtisans] = useState<AdminArtisan[]>([]);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [demandes, setDemandes] = useState<AdminDemande[]>([]);
  
  // États pour la pagination
  const [artisansPage, setArtisansPage] = useState(0);
  const [clientsPage, setClientsPage] = useState(0);
  const [demandesPage, setDemandesPage] = useState(0);
  const [artisansTotal, setArtisansTotal] = useState(0);
  const [clientsTotal, setClientsTotal] = useState(0);
  const [demandesTotal, setDemandesTotal] = useState(0);
  
  // États pour les actions
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);

  // Charger les données
  const fetchData = async () => {
    setLoading(true);
    try {
      const [artisansData, clientsData, demandesData] = await Promise.all([
        getAdminArtisans(artisansPage, 10),
        getAdminClients(clientsPage, 10),
        getAdminDemandes(demandesPage, 10)
      ]);
      
      setArtisans(artisansData.content || []);
      setArtisansTotal(artisansData.totalElements);
      setClients(clientsData.content || []);
      setClientsTotal(clientsData.totalElements);
      setDemandes(demandesData.content || []);
      setDemandesTotal(demandesData.totalElements);
    } catch (err) {
      console.error("Erreur chargement données", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [artisansPage, clientsPage, demandesPage]);

  // Actions Artisans
  const handleBlockArtisan = async (id: number) => {
    setActionLoading(id);
    try {
      await blockArtisan(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockArtisan = async (id: number) => {
    setActionLoading(id);
    try {
      await unblockArtisan(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyArtisan = async (id: number) => {
    setActionLoading(id);
    try {
      await verifyArtisan(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteArtisan = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet artisan ?")) {
      setActionLoading(id);
      try {
        await deleteArtisan(id);
        await fetchData();
      } catch (err) {
        console.error(err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Actions Clients
  const handleBlockClient = async (id: number) => {
    setActionLoading(id);
    try {
      await blockClient(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockClient = async (id: number) => {
    setActionLoading(id);
    try {
      await unblockClient(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      setActionLoading(id);
      try {
        await deleteClient(id);
        await fetchData();
      } catch (err) {
        console.error(err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Actions Demandes
  const handleUpdateStatut = async (id: number, statut: string) => {
    setActionLoading(id);
    try {
      await updateDemandeStatut(id, statut as any);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDemande = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      setActionLoading(id);
      try {
        await deleteAdminDemande(id);
        await fetchData();
      } catch (err) {
        console.error(err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Statistiques (calculées à partir des données chargées)
  const stats = {
    totalArtisans: artisansTotal,
    totalClients: clientsTotal,
    totalDemandes: demandesTotal,
    artisansActifs: artisans.filter(a => !a.blocked).length,
    artisansBloques: artisans.filter(a => a.blocked).length,
    artisansVerifies: artisans.filter(a => a.verified).length,
    demandesEnAttente: demandes.filter(d => d.statutDemande === "EN_ATTENTE").length,
    demandesAcceptees: demandes.filter(d => d.statutDemande === "ACCEPTEE").length,
    demandesTerminees: demandes.filter(d => d.statutDemande === "TERMINEE").length,
  };

  // Filtrage par recherche
  const filteredArtisans = artisans.filter(a =>
    `${a.nom} ${a.prenom} ${a.email} ${a.metier?.nom} ${a.commune}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(c =>
    `${c.nom} ${c.prenom} ${c.email} ${c.commune}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredDemandes = demandes.filter(d =>
    `${d.descriptionTravail} ${d.clientName} ${d.artisanName || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatutBadge = (statut: string) => {
    const config = {
      EN_ATTENTE: "bg-amber-100 text-amber-700",
      ACCEPTEE: "bg-blue-100 text-blue-700",
      TERMINEE: "bg-green-100 text-green-700",
      REFUSEE: "bg-red-100 text-red-700",
    };
    return config[statut as keyof typeof config] || "bg-gray-100 text-gray-700";
  };

  const getStatutLabel = (statut: string) => {
    const labels = {
      EN_ATTENTE: "En attente",
      ACCEPTEE: "Acceptée",
      TERMINEE: "Terminée",
      REFUSEE: "Refusée",
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  if (loading && artisans.length === 0 && clients.length === 0 && demandes.length === 0) {
    return (
      <>
        <Navbar brand="Admin Panel" links={[]} showAuthButtons={false} />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <Loader2 className="animate-spin text-purple-600" size={48} />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar brand="Admin Panel" links={[]} showAuthButtons={false} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 pt-8 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Administration</h1>
                <p className="text-purple-200 mt-1">Gestion complète de la plateforme ArtisanCI</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition"
              >
                <LogOut size={16} /> Déconnexion
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 flex-wrap">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                icon={TrendingUp}
                label="Vue d'ensemble"
              />
              <TabButton
                active={activeTab === "artisans"}
                onClick={() => setActiveTab("artisans")}
                icon={Briefcase}
                label="Artisans"
                count={stats.totalArtisans}
              />
              <TabButton
                active={activeTab === "clients"}
                onClick={() => setActiveTab("clients")}
                icon={Users}
                label="Clients"
                count={stats.totalClients}
              />
              <TabButton
                active={activeTab === "demandes"}
                onClick={() => setActiveTab("demandes")}
                icon={ClipboardList}
                label="Demandes"
                count={stats.totalDemandes}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
          
          {/* ========== VUE D'ENSEMBLE ========== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Artisans"
                  value={stats.totalArtisans}
                  icon={Briefcase}
                  color="purple"
                  subStats={[
                    { label: "Actifs", value: stats.artisansActifs },
                    { label: "Bloqués", value: stats.artisansBloques },
                    { label: "Vérifiés", value: stats.artisansVerifies },
                  ]}
                />
                <StatCard
                  title="Clients"
                  value={stats.totalClients}
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Demandes"
                  value={stats.totalDemandes}
                  icon={ClipboardList}
                  color="green"
                  subStats={[
                    { label: "En attente", value: stats.demandesEnAttente },
                    { label: "Acceptées", value: stats.demandesAcceptees },
                    { label: "Terminées", value: stats.demandesTerminees },
                  ]}
                />
              </div>

              {/* Dernières demandes */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">📋 Dernières demandes</h2>
                  <button
                    onClick={() => setActiveTab("demandes")}
                    className="text-purple-600 text-sm hover:underline"
                  >
                    Voir tout →
                  </button>
                </div>
                <div className="space-y-3">
                  {demandes.slice(0, 5).map((demande) => (
                    <div
                      key={demande.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/admin/demande/${demande.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{demande.descriptionTravail}</p>
                        <p className="text-sm text-gray-500">Client: {demande.clientName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatutBadge(demande.statutDemande)}`}>
                        {getStatutLabel(demande.statutDemande)}
                      </span>
                    </div>
                  ))}
                  {demandes.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Aucune demande</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========== GESTION DES ARTISANS ========== */}
          {activeTab === "artisans" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-800">👨‍🔧 Liste des artisans</h2>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un artisan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 outline-none w-full md:w-64"
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artisan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Métier</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vérifié</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredArtisans.map((artisan) => (
                      <tr key={artisan.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              {artisan.photoprofil ? (
                                <img src={artisan.photoprofil} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <span className="text-purple-600 font-bold">
                                  {artisan.prenom?.charAt(0)}{artisan.nom?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{artisan.prenom} {artisan.nom}</p>
                              <p className="text-xs text-gray-500">{artisan.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{artisan.metier?.nom}</td>
                        <td className="px-4 py-3">{artisan.commune}, {artisan.localisation}</td>
                        <td className="px-4 py-3">
                          {artisan.blocked ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Bloqué</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Actif</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {artisan.verified ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">✓ Vérifié</span>
                          ) : (
                            <button
                              onClick={() => handleVerifyArtisan(artisan.id)}
                              disabled={actionLoading === artisan.id}
                              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs hover:bg-yellow-200"
                            >
                              À vérifier
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/artisan/${artisan.id}`)}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                              title="Voir"
                            >
                              <Eye size={16} />
                            </button>
                            {artisan.blocked ? (
                              <button
                                onClick={() => handleUnblockArtisan(artisan.id)}
                                disabled={actionLoading === artisan.id}
                                className="p-1 text-green-500 hover:bg-green-50 rounded"
                                title="Débloquer"
                              >
                                <UserCheck size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlockArtisan(artisan.id)}
                                disabled={actionLoading === artisan.id}
                                className="p-1 text-orange-500 hover:bg-orange-50 rounded"
                                title="Bloquer"
                              >
                                <UserX size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteArtisan(artisan.id)}
                              disabled={actionLoading === artisan.id}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {artisansTotal > 10 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total: {artisansTotal} artisans</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setArtisansPage(Math.max(0, artisansPage - 1))}
                      disabled={artisansPage === 0}
                      className="p-2 rounded-lg border disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-3 py-1">Page {artisansPage + 1}</span>
                    <button
                      onClick={() => setArtisansPage(artisansPage + 1)}
                      disabled={artisans.length < 10}
                      className="p-2 rounded-lg border disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== GESTION DES CLIENTS ========== */}
          {activeTab === "clients" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-800">👥 Liste des clients</h2>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 outline-none w-full md:w-64"
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commune</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscrit le</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              {client.photoprofil ? (
                                <img src={client.photoprofil} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <span className="text-blue-600 font-bold">
                                  {client.prenom?.charAt(0)}{client.nom?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{client.prenom} {client.nom}</p>
                              <p className="text-xs text-gray-500">{client.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{client.localisation}</td>
                        <td className="px-4 py-3">{client.commune}</td>
                        <td className="px-4 py-3">
                          {client.blocked ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Bloqué</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Actif</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">{new Date(client.createdAt).toLocaleDateString("fr-FR")}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/client/${client.id}`)}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                              title="Voir"
                            >
                              <Eye size={16} />
                            </button>
                            {client.blocked ? (
                              <button
                                onClick={() => handleUnblockClient(client.id)}
                                disabled={actionLoading === client.id}
                                className="p-1 text-green-500 hover:bg-green-50 rounded"
                                title="Débloquer"
                              >
                                <UserCheck size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlockClient(client.id)}
                                disabled={actionLoading === client.id}
                                className="p-1 text-orange-500 hover:bg-orange-50 rounded"
                                title="Bloquer"
                              >
                                <UserX size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              disabled={actionLoading === client.id}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {clientsTotal > 10 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total: {clientsTotal} clients</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setClientsPage(Math.max(0, clientsPage - 1))}
                      disabled={clientsPage === 0}
                      className="p-2 rounded-lg border disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-3 py-1">Page {clientsPage + 1}</span>
                    <button
                      onClick={() => setClientsPage(clientsPage + 1)}
                      disabled={clients.length < 10}
                      className="p-2 rounded-lg border disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== GESTION DES DEMANDES ========== */}
          {activeTab === "demandes" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-800">📝 Liste des demandes</h2>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une demande..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 outline-none w-full md:w-64"
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artisan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDemandes.map((demande) => (
                      <tr key={demande.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">#{demande.id}</td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate">{demande.descriptionTravail}</td>
                        <td className="px-4 py-3 text-sm">{demande.clientName}</td>
                        <td className="px-4 py-3 text-sm">{demande.artisanName || "Non assigné"}</td>
                        <td className="px-4 py-3">
                          <select
                            value={demande.statutDemande}
                            onChange={(e) => handleUpdateStatut(demande.id, e.target.value)}
                            disabled={actionLoading === demande.id}
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatutBadge(demande.statutDemande)}`}
                          >
                            <option value="EN_ATTENTE">En attente</option>
                            <option value="ACCEPTEE">Acceptée</option>
                            <option value="TERMINEE">Terminée</option>
                            <option value="REFUSEE">Refusée</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm">{new Date(demande.createdAt).toLocaleDateString("fr-FR")}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/demande/${demande.id}`)}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                              title="Voir"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteDemande(demande.id)}
                              disabled={actionLoading === demande.id}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {demandesTotal > 10 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total: {demandesTotal} demandes</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDemandesPage(Math.max(0, demandesPage - 1))}
                      disabled={demandesPage === 0}
                      className="p-2 rounded-lg border disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-3 py-1">Page {demandesPage + 1}</span>
                    <button
                      onClick={() => setDemandesPage(demandesPage + 1)}
                      disabled={demandes.length < 10}
                      className="p-2 rounded-lg border disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

// Composants auxiliaires
const TabButton = ({ active, onClick, icon: Icon, label, count }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
      active 
        ? "bg-white text-purple-700 shadow-md" 
        : "bg-white/10 text-white hover:bg-white/20"
    }`}
  >
    <Icon size={18} />
    {label}
    {count !== undefined && (
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        active ? "bg-purple-100 text-purple-700" : "bg-white/20 text-white"
      }`}>
        {count}
      </span>
    )}
  </button>
);

const StatCard = ({ title, value, icon: Icon, color, subStats }: any) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-100`}>
        <Icon size={24} className={`text-${color}-600`} />
      </div>
      <span className="text-3xl font-bold text-gray-800">{value}</span>
    </div>
    <h3 className="text-gray-600 font-medium">{title}</h3>
    {subStats && (
      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-sm">
        {subStats.map((stat: any, index: number) => (
          <div key={index}>
            <p className="text-gray-400">{stat.label}</p>
            <p className="font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default DashboardAdmin;