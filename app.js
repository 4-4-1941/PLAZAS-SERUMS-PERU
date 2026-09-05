(() => {
  "use strict";

  const DATA_ROOT = "data/2026-I/";
  const cache = new Map();

  const $ = (id) => document.getElementById(id);

  const els = {
    convocatoria: $("f-convocatoria"),
    profesion: $("f-profesion"),
    modalidad: $("f-modalidad"),
    departamento: $("f-departamento"),
    provincia: $("f-provincia"),
    distrito: $("f-distrito"),
    buscar: $("btn-buscar"),
    resultados: $("resultados"),
    estado: $("estado-datos")
  };

  if (Object.values(els).some(el => !el)) {
    console.error(
      "PLAZAS SERUMS: faltan controles requeridos en index.html."
    );
    return;
  }

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);

  const uniqueSorted = (values) =>
    [...new Set(values.filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" })
    );

  function setOptions(
    select,
    values,
    placeholder,
    selected = ""
  ) {
    select.innerHTML =
      `<option value="">${esc(placeholder)}</option>` +
      values
        .map(v => `<option value="${esc(v)}">${esc(v)}</option>`)
        .join("");

    if (selected && values.includes(selected)) {
      select.value = selected;
    }

    select.disabled = values.length === 0;
  }

  function modalidadArchivo() {
    if (els.modalidad.value === "remuneradas") {
      return "remuneradas.json";
    }

    if (els.modalidad.value === "equivalentes") {
      return "equivalentes.json";
    }

    return null;
  }

  async function cargarModalidad() {
    const archivo = modalidadArchivo();

    if (!archivo) return [];

    if (cache.has(archivo)) {
      return cache.get(archivo);
    }

    els.estado.textContent =
      "Cargando oferta oficial MINSA…";

    const res = await fetch(
      DATA_ROOT + archivo,
      { cache: "no-cache" }
    );

    if (!res.ok) {
      throw new Error(
        `No se pudo cargar ${archivo} (${res.status})`
      );
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error(
        `${archivo} no contiene un arreglo válido.`
      );
    }

    cache.set(archivo, data);

    els.estado.textContent =
      `${data.length.toLocaleString("es-PE")} ` +
      "registros oficiales cargados.";

    return data;
  }

  const oficial = r => r.oficial_minsa || {};
  const normalizado = r => r.normalizado || {};

  function baseFiltrada(data, omitir = "") {
    return data.filter(r => {
      const x = oficial(r);

      if (
        omitir !== "profesion" &&
        els.profesion.value &&
        x.profesion !== els.profesion.value
      ) {
        return false;
      }

      if (
        omitir !== "departamento" &&
        els.departamento.value &&
        (
          normalizado(r).departamento ||
          x.departamento
        ) !== els.departamento.value
      ) {
        return false;
      }

      if (
        omitir !== "provincia" &&
        els.provincia.value &&
        x.provincia !== els.provincia.value
      ) {
        return false;
      }

      if (
        omitir !== "distrito" &&
        els.distrito.value &&
        x.distrito !== els.distrito.value
      ) {
        return false;
      }

      return true;
    });
  }

  async function reconstruirFiltros(desde) {
    const data = await cargarModalidad();

    if (desde === "modalidad") {
      setOptions(
        els.profesion,
        uniqueSorted(
          data.map(r => oficial(r).profesion)
        ),
        "Todas las profesiones"
      );

      els.departamento.value = "";
      els.provincia.value = "";
      els.distrito.value = "";
    }

    const paraDepartamento =
      baseFiltrada(data, "departamento");

    setOptions(
      els.departamento,
      uniqueSorted(
        paraDepartamento.map(
          r =>
            normalizado(r).departamento ||
            oficial(r).departamento
        )
      ),
      "Todos los departamentos",
      els.departamento.value
    );

    const paraProvincia =
      baseFiltrada(data, "provincia");

    setOptions(
      els.provincia,
      uniqueSorted(
        paraProvincia.map(
          r => oficial(r).provincia
        )
      ),
      "Todas las provincias",
      els.provincia.value
    );

    const paraDistrito =
      baseFiltrada(data, "distrito");

    setOptions(
      els.distrito,
      uniqueSorted(
        paraDistrito.map(
          r => oficial(r).distrito
        )
      ),
      "Todos los distritos",
      els.distrito.value
    );

    els.buscar.disabled = false;
  }

  function render(data) {
    const rows = baseFiltrada(data);

    const plazas = rows.reduce(
      (total, r) =>
        total +
        Number(
          oficial(r).numero_plazas || 0
        ),
      0
    );

    if (!rows.length) {
      els.resultados.innerHTML = `
        <div class="placeholder">
          <strong>
            No se encontraron plazas con estos filtros.
          </strong>
        </div>
      `;
      return;
    }

    const MAX = 200;

    els.resultados.innerHTML = `
      <div class="result-summary">

        <strong>
          ${plazas.toLocaleString("es-PE")}
          plaza${plazas === 1 ? "" : "s"}
        </strong>

        · ${rows.length.toLocaleString("es-PE")}
        registro${rows.length === 1 ? "" : "s"} MINSA

        ${
          rows.length > MAX
            ? ` · mostrando los primeros ${MAX}`
            : ""
        }

      </div>

      <div class="result-list">

        ${rows
          .slice(0, MAX)
          .map(r => {
            const x = oficial(r);

            return `
              <article class="plaza-card">

                <div class="plaza-head">

                  <strong>
                    ${esc(x.establecimiento)}
                  </strong>

                  <span>
                    ${esc(x.grado_dificultad)}
                  </span>

                </div>

                <div>
                  ${esc(x.distrito)}
                  · ${esc(x.provincia)}
                  · ${esc(
                    normalizado(r).departamento ||
                    x.departamento
                  )}
                </div>

                <div>
                  <b>${esc(x.profesion)}</b>
                  · ${esc(x.numero_plazas)}
                  plaza${
                    Number(x.numero_plazas) === 1
                      ? ""
                      : "s"
                  }
                </div>

                <div>
                  RENIPRESS:
                  ${esc(x.codigo_renipress)}
                  · Categoría:
                  ${esc(x.categoria)}
                </div>

                <div>
                  Institución:
                  ${esc(x.institucion)}
                  · Presupuesto:
                  ${esc(x.presupuesto)}
                </div>

                <div>
                  ZAF: ${esc(x.zaf)}
                  · ZE: ${esc(x.ze)}
                </div>

              </article>
            `;
          })
          .join("")}

      </div>
    `;
  }

  async function safe(fn) {
    try {
      await fn();
    } catch (err) {
      console.error(err);

      els.estado.textContent =
        "Error al cargar los datos.";

      els.resultados.innerHTML = `
        <div class="placeholder">

          <strong>
            No se pudo cargar la oferta.
          </strong>

          <p>${esc(err.message)}</p>

        </div>
      `;
    }
  }

  els.modalidad.addEventListener(
    "change",
    () =>
      safe(async () => {

        setOptions(
          els.profesion,
          [],
          "Cargando…"
        );

        setOptions(
          els.departamento,
          [],
          "Selecciona modalidad"
        );

        setOptions(
          els.provincia,
          [],
          "Selecciona departamento"
        );

        setOptions(
          els.distrito,
          [],
          "Selecciona provincia"
        );

        els.buscar.disabled = true;

        if (els.modalidad.value) {
          await reconstruirFiltros(
            "modalidad"
          );
        }
      })
  );

  els.profesion.addEventListener(
    "change",
    () =>
      safe(async () => {

        els.departamento.value = "";
        els.provincia.value = "";
        els.distrito.value = "";

        await reconstruirFiltros(
          "profesion"
        );
      })
  );

  els.departamento.addEventListener(
    "change",
    () =>
      safe(async () => {

        els.provincia.value = "";
        els.distrito.value = "";

        await reconstruirFiltros(
          "departamento"
        );
      })
  );

  els.provincia.addEventListener(
    "change",
    () =>
      safe(async () => {

        els.distrito.value = "";

        await reconstruirFiltros(
          "provincia"
        );
      })
  );

  els.distrito.addEventListener(
    "change",
    () =>
      safe(async () => {
        await reconstruirFiltros(
          "distrito"
        );
      })
  );

  els.buscar.addEventListener(
    "click",
    () =>
      safe(async () => {
        render(
          await cargarModalidad()
        );
      })
  );

  els.convocatoria.disabled = false;
  els.modalidad.disabled = false;

  els.estado.textContent =
    "Selecciona una modalidad para cargar la oferta oficial.";

})();
