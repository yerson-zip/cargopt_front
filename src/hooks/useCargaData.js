import { useState, useEffect } from "react";
import { getCargaUrl } from "../constants/api";
import { mapItem } from "../utils/colorUtils";

export function useCargaData(camionId, cargaId) {
  const [camion,  setCamion]  = useState(null);
  const [cajas,   setCajas]   = useState([]);
  const [carga,   setCarga]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch(getCargaUrl(camionId, cargaId))
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