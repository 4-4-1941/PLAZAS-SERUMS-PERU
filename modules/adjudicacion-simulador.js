(()=>{"use strict";
const flatten=st=>["A","B","C"].flatMap(p=>(st.planes?.[p]||[]).map(r=>({plan:p,plaza:r})));
function create({ordenMerito,personasAntes=0,ocupadas=[]}={}){const S=window.SIP_ADJUDICACION_STORAGE;if(!S)throw Error("Storage no disponible");const st=S.read(),lista=flatten(st),off=new Set((ocupadas||[]).map(String)),disponibles=lista.filter(x=>!off.has(S.plazaKey(x.plaza))),resultado={ordenMerito:Number(ordenMerito)||null,personasAntes:Math.max(0,Number(personasAntes)||0),alternativas:lista.length,ocupadas:off.size,disponibles:disponibles.length,siguiente:disponibles[0]||null,fecha:new Date().toISOString(),nota:"Simulación local de planificación. No representa disponibilidad oficial en tiempo real."};S.write({...st,simulacion:resultado});return resultado}
window.SIP_ADJUDICACION_SIMULADOR=Object.freeze({create});
})();
