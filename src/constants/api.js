export const API_BASE = "http://127.0.0.1:8000";
export const getCargaUrl = (camionId, cargaId) =>
  `${API_BASE}/cargas/camiones/${camionId}/cargas/${cargaId}`;