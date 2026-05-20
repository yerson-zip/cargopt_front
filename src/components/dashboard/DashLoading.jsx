export default function DashLoading({ message = "Cargando..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "60vh", gap: 16 }}>
      <div style={{
        width: 36, height: 36, border: "3px solid var(--border2)",
        borderTop: "3px solid var(--blue)", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 2 }}>
        {message.toUpperCase()}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
