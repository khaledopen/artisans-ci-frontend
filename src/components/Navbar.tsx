import { useLocation, useNavigate } from "react-router-dom";

type NavItem = {
  label: string;
  targetId?: string; // scroll interne
  path?: string;     // navigation route
};

type NavbarProps = {
  brand: string;
  links: NavItem[];
  showAuthButtons?: boolean;
};

const Navbar = ({ brand, links, showAuthButtons = true }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (link: NavItem) => {
    // Scroll UNIQUEMENT si on est sur Home
    if (link.targetId && location.pathname === "/") {
      const el = document.getElementById(link.targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Sinon navigation classique
    if (link.path) {
      navigate(link.path);
    }
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
              onClick={() => handleClick(link)}
              className="hover:text-blue-600 transition"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth buttons */}
        {showAuthButtons && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              S’inscrire
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Se connecter
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
