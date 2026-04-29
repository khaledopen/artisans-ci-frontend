import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { login } from "../api/auth.api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    motpasse: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    // Reset messages
    setError("");
    setSuccess("");

    // Validation
    if (!form.email || !form.motpasse) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email: form.email,
        motpasse: form.motpasse,
      });

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
      const message = err.response?.data?.message || "Email ou mot de passe incorrect";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h2 className="text-white text-2xl font-bold">Bienvenue</h2>
          <p className="text-blue-100 text-sm mt-1">
            Connectez-vous à votre espace
          </p>
        </div>

        {/* Body */}
        <div className="p-6">

          {/* Messages d'alerte */}
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

          {/* Formulaire */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Champ Email */}
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

            {/* Champ Mot de passe avec toggle */}
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

            {/* Bouton de connexion */}
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

          {/* Lien inscription */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              S’inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;