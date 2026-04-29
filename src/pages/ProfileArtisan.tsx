import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMe } from "../api/auth.api";
import { updateArtisanProfile } from "../api/artisan.api";
import { Loader2, CheckCircle, AlertCircle, User, MapPin, Mail, Briefcase, Camera } from "lucide-react";

const ProfileArtisan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [form, setForm] = useState({
    id: 0,
    nom: "",
    prenom: "",
    email: "",
    localisation: "",
    commune: "",
    photoprofil: "",
    metier: { id: 0, nom: "" }
  });

  // Charger les infos de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await getMe();
        console.log("📦 Données reçues de getMe:", user);
        
        // Récupérer aussi depuis localStorage si des champs sont manquants
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        
        setForm({
          id: user.id || storedUser.id,
          nom: user.nom || storedUser.nom || "",
          prenom: user.prenom || storedUser.prenom || "",
          email: user.email || storedUser.email || "",
          localisation: user.localisation || storedUser.localisation || "",
          commune: user.commune || storedUser.commune || "",
          photoprofil: user.photoprofil || storedUser.photoprofil || "",
          metier: user.metier || storedUser.metier || { id: 0, nom: "" }
        });
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updated = await updateArtisanProfile(form);
      setSuccess("Profil mis à jour avec succès !");
      
      // Mettre à jour localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.nom = updated.nom;
        user.prenom = updated.prenom;
        user.email = updated.email;
        user.localisation = updated.localisation;
        user.commune = updated.commune;
        user.photoprofil = updated.photoprofil;
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar brand="ArtisanCI" links={[]} />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Accueil", path: "/" },
          { label: "Tableau de bord", path: "/dashboard-artisan" },
          { label: "Trouver un artisan", path: "/artisans" },
        ]}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard-artisan")}
              className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2"
            >
              ← Retour au tableau de bord
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Modifier mon profil</h1>
            <p className="text-gray-500 mt-1">Modifiez vos informations personnelles</p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-center">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                {form.photoprofil ? (
                  <img 
                    src={form.photoprofil} 
                    alt="profil" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {form.prenom?.charAt(0)}{form.nom?.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="text-white text-xl font-bold">
                {form.prenom} {form.nom}
              </h2>
              <p className="text-blue-100 text-sm flex items-center justify-center gap-1 mt-1">
                <Briefcase size={14} />
                {form.metier?.nom || "Artisan"}
              </p>
            </div>

            <div className="p-6">
              {/* Messages */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle size={16} />
                  {success}
                </div>
              )}

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.prenom}
                        onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Métier</label>
                  <div className="relative">
                    <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={form.metier?.nom || ""}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Le métier ne peut pas être modifié. Contactez le support si nécessaire.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation / Ville</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.localisation}
                        onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                        placeholder="Ex: Abidjan"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.commune}
                        onChange={(e) => setForm({ ...form, commune: e.target.value })}
                        placeholder="Ex: Cocody, Plateau..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil (URL)</label>
                  <div className="relative">
                    <Camera size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={form.photoprofil}
                      onChange={(e) => setForm({ ...form, photoprofil: e.target.value })}
                      placeholder="https://exemple.com/ma-photo.jpg"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Entrez l'URL de votre photo de profil</p>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProfileArtisan;