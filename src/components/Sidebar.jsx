import { COLORS, FONTS } from "../constants/palette";

export default function Sidebar({ cajas, camion, cajaHover }) {
  const volCamion = camion.largo * camion.ancho * camion.alto;
  const volUsado  = cajas.reduce((s, c) => s + c.largo * c.alto * c.ancho, 0);
  const pesoTotal = cajas.reduce((s, c) => s + c.peso, 0);
  const ocupacion = ((volUsado / volCamion) * 100).toFixed(1);

  const stats = [
    { label: "Ocupación",  value: `${ocupacion}%`,             color: ocupacion > 80 ? COLORS.danger : COLORS.success },
    { label: "Peso total", value: `${pesoTotal} kg`,           color: COLORS.accent },
    { label: "Cajas",      value: cajas.length,                color: "#f39c12" },
    { label: "Vol. usado", value: `${volUsado.toFixed(1)} m³`, color: "#9b59b6" },
  ];

  return (
    <div style={{ width: 240, background: COLORS.bgSidebar, borderLeft: `1px solid ${COLORS.border}`,
      padding: 20, display: "flex", flexDirection: "column", gap: 20, overflowY: "auto",
      fontFamily: FONTS.mono }}>

      {/* Estadísticas */}
      <div>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.textDim, marginBottom: 12 }}>ESTADÍSTICAS</div>
        {stats.map(({ label, value, color }) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: COLORS.textMuted }}>{label}</span>
              <span style={{ color }}>{value}</span>
            </div>
            {label === "Ocupación" && (
              <div style={{ height: 3, background: COLORS.border, borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${ocupacion}%`, background: color,
                  borderRadius: 2, transition: "width 0.5s" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Manifiesto */}
      <div>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.textDim, marginBottom: 12 }}>MANIFIESTO DE CARGA</div>
        {cajas.map((c) => (
          <div key={c.id} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 8px", borderRadius: 6, marginBottom: 4,
            background: cajaHover?.id === c.id ? "#1a1d2e" : "transparent",
            border: `1px solid ${cajaHover?.id === c.id ? c.color + "66" : "transparent"}`,
            transition: "all 0.15s"
          }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: COLORS.textPrimary,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.nombre}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim }}>{c.peso} kg · {c.largo}×{c.alto}×{c.ancho}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Info camión */}
      <div style={{ marginTop: "auto", padding: 12, background: COLORS.bgCard,
        borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.textDim, marginBottom: 8 }}>
          CAMIÓN · {camion.placa}
        </div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 2 }}>
          <div>Largo: <span style={{ color: COLORS.textPrimary }}>{camion.largo} m</span></div>
          <div>Ancho: <span style={{ color: COLORS.textPrimary }}>{camion.ancho} m</span></div>
          <div>Alto:  <span style={{ color: COLORS.textPrimary }}>{camion.alto} m</span></div>
          <div>Cap.:  <span style={{ color: COLORS.textPrimary }}>{camion.capacidad_kg} kg</span></div>
          <div>Vol.:  <span style={{ color: COLORS.textPrimary }}>{volCamion.toFixed(1)} m³</span></div>
        </div>
      </div>
    </div>
  );
}