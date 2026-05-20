const STEPS = ["Seleccionar camión", "Agregar cajas", "Resultado"];

export default function WizardSteps({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700,
              background:  i + 1 < step ? "var(--blue)" : i + 1 === step ? "#0d1929" : "transparent",
              border:      i + 1 <= step ? "2px solid var(--blue)" : "2px solid var(--border2)",
              color:       i + 1 <= step ? "var(--blue)" : "var(--muted)",
            }}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 10, letterSpacing: 1, whiteSpace: "nowrap",
              color: i + 1 === step ? "var(--text)" : "var(--muted)" }}>
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 1, margin: "0 12px", minWidth: 16,
              background: i + 1 < step ? "var(--blue)" : "var(--border2)" }} />
          )}
        </div>
      ))}
    </div>
  );
}
