import { Link } from "react-router-dom";
import { Home, Users, Settings } from "lucide-react"; // Icônes de navigation

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <h2 className="text-xl font-semibold mb-8">Admin Dashboard</h2>
      <ul>
        <li>
          <Link to="/admin" className="flex items-center gap-2 mb-4 hover:bg-gray-700 p-2 rounded">
            <Home size={20} /> Tableau de bord
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="flex items-center gap-2 mb-4 hover:bg-gray-700 p-2 rounded">
            <Users size={20} /> Utilisateurs
          </Link>
        </li>
        <li>
          <Link to="/admin/settings" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
            <Settings size={20} /> Paramètres
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
