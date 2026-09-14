(()=>{"use strict";
const S=()=>window.SIP_ADJUDICACION_STORAGE;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const title=r=>r?.oficial_minsa?.establecimiento||r?.oficial_minsa?.institucion||"Plaza SERUMS";
const loc=r=>[r?.oficial_minsa?.distrito,r?.oficial_minsa?.provincia,r?.oficial_minsa?.departamento].filter(Boolean).join(" · ");
let expanded=false;
function render(){const host=document.getElementById("sip-planes");if(!host||!S())return;const st=S().read(),all=st.alternativas||[],assigned=new Set(["A","B","C"].flatMap(p=>(st.planes[p]||[]).map(S().plazaKey))),free=all.filter(r=>!assigned.has(S().plazaKey(r)));
host.innerHTML=`<button type="button" id="sip-toggle-planes" aria-expanded="${expanded}">Planes de elección ${expanded?"▲":"▼"}</button><div id="sip-plan-content" ${expanded?"":"hidden"}><div class="compare-head"><div><h2>Plan A / B / C</h2><p>Organiza tus alternativas guardadas sin alterar la oferta oficial.</p><div class="sip-planning-note"><strong>Herramienta personal SIP:</strong> Plan A/B/C no forma parte del procedimiento oficial MINSA ni modifica el orden de mérito.</div></div><strong>${all.length} guardadas</strong></div><div class="sip-plan-grid">${["A","B","C"].map(p=>`<section class="sip-plan"><h3>Plan ${p}</h3>${(st.planes[p]||[]).map((r,i)=>`<article class="sip-plan-item"><b>${i+1}. ${esc(title(r))}</b><small>${esc(loc(r))}</small><button data-unplan="${esc(S().plazaKey(r))}">Quitar</button></article>`).join("")||'<div class="empty-state">Sin alternativas.</div>'}</section>`).join("")}</div><h3>Por clasificar</h3><div class="sip-unassigned">${free.map(r=>`<article class="sip-plan-item"><b>${esc(title(r))}</b><small>${esc(loc(r))}</small><div>${["A","B","C"].map(p=>`<button data-plan="${p}" data-key="${esc(S().plazaKey(r))}">Plan ${p}</button>`).join("")}</div></article>`).join("")||'<div class="empty-state">Todas tus alternativas están clasificadas.</div>'}</div>`;
const toggle=host.querySelector("#sip-toggle-planes");if(toggle)toggle.onclick=()=>{expanded=!expanded;render()};host.querySelectorAll("[data-plan]").forEach(b=>b.onclick=()=>{const r=all.find(x=>S().plazaKey(x)===b.dataset.key);if(r){S().assign(b.dataset.plan,r);render()}});
host.querySelectorAll("[data-unplan]").forEach(b=>b.onclick=()=>{const r=all.find(x=>S().plazaKey(x)===b.dataset.unplan);if(r){S().remove(r);render()}});
}
addEventListener("sip:adjudicacion:alternativas",e=>{if(S()){S().setAlternativas(e.detail?.alternativas||[]);render()}});
addEventListener("sip:adjudicacion:state",render);document.addEventListener("DOMContentLoaded",render);window.SIP_ADJUDICACION_PLANES=Object.freeze({render});
})();
