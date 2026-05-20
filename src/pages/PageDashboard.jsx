import { useState } from "react";
import { useDashboardData, useCamiones } from "../hooks/useCargaData";
import DashLoading from "../components/dashboard/DashLoading";
import DashError   from "../components/dashboard/DashError";
import { useNavigate } from "react-router-dom";

const STAT_META = [
  { key: "cargas_optimizadas", deltaKey: "cargas_delta",   label: "Cargas optimizadas", icon: "▦", color: "#4a9eff" },
  { key: "ocupacion_promedio",  deltaKey: "ocupacion_delta", label: "Ocupación promedio",  icon: "◈", color: "#2ecc71" },
  { key: "viajes_ahorrados",    deltaKey: "viajes_delta",    label: "Viajes ahorrados",    icon: "⟁", color: "#f59e0b" },
  { key: "cajas_procesadas",    deltaKey: "cajas_delta",     label: "Cajas procesadas",    icon: "◻", color: "#e879f9" },
];

const eCol = (e) => e === "ok" ? "#2ecc71" : e === "warn" ? "#f59e0b" : "#e74c3c";
const eLbl = (e) => e === "ok" ? "Óptimo"  : e === "warn" ? "Regular"  : "Bajo";
const ocpColor = (v) => v >= 85 ? "#2ecc71" : v >= 65 ? "#f59e0b" : "#e74c3c";

