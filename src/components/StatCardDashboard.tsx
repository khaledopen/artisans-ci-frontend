type StatCardDashboardProps = {
  label: string;
  value: number;
};

const StatCardDashboard = ({ label, value }: StatCardDashboardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">{label}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
};

export default StatCardDashboard;
