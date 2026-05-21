import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard    from "./pages/Dashboard";
import CamionLoader from "./pages/CamionLoader";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/dashboard"}>
      <Routes>
        <Route path="/"                                    element={<Navigate to="/" replace />} />
        <Route path="/dashboard"                           element={<Dashboard />} />
        <Route path="/optimizer/:id_camion/:id_carga"      element={<CamionLoader />} />
      </Routes>
    </BrowserRouter>
  );
}