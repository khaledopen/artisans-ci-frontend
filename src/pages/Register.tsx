import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Register = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Services", path: "/" },
          { label: "Trouver un artisan", path: "/artisans" },
          { label: "Comment ça marche", path: "/#how-it-works" },
          { label: "Contact", path: "/#contact" },
        ]}
      />

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Créer un compte
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Rejoignez ArtisanCI en quelques secondes
          </p>

          {/* Form */}
          <form className="space-y-4">

            <input
              type="text"
              placeholder="Nom complet"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Adresse email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              S’inscrire
            </button>
          </form>

          {/* Footer */}
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
