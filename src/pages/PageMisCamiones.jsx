import { useState } from "react";
import { useCamiones } from "../hooks/useCargaData";
import DashInp     from "../components/dashboard/DashInp";
import DashLoading from "../components/dashboard/DashLoading";
import DashError   from "../components/dashboard/DashError";

const EF = { nombre:"", placa:"", largo:"", ancho:"", alto:"", peso_max:"" };
const empty = (v) => !v || String(v).trim() === "";

export default function PageMisCamiones() {
  const { camiones, loading, error, refetch, crearCamion, editarCamion, eliminarCamion } = useCamiones();
  const [form,   setForm]   = useState(EF);
  const [errs,   setErrs]   = useState({});
  const [show,   setShow]   = useState(false);
  const [editId, setEditId] = useState(null);
  const [delId,  setDelId]  = useState(null);
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState("");

  if (loading) return <DashLoading message="Cargando camiones..."/>;
  if (error)   return <DashError   message={error} onRetry={refetch}/>;

  function validar() {
    const e={};
    if(empty(form.nombre)) e.nombre="Requerido";
    if(empty(form.placa))  e.placa="Requerido";
    ["largo","ancho","alto","peso_max"].forEach((k)=>{ if(empty(form[k])||isNaN(+form[k])||+form[k]<=0) e[k]="Número positivo"; });
    return e;
  }

  async function guardar() {
    const e=validar(); if(Object.keys(e).length){setErrs(e);return;}
    setErrs({}); setSaving(true); setApiErr("");
    const data={ nombre:form.nombre, placa:form.placa.toUpperCase(),
      largo:+form.largo, ancho:+form.ancho, alto:+form.alto, peso_max:+form.peso_max };
    try {
      editId ? await editarCamion(editId,data) : await crearCamion(data);
      setForm(EF); setShow(false); setEditId(null);
    } catch(err){ setApiErr(err.message); }
    finally{ setSaving(false); }
  }

  function editar(c) {
    setForm({nombre:c.nombre,placa:c.placa,largo:c.largo,ancho:c.ancho,alto:c.alto,peso_max:c.peso_max});
    setEditId(c.id); setShow(true); setErrs({}); setApiErr("");
  }

  async function confirmarEliminar() {
    setSaving(true);
    try { await eliminarCamion(delId); }
    catch(err){ setApiErr(err.message); }
    finally{ setSaving(false); setDelId(null); }
  }

  return (
    <>
      <div className="ph">
        <div><div className="ptitle syne">Mis Camiones</div><div className="psub">{camiones.length} VEHÍCULOS REGISTRADOS</div></div>
        <button className="btn bp" onClick={()=>{setShow(true);setEditId(null);setForm(EF);setErrs({});setApiErr("");}}>
          + Registrar camión
        </button>
      </div>

      {show&&(
        <div className="card" style={{marginBottom:24,border:"1px solid var(--border2)"}}>
          <div className="ch">
            <div><div className="ct syne">{editId?"Editar camión":"Registrar nuevo camión"}</div><div className="cs">TODOS LOS CAMPOS SON REQUERIDOS</div></div>
            <button className="btn bg" style={{fontSize:10,padding:"6px 12px"}}
              onClick={()=>{setShow(false);setEditId(null);setErrs({});}}>✕ Cancelar</button>
          </div>
          <div style={{padding:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <DashInp label="Nombre" value={form.nombre} onChange={(v)=>setForm((p)=>({...p,nombre:v}))} placeholder="Ej: Turbo Ruta" err={errs.nombre??""} />
            <DashInp label="Placa"  value={form.placa}  onChange={(v)=>setForm((p)=>({...p,placa:v}))}  placeholder="Ej: ABC-123"   err={errs.placa??""} />
            <DashInp label="Largo"    value={form.largo}    onChange={(v)=>setForm((p)=>({...p,largo:v}))}    type="number" unit="m"  err={errs.largo??""} />
            <DashInp label="Ancho"    value={form.ancho}    onChange={(v)=>setForm((p)=>({...p,ancho:v}))}    type="number" unit="m"  err={errs.ancho??""} />
            <DashInp label="Alto"     value={form.alto}     onChange={(v)=>setForm((p)=>({...p,alto:v}))}     type="number" unit="m"  err={errs.alto??""} />
            <DashInp label="Cap. peso" value={form.peso_max} onChange={(v)=>setForm((p)=>({...p,peso_max:v}))} type="number" unit="kg" err={errs.peso_max??""} />
            <div style={{gridColumn:"1/-1",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:16,marginTop:4}}>
              {form.largo&&form.ancho&&form.alto&&!isNaN(+form.largo)&&(
                <div style={{flex:1,fontSize:10,color:"var(--muted2)"}}>
                  Vol: <strong style={{color:"var(--blue)"}}>{(+form.largo*+form.ancho*+form.alto).toFixed(1)} m³</strong>
                </div>
              )}
              {apiErr&&<span style={{fontSize:10,color:"#e74c3c"}}>{apiErr}</span>}
              <button className="btn bp" onClick={guardar} disabled={saving}>
                {saving?"Guardando...":editId?"Guardar cambios":"Registrar camión"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {camiones.map((c)=>(
          <div key={c.id} className="card" style={{transition:"border-color 0.2s"}}
            onMouseEnter={(e)=>e.currentTarget.style.borderColor="var(--border2)"}
            onMouseLeave={(e)=>e.currentTarget.style.borderColor="var(--border)"}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:"#0d1929",border:"1px solid #1e3a6a",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🚛</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontFamily:"'Syne',sans-serif",fontWeight:700,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.nombre}</div>
                <div style={{fontSize:9,color:"var(--muted)",letterSpacing:2,marginTop:2}}>{c.placa}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"var(--blue)"}}>{c.cargas??0}</div>
                <div style={{fontSize:8,color:"var(--muted)",letterSpacing:1}}>cargas</div>
              </div>
            </div>
            <div style={{padding:"16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,borderBottom:"1px solid var(--border)"}}>
              {[{l:"Largo",v:`${c.largo} m`},{l:"Ancho",v:`${c.ancho} m`},{l:"Alto",v:`${c.alto} m`},
                {l:"Cap. peso",v:`${c.peso_max?.toLocaleString()} kg`},{l:"Vol. total",v:`${(c.largo*c.ancho*c.alto).toFixed(1)} m³`}]
                .map((m,i)=>(
                <div key={i}><div style={{fontSize:8,color:"var(--muted)",letterSpacing:2,marginBottom:2}}>{m.l}</div>
                <div style={{fontSize:12,fontWeight:500}}>{m.v}</div></div>
              ))}
            </div>
            <div style={{padding:"12px 20px",display:"flex",gap:8}}>
              <button className="btn bg" style={{flex:1,fontSize:10,padding:"7px 0",justifyContent:"center"}}
                onClick={()=>editar(c)}>✎ Editar</button>
              <button style={{flex:1,fontSize:10,padding:"7px 0",justifyContent:"center",background:"transparent",
                border:"1px solid #4a1a1a",borderRadius:8,color:"#e74c3c",cursor:"pointer",
                fontFamily:"'DM Mono',monospace",letterSpacing:1,display:"flex",alignItems:"center",gap:6,transition:"background 0.15s"}}
                onClick={()=>setDelId(c.id)}
                onMouseEnter={(e)=>e.currentTarget.style.background="#2a080822"}
                onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
                ✕ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {delId&&(
        <div style={{position:"fixed",inset:0,background:"#00000099",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div style={{background:"var(--surface)",border:"1px solid #4a1a1a",borderRadius:14,padding:28,maxWidth:360,width:"90%"}}>
            <div style={{fontSize:16,fontFamily:"'Syne',sans-serif",fontWeight:800,marginBottom:8,color:"#e74c3c"}}>¿Eliminar camión?</div>
            <div style={{fontSize:11,color:"var(--muted2)",marginBottom:20,lineHeight:1.7}}>
              Esto eliminará <strong style={{color:"var(--text)"}}>{camiones.find((c)=>c.id===delId)?.nombre}</strong> permanentemente.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn bg" style={{flex:1,justifyContent:"center"}} onClick={()=>setDelId(null)}>Cancelar</button>
              <button className="btn" style={{flex:1,justifyContent:"center",background:"#e74c3c",color:"#fff",border:"none",
                boxShadow:"0 0 16px #e74c3c33"}} onClick={confirmarEliminar} disabled={saving}>
                {saving?"Eliminando...":"Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
