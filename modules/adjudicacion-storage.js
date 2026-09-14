(()=>{"use strict";
const KEY="sip-serums-adjudicacion-v1";
const empty=()=>({version:1,alternativas:[],planes:{A:[],B:[],C:[]},simulacion:null,adjudicada:null,checklist:{},contexto247:null,updatedAt:null});
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");return x&&x.version===1?{...empty(),...x,planes:{...empty().planes,...(x.planes||{})},checklist:{...(x.checklist||{})}}:empty()}catch{return empty()}}
function write(state){const next={...empty(),...state,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(next));dispatchEvent(new CustomEvent("sip:adjudicacion:state",{detail:next}));return next}
function plazaKey(r){const parts=[r?.convocatoria,r?.modalidad,r?.id].map(v=>String(v??"").trim());return parts.every(Boolean)?parts.join("|"):""}
function setAlternativas(rows){const s=read(),seen=new Set(),alternativas=(rows||[]).filter(r=>{const k=plazaKey(r);if(!k||seen.has(k))return false;seen.add(k);return true}),allowed=new Set(alternativas.map(plazaKey)),planes={A:[],B:[],C:[]};for(const p of ["A","B","C"])planes[p]=(s.planes?.[p]||[]).filter(r=>allowed.has(plazaKey(r)));const adjudicada=s.adjudicada&&allowed.has(plazaKey(s.adjudicada))?s.adjudicada:null;return write({...s,alternativas,planes,adjudicada})}
function assign(plan,row){if(!["A","B","C"].includes(plan))throw Error("Plan inválido");const s=read(),k=plazaKey(row);if(!k)throw Error("Plaza inválida");const planes={A:[],B:[],C:[],...s.planes};for(const p of ["A","B","C"])planes[p]=(planes[p]||[]).filter(r=>plazaKey(r)!==k);planes[plan].push(row);return write({...s,planes})}
function remove(row){const s=read(),k=plazaKey(row),planes={A:[],B:[],C:[],...s.planes};for(const p of ["A","B","C"])planes[p]=(planes[p]||[]).filter(r=>plazaKey(r)!==k);return write({...s,planes})}
function setChecklist(id,value){const s=read();return write({...s,checklist:{...s.checklist,[id]:!!value}})}
function setAdjudicada(row){const s=read(),adjudicada=row||null;return write({...s,adjudicada})}
function setContexto247(ctx){const s=read();return write({...s,contexto247:ctx||null})}
window.SIP_ADJUDICACION_STORAGE=Object.freeze({read,write,setAlternativas,assign,remove,setChecklist,setAdjudicada,setContexto247,plazaKey});
})();
