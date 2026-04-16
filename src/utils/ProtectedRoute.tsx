import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "CLIENT" | "ARTISAN" | "ADMIN";
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Non connecté
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Rôle requis mais non correspondant
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;