# Plazas SERUMS Perú

**Módulo independiente e integrable del Ecosistema Profesional SERUMS Perú**  
© SIP · SYSTEM INTELLIGENCE PLATFORM 2026

## Propósito

Plazas SERUMS Perú se proyecta como un explorador profesional para apoyar al postulante después de la evaluación SERUMS y durante la elección de plaza.

No pretende sustituir el proceso oficial de adjudicación ni presentar información pública como propietaria. Su valor estará en organizar, relacionar, consultar, comparar y georreferenciar datos oficiales para convertirlos en información útil para la toma de decisiones.

## Fuente primaria

La fuente inicial es el **Ministerio de Salud del Perú (MINSA)**.

Para SERUMS 2026-I, MINSA publicó la oferta de plazas remuneradas y equivalentes en PDF y XLSX. La publicación oficial indica que el listado está organizado por profesión, institución ofertante, departamento, provincia, distrito y establecimiento, e incorpora el grado de dificultad.

El Anexo de plazas remuneradas 2026-I incluye además campos como sede de adjudicación, número de plazas, DIRESA/GERESA/DIRIS, código RENIPRESS, categoría, presupuesto y bonificaciones señaladas en la publicación oficial.

Referencia oficial:
https://www.gob.pe/institucion/minsa/informes-publicaciones/8040039-oferta-de-plazas-remuneradas-y-equivalentes-para-el-proceso-de-adjudicacion-de-plazas-al-serums-2026-i

Portal temático SERUMS del MINSA:
https://www.gob.pe/institucion/minsa/tema/105-serums/informes-publicaciones

## Principios

1. **Fuente oficial primero.** No inventar plazas, coordenadas, establecimientos ni atributos faltantes.
2. **Trazabilidad.** Conservar convocatoria, modalidad y procedencia de cada dato.
3. **Histórico acumulativo.** 2026-I será la primera cohorte; futuras convocatorias no reemplazarán las anteriores.
4. **Separación entre dato y análisis.** Distinguir información oficial de cualquier cálculo, enriquecimiento o recomendación derivada.
5. **Integración futura.** El módulo debe poder incorporarse posteriormente a `SERUM-APP/plazas/` sin reconstrucción.
6. **Diseño móvil.** La experiencia debe funcionar correctamente en teléfono y escritorio.
7. **No dependencia de URLs rígidas.** Usar rutas relativas y módulos desacoplados para facilitar la integración.

## Recorrido funcional previsto

`Convocatoria → Profesión → Modalidad → Departamento → Provincia → Distrito → Establecimiento/IPRESS → Dificultad → Comparación → Mapa → Cómo llegar`

Funciones proyectadas:

- buscar y filtrar plazas;
- consultar remuneradas y equivalentes;
- ver ficha de establecimiento;
- guardar plazas candidatas;
- comparar candidatas;
- visualizar ubicación en mapa;
- orientar cómo llegar;
- consultar convocatorias históricas;
- relacionar oferta y adjudicación cuando existan datos oficiales compatibles.

## Histórico

Los datos no se sobrescribirán al aparecer una nueva convocatoria.

Estructura prevista:

```text
data/
├── 2026-I/
│   ├── remuneradas.json
│   └── equivalentes.json
├── 2026-II/
└── 2027-I/
```

La convocatoria vigente podrá mostrarse por defecto, manteniendo las anteriores disponibles para consulta histórica.

## Arquitectura objetivo

```text
plazas/
├── index.html
├── assets/
│   └── styles.css
├── modules/
│   ├── plazas.js
│   ├── filtros.js
│   ├── comparador.js
│   └── mapa.js
├── data/
│   └── 2026-I/
└── fuentes/
    └── FUENTES.md
```

La separación se implementará progresivamente. El `index.html` inicial es deliberadamente autocontenido para disponer de una base visible sin introducir dependencias prematuras.

## Integración futura con SERUM-APP

El módulo se desarrolla independientemente, pero su destino arquitectónico es:

```text
SERUM-APP/
├── index.html
├── screening/
├── capacitacion/
├── plazas/
│   ├── index.html
│   ├── assets/
│   ├── modules/
│   ├── data/
│   └── fuentes/
└── ...
```

La integración definitiva solo se realizará después de auditar el estado real de SERUM-APP en ese momento.

## Estado actual

**Etapa base — estructura inicial.**

Incluido:

- `index.html` profesional, responsive y sin datos ficticios;
- `README.md` con propósito, principios, arquitectura e integración prevista.

Pendiente de las siguientes iteraciones:

- descargar y auditar los XLSX oficiales 2026-I;
- definir esquema normalizado;
- transformar datos oficiales a formato consumible por la aplicación;
- implementar filtros reales;
- conciliación RENIPRESS;
- georreferenciación verificable;
- mapa y rutas;
- comparador y favoritos;
- histórico de adjudicaciones.

## Advertencia

Plazas SERUMS Perú es una herramienta informativa y de apoyo. La disponibilidad, requisitos, cronogramas, adjudicación y demás decisiones oficiales corresponden a MINSA y a las entidades competentes. Ante discrepancias, prevalece siempre la fuente oficial.

---

**ECOSISTEMA PROFESIONAL SERUMS PERÚ**  
© SIP · SYSTEM INTELLIGENCE PLATFORM 2026
