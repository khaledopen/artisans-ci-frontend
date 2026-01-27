import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Titre */}
        <h1 className="text-2xl font-bold text-center mb-2">
          Se connecter
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Accédez à votre espace ArtisanCI
        </p>

        {/* Formulaire */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="exemple@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Se connecter
          </button>
        </form>

        {/* Lien inscription */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
