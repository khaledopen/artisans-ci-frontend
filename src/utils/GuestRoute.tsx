import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const token = localStorage.getItem("token");

  // Si déjà connecté, rediriger vers son dashboard
  if (token) {
    const role = localStorage.getItem("role");
    if (role === "ARTISAN") return <Navigate to="/dashboard-artisan" />;
    if (role === "CLIENT") return <Navigate to="/dashboard-client" />;
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default GuestRoute;