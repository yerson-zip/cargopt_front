export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const ENDPOINTS = {
  // Dashboard
  DASHBOARD_STATS:     `${API_BASE}/dashboard/stats`,
  DASHBOARD_OCUPACION: `${API_BASE}/dashboard/ocupacion-mensual`,

  // Historial
  HISTORIAL: `${API_BASE}/cargas/historial`,

  // Camiones CRUD
  CAMIONES:          `${API_BASE}/camiones`,
  CAMION_BY_ID: (id) => `${API_BASE}/camiones/${id}`,

  // Optimización
  OPTIMIZAR: `${API_BASE}/optimizaciones`,

  // Visor 3D (ya existente — no tocar)
  getCargaUrl: (camionId, cargaId) =>
    `${API_BASE}/cargas/camiones/${camionId}/cargas/${cargaId}`,
};
