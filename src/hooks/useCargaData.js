import { useState, useEffect, useCallback } from "react";
import { ENDPOINTS } from "../constants/api";
import { mapItem } from "../utils/colorUtils";

// ─────────────────────────────────────────
// Hook original del VISOR 3D — no modificar
// ─────────────────────────────────────────
export function useCargaData(camionId, cargaId) {
  const [camion,  setCamion]  = useState(null);
  const [cajas,   setCajas]   = useState([]);
  const [carga,   setCarga]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch(ENDPOINTS.getCargaUrl(camionId, cargaId))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setCamion(data.camion);
        setCarga(data.carga);
        setCajas(data.items.map(mapItem));
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [camionId, cargaId]);

  return { camion, cajas, carga, loading, error };
}

// ─────────────────────────────────────────
// Helpers auth
// ─────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─────────────────────────────────────────
// Hook: datos del Dashboard
// ─────────────────────────────────────────
export function useDashboardData() {
  const [stats,     setStats]     = useState(null);
  const [historial, setHistorial] = useState([]);
  const [barData,   setBarData]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = authHeaders();
      const [sRes, hRes, bRes] = await Promise.all([
        fetch(ENDPOINTS.DASHBOARD_STATS,                    { headers }),
        fetch(`${ENDPOINTS.HISTORIAL}?limit=5`,             { headers }),
        fetch(ENDPOINTS.DASHBOARD_OCUPACION,                { headers }),
      ]);
      if (!sRes.ok || !hRes.ok || !bRes.ok)
        throw new Error("Error al cargar datos del dashboard");
      const [statsData, histData, barRaw] = await Promise.all([
        sRes.json(), hRes.json(), bRes.json(),
      ]);
      setStats(statsData);
      setHistorial(histData);
      setBarData(barRaw);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { stats, historial, barData, loading, error, refetch: fetchAll };
}

// ─────────────────────────────────────────
// Hook: CRUD de camiones
// ─────────────────────────────────────────
export function useCamiones() {
  const [camiones, setCamiones] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const fetchCamiones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.CAMIONES, { headers: authHeaders() });
      if (!res.ok) throw new Error("Error al cargar camiones");
      setCamiones(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCamiones(); }, [fetchCamiones]);

  const crearCamion = async (data) => {
    const res = await fetch(ENDPOINTS.CAMIONES, {
      method: "POST", headers: authHeaders(), body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear camión");
    const nuevo = await res.json();
    setCamiones((p) => [...p, nuevo]);
    return nuevo;
  };

  const editarCamion = async (id, data) => {
    const res = await fetch(ENDPOINTS.CAMION_BY_ID(id), {
      method: "PUT", headers: authHeaders(), body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al editar camión");
    const updated = await res.json();
    setCamiones((p) => p.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const eliminarCamion = async (id) => {
    const res = await fetch(ENDPOINTS.CAMION_BY_ID(id), {
      method: "DELETE", headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar camión");
    setCamiones((p) => p.filter((c) => c.id !== id));
  };

  return { camiones, loading, error, refetch: fetchCamiones,
           crearCamion, editarCamion, eliminarCamion };
}

// ─────────────────────────────────────────
// Hook: lanzar optimización
// ─────────────────────────────────────────
export function useOptimizacion() {
  const [loading,   setLoading]   = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error,     setError]     = useState(null);

  const optimizar = async (payload) => {          // ← recibe el payload completo
    setLoading(true);
    setError(null);
    setResultado(null);
    try {
      const res = await fetch(ENDPOINTS.OPTIMIZAR, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),             // ← lo manda tal cual
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResultado(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { optimizar, loading, resultado, error, reset: () => setResultado(null) };
}
