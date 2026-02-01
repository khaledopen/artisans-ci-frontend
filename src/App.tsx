import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Artisans from "./pages/Artisans";
import Register from "./pages/Register";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artisans" element={<Artisans />} />
      <Route path="/register" element={<Register />} />

    </Routes>
  );
};

export default App;
