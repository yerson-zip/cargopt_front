/** Input reutilizable del dashboard — nombre DashInp para no colisionar con nada del visor */
export default function DashInp({ label, value, onChange, type = "text", placeholder = "", unit = "", err = "" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center", background: "#0a0c12",
        border: `1px solid ${err ? "var(--red)" : "var(--border2)"}`,
        borderRadius: 8, overflow: "hidden",
      }}>
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none",
            padding: "9px 12px", fontSize: 12, color: "var(--text)", fontFamily: "'DM Mono',monospace" }}
        />
        {unit && (
          <span style={{ padding: "0 12px", fontSize: 10, color: "var(--muted)", borderLeft: "1px solid var(--border2)" }}>
            {unit}
          </span>
        )}
      </div>
      {err && <span style={{ fontSize: 9, color: "var(--red)" }}>{err}</span>}
    </div>
  );
}
