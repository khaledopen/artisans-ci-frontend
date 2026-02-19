const Table = () => {
  const users = [
    { id: 1, name: "Jean Dupont", role: "Client", status: "Actif" },
    { id: 2, name: "Marie Leclerc", role: "Artisan", status: "Inactif" },
    { id: 3, name: "Pierre Martin", role: "Client", status: "Actif" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Utilisateurs</h3>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nom</th>
            <th className="px-4 py-2 border">Rôle</th>
            <th className="px-4 py-2 border">Statut</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{user.id}</td>
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
