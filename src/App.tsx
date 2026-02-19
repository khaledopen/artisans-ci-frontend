import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Artisans from "./pages/Artisans";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // Import du Dashboard

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artisans" element={<Artisans />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Dashboard />} /> {/* Ajout de la route pour le Dashboard */}
    </Routes>
  );
}

export default App;

