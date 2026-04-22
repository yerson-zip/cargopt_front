export default function CajaHoverInfo({ caja }) {
  if (!caja) return null;
  return (
    <div style={{
      position: "absolute", top: 16, left: 16,
      background: "#141824", border: `1px solid ${caja.color}`,
      borderRadius: 8, padding: "12px 16px", minWidth: 180,
      boxShadow: `0 0 20px ${caja.color}33`
    }}>
      <div style={{ color: caja.color, fontWeight: "bold", marginBottom: 8, fontSize: 13 }}>
        ■ {caja.nombre}
      </div>
      <div style={{ fontSize: 11, color: "#8a9ab5", lineHeight: 1.8 }}>
        <div>ID:   <span style={{ color: "#e0e6f0" }}>{caja.id}</span></div>
        <div>Pos:  <span style={{ color: "#e0e6f0" }}>({caja.x}, {caja.y}, {caja.z}) m</span></div>
        <div>Dim:  <span style={{ color: "#e0e6f0" }}>{caja.largo}×{caja.alto}×{caja.ancho} m</span></div>
        <div>Peso: <span style={{ color: "#e0e6f0" }}>{caja.peso} kg</span></div>
      </div>
    </div>
  );
}