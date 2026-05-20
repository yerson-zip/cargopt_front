import { useState } from "react";
import "../index.css";
import DashSidebar     from "../components/dashboard/DashSidebar";
import PageDashboard   from "./PageDashboard";
import PageNuevaCarga  from "./PageNuevaCarga";
import PageMisCamiones from "./PageMisCamiones";
import { useCamiones } from "../hooks/useCargaData";

const COMING_SOON = ["historial","reportes","config"];

export default function Dashboard() {
  const [nav, setNav] = useState("dashboard");
  const { camiones, loading } = useCamiones();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <DashSidebar nav={nav} setNav={setNav} />
      <main style={{ marginLeft: 220, padding: 32, flex: 1, minHeight: "100vh" }}>
        {nav === "dashboard" && <PageDashboard setNav={setNav} />}
        {nav === "optimizar" && <PageNuevaCarga camiones={loading ? [] : camiones} />}
        {nav === "camiones"  && <PageMisCamiones />}
        {COMING_SOON.includes(nav) && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", height:"60vh", gap:12 }}>
            <div style={{ fontSize:48, opacity:0.15 }}>◻</div>
            <div style={{ fontSize:14, fontFamily:"'Syne',sans-serif", fontWeight:700, color:"var(--muted)" }}>
              Próximamente
            </div>
            <div style={{ fontSize:11, color:"var(--muted)" }}>Esta sección está en desarrollo</div>
          </div>
        )}
      </main>
    </div>
  );
}