export default function PageDashboard({ setNav }) {
  const { stats, historial, barData, loading, error, refetch } = useDashboardData();
  const { camiones, loading: loadCam } = useCamiones();
  const [hoveredBar, setHoveredBar] = useState(null);
  const navigate = useNavigate();

  if (loading || loadCam) return <DashLoading message="Cargando dashboard..." />;
  if (error)              return <DashError   message={error} onRetry={refetch} />;

  const fecha = new Date().toLocaleDateString("es-CO", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  }).toUpperCase();

  return (
    <>
      {/* Header */}
      <div className="ph">
        <div>
          <div className="ptitle syne">Dashboard</div>
          <div className="psub">{fecha} · {camiones.length} CAMIONES ACTIVOS</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn bg">↓ Exportar</button>
          <button className="btn bp pulse" onClick={() => setNav("optimizar")}>⟁ Nueva Carga</button>
        </div>
      </div>

      {/* CO2 Banner */}
      <div className="co2b">
        <div className="co2d" />
        <div style={{ fontSize: 11, color: "#2ecc71" }}>
          Este mes evitaste <strong>{stats?.viajes_ahorrados ?? "—"} viajes innecesarios</strong> — impacto estimado:{" "}
          <strong>{stats?.co2_ahorrado_kg ?? "—"} kg de CO₂</strong> menos
        </div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginLeft: "auto", whiteSpace: "nowrap" }}>
          ODS 9 · Industria Sostenible
        </div>
      </div>

      {/* Stats */}
      <div className="sg">
        {STAT_META.map((s, i) => (
          <div className="sc" key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 18, color: s.color }}>{s.icon}</span>
              <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 20, letterSpacing: 1,
                background: s.color + "18", color: s.color }}>↑ ACTIVO</span>
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>
              {stats?.[s.key] ?? "—"}
            </div>
            <div style={{ fontSize: 10, color: "var(--muted2)", marginBottom: 8, letterSpacing: 1 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>{stats?.[s.deltaKey] ?? ""}</div>
          </div>
        ))}
      </div>

      {/* Historial + Gráfico */}
      <div className="g31" style={{ marginBottom: 24 }}>
        {/* Tabla historial */}
        <div className="card">
          <div className="ch">
            <div><div className="ct syne">Historial de Cargas</div><div className="cs">ÚLTIMAS 5 OPTIMIZACIONES</div></div>
            <button className="btn bg" style={{ fontSize: 10, padding: "6px 12px" }}
              onClick={() => setNav("historial")}>Ver todo →</button>
          </div>
          <div style={{ padding: "0 20px" }}>
            <table className="tbl">
              <thead>
                <tr><th>ID</th><th>CAMIÓN</th><th>CAJAS</th><th>OCUPACIÓN</th><th>ESTADO</th><th></th></tr>
              </thead>
              <tbody>
                {historial.map((h) => (
                  <tr key={h.id} style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/optimizer/${h.camion_id}/${h.id}`)}>
                    <td>
                      <div style={{ color: "var(--blue)", fontSize: 11 }}>{h.id}</div>
                      <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>{h.fecha}</div>
                    </td>
                    <td style={{ color: "var(--muted2)", fontSize: 11 }}>{h.camion}</td>
                    <td style={{ fontWeight: 500 }}>{h.cajas}</td>
                    <td>
                      <div style={{ fontSize: 11 }}>{h.ocupacion}%</div>
                      <div style={{ height: 4, borderRadius: 2, background: "var(--border)", marginTop: 4, width: 80 }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${h.ocupacion}%`,
                          background: ocpColor(h.ocupacion) }} />
                      </div>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 10px", borderRadius: 20, fontSize: 9, letterSpacing: 1,
                        background: eCol(h.estado) + "18", color: eCol(h.estado) }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: eCol(h.estado) }} />
                        {eLbl(h.estado)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 10, color: "var(--blue)" }}>Ver →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Barras */}
        <div className="card">
          <div className="ch">
            <div><div className="ct syne">Ocupación Media</div><div className="cs">ÚLTIMOS 6 MESES · %</div></div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, padding: "0 4px" }}>
              {barData.map((b, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: "100%", borderRadius: "4px 4px 0 0", height: `${b.val}%`,
                      cursor: "pointer", transition: "all 0.2s",
                      background: hoveredBar === i
                        ? "linear-gradient(to top,#4a9eff,#7bc4ff)"
                        : i === barData.length - 1
                        ? "linear-gradient(to top,#4a9eff88,#4a9eff44)"
                        : "linear-gradient(to top,#1e2740,#1e2740)",
                      border: hoveredBar === i ? "1px solid #4a9eff" : "1px solid var(--border2)",
                    }}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                  <div style={{ fontSize: 10, transition: "color 0.15s",
                    color: hoveredBar === i ? "var(--blue)" : "var(--muted)" }}>
                    {hoveredBar === i ? `${b.val}%` : b.mes}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: 14, background: "#0a0c12", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, marginBottom: 6 }}>TENDENCIA</div>
              {barData.length >= 2 && (
                <div style={{ fontSize: 11, color: "#2ecc71" }}>
                  ↑ +{(barData[barData.length - 1].val - barData[0].val).toFixed(0)} puntos en {barData.length} meses
                </div>
              )}
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
                El algoritmo mejora con más datos históricos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camiones + CTA */}
      <div className="g2">
        <div className="card">
          <div className="ch">
            <div><div className="ct syne">Mis Camiones</div><div className="cs">{camiones.length} VEHÍCULOS REGISTRADOS</div></div>
            <button className="btn bg" style={{ fontSize: 10, padding: "6px 12px" }}
              onClick={() => setNav("camiones")}>Ver todos →</button>
          </div>
          <div style={{ padding: "8px 20px" }}>
            {camiones.slice(0, 3).map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0d1929",
                  border: "1px solid #1e3a6a", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🚛</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{c.nombre}</div>
                  <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, marginTop: 2 }}>{c.placa}</div>
                  <div style={{ fontSize: 9, color: "var(--muted2)", marginTop: 3 }}>
                    {c.largo}×{c.ancho}×{c.alto} m · {c.peso_max?.toLocaleString()} kg
                  </div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "var(--blue)" }}>
                    {c.cargas ?? 0}
                  </div>
                  <div style={{ fontSize: 8, color: "var(--muted)", letterSpacing: 1 }}>cargas</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "linear-gradient(135deg,#0d1929,#0a1220)", border: "1px solid #1e3a6a",
            borderRadius: 12, padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>⟁</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
                Optimizar nueva carga
              </div>
              <div style={{ fontSize: 11, color: "var(--muted2)", lineHeight: 1.6 }}>
                Ingresa tus cajas y el algoritmo calcula la distribución óptima en segundos.
              </div>
              <button className="btn bp pulse" style={{ marginTop: 14 }} onClick={() => setNav("optimizar")}>
                Comenzar optimización →
              </button>
            </div>
          </div>

          <div className="card">
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3 }}>RESUMEN HOY</div>
              {[
                { l: "Cargas completadas", v: stats?.hoy_cargas    ?? "—", c: "var(--blue)" },
                { l: "Mejor ocupación",    v: stats?.hoy_mejor_ocp ?? "—", c: "#2ecc71" },
                { l: "Cajas rechazadas",   v: stats?.hoy_rechazadas?? "—", c: "#e74c3c" },
                { l: "CO₂ ahorrado hoy",   v: stats?.hoy_co2       ?? "—", c: "#f59e0b" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--muted2)" }}>{r.l}</span>
                  <span style={{ fontSize: 12, color: r.c, fontWeight: 500 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
