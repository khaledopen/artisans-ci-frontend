// src/pages/Login.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff, User, Briefcase, Shield } from "lucide-react";
import { login } from "../api/auth.api";

type SelectedRole = "CLIENT" | "ARTISAN" | null;

const Login = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<SelectedRole>(null);
  const [form, setForm] = useState({
    email: "",
    motpasse: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.email || !form.motpasse) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    // ✅ Pour l'admin, pas besoin de sélectionner un rôle
    // Le backend vérifiera automatiquement

    setLoading(true);

    try {
      console.log("🔐 Tentative de connexion avec:", form.email);
      console.log("👤 Rôle sélectionné:", selectedRole);
      
      // ✅ Envoyer le rôle si sélectionné (pour Client ou Artisan)
      const response = await login({
        email: form.email,
        motpasse: form.motpasse,
        role: selectedRole || undefined,  // ← Envoyer le rôle si sélectionné
      });

      console.log("✅ Réponse du backend:", response);
      console.log("👤 Rôle reçu:", response.role);

      // Stockage des infos
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user", JSON.stringify(response.user));

      setSuccess("Connexion réussie ! Redirection...");

      // Redirection selon le rôle
      setTimeout(() => {
        if (response.role === "ADMIN") {
          navigate("/dashboard-admin");
        } else if (response.role === "ARTISAN") {
          navigate("/dashboard-artisan");
        } else {
          navigate("/dashboard-client");
        }
      }, 1500);

    } catch (err: any) {
      console.error("❌ Erreur:", err);
      console.error("❌ Statut:", err.response?.status);
      console.error("❌ Message:", err.response?.data?.message);
      
      if (err.response?.status === 409) {
        // ✅ Erreur spécifique : plusieurs comptes trouvés
        setError("Plusieurs comptes trouvés avec cet email. Veuillez sélectionner un rôle (Client ou Artisan).");
      } else if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else if (err.response?.status === 403) {
        setError("Compte bloqué. Contactez l'administrateur.");
      } else {
        setError(err.response?.data?.message || "Email ou mot de passe incorrect");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h2 className="text-white text-2xl font-bold">Connexion</h2>
          <p className="text-blue-100 text-sm mt-1">
            Connectez-vous à votre espace
          </p>
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

          {/* Message informatif */}
          <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-xl text-center text-xs text-yellow-700">
            ⚠️ Si vous avez un compte Client ET Artisan avec le même email, sélectionnez le bon rôle
          </div>

          <div className="mb-4 p-2 bg-purple-50 border border-purple-200 rounded-xl text-center text-xs text-purple-600">
            <Shield size={14} className="inline mr-1" />
            Les administrateurs n'ont pas besoin de sélectionner un type
          </div>

          {/* Choix du rôle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Je me connecte en tant que :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("CLIENT")}
                className={`border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-200
                  ${selectedRole === "CLIENT"
                    ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                    : "border-gray-200 bg-gray-50 hover:border-blue-300"}`}
              >
                <div className={`p-2 rounded-full ${selectedRole === "CLIENT" ? "bg-blue-500" : "bg-gray-400"}`}>
                  <User size={20} className="text-white" />
                </div>
                <span className={`font-medium ${selectedRole === "CLIENT" ? "text-blue-600" : "text-gray-600"}`}>
                  Client
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("ARTISAN")}
                className={`border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-200
                  ${selectedRole === "ARTISAN"
                    ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                    : "border-gray-200 bg-gray-50 hover:border-blue-300"}`}
              >
                <div className={`p-2 rounded-full ${selectedRole === "ARTISAN" ? "bg-blue-500" : "bg-gray-400"}`}>
                  <Briefcase size={20} className="text-white" />
                </div>
                <span className={`font-medium ${selectedRole === "ARTISAN" ? "text-blue-600" : "text-gray-600"}`}>
                  Artisan
                </span>
              </button>
            </div>
          </div>

          {/* Formulaire */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="exemple@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.motpasse}
                  onChange={(e) => setForm({ ...form, motpasse: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
              S’inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;