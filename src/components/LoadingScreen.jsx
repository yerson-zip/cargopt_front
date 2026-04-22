import { COLORS, FONTS } from "../constants/palette";

export default function LoadingScreen() {
  return (
    <div style={{ background: COLORS.bg, height: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      color: COLORS.accent, fontFamily: FONTS.mono, letterSpacing: 3 }}>
      CARGANDO DATOS…
    </div>
  );
}