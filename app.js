(() => {
"use strict";
const ROOT="data/2026-I/", $=id=>document.getElementById(id);
const e={conv:$("f-convocatoria"),mod:$("f-modalidad"),pro:$("f-profesion"),dep:$("f-departamento"),prov:$("f-provincia"),dist:$("f-distrito"),btn:$("btn-buscar"),res:$("resultados"),estado:$("estado-datos")};
if(Object.values(e).some(x=>!x)){console.error("PLAZAS SERUMS: controles faltantes");return;}
const cache=new Map(),
esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),
clave=v=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9Ñ]+/g," ").trim();
const opts=(el,vals,ph)=>{el.innerHTML=`<option value="">${esc(ph)}</option>`+vals.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join("");el.disabled=!vals.length;};
const file=()=>e.mod.value==="remuneradas"?"remuneradas":e.mod.value==="equivalentes"?"equivalentes":"";
async function getJSON(path){if(cache.has(path))return cache.get(path);const r=await fetch(ROOT+path,{cache:"no-cache"});if(!r.ok)throw new Error(`${path}: HTTP ${r.status}`);const d=await r.json();cache.set(path,d);return d;}
async function catalogo(){const m=file();if(!m)return null;e.estado.textContent="Cargando filtros…";const c=await getJSON(`catalogo-${m}.json`);e.estado.textContent=`${c.registros.toLocaleString("es-PE")} registros disponibles.`;return c;}
function ramas(c){const fs=c.filtros,p=e.pro.value;return p&&fs[p]?fs[p]:{};}
function departamentos(c){return Object.keys(ramas(c)).sort((a,b)=>a.localeCompare(b,"es"));}
function provincias(c){const r=ramas(c),d=e.dep.value;return d&&r[d]?Object.keys(r[d]).sort((a,b)=>a.localeCompare(b,"es")):[];}
function distritos(c){const r=ramas(c),d=e.dep.value,p=e.prov.value;return d&&p&&r[d]&&r[d][p]?[...r[d][p]]:[];}
async function resetModalidad(){const c=await catalogo();opts(e.pro,Object.keys(c.filtros).sort((a,b)=>a.localeCompare(b,"es")),"Todas las profesiones");opts(e.dep,[],"Selecciona profesión");opts(e.prov,[],"Selecciona departamento");opts(e.dist,[],"Selecciona provincia");e.btn.disabled=false;}
async function rebuild(level){const c=await catalogo();if(level==="pro"){opts(e.dep,departamentos(c),"Todos los departamentos");opts(e.prov,[],"Selecciona departamento");opts(e.dist,[],"Selecciona provincia");}
if(level==="dep"){opts(e.prov,provincias(c),"Todas las provincias");opts(e.dist,[],"Selecciona provincia");}
if(level==="prov")opts(e.dist,distritos(c),"Todos los distritos");}
const igual=(a,b)=>!b||clave(a)===clave(b);
function match(r){const x=r.oficial_minsa||{},n=r.normalizado||{};return igual(x.profesion,e.pro.value)&&igual(n.departamento||x.departamento,e.dep.value)&&igual(x.provincia,e.prov.value)&&igual(x.distrito,e.dist.value);}
async function buscar(){const m=file();e.estado.textContent="Cargando plazas oficiales…";const data=await getJSON(`${m}.json`);const rows=data.filter(match),plazas=rows.reduce((s,r)=>s+Number((r.oficial_minsa||{}).numero_plazas||0),0),MAX=200;
e.estado.textContent=`${rows.length.toLocaleString("es-PE")} registros encontrados.`;
if(!rows.length){e.res.innerHTML='<div class="placeholder"><strong>No se encontraron plazas.</strong></div>';return;}
e.res.innerHTML=`<div class="result-summary"><strong>${plazas.toLocaleString("es-PE")} plazas</strong> · ${rows.length.toLocaleString("es-PE")} registros MINSA${rows.length>MAX?` · primeros ${MAX}`:""}</div><div class="result-list">${rows.slice(0,MAX).map(r=>{const x=r.oficial_minsa||{},n=r.normalizado||{};return `<article class="plaza-card"><div class="plaza-head"><strong>${esc(x.establecimiento)}</strong><span>${esc(x.grado_dificultad)}</span></div><div>${esc(x.distrito)} · ${esc(x.provincia)} · ${esc(n.departamento||x.departamento)}</div><div><b>${esc(x.profesion)}</b> · ${esc(x.numero_plazas)} plaza(s) · <b>${esc(e.mod.options[e.mod.selectedIndex].text)}</b></div><div>RENIPRESS: ${esc(x.codigo_renipress)} · Categoría: ${esc(x.categoria)}</div><div>Institución: ${esc(x.institucion)} · Presupuesto: ${esc(x.presupuesto)}</div><div>ZAF: ${esc(x.zaf)} · ZE: ${esc(x.ze)}</div></article>`}).join("")}</div>`;}
async function safe(fn){try{await fn()}catch(err){console.error(err);e.estado.textContent="Error al cargar datos.";e.res.innerHTML=`<div class="placeholder"><strong>No se pudo cargar la oferta.</strong><p>${esc(err.message)}</p></div>`;}}
e.mod.addEventListener("change",()=>safe(resetModalidad));
e.pro.addEventListener("change",()=>safe(()=>rebuild("pro")));
e.dep.addEventListener("change",()=>safe(()=>rebuild("dep")));
e.prov.addEventListener("change",()=>safe(()=>rebuild("prov")));
e.btn.addEventListener("click",()=>safe(buscar));
e.conv.disabled=false;e.mod.disabled=false;e.estado.textContent="Selecciona una modalidad para cargar los filtros.";
})();
