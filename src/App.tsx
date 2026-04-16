import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Artisans from "./pages/Artisans";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArtisanProfile from "./pages/ArtisanProfile";
import DashboardClient from "./pages/DashboardClient";
import DashboardArtisan from "./pages/DashboardArtisan";
import ProfileArtisan from "./pages/ProfileArtisan";
import CreerDemande from "./pages/CreerDemande";
import DemandeDetail from "./pages/DemandeDetail";
import ProtectedRoute from "./utils/ProtectedRoute";
import GuestRoute from "./utils/GuestRoute";

function App() {
  return (
    <Routes>
      {/* ========== ROUTES PUBLIQUES ========== */}
      <Route path="/" element={<Home />} />
      <Route path="/artisans" element={<Artisans />} />
      <Route path="/artisan/:id" element={<ArtisanProfile />} />

      {/* ========== ROUTES RÉSERVÉES AUX INVITÉS (NON CONNECTÉS) ========== */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* ========== DASHBOARD CLIENT (PROTÉGÉ) ========== */}
      <Route
        path="/dashboard-client"
        element={
          <ProtectedRoute role="CLIENT">
            <DashboardClient />
          </ProtectedRoute>
        }
      />

      {/* ========== DASHBOARD ARTISAN (PROTÉGÉ) ========== */}
      <Route
        path="/dashboard-artisan"
        element={
          <ProtectedRoute role="ARTISAN">
            <DashboardArtisan />
          </ProtectedRoute>
        }
      />

      {/* ========== PROFIL ARTISAN (MODIFICATION) ========== */}
      <Route
        path="/profile-artisan"
        element={
          <ProtectedRoute role="ARTISAN">
            <ProfileArtisan />
          </ProtectedRoute>
        }
      />

      {/* ========== CRÉER UNE DEMANDE (CLIENT UNIQUEMENT) ========== */}
      <Route
        path="/creer-demande"
        element={
          <ProtectedRoute role="CLIENT">
            <CreerDemande />
          </ProtectedRoute>
        }
      />

      {/* ========== DÉTAIL D'UNE DEMANDE (CLIENT OU ARTISAN) ========== */}
      <Route
        path="/demande/:id"
        element={
          <ProtectedRoute>
            <DemandeDetail />
          </ProtectedRoute>
        }
      />

      {/* ========== REDIRECTION PAR DÉFAUT ========== */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;