import Sidebar from "../components/Sidebar";
import StatCardDashboard from "../components/StatCardDashboard"; // Nouveau nom
import Table from "../components/Table";
import { useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats] = useState([
    { label: "Artisans", value: 1500 },
    { label: "Projets réalisés", value: 5000 },
    { label: "Clients", value: 2000 },
  ]);

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6">Dashboard Admin</h1>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <StatCardDashboard key={index} label={stat.label} value={stat.value} />
          ))}
        </div>

        {/* Tableau */}
        <Table />

        {/* Button to manage users */}
        <Link
          to="/admin/users"
          className="inline-block mt-6 text-blue-600 hover:text-blue-700"
        >
          Gérer les utilisateurs
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
