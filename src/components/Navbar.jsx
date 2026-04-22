import { COLORS, FONTS } from "../constants/palette";

export default function Navbar({ carga, camion }) {
  return (
    <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`,
      display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%",
        background: COLORS.accent, boxShadow: `0 0 8px ${COLORS.accent}` }} />
      <span style={{ fontSize: 13, letterSpacing: 3, color: COLORS.accent,
        textTransform: "uppercase", fontFamily: FONTS.mono }}>
        Optimizador de Carga 3D
      </span>
      <span style={{ marginLeft: 8, fontSize: 12, color: COLORS.textMuted }}>
        {carga?.nombre} · {camion?.placa}
      </span>
      <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.textDim, letterSpacing: 2 }}>
        ODS 9 · Industria e Innovación
      </span>
    </div>
  );
}