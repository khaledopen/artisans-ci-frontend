import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Artisans from "./pages/Artisans";
import Login from "./pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/artisans" element={<Artisans />} />
    </Routes>
  )
};

export default App;
