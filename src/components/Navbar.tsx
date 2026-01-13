import { Link } from "react-router-dom";

type NavItem = {
  label: string;
  path: string;
};

type NavbarProps = {
  brand: string;
  links: NavItem[];
  showAuthButtons?: boolean;
};

const Navbar = ({ brand, links, showAuthButtons = true }: NavbarProps) => {
  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
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
            <Link key={link.label} to={link.path}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        {showAuthButtons && (
          <div className="flex items-center gap-4">
            <button className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
              S’inscrire
            </button>
            <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Se connecter
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
