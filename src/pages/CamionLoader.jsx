import { useState } from "react";
import { useCargaData } from "../hooks/useCargaData";
import { COLORS, FONTS } from "../constants/palette";
import LoadingScreen  from "../components/LoadingScreen";
import ErrorScreen    from "../components/ErrorScreen";
import Navbar         from "../components/Navbar";
import CanvasView     from "../components/CanvasView";
import Sidebar        from "../components/Sidebar";

export default function CamionLoader() {
  const [cajaHover, setCajaHover] = useState(null);
  const { camion, cajas, carga, loading, error } = useCargaData(1, 1);

  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen message={error} />;

  return (
    <div style={{ fontFamily: FONTS.mono, background: COLORS.bg,
      height: "100vh", color: COLORS.textPrimary,
      display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Navbar carga={carga} camion={camion} />
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <CanvasView cajas={cajas} camion={camion} onHover={setCajaHover} />
        <Sidebar cajas={cajas} camion={camion} cajaHover={cajaHover} />
      </div>
    </div>
  );
}