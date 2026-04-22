import { useRef, useEffect, useState } from "react";
import { buildScene } from "../three/buildScene";
import CajaHoverInfo from "./CajaHoverInfo";
import { COLORS } from "../constants/palette";

export default function CanvasView({ cajas, camion }) {
  const canvasRef = useRef(null);
  const [cajaHover, setCajaHover] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || !camion || cajas.length === 0) return;
    return buildScene(canvasRef.current, cajas, camion, setCajaHover);
  }, [cajas, camion]);

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      <div style={{ position: "absolute", bottom: 16, left: 16,
        fontSize: 11, color: COLORS.textDim, letterSpacing: 1 }}>
        DRAG · rotar &nbsp;|&nbsp; SCROLL · zoom &nbsp;|&nbsp; HOVER · info caja
      </div>
      <CajaHoverInfo caja={cajaHover} />
    </div>
  );
}