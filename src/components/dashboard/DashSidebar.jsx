import { useNavigate } from "react-router-dom";

const NAV1 = [
  { id: "dashboard", icon: "◈", l: "Dashboard" },
  { id: "optimizar", icon: "⟁", l: "Nueva Carga" },
  { id: "historial", icon: "▤", l: "Historial" },
];
const NAV2 = [
  { id: "camiones", icon: "🚛", l: "Mis Camiones" },
  { id: "reportes", icon: "◻",  l: "Reportes" },
  { id: "config",   icon: "⚙",  l: "Configuración" },
];

export default function DashSidebar({ nav, setNav }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, marginBottom: 12,
          background: "linear-gradient(135deg,#1a3a6a,#0a1a3a)",
          border: "1px solid var(--blue)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, boxShadow: "0 0 16px #4a9eff22",
        }}>▦</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
          CARGOPT
        </div>
        <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, marginTop: 2 }}>
          ODS 9 · Industria
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "20px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: "var(--muted)", padding: "16px 12px 6px" }}>
          PRINCIPAL
        </div>
        {NAV1.map((n) => (
          <div key={n.id} className={`ni${nav === n.id ? " on" : ""}`} onClick={() => setNav(n.id)}>
            <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{n.icon}</span>
            <span>{n.l}</span>
          </div>
        ))}
        <div style={{ fontSize: 9, letterSpacing: 3, color: "var(--muted)", padding: "16px 12px 6px", marginTop: 8 }}>
          GESTIÓN
        </div>
        {NAV2.map((n) => (
          <div key={n.id} className={`ni${nav === n.id ? " on" : ""}`} onClick={() => setNav(n.id)}>
            <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{n.icon}</span>
            <span>{n.l}</span>
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: 16, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", fontSize: 12, color: "var(--blue)",
          background: "linear-gradient(135deg,#1a3a6a,#2ecc7122)",
          border: "1px solid var(--border2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>JD</div>
        <div>
          <div style={{ fontSize: 11 }}>Juan Dev</div>
          <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 1 }}>juan@empresa.co</div>
        </div>
      </div>
    </aside>
  );
}
