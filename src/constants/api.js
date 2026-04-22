export const API_BASE = "https://cargopt.onrender.com";
export const getCargaUrl = (camionId, cargaId) =>
  `${API_BASE}/cargas/camiones/${camionId}/cargas/${cargaId}`;