// src/pages/DashboardAdmin.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Users, Briefcase, ClipboardList, Loader2, LogOut,
  TrendingUp, Eye, Trash2, UserCheck, UserX, Search,
  ChevronLeft, ChevronRight, Home, PieChart, Bell, Menu, X,
  ShieldCheck, AlertCircle, CheckCircle2, Clock
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
      
      const demandesList = Array.isArray(demandesData) ? demandesData : (demandesData?.content || []);
      
      setArtisans(artisansData?.content || []);
      setArtisansTotal(artisansData?.totalElements || 0);
      setClients(clientsData?.content || []);
      setClientsTotal(clientsData?.totalElements || 0);
      setDemandes(demandesList);
      setDemandesTotal(demandesList.length);
      
    } catch (err) {
      console.error("Erreur chargement données", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [artisansPage, clientsPage, demandesPage]);

  // ========== ACTIONS (Conservées telles quelles) ==========
  const handleBlockArtisan = async (id: number) => {
    setActionLoading(id);
    try {
      await blockArtisan(id);
      await fetchData();
    } catch (err) { console.error(err); } finally { setActionLoading(null); }
  };

  const handleUnblockArtisan = async (id: number) => {
    setActionLoading(id);
    try {
      await unblockArtisan(id);
      await fetchData();
    } catch (err) { console.error(err); } finally { setActionLoading(null); }
  };

  const handleVerifyArtisan = async (id: number) => {
    setActionLoading(id);
    try {
      await verifyArtisan(id);
      await fetchData();
    } catch (err) { console.error(err); } finally { setActionLoading(null); }
  };

  const handleDeleteArtisan = async (id: number) => {
    if (confirm("Supprimer cet artisan ?")) {
      setActionLoading(id);
      try {
        await deleteArtisan(id);
        await fetchData();
      } catch (err) { console.error(err); } finally { setActionLoading(null); }
    }
  };

  const handleBlockClient = async (id: number) => {
    setActionLoading(id);
    try {
      await blockClient(id);
      await fetchData();
    } catch (err) { console.error(err); } finally { setActionLoading(null); }
  };

  const handleUnblockClient = async (id: number) => {
    setActionLoading(id);
    try {
      await unblockClient(id);
      await fetchData();
    } catch (err) { console.error(err); } finally { setActionLoading(null); }
  };

  const handleDeleteClient = async (id: number) => {
    if (confirm("Supprimer ce client ?")) {
      setActionLoading(id);
      try {
        await deleteClient(id);
        await fetchData();
      } catch (err) { console.error(err); } finally { setActionLoading(null); }
    }
  };

  const handleUpdateStatut = async (id: number, statut: string) => {
    setActionLoading(id);
    try {
      await updateDemandeStatut(id, statut as any);
      await fetchData();
    } catch (err) { console.error(err); } finally { setActionLoading(null); }
  };

  const handleDeleteDemande = async (id: number) => {
    if (confirm("Supprimer cette demande ?")) {
      setActionLoading(id);
      try {
        await deleteAdminDemande(id);
        await fetchData();
      } catch (err) { console.error(err); } finally { setActionLoading(null); }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ========== CALCULS STATS ==========
  const stats = {
    totalArtisans: artisansTotal,
    totalClients: clientsTotal,
    totalDemandes: demandesTotal,
    artisansActifs: artisans.filter(a => !a.blocked).length,
    artisansVerifies: artisans.filter(a => a.verified).length,
    demandesEnAttente: demandes.filter(d => d.statutDemande === "EN_ATTENTE").length,
    demandesEnCours: demandes.filter(d => d.statutDemande === "EN_COURS").length,
    demandesTerminees: demandes.filter(d => d.statutDemande === "TERMINEE").length,
  };

  const filteredArtisans = artisans.filter(a =>
    `${a.nom} ${a.prenom} ${a.email} ${a.metier?.nom || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(c =>
    `${c.nom} ${c.prenom} ${c.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDemandes = demandes.filter(d =>
    `${d.descriptionTravail} ${d.clientName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutBadge = (statut: string) => {
    const config: Record<string, string> = {
      EN_ATTENTE: "bg-amber-50 text-amber-600 border-amber-100",
      ACCEPTEE: "bg-blue-50 text-blue-600 border-blue-100",
      EN_COURS: "bg-purple-50 text-purple-600 border-purple-100",
      TERMINEE: "bg-green-50 text-green-600 border-green-100",
      REFUSEE: "bg-red-50 text-red-600 border-red-100",
    };
    return config[statut] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  if (loading && artisans.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          {sidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ArtisanCI Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          <SidebarItem active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={Home} label="Vue d'ensemble" collapsed={!sidebarOpen} />
          <SidebarItem active={activeTab === "artisans"} onClick={() => setActiveTab("artisans")} icon={Briefcase} label="Artisans" collapsed={!sidebarOpen} count={stats.totalArtisans} />
          <SidebarItem active={activeTab === "clients"} onClick={() => setActiveTab("clients")} icon={Users} label="Clients" collapsed={!sidebarOpen} count={stats.totalClients} />
          <SidebarItem active={activeTab === "demandes"} onClick={() => setActiveTab("demandes")} icon={ClipboardList} label="Demandes" collapsed={!sidebarOpen} count={stats.totalDemandes} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* TOPBAR */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab.replace("_", " ")}</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Recherche globale..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl outline-none text-sm w-64 transition-all"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">Super Contrôle</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">A</div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* ==================== VUE D'ENSEMBLE ==================== */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Artisans" value={stats.totalArtisans} icon={Briefcase} color="indigo" trend="+12%" />
                <StatCard title="Total Clients" value={stats.totalClients} icon={Users} color="blue" trend="+5%" />
                <StatCard title="Demandes Totales" value={stats.totalDemandes} icon={ClipboardList} color="purple" trend="+8%" />
                <StatCard title="Revenu Estimé" value="2.4M FCFA" icon={PieChart} color="emerald" trend="+15%" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECENT ACTIVITY */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">📋 Demandes Récentes</h3>
                    <button onClick={() => setActiveTab("demandes")} className="text-indigo-600 text-sm font-semibold hover:underline">Voir tout</button>
                  </div>
                  <div className="space-y-4">
                    {demandes.slice(0, 5).map((demande) => (
                      <div key={demande.id} className="group flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                        onClick={() => navigate(`/admin/demande/${demande.id}`)}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatutBadge(demande.statutDemande)} bg-opacity-20`}>
                          <Clock size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 truncate">{demande.descriptionTravail}</p>
                          <p className="text-xs text-gray-500 italic">Par {demande.clientName || "Inconnu"}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatutBadge(demande.statutDemande)}`}>
                          {demande.statutDemande}
                        </span>
                      </div>
                    ))}
                    {demandes.length === 0 && <p className="text-center text-gray-400 py-12">Aucune donnée disponible</p>}
                  </div>
                </div>

                {/* DISTRIBUTION / QUICK STATS */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">📊 Répartition</h3>
                  <div className="space-y-6 flex-1">
                    <ProgressStat label="Demandes Terminées" value={stats.demandesTerminees} total={stats.totalDemandes} color="bg-emerald-500" />
                    <ProgressStat label="En Cours" value={stats.demandesEnCours} total={stats.totalDemandes} color="bg-indigo-500" />
                    <ProgressStat label="En Attente" value={stats.demandesEnAttente} total={stats.totalDemandes} color="bg-amber-500" />
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl">
                      <ShieldCheck className="text-indigo-600" size={24} />
                      <div>
                        <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider">Sécurité</p>
                        <p className="text-sm text-indigo-900">{stats.artisansVerifies} Artisans vérifiés</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VUES LISTES (Améliorées) ==================== */}
          {activeTab !== "overview" && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    {activeTab === "artisans" ? <Briefcase size={20} /> : activeTab === "clients" ? <Users size={20} /> : <ClipboardList size={20} />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Liste des {activeTab}</h2>
                </div>
                <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder={`Filtrer les ${activeTab}...`} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-400 rounded-xl outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                {activeTab === "artisans" && (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Artisan</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Métier</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Localisation</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredArtisans.map(artisan => (
                        <tr key={artisan.id} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                                {artisan.photoprofil ? <img src={artisan.photoprofil} className="w-full h-full object-cover" /> : <span className="text-indigo-600 font-bold">{artisan.nom.charAt(0)}</span>}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">{artisan.prenom} {artisan.nom}</p>
                                <p className="text-xs text-gray-500">{artisan.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold">{artisan.metier?.nom}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{artisan.commune}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {artisan.verified && <CheckCircle2 className="text-emerald-500" size={16} />}
                              {artisan.blocked ? <span className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={12} /> Bloqué</span> : <span className="text-emerald-600 text-xs font-bold">Actif</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <ActionBtn onClick={() => navigate(`/admin/artisan/${artisan.id}`)} icon={Eye} color="indigo" />
                              {!artisan.verified && <ActionBtn onClick={() => handleVerifyArtisan(artisan.id)} icon={ShieldCheck} color="emerald" />}
                              <ActionBtn onClick={() => artisan.blocked ? handleUnblockArtisan(artisan.id) : handleBlockArtisan(artisan.id)} icon={artisan.blocked ? UserCheck : UserX} color={artisan.blocked ? "emerald" : "orange"} />
                              <ActionBtn onClick={() => handleDeleteArtisan(artisan.id)} icon={Trash2} color="red" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === "clients" && (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Commune</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredClients.map(client => (
                        <tr key={client.id} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden text-blue-600 font-bold">
                                {client.photoprofil ? <img src={client.photoprofil} className="w-full h-full object-cover" /> : client.nom.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">{client.prenom} {client.nom}</p>
                                <p className="text-xs text-gray-500">{client.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{client.commune}</td>
                          <td className="px-6 py-4">
                            {client.blocked ? <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">Bloqué</span> : <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Actif</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <ActionBtn onClick={() => navigate(`/admin/client/${client.id}`)} icon={Eye} color="indigo" />
                              <ActionBtn onClick={() => client.blocked ? handleUnblockClient(client.id) : handleBlockClient(client.id)} icon={client.blocked ? UserCheck : UserX} color={client.blocked ? "emerald" : "orange"} />
                              <ActionBtn onClick={() => handleDeleteClient(client.id)} icon={Trash2} color="red" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === "demandes" && (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Demande</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Artisan</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredDemandes.map(demande => (
                        <tr key={demande.id} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {demande.photoUrl ? <img src={demande.photoUrl} className="w-12 h-10 object-cover rounded-lg" /> : <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300"><ClipboardList size={16} /></div>}
                              <div className="max-w-[200px]">
                                <p className="font-bold text-gray-800 text-sm truncate">{demande.descriptionTravail}</p>
                                <p className="text-xs text-gray-400">ID #{demande.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-700">{demande.clientName}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{demande.artisanName || "Non assigné"}</td>
                          <td className="px-6 py-4">
                            <select
                              value={demande.statutDemande}
                              onChange={(e) => handleUpdateStatut(demande.id, e.target.value)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold border outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${getStatutBadge(demande.statutDemande)}`}
                            >
                              {["EN_ATTENTE", "ACCEPTEE", "EN_COURS", "TERMINEE", "REFUSEE"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <ActionBtn onClick={() => navigate(`/admin/demande/${demande.id}`)} icon={Eye} color="indigo" />
                              <ActionBtn onClick={() => handleDeleteDemande(demande.id)} icon={Trash2} color="red" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
                <span>Total: {activeTab === "artisans" ? artisansTotal : activeTab === "clients" ? clientsTotal : demandesTotal} entrées</span>
                <div className="flex gap-2">
                  <button onClick={() => activeTab === "artisans" ? setArtisansPage(p => Math.max(0, p-1)) : activeTab === "clients" ? setClientsPage(p => Math.max(0, p-1)) : setDemandesPage(p => Math.max(0, p-1))} className="p-2 hover:bg-white rounded-lg transition shadow-sm"><ChevronLeft size={16} /></button>
                  <button onClick={() => activeTab === "artisans" ? setArtisansPage(p => p+1) : activeTab === "clients" ? setClientsPage(p => p+1) : setDemandesPage(p => p+1)} className="p-2 hover:bg-white rounded-lg transition shadow-sm"><ChevronRight size={16} /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ==================== COMPOSANTS UI MODERNES ====================

const SidebarItem = ({ active, onClick, icon: Icon, label, collapsed, count }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full p-3.5 rounded-2xl transition-all duration-200 group ${
    active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-400 hover:text-white hover:bg-slate-800"
  }`}>
    <Icon size={22} className={active ? "scale-110 transition-transform" : "group-hover:scale-110 transition-transform"} />
    {!collapsed && <span className="flex-1 text-left font-semibold">{label}</span>}
    {!collapsed && count !== undefined && <span className={`text-[10px] px-2 py-0.5 rounded-lg ${active ? "bg-white/20" : "bg-slate-800 group-hover:bg-slate-700"}`}>{count}</span>}
  </button>
);

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => {
  const colors: any = {
    indigo: "from-indigo-500 to-indigo-700 text-indigo-600 bg-indigo-50",
    blue: "from-blue-500 to-blue-700 text-blue-600 bg-blue-50",
    purple: "from-purple-500 to-purple-700 text-purple-600 bg-purple-50",
    emerald: "from-emerald-500 to-emerald-700 text-emerald-600 bg-emerald-50"
  };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color].split(" ")[2]}`}>
          <Icon size={24} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{trend}</span>
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-800">{value}</h3>
    </div>
  );
};

const ProgressStat = ({ label, value, total, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${(value / total) * 100}%` }}></div>
    </div>
  </div>
);

const ActionBtn = ({ onClick, icon: Icon, color }: any) => {
  const colors: any = {
    indigo: "text-indigo-600 hover:bg-indigo-100",
    emerald: "text-emerald-600 hover:bg-emerald-100",
    orange: "text-orange-600 hover:bg-orange-100",
    red: "text-red-600 hover:bg-red-100"
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-xl transition-colors ${colors[color]}`}>
      <Icon size={18} />
    </button>
  );
};

export default DashboardAdmin;