import { COLORS, FONTS } from "../constants/palette";

export default function ErrorScreen({ message }) {
  return (
    <div style={{ background: COLORS.bg, height: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      color: COLORS.danger, fontFamily: FONTS.mono }}>
      ERROR: {message}
    </div>
  );
}