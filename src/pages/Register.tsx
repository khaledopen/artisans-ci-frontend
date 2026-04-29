import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { User, Briefcase, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { registerClient, registerArtisan } from "../api/auth.api";

type Role = "CLIENT" | "ARTISAN";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    // Champs communs
    nom: "",
    prenom: "",
    email: "",
    motpasse: "",
    confirmPassword: "",
    localisation: "Abidjan",
    commune: "",  // ← Commune pour client aussi
    
    // Champs artisan uniquement
    metierId: 1,
  });

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!role) {
      setError("Veuillez choisir un type de compte");
      return;
    }

    if (!form.nom || !form.prenom || !form.email || !form.motpasse) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    if (role === "CLIENT" && !form.commune) {
      setError("Veuillez renseigner votre commune");
      return;
    }

    if (role === "ARTISAN" && !form.commune) {
      setError("Veuillez renseigner votre commune");
      return;
    }

    if (form.motpasse !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (form.motpasse.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (role === "CLIENT") {
        response = await registerClient({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          motpasse: form.motpasse,
          localisation: form.localisation,
          commune: form.commune,  // ← AJOUTÉ
        });
      } else {
        response = await registerArtisan({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          motpasse: form.motpasse,
          localisation: form.localisation,
          commune: form.commune,
          metierId: form.metierId,
        });
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user", JSON.stringify(response.user));

      setSuccess("Inscription réussie ! Redirection...");

      setTimeout(() => {
        if (response.role === "ARTISAN") {
          navigate("/dashboard-artisan");
        } else {
          navigate("/dashboard-client");
        }
      }, 1500);

    } catch (err: any) {
      console.error("Erreur inscription:", err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Services", path: "/" },
          { label: "Trouver un artisan", path: "/artisans" },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
            <h2 className="text-white text-2xl font-bold">Créer un compte</h2>
            <p className="text-blue-100 text-sm mt-1">Rejoignez la communauté ArtisanCI</p>
          </div>

          {/* Body */}
          <div className="p-6">

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            {/* Choix du rôle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setRole("CLIENT")}
                className={`border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-200
                  ${role === "CLIENT"
                    ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                    : "border-gray-200 bg-gray-50 hover:border-blue-300"}`}
              >
                <div className={`p-2 rounded-full ${role === "CLIENT" ? "bg-blue-500" : "bg-gray-400"}`}>
                  <User size={20} className="text-white" />
                </div>
                <span className={`font-medium ${role === "CLIENT" ? "text-blue-600" : "text-gray-600"}`}>
                  Client
                </span>
              </button>

              <button
                onClick={() => setRole("ARTISAN")}
                className={`border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-200
                  ${role === "ARTISAN"
                    ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                    : "border-gray-200 bg-gray-50 hover:border-blue-300"}`}
              >
                <div className={`p-2 rounded-full ${role === "ARTISAN" ? "bg-blue-500" : "bg-gray-400"}`}>
                  <Briefcase size={20} className="text-white" />
                </div>
                <span className={`font-medium ${role === "ARTISAN" ? "text-blue-600" : "text-gray-600"}`}>
                  Artisan
                </span>
              </button>
            </div>

            {/* Formulaire */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>

              <input
                type="email"
                placeholder="Adresse email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />

              {/* LOCALISATION ET COMMUNE - pour les deux rôles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ville"
                    value={form.localisation}
                    onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    required
                  />
                </div>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Commune (ex: Cocody, Plateau...)"
                    value={form.commune}
                    onChange={(e) => setForm({ ...form, commune: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Métier - seulement pour artisan */}
              {role === "ARTISAN" && (
                <select
                  value={form.metierId}
                  onChange={(e) => setForm({ ...form, metierId: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                >
                  <option value={1}>Plomberie</option>
                  <option value={2}>Électricité</option>
                  <option value={3}>Serrurerie</option>
                  <option value={4}>Peinture</option>
                  <option value={5}>Menuiserie</option>
                  <option value={6}>Maçonnerie</option>
                </select>
              )}

              <input
                type="password"
                placeholder="Mot de passe"
                value={form.motpasse}
                onChange={(e) => setForm({ ...form, motpasse: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />

              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Déjà un compte ?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;