import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { User, Briefcase } from "lucide-react";

type Role = "CLIENT" | "ARTISAN";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    job: "", // métier (artisan uniquement)
  });

  const handleSubmit = () => {
    if (!role) {
      alert("Veuillez choisir un type de compte");
      return;
    }

    if (!form.name || !form.email || !form.password) {
      alert("Tous les champs sont obligatoires");
      return;
    }

    if (role === "ARTISAN" && !form.job) {
      alert("Veuillez préciser votre métier");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role,
      job: role === "ARTISAN" ? form.job : null,
    };

    console.log("Données envoyées :", payload);
    alert("Inscription réussie (simulation)");

    // Plus tard : navigate selon le rôle
    // navigate(role === "ARTISAN" ? "/artisan/dashboard" : "/client/dashboard");
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

      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-center mb-2">
            Créer un compte
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Choisissez votre type de compte
          </p>

          {/* Choix du rôle */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setRole("CLIENT")}
              className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition
                ${role === "CLIENT"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"}`}
            >
              <User />
              <span className="font-medium">Client</span>
            </button>

            <button
              onClick={() => setRole("ARTISAN")}
              className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition
                ${role === "ARTISAN"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"}`}
            >
              <Briefcase />
              <span className="font-medium">Artisan</span>
            </button>
          </div>

          {/* Formulaire */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Nom complet"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="email"
              placeholder="Adresse email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* Champ métier – seulement pour artisan */}
            {role === "ARTISAN" && (
              <input
                type="text"
                placeholder="Votre métier (ex : Plombier, Électricien)"
                value={form.job}
                onChange={(e) => setForm({ ...form, job: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            <input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              S’inscrire
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
