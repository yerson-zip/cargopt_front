import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WizardSteps from "../components/dashboard/WizardSteps";
import DashInp     from "../components/dashboard/DashInp";
import { useOptimizacion } from "../hooks/useCargaData";
import { hashColor } from "../utils/colorUtils";

const EF = { nombre: "", largo: "", alto: "", ancho: "", peso: "", cantidad: 1 };
const empty = (v) => !v || String(v).trim() === "";

export default function PageNuevaCarga({ camiones }) {
  const navigate = useNavigate();
  const [step, setStep]         = useState(1);
  const [camionId, setCamionId] = useState("");
  const [cajas, setCajas]       = useState([]);
  const [fc, setFc]             = useState(EF);
  const [formErr, setFormErr]   = useState("");
  const { optimizar, loading, resultado, error: apiErr } = useOptimizacion();
  const camSel = camiones.find((c) => String(c.id) === String(camionId));

  function addCaja() {
    if ([fc.nombre,fc.largo,fc.alto,fc.ancho,fc.peso].some(empty)) { setFormErr("Todos los campos son requeridos"); return; }
    if ([fc.largo,fc.alto,fc.ancho,fc.peso].some((v) => isNaN(+v)||+v<=0)) { setFormErr("Medidas y peso deben ser números positivos"); return; }
    if (isNaN(+fc.cantidad)||+fc.cantidad<1) { setFormErr("La cantidad debe ser al menos 1"); return; }
    setFormErr("");
    setCajas((p) => [...p, {
      id: `C${String(p.length+1).padStart(3,"0")}`,
      nombre:   fc.nombre,
      largo:    +fc.largo,
      alto:     +fc.alto,
      ancho:    +fc.ancho,
      peso:     +fc.peso,
      cantidad: +fc.cantidad,
      color:    hashColor(fc.nombre),
    }]);
    setFc(EF);
  }

  async function handleOptimizar() {
    try {
      const payload = {
        nombre:      `Carga ${new Date().toLocaleString()}`,
        descripcion: "Carga generada desde frontend",
        camion_id:   Number(camSel.id),
        items: cajas.map((c) => ({
          nombre:   c.nombre,
          largo:    c.largo,
          alto:     c.alto,
          ancho:    c.ancho,
          peso:     c.peso,
          cantidad: c.cantidad,
        })),
      };
      const data = await optimizar(payload);
      if (data?.carga_id && data?.camion_id) {
        navigate(`/optimizer/${data.camion_id}/${data.carga_id}`);
      } else {
        setStep(3);
      }
    } catch (_) {}
  }

  /* STEP 1 */
  if (step === 1) return (
    <>
      <div className="ph"><div><div className="ptitle syne">Nueva Carga</div><div className="psub">PASO 1 DE 3 · SELECCIONAR CAMIÓN</div></div></div>
      <WizardSteps step={1}/>
      <div style={{maxWidth:540,margin:"0 auto"}}>
        <div className="card">
          <div className="ch"><div className="ct syne">¿Qué camión vas a cargar?</div></div>
          <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:9,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase"}}>Seleccionar camión registrado</label>
              <select value={camionId} onChange={(e)=>setCamionId(e.target.value)}
                style={{background:"#0a0c12",border:"1px solid var(--border2)",borderRadius:8,padding:"9px 12px",fontSize:12,color:"var(--text)",fontFamily:"'DM Mono',monospace",outline:"none",cursor:"pointer"}}>
                <option value="">— Seleccionar —</option>
                {camiones.map((c)=><option key={c.id} value={c.id}>{c.nombre} · {c.placa}</option>)}
              </select>
            </div>
            {camSel && (
              <div style={{background:"#0a0c12",border:"1px solid var(--border2)",borderRadius:10,padding:18,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{l:"Largo",v:`${camSel.largo} m`},{l:"Ancho",v:`${camSel.ancho} m`},{l:"Alto",v:`${camSel.alto} m`},
                  {l:"Cap. peso",v:`${camSel.peso_max?.toLocaleString()} kg`},{l:"Vol. total",v:`${(camSel.largo*camSel.ancho*camSel.alto).toFixed(1)} m³`},{l:"Cargas previas",v:camSel.cargas??0}]
                  .map((m,i)=>(
                  <div key={i}><div style={{fontSize:8,color:"var(--muted)",letterSpacing:2,marginBottom:3}}>{m.l}</div>
                  <div style={{fontSize:13,color:"var(--blue)",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{m.v}</div></div>
                ))}
              </div>
            )}
            <button className="btn bp" style={{alignSelf:"flex-end",opacity:camSel?1:0.4,pointerEvents:camSel?"auto":"none"}}
              onClick={()=>setStep(2)}>Continuar → Agregar cajas</button>
          </div>
        </div>
      </div>
    </>
  );

  /* STEP 2 */
  if (step === 2) return (
    <>
      <div className="ph">
        <div><div className="ptitle syne">Nueva Carga</div><div className="psub">PASO 2 DE 3 · {camSel.nombre}</div></div>
        <button className="btn bg" onClick={()=>setStep(1)}>← Volver</button>
      </div>
      <WizardSteps step={2}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.1fr",gap:20}}>
        <div className="card">
          <div className="ch"><div><div className="ct syne">Agregar caja</div><div className="cs">DIMENSIONES EN METROS</div></div></div>
          <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
            <DashInp label="Nombre / descripción" value={fc.nombre} onChange={(v)=>setFc((p)=>({...p,nombre:v}))} placeholder="Ej: Nevera LG"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <DashInp label="Largo" value={fc.largo} onChange={(v)=>setFc((p)=>({...p,largo:v}))} type="number" placeholder="0.0" unit="m"/>
              <DashInp label="Alto"  value={fc.alto}  onChange={(v)=>setFc((p)=>({...p,alto:v}))}  type="number" placeholder="0.0" unit="m"/>
              <DashInp label="Ancho" value={fc.ancho} onChange={(v)=>setFc((p)=>({...p,ancho:v}))} type="number" placeholder="0.0" unit="m"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <DashInp label="Peso"     value={fc.peso}     onChange={(v)=>setFc((p)=>({...p,peso:v}))}     type="number" placeholder="0"   unit="kg"/>
              <DashInp label="Cantidad" value={fc.cantidad} onChange={(v)=>setFc((p)=>({...p,cantidad:v}))} type="number" placeholder="1"   unit="uds"/>
            </div>
            {formErr&&<div style={{fontSize:10,color:"#e74c3c",padding:"8px 12px",background:"#2a080822",borderRadius:6,border:"1px solid #e74c3c44"}}>{formErr}</div>}
            <button className="btn bp" style={{alignSelf:"flex-start"}} onClick={addCaja}>+ Agregar caja</button>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card" style={{flex:1}}>
            <div className="ch">
              <div><div className="ct syne">Manifiesto</div><div className="cs">{cajas.length} CAJAS</div></div>
              {cajas.length>0&&<div style={{fontSize:10,color:"var(--muted2)"}}>{cajas.reduce((s,c)=>s+c.peso,0)} kg</div>}
            </div>
            <div style={{padding:"0 20px",maxHeight:300,overflowY:"auto"}}>
              {cajas.length===0?(
                <div style={{padding:"40px 0",textAlign:"center",color:"var(--muted)",fontSize:11}}>
                  <div style={{fontSize:28,marginBottom:10}}>◻</div>Aún no hay cajas
                </div>
              ):cajas.map((c,i)=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",
                  borderBottom:i<cajas.length-1?"1px solid var(--border)":"none"}}>
                  <div style={{width:10,height:10,borderRadius:2,background:c.color,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:500}}>{c.nombre}</div>
                    <div style={{fontSize:9,color:"var(--muted)",marginTop:2}}>{c.id} · {c.largo}×{c.alto}×{c.ancho} m · {c.peso} kg · ×{c.cantidad}</div>
                  </div>
                  <button onClick={()=>setCajas((p)=>p.filter((x)=>x.id!==c.id))}
                    style={{background:"transparent",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:14,padding:"2px 6px",borderRadius:4}}
                    onMouseEnter={(e)=>e.target.style.color="#e74c3c"}
                    onMouseLeave={(e)=>e.target.style.color="var(--muted)"}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {cajas.length>0&&(()=>{
            const pt=cajas.reduce((s,c)=>s+c.peso,0); const exc=pt>camSel.peso_max;
            return(
              <div style={{background:"#0a0c12",border:"1px solid var(--border2)",borderRadius:10,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)",marginBottom:6}}>
                  <span>Peso acumulado</span>
                  <span style={{color:exc?"#e74c3c":"#2ecc71"}}>{pt} / {camSel.peso_max} kg</span>
                </div>
                <div style={{height:6,borderRadius:3,background:"var(--border)"}}>
                  <div style={{height:"100%",borderRadius:3,transition:"width 0.4s",
                    width:`${Math.min(100,(pt/camSel.peso_max)*100)}%`,background:exc?"#e74c3c":"#2ecc71"}}/>
                </div>
              </div>
            );
          })()}

          {apiErr&&<div style={{fontSize:10,color:"#e74c3c",padding:"10px 14px",background:"#2a080822",borderRadius:8,border:"1px solid #e74c3c44"}}>{apiErr}</div>}
          <button className="btn bp pulse" disabled={loading}
            style={{opacity:cajas.length>0?1:0.4,pointerEvents:cajas.length>0?"auto":"none"}}
            onClick={handleOptimizar}>
            {loading?"⟳ Calculando...": `⟁ Optimizar ${cajas.length} cajas →`}
          </button>
        </div>
      </div>
    </>
  );

  /* STEP 3 — fallback si el backend no devuelve IDs para navegar */
  if (step===3&&resultado) {
    const col = resultado.cajas_colocadas ?? [];
    const rej = resultado.cajas_rechazadas ?? [];
    const m   = resultado.metricas ?? {};
    return (
      <>
        <div className="ph">
          <div><div className="ptitle syne">Resultado</div><div className="psub">DISTRIBUCIÓN ÓPTIMA CALCULADA</div></div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn bg" onClick={()=>{setStep(1);setCajas([]);setCamionId("");}}>+ Nueva carga</button>
            {resultado.carga_id&&resultado.camion_id&&(
              <button className="btn bp" onClick={()=>navigate(`/optimizer/${resultado.camion_id}/${resultado.carga_id}`)}>
                ▦ Ver en 3D →
              </button>
            )}
          </div>
        </div>
        <WizardSteps step={3}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
          {[
            {l:"Ocupación",       v:`${m.ocupacion??'—'}%`,          c:(m.ocupacion??0)>85?"#2ecc71":"#f59e0b"},
            {l:"Peso cargado",    v:`${m.peso_cargado??'—'} kg`,     c:"#4a9eff"},
            {l:"Cajas colocadas", v:m.cajas_colocadas??col.length,   c:"#2ecc71"},
            {l:"Cajas rechazadas",v:m.cajas_rechazadas??rej.length,  c:(m.cajas_rechazadas??rej.length)>0?"#e74c3c":"#2ecc71"},
          ].map((item,i)=>(
            <div key={i} className="sc">
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:item.c,marginBottom:4}}>{item.v}</div>
              <div style={{fontSize:10,color:"var(--muted2)",letterSpacing:1}}>{item.l}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="ch"><div><div className="ct syne">Cajas colocadas</div><div className="cs">{col.length} ITEMS</div></div></div>
          <div style={{padding:"0 20px",maxHeight:300,overflowY:"auto"}}>
            {col.map((c,i)=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",
                borderBottom:i<col.length-1?"1px solid var(--border)":"none"}}>
                <div style={{width:8,height:8,borderRadius:2,background:c.color??hashColor(c.nombre),flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:11}}>{c.nombre}</div>
                  <div style={{fontSize:9,color:"var(--muted)",marginTop:1}}>pos: ({c.x},{c.y},{c.z}) m</div>
                </div>
                <span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:"#1a4a2a",color:"#2ecc71"}}>✓ OK</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  return null;
}