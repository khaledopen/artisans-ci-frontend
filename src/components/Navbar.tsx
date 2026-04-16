import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react";

type NavItem = {
  label: string;
  targetId?: string;
  path?: string;
};

type NavbarProps = {
  brand: string;
  links: NavItem[];
  showAuthButtons?: boolean;
};

const Navbar = ({ brand, links, showAuthButtons = true }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Récupérer les infos utilisateur depuis localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    setToken(storedToken);
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur parsing user", e);
      }
    }
  }, [location.pathname]); // Re-vérifie quand la route change

  const handleNavigation = (link: NavItem) => {
    // navigation vers une autre page
    if (link.path) {
      navigate(link.path);
      return;
    }

    // navigation vers une section
    if (link.targetId) {
      // si on n'est pas sur la home
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(link.targetId!);
          element?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.getElementById(link.targetId);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setDropdownOpen(false);
    navigate("/login");
  };

  const getInitials = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
    }
    return "U";
  };

  const getDashboardPath = () => {
    const role = localStorage.getItem("role");
    if (role === "ARTISAN") return "/dashboard-artisan";
    if (role === "CLIENT") return "/dashboard-client";
    if (role === "ADMIN") return "/dashboard-admin";
    return "/";
  };

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-xl font-semibold text-gray-900">
            {brand}
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavigation(link)}
              className="hover:text-blue-600 transition"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth Section - Change selon connexion */}
        <div className="flex items-center gap-4">
          {!token ? (
            // 🔓 NON CONNECTÉ : afficher boutons login/register
            <>
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                S’inscrire
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Se connecter
              </button>
            </>
          ) : (
            // 🔐 CONNECTÉ : afficher avatar + menu déroulant
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold shadow-md">
                  {user?.photoprofil ? (
                    <img 
                      src={user.photoprofil} 
                      alt="avatar" 
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
                
                {/* Nom + prénom (sur desktop) */}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-gray-500">
                    {localStorage.getItem("role") === "ARTISAN" ? "Artisan" : "Client"}
                  </p>
                </div>
                
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {/* Infos utilisateur (mobile) */}
                  <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                    <p className="font-semibold text-gray-800">
                      {user?.prenom} {user?.nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(getDashboardPath());
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <LayoutDashboard size={16} className="text-gray-400" />
                    Tableau de bord
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User size={16} className="text-gray-400" />
                    Mon profil
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/artisans");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Settings size={16} className="text-gray-400" />
                    Trouver un artisan
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;