export default function DashError({ message, onRetry }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "60vh", gap: 16 }}>
      <div style={{ fontSize: 36, opacity: 0.4 }}>⚠</div>
      <div style={{ fontSize: 14, color: "var(--red)", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
        Error al cargar datos
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)", maxWidth: 320, textAlign: "center", lineHeight: 1.7 }}>
        {message}
      </div>
      {onRetry && (
        <button className="btn bp" onClick={onRetry} style={{ marginTop: 8 }}>
          ↺ Reintentar
        </button>
      )}
    </div>
  );
}
