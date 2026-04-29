// src/pages/DashboardAdmin.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Users, Briefcase, ClipboardList, Loader2, LogOut,
  TrendingUp, Eye, Trash2, UserCheck, UserX, Search,
  ChevronLeft, ChevronRight
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
  
  const [artisans, setArtisans] = useState<AdminArtisan[]>([]);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [demandes, setDemandes] = useState<AdminDemande[]>([]);
  
  const [artisansPage, setArtisansPage] = useState(0);
  const [clientsPage, setClientsPage] = useState(0);
  const [demandesPage, setDemandesPage] = useState(0);
  const [artisansTotal, setArtisansTotal] = useState(0);
  const [clientsTotal, setClientsTotal] = useState(0);
  const [demandesTotal, setDemandesTotal] = useState(0);
  
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artisansData, clientsData, demandesData] = await Promise.all([
        getAdminArtisans(artisansPage, 10),
        getAdminClients(clientsPage, 10),
        getAdminDemandes(demandesPage, 10)
      ]);
      
      console.log("📋 Artisans reçus:", artisansData?.content?.length);
      console.log("📋 Clients reçus:", clientsData?.content?.length);
      console.log("📋 Demandes reçues:", demandesData?.length);
      
      const demandesList = Array.isArray(demandesData) ? demandesData : (demandesData?.content || []);
      
      setArtisans(artisansData?.content || []);
      setArtisansTotal(artisansData?.totalElements || 0);
      setClients(clientsData?.content || []);
      setClientsTotal(clientsData?.totalElements || 0);
      setDemandes(demandesList);
      setDemandesTotal(demandesList.length);
      
      console.log("✅ Demandes chargées:", demandesList.length);
      
    } catch (err) {
      console.error("Erreur chargement données", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [artisansPage, clientsPage, demandesPage]);

  // ========== ACTIONS ARTISANS ==========
  const handleBlockArtisan = async (id: number) => {
    setActionLoading(id);
    try {
      await blockArtisan(id);
      await fetchData();
      alert("Artisan bloqué avec succès");
    } catch (err) {
      console.error(err);
      alert("Erreur lors du blocage");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockArtisan = async (id: number) => {
    setActionLoading(id);
    try {
      await unblockArtisan(id);
      await fetchData();
      alert("Artisan débloqué avec succès");
    } catch (err) {
      console.error(err);
      alert("Erreur lors du déblocage");
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyArtisan = async (id: number) => {
    setActionLoading(id);
    try {
      await verifyArtisan(id);
      await fetchData();
      alert("Artisan vérifié avec succès");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la vérification");
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
        alert("Artisan supprimé avec succès");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression");
      } finally {
        setActionLoading(null);
      }
    }
  };

  // ========== ACTIONS CLIENTS ==========
  const handleBlockClient = async (id: number) => {
    setActionLoading(id);
    try {
      await blockClient(id);
      await fetchData();
      alert("Client bloqué avec succès");
    } catch (err) {
      console.error(err);
      alert("Erreur lors du blocage");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockClient = async (id: number) => {
    setActionLoading(id);
    try {
      await unblockClient(id);
      await fetchData();
      alert("Client débloqué avec succès");
    } catch (err) {
      console.error(err);
      alert("Erreur lors du déblocage");
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
        alert("Client supprimé avec succès");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression");
      } finally {
        setActionLoading(null);
      }
    }
  };

  // ========== ACTIONS DEMANDES ==========
  const handleUpdateStatut = async (id: number, statut: string) => {
    setActionLoading(id);
    try {
      await updateDemandeStatut(id, statut as any);
      await fetchData();
      alert(`Statut modifié en ${statut}`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
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
        alert("Demande supprimée avec succès");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ========== STATISTIQUES ==========
  const stats = {
    totalArtisans: artisansTotal,
    totalClients: clientsTotal,
    totalDemandes: demandesTotal,
    artisansActifs: artisans.filter(a => !a.blocked).length,
    artisansBloques: artisans.filter(a => a.blocked).length,
    artisansVerifies: artisans.filter(a => a.verified).length,
    demandesEnAttente: demandes.filter(d => d.statutDemande === "EN_ATTENTE").length,
    demandesAcceptees: demandes.filter(d => d.statutDemande === "ACCEPTEE").length,
    demandesEnCours: demandes.filter(d => d.statutDemande === "EN_COURS").length,
    demandesTerminees: demandes.filter(d => d.statutDemande === "TERMINEE").length,
    demandesRefusees: demandes.filter(d => d.statutDemande === "REFUSEE").length,
  };

  // ========== FILTRAGE ==========
  const filteredArtisans = artisans.filter(a =>
    `${a.nom} ${a.prenom} ${a.email} ${a.metier?.nom || ""} ${a.commune || ""} ${a.localisation || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(c =>
    `${c.nom} ${c.prenom} ${c.email} ${c.commune || ""} ${c.localisation || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredDemandes = demandes.filter(d =>
    `${d.descriptionTravail} ${d.clientName || ''} ${d.artisanName || ''} ${d.clientCommune || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ========== UTILITAIRES ==========
  const getStatutBadge = (statut: string) => {
    const config: Record<string, string> = {
      EN_ATTENTE: "bg-amber-100 text-amber-700",
      ACCEPTEE: "bg-blue-100 text-blue-700",
      EN_COURS: "bg-purple-100 text-purple-700",
      TERMINEE: "bg-green-100 text-green-700",
      REFUSEE: "bg-red-100 text-red-700",
    };
    return config[statut] || "bg-gray-100 text-gray-700";
  };

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      EN_ATTENTE: "En attente",
      ACCEPTEE: "Acceptée",
      EN_COURS: "En cours",
      TERMINEE: "Terminée",
      REFUSEE: "Refusée",
    };
    return labels[statut] || statut;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date inconnue";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR");
    } catch {
      return dateStr;
    }
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
        {/* HEADER */}
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

            {/* TABS */}
            <div className="flex gap-2 flex-wrap">
              <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={TrendingUp} label="Vue d'ensemble" />
              <TabButton active={activeTab === "artisans"} onClick={() => setActiveTab("artisans")} icon={Briefcase} label="Artisans" count={stats.totalArtisans} />
              <TabButton active={activeTab === "clients"} onClick={() => setActiveTab("clients")} icon={Users} label="Clients" count={stats.totalClients} />
              <TabButton active={activeTab === "demandes"} onClick={() => setActiveTab("demandes")} icon={ClipboardList} label="Demandes" count={stats.totalDemandes} />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
          
          {/* ==================== VUE D'ENSEMBLE ==================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Carte Artisans */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-100">
                      <Briefcase size={24} className="text-purple-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{stats.totalArtisans}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium">Artisans</h3>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-sm">
                    <div><p className="text-gray-400">Actifs</p><p className="font-semibold">{stats.artisansActifs}</p></div>
                    <div><p className="text-gray-400">Bloqués</p><p className="font-semibold">{stats.artisansBloques}</p></div>
                    <div><p className="text-gray-400">Vérifiés</p><p className="font-semibold">{stats.artisansVerifies}</p></div>
                  </div>
                </div>

                {/* Carte Clients */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-100">
                      <Users size={24} className="text-blue-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{stats.totalClients}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium">Clients</h3>
                </div>

                {/* Carte Demandes */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-green-100">
                      <ClipboardList size={24} className="text-green-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{stats.totalDemandes}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium">Demandes</h3>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-sm">
                    <div><p className="text-gray-400">En attente</p><p className="font-semibold">{stats.demandesEnAttente}</p></div>
                    <div><p className="text-gray-400">Acceptées</p><p className="font-semibold">{stats.demandesAcceptees}</p></div>
                    <div><p className="text-gray-400">Terminées</p><p className="font-semibold">{stats.demandesTerminees}</p></div>
                  </div>
                </div>
              </div>

              {/* Dernières demandes */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">📋 Dernières demandes</h2>
                  <button onClick={() => setActiveTab("demandes")} className="text-purple-600 text-sm hover:underline">
                    Voir tout →
                  </button>
                </div>
                <div className="space-y-3">
                  {demandes.slice(0, 5).map((demande) => (
                    <div key={demande.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/admin/demande/${demande.id}`)}>
                      <div className="flex-1">
                        <p className="font-medium">{demande.descriptionTravail}</p>
                        <p className="text-sm text-gray-500">Client: {demande.clientName || "Inconnu"}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatutBadge(demande.statutDemande)}`}>
                        {getStatutLabel(demande.statutDemande)}
                      </span>
                    </div>
                  ))}
                  {demandes.length === 0 && <p className="text-center text-gray-500 py-8">Aucune demande</p>}
                </div>
              </div>
            </div>
          )}

          {/* ==================== GESTION DES ARTISANS ==================== */}
          {activeTab === "artisans" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-800">👨‍🔧 Liste des artisans</h2>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Rechercher un artisan..." value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 outline-none w-full md:w-64" />
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
                                <span className="text-purple-600 font-bold">{artisan.prenom?.charAt(0)}{artisan.nom?.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{artisan.prenom} {artisan.nom}</p>
                              <p className="text-xs text-gray-500">{artisan.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {artisan.metier?.nom || "Non défini"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {artisan.commune && artisan.localisation 
                            ? `${artisan.commune}, ${artisan.localisation}`
                            : artisan.commune || artisan.localisation || "Non défini"}
                        </td>
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
                            <button onClick={() => handleVerifyArtisan(artisan.id)} disabled={actionLoading === artisan.id}
                              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs hover:bg-yellow-200">
                              À vérifier
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => navigate(`/admin/artisan/${artisan.id}`)} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Voir">
                              <Eye size={16} />
                            </button>
                            {artisan.blocked ? (
                              <button onClick={() => handleUnblockArtisan(artisan.id)} disabled={actionLoading === artisan.id}
                                className="p-1 text-green-500 hover:bg-green-50 rounded" title="Débloquer">
                                <UserCheck size={16} />
                              </button>
                            ) : (
                              <button onClick={() => handleBlockArtisan(artisan.id)} disabled={actionLoading === artisan.id}
                                className="p-1 text-orange-500 hover:bg-orange-50 rounded" title="Bloquer">
                                <UserX size={16} />
                              </button>
                            )}
                            <button onClick={() => handleDeleteArtisan(artisan.id)} disabled={actionLoading === artisan.id}
                              className="p-1 text-red-500 hover:bg-red-50 rounded" title="Supprimer">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {artisansTotal > 10 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total: {artisansTotal} artisans</p>
                  <div className="flex gap-2">
                    <button onClick={() => setArtisansPage(Math.max(0, artisansPage - 1))} disabled={artisansPage === 0}
                      className="p-2 rounded-lg border disabled:opacity-50"><ChevronLeft size={16} /></button>
                    <span className="px-3 py-1">Page {artisansPage + 1}</span>
                    <button onClick={() => setArtisansPage(artisansPage + 1)} disabled={artisans.length < 10}
                      className="p-2 rounded-lg border disabled:opacity-50"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== GESTION DES CLIENTS ==================== */}
          {activeTab === "clients" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-800">👥 Liste des clients</h2>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Rechercher un client..." value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 outline-none w-full md:w-64" />
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
                                <span className="text-blue-600 font-bold">{client.prenom?.charAt(0)}{client.nom?.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{client.prenom} {client.nom}</p>
                              <p className="text-xs text-gray-500">{client.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{client.localisation || "Non défini"}</td>
                        <td className="px-4 py-3">{client.commune || "Non défini"}</td>
                        <td className="px-4 py-3">
                          {client.blocked ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Bloqué</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Actif</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">{formatDate(client.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => navigate(`/admin/client/${client.id}`)} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Voir">
                              <Eye size={16} />
                            </button>
                            {client.blocked ? (
                              <button onClick={() => handleUnblockClient(client.id)} disabled={actionLoading === client.id}
                                className="p-1 text-green-500 hover:bg-green-50 rounded" title="Débloquer">
                                <UserCheck size={16} />
                              </button>
                            ) : (
                              <button onClick={() => handleBlockClient(client.id)} disabled={actionLoading === client.id}
                                className="p-1 text-orange-500 hover:bg-orange-50 rounded" title="Bloquer">
                                <UserX size={16} />
                              </button>
                            )}
                            <button onClick={() => handleDeleteClient(client.id)} disabled={actionLoading === client.id}
                              className="p-1 text-red-500 hover:bg-red-50 rounded" title="Supprimer">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {clientsTotal > 10 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total: {clientsTotal} clients</p>
                  <div className="flex gap-2">
                    <button onClick={() => setClientsPage(Math.max(0, clientsPage - 1))} disabled={clientsPage === 0}
                      className="p-2 rounded-lg border disabled:opacity-50"><ChevronLeft size={16} /></button>
                    <span className="px-3 py-1">Page {clientsPage + 1}</span>
                    <button onClick={() => setClientsPage(clientsPage + 1)} disabled={clients.length < 10}
                      className="p-2 rounded-lg border disabled:opacity-50"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== GESTION DES DEMANDES ==================== */}
          {activeTab === "demandes" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-800">📝 Liste des demandes</h2>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Rechercher une demande..." value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 outline-none w-full md:w-64" />
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commune</th>
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
                        <td className="px-4 py-3 text-sm">{demande.clientName || "Inconnu"}</td>
                        <td className="px-4 py-3 text-sm">{demande.clientCommune || "-"}</td>
                        <td className="px-4 py-3 text-sm">{demande.artisanName || "Non assigné"}</td>
                        <td className="px-4 py-3">
                          <select
                            value={demande.statutDemande}
                            onChange={(e) => handleUpdateStatut(demande.id, e.target.value)}
                            disabled={actionLoading === demande.id}
                            className={`px-2 py-1 rounded-lg text-xs border ${getStatutBadge(demande.statutDemande)}`}
                          >
                            <option value="EN_ATTENTE">En attente</option>
                            <option value="ACCEPTEE">Acceptée</option>
                            <option value="EN_COURS">En cours</option>
                            <option value="TERMINEE">Terminée</option>
                            <option value="REFUSEE">Refusée</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm">{formatDate(demande.createdAt || demande.dateRendezVous)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => navigate(`/admin/demande/${demande.id}`)} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Voir">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleDeleteDemande(demande.id)} disabled={actionLoading === demande.id}
                              className="p-1 text-red-500 hover:bg-red-50 rounded" title="Supprimer">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {demandesTotal > 10 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total: {demandesTotal} demandes</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDemandesPage(Math.max(0, demandesPage - 1))} disabled={demandesPage === 0}
                      className="p-2 rounded-lg border disabled:opacity-50"><ChevronLeft size={16} /></button>
                    <span className="px-3 py-1">Page {demandesPage + 1}</span>
                    <button onClick={() => setDemandesPage(demandesPage + 1)} disabled={demandes.length < 10}
                      className="p-2 rounded-lg border disabled:opacity-50"><ChevronRight size={16} /></button>
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

// ==================== COMPOSANTS AUXILIAIRES ====================

const TabButton = ({ active, onClick, icon: Icon, label, count }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
    active ? "bg-white text-purple-700 shadow-md" : "bg-white/10 text-white hover:bg-white/20"
  }`}>
    <Icon size={18} />
    {label}
    {count !== undefined && <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-purple-100 text-purple-700" : "bg-white/20 text-white"}`}>{count}</span>}
  </button>
);

export default DashboardAdmin;