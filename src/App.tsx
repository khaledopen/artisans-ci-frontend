import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Artisans from "./pages/Artisans";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artisans" element={<Artisans />} />
    </Routes>
  );
};

export default App;
