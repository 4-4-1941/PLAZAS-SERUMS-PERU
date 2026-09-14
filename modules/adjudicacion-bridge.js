(()=>{"use strict";
function sync(ev){const rows=ev?.detail?.alternativas;if(Array.isArray(rows))dispatchEvent(new CustomEvent("sip:adjudicacion:alternativas",{detail:{alternativas:rows}}))}
addEventListener("serums:alternativas",sync);
window.SIP_ADJUDICACION_BRIDGE=Object.freeze({sync});
})();
