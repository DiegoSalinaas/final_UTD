let detallesDiagnostico=[];
function mostrarListarDiagnostico(){
  let c=dameContenido("paginas/referenciales/diagnostico/listar.php");
  $("#contenido-principal").html(c);
  cargarTablaDiagnostico();
  cargarPendientesDiagnostico();
}
window.mostrarListarDiagnostico=mostrarListarDiagnostico;

function mostrarAgregarDiagnostico(reset=true){
  let c=dameContenido("paginas/referenciales/diagnostico/agregar.php");
  $("#contenido-principal").html(c);
  if(reset)detallesDiagnostico=[];
  cargarListaRecepciones();
}
window.mostrarAgregarDiagnostico=mostrarAgregarDiagnostico;

function cargarPendientesDiagnostico(){
  let d=ejecutarAjax("controladores/recepcion.php","leer_pendientes=1");
  let n=d==="0"?0:JSON.parse(d).length;
  $("#recepcion_pendiente_count").text(n);
}

function cargarListaRecepciones(selId=""){let q="leer_pendientes=1";if(selId)q+="&incluido="+selId;let d=ejecutarAjax("controladores/recepcion.php",q),$s=$("#id_recepcion_lst");$s.html('<option value="">-- Seleccione --</option>');if(d!=="0"){JSON.parse(d).forEach(r=>$s.append(`<option value="${r.id_recepcion}">${r.id_recepcion} - ${r.nombre_cliente}</option>`));if(selId)$s.val(selId);}}
$(document).on("change","#id_recepcion_lst",function(){let id=$(this).val(),$s=$("#id_detalle_lst");$s.html('<option value="">-- Equipo --</option>');if(id){let det=ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+id+"&sin_diagnostico=1");if(det!=="0")JSON.parse(det).forEach(d=>$s.append(`<option value="${d.id_detalle}">${d.nombre_equipo}</option>`));}});

function agregarDetalleDiagnostico(){
  if(!validarDetalleDiagnosticoForm()) return;

  let det = {
    componente: _trim("#componente_txt"),
    estado_componente: _trim("#estado_comp_lst"),
    hallazgo: _trim("#hallazgo_txt"),
    accion_recomendada: _trim("#accion_txt"),
    id_repuesto: null,
    cantidad_repuesto: 0,
    costo_unitario_estimado: 0,
    costo_linea_estimado: 0,
    nota_adicional: null
  };
  detallesDiagnostico.push(det);
  renderDetallesDiagnostico();

  $("#componente_txt,#hallazgo_txt,#accion_txt").val('');
  $("#estado_comp_lst").val('');
}
window.agregarDetalleDiagnostico = agregarDetalleDiagnostico;


function renderDetallesDiagnostico(){let tb=$("#detalle_diagnostico_tb");tb.html('');detallesDiagnostico.forEach((d,i)=>tb.append(`<tr><td>${d.componente}</td><td>${d.estado_componente}</td><td>${d.hallazgo}</td><td>${d.accion_recomendada}</td><td><button class="btn btn-danger btn-sm" onclick="eliminarDetalleDiagnostico(${i});return false;"><i class="bi bi-trash"></i></button></td></tr>`));}

function eliminarDetalleDiagnostico(i){detallesDiagnostico.splice(i,1);renderDetallesDiagnostico();}
window.eliminarDetalleDiagnostico=eliminarDetalleDiagnostico;

function guardarDiagnostico(){
  if(!validarDiagnosticoForm()) return;
  if(detallesDiagnostico.length === 0){
    mensaje_dialogo_info_ERROR("Debe agregar al menos un detalle","ATENCIÓN");
    return;
  }

  let datos = {
    id_recepcion: _trim("#id_recepcion_lst"),
    id_detalle_recepcion: _trim("#id_detalle_lst"),
    estado: _trim("#estado_lst"),
    descripcion_falla: _trim("#descripcion_falla_txt"),
    tiempo_estimado_horas: _num("#tiempo_txt") || 0,
    costo_mano_obra_estimado: _num("#costo_mano_txt") || 0,
    costo_repuestos_estimado: _num("#costo_repuestos_txt") || 0,
    aplica_garantia: _trim("#aplica_garantia_lst"),
    observaciones: _trim("#observaciones_txt")
  };
  datos.costo_total_estimado = datos.costo_mano_obra_estimado + datos.costo_repuestos_estimado;

  let id = $("#id_diagnostico").val();
  if(id === "0"){
    datos.creado_por = 1;
    id = ejecutarAjax("controladores/diagnostico.php","guardar="+JSON.stringify(datos));
  }else{
    datos = {...datos, id_diagnostico:id, modificado_por:1};
    ejecutarAjax("controladores/diagnostico.php","actualizar="+JSON.stringify(datos));
    ejecutarAjax("controladores/detalle_diagnostico.php","eliminar_por_diagnostico="+id);
  }

  detallesDiagnostico.forEach(d=>{
    const det = {
      id_diagnostico: id,
      componente: d.componente,
      estado_componente: d.estado_componente,
      hallazgo: d.hallazgo,
      accion_recomendada: d.accion_recomendada,
      id_repuesto: d.id_repuesto,
      cantidad_repuesto: d.cantidad_repuesto,
      costo_unitario_estimado: d.costo_unitario_estimado,
      costo_linea_estimado: d.costo_linea_estimado,
      nota_adicional: d.nota_adicional
    };
    ejecutarAjax("controladores/detalle_diagnostico.php","guardar="+JSON.stringify(det));
  });
  mensaje_confirmacion("Guardado correctamente");
  mostrarListarDiagnostico();
}
window.guardarDiagnostico = guardarDiagnostico;

// Helpers
function _trim(id){ return ($(id).val() || "").toString().trim(); }
function _num(id){ let v = parseFloat($(id).val()); return isNaN(v) ? null : v; }


function imprimirDiagnostico(id, auto = true, copias = 1){
  const d = ejecutarAjax("controladores/diagnostico.php","leer_id="+id);
  if(d==="0"){ alert("No se encontró el diagnóstico"); return; }
  const diag = JSON.parse(d);

  // Equipo desde la recepción (mejor nombre legible)
  let nombreEquipo = "";
  try{
    const detRec = ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+diag.id_recepcion);
    if(detRec !== "0"){
      const arr = JSON.parse(detRec);
      const match = arr.find(x => String(x.id_detalle) === String(diag.id_detalle_recepcion));
      nombreEquipo = match ? (match.nombre_equipo || match.modelo || "") : "";
    }
  }catch(e){}

  // Componentes del diagnóstico
  const det = ejecutarAjax("controladores/detalle_diagnostico.php","leer=1&id_diagnostico="+id);
  const componentes = det !== "0" ? JSON.parse(det) : [];
  const filas = componentes.length ? componentes.map(e=>{
    const est = String(e.estado_componente||"").toUpperCase();
    const ok  = est === "OK" ? "✔" : "";
    const pill = est === "OK" ? "bg-success" :
                 est === "MALO" ? "bg-danger" :
                 "bg-secondary";
    return `
      <tr>
        <td class="text-start">${e.componente||""}</td>
        <td class="text-center"><span class="badge rounded-pill ${pill}">${e.estado_componente||""}</span></td>
        <td class="text-center">${ok}</td>
        <td class="text-start">${(e.hallazgo||"").toString()}</td>
        <td class="text-start">${(e.accion_recomendada||"").toString()}</td>
      </tr>`;
  }).join("") : `<tr><td colspan="5" class="text-start">Sin componentes</td></tr>`;

  // Helpers
  const fmtPY = (n)=> (typeof formatearPY==="function" ? formatearPY(n||0) : new Intl.NumberFormat("es-PY",{maximumFractionDigits:0}).format(Math.round(n||0)));
  const fDMA  = (f)=> (typeof formatearFechaDMA==="function" ? formatearFechaDMA(f) : (f||""));

  // Estados
  const estadoTxt = diag.estado || "EN PROCESO";
  const estUC = estadoTxt.toUpperCase();
  const estadoBadge =
    estUC.includes("FINALIZ") ? "bg-primary" :
    estUC.includes("ANUL")    ? "bg-danger"  :
    "bg-warning text-dark";

  // KPIs
  const tiempoEst = diag.tiempo_estimado_horas || 0;
  const manoObra  = fmtPY(diag.costo_mano_obra_estimado||0);
  const repuestos = fmtPY(diag.costo_repuestos_estimado||0);
  const garantiaSi = (String(diag.aplica_garantia||"").toUpperCase()==="SI" || diag.aplica_garantia===1);
  const garantiaTxt = garantiaSi ? "Sí" : "No";
  const garantiaBadge = garantiaSi ? "bg-success" : "bg-danger";

  // Empresa (ajustar)
  const EMPRESA = {
    nombre: "HARD INFORMATICA S.A.",
    ruc: "84945944-4",
    dir: "Av. Siempre Viva 123 - Asunción",
    tel: "(021) 376-548",
    email: "servicio@hardinformatica.com"
  };

  // Copias
  const etiquetas = ["ORIGINAL", "DUPLICADO", "TRIPLICADO", "COPIA 4"];
  const bloques = [];
  for (let i = 0; i < Math.max(1, copias); i++) {
    const etiqueta = etiquetas[i] || `COPIA ${i+1}`;
    bloques.push(`
      <section class="doc">
        ${estUC.includes("ANUL") ? `<div class="watermark">ANULADO</div>` : ""}

        <header class="doc-header">
          <div class="doc-logo"><img src="images/logo.png" alt="Logo" onerror="this.style.display='none'"></div>
          <div class="doc-empresa">
            <h1>${EMPRESA.nombre}</h1>
            <div class="emp-meta">
              RUC: ${EMPRESA.ruc} &nbsp;•&nbsp; ${EMPRESA.dir}<br>
              Tel.: ${EMPRESA.tel} &nbsp;•&nbsp; ${EMPRESA.email}
            </div>
          </div>
          <div class="doc-right">
            <div class="doc-tipo">DIAGNÓSTICO</div>
            <div class="doc-num">#${diag.id_diagnostico}</div>
            <span class="badge ${estadoBadge}">${estadoTxt}</span>
            <div class="doc-fecha">${fDMA(diag.fecha_inicio)}</div>
            <span class="copia">${etiqueta}</span>
          </div>
        </header>

        <div class="doc-info">
          <div class="pair"><span class="lbl">Recepción:</span> <span class="val">${diag.id_recepcion || ""}</span></div>
          <div class="pair"><span class="lbl">Equipo:</span>    <span class="val">${nombreEquipo || ""}</span></div>
          ${diag.tecnico ? `<div class="pair"><span class="lbl">Técnico:</span> <span class="val">${diag.tecnico}</span></div>` : ""}
          <div class="pair"><span class="lbl">Garantía:</span>  <span class="val"><span class="badge ${garantiaBadge}">${garantiaTxt}</span></span></div>
        </div>

        <div class="kpi-grid">
          <div class="kpi"><div class="lbl">Tiempo Est. (h)</div><div class="val">${tiempoEst}</div></div>
          <div class="kpi"><div class="lbl">Mano de Obra</div><div class="val">${manoObra}</div></div>
          <div class="kpi"><div class="lbl">Repuestos</div><div class="val">${repuestos}</div></div>
          ${diag.fecha_fin ? `<div class="kpi"><div class="lbl">Fecha Fin</div><div class="val">${fDMA(diag.fecha_fin)}</div></div>` : ""}
        </div>

        ${diag.descripcion_falla ? `
        <div class="section">
          <div class="section-title">Descripción de Falla</div>
          <div class="note-box">${String(diag.descripcion_falla).replaceAll("\\n","<br>")}</div>
        </div>` : ""}

        ${diag.observaciones ? `
        <div class="section">
          <div class="section-title">Observaciones</div>
          <div class="note-box">${String(diag.observaciones).replaceAll("\\n","<br>")}</div>
        </div>` : ""}

        <div class="section">
          <div class="section-title">Componentes</div>
          <table class="tabla">
            <thead>
              <tr>
                <th class="text-start" style="width:24%">Componente</th>
                <th class="text-center" style="width:12%">Estado</th>
                <th class="text-center" style="width:6%">OK</th>
                <th class="text-start" style="width:29%">Hallazgo</th>
                <th class="text-start" style="width:29%">Acción Recomendada</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>

        <div class="firmas">
          <div class="fbox"><div class="linea"></div><div class="ftxt">Técnico</div></div>
          <div class="fbox"><div class="linea"></div><div class="ftxt">Cliente</div></div>
          <div class="fbox"><div class="linea"></div><div class="ftxt">Autorizado por</div></div>
        </div>

        <footer class="doc-footer">Documento generado automáticamente — ${new Date().toLocaleString()}</footer>
      </section>
    `);
  }

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Diagnóstico #${diag.id_diagnostico}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      @page { size: A4; margin: 14mm; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { color:#111; font-family: "Segoe UI", Arial, sans-serif; }
      .doc { position: relative; page-break-after: always; }
      .doc:last-of-type { page-break-after: auto; }

      /* Header alineado (logo | empresa | doc) */
      .doc-header{
        display:grid;
        grid-template-columns: auto 1fr auto;
        align-items:center;
        gap:16px;
        border-bottom:2px solid #0d6efd;
        padding-bottom:10px;
        margin-bottom:14px;
      }
      .doc-logo img{ height:70px; display:block; }
      .doc-empresa{ display:flex; flex-direction:column; justify-content:center; }
      .doc-empresa h1{ font-size:20px; font-weight:800; margin:0 0 4px 0; letter-spacing:.2px; text-align:center; }
      .emp-meta{ font-size:12px; color:#555; line-height:1.35; text-align:center; }

      .doc-right{ text-align:right; display:flex; flex-direction:column; gap:6px; align-items:flex-end; }
      .doc-right .doc-tipo{ font-size:14px; font-weight:700; color:#0d6efd; letter-spacing:1.2px; }
      .doc-right .doc-num{ font-size:18px; font-weight:800; }
      .doc-right .doc-fecha{ font-size:12px; color:#555; }
      .doc-right .badge{ font-size:12px; }
      .doc-right .copia{
        background:#f1f3f5; border:1px solid #dee2e6; padding:2px 8px; border-radius:12px; font-size:11px;
      }

      /* Info en pares */
      .doc-info{
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap:6px 12px;
        margin-bottom:10px;
        font-size:13px;
        align-items:center;
      }
      .doc-info .pair{ display:flex; align-items:center; gap:6px; white-space:nowrap; }
      .doc-info .lbl{ color:#6c757d; min-width:90px; font-weight:600; }
      .doc-info .val{ font-weight:600; }

      /* KPIs compactos */
      .kpi-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:10px 12px; margin-bottom:8px; }
      .kpi{ border:1px solid #e9ecef; border-radius:12px; padding:10px 12px; background:#f8f9fa; }
      .kpi .lbl{ font-size:11px; color:#6c757d; margin-bottom:2px; text-transform:uppercase; letter-spacing:.3px; }
      .kpi .val{ font-size:14px; font-weight:700; }

      /* Secciones de texto */
      .section{ margin-top:12px; }
      .section .section-title{ font-size:13px; font-weight:700; color:#0d6efd; text-transform:uppercase; letter-spacing:.4px; margin-bottom:6px; }
      .note-box{ border:1px dashed #cfe2ff; background:#f8fbff; border-radius:10px; padding:10px; min-height:52px; font-size:12.5px; }

      /* Tabla de componentes */
      table.tabla{ width:100%; border-collapse:collapse; margin-top:8px; }
      .tabla thead th{
        background:#e9f2ff;
        border:1px solid #cfe2ff !important;
        font-weight:700;
        padding:6px 8px;
        text-align:center;
      }
      .tabla td{
        border:1px solid #e9ecef;
        padding:7px 8px;
        font-size:12.5px;
        vertical-align:top;
      }
      .text-center{text-align:center;} .text-start{text-align:left;} .text-end{text-align:right;}
      thead{ display: table-header-group; }
      tfoot{ display: table-footer-group; }

      /* Firmas y footer */
      .firmas{ display:grid; grid-template-columns: repeat(3, 1fr); gap:22px; margin-top:16px; }
      .firmas .linea{ border-bottom:1px solid #000; height:28px; }
      .firmas .ftxt{ text-align:center; font-size:12px; color:#444; margin-top:6px; }

      .doc-footer{ margin-top:8px; font-size:11px; color:#6c757d; text-align:right; }

      /* Watermark ANULADO */
      .watermark{
        position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
        font-size:100px; opacity:0.07; transform: rotate(-22deg); font-weight:900; color:#dc3545;
        pointer-events:none; user-select:none;
      }

      @media print { .no-print{ display:none !important; } }
    </style>
  </head>
  <body>
    ${bloques.join("")}
    <script>${auto ? "window.print();" : ""}</script>
  </body>
  </html>`);
  v.document.close();
  v.focus();
}
window.imprimirDiagnostico = imprimirDiagnostico;





function cargarTablaDiagnostico(filtro=""){let q=filtro?"leer_descripcion="+filtro:"leer=1",datos=ejecutarAjax("controladores/diagnostico.php",q);if(datos==="0"){$("#diagnostico_datos_tb").html("NO HAY REGISTROS");$("#diagnostico_count").text(0);}else{let js=JSON.parse(datos);$("#diagnostico_datos_tb").html('');js.forEach(it=>{$("#diagnostico_datos_tb").append(`<tr><td>${it.id_diagnostico}</td><td>${it.id_recepcion} - ${it.nombre_cliente}</td><td>${it.fecha_inicio}</td><td>${badgeEstado(it.estado)}</td><td><button class="btn btn-secondary btn-sm imprimir-diagnostico" data-id="${it.id_diagnostico}"><i class="bi bi-printer"></i></button> <button class="btn btn-warning btn-sm editar-diagnostico" data-id="${it.id_diagnostico}"><i class="bi bi-pencil-square"></i></button> <button class="btn btn-danger btn-sm eliminar-diagnostico" data-id="${it.id_diagnostico}"><i class="bi bi-trash"></i></button></td></tr>`);});$("#diagnostico_count").text(js.length);}}

function cargarDiagnostico(id){
  // Cargar la vista de edición antes de establecer los datos para evitar
  // que se reinicie el arreglo de detalles al incluir nuevamente el script
  mostrarAgregarDiagnostico(false);

  let d=ejecutarAjax("controladores/diagnostico.php","leer_id="+id);
  if(d!=='0'){
    let j=JSON.parse(d);

    // Obtener los detalles del diagnóstico ya guardados
    let det=ejecutarAjax("controladores/detalle_diagnostico.php","leer=1&id_diagnostico="+id);
    detallesDiagnostico = det!=="0" ? JSON.parse(det) : [];

    $("#id_diagnostico").val(j.id_diagnostico);
    $("#estado_lst").val(j.estado);
    $("#descripcion_falla_txt").val(j.descripcion_falla);
    $("#observaciones_txt").val(j.observaciones);
    $("#tiempo_txt").val(j.tiempo_estimado_horas);
    $("#costo_mano_txt").val(j.costo_mano_obra_estimado);
    $("#costo_repuestos_txt").val(j.costo_repuestos_estimado);
    $("#aplica_garantia_lst").val(j.aplica_garantia);

    cargarListaRecepciones(j.id_recepcion);
    let detRec=ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+j.id_recepcion);
    if(detRec!=="0"){
      let arr=JSON.parse(detRec),$s=$("#id_detalle_lst");
      arr.forEach(e=>$s.append(`<option value="${e.id_detalle}">${e.nombre_equipo}</option>`));
      $s.val(j.id_detalle_recepcion);
    }

    renderDetallesDiagnostico();
  }
}
$(document).on("click",".editar-diagnostico",function(){cargarDiagnostico($(this).data('id'));});
$(document).on("click",".eliminar-diagnostico",function(){if(confirm("¿Eliminar?")){ejecutarAjax("controladores/diagnostico.php","eliminar="+$(this).data('id'));cargarTablaDiagnostico();cargarPendientesDiagnostico();}});
$(document).on("click",".imprimir-diagnostico",function(){imprimirDiagnostico($(this).data('id'));});
$(document).on("keyup","#b_diagnostico",function(){cargarTablaDiagnostico($(this).val());});



function _val(id){ return $(id).val(); }
function _trim(id){ return (_val(id) || "").toString().trim(); }
function _num(id){ const v = parseFloat(_val(id)); return isNaN(v) ? null : v; }
function _setInvalid($el, cond){
  $el.toggleClass("is-invalid", !!cond);
  return !cond; // true si es válido
}
function _clearInvalid(ids){
  ids.forEach(sel => $(sel).removeClass("is-invalid"));
}

// Quitar rojo al escribir/cambiar
$(document).on("input change", `
  #id_recepcion_lst,#id_detalle_lst,#estado_lst,#descripcion_falla_txt,
  #tiempo_txt,#costo_mano_txt,#costo_repuestos_txt,#aplica_garantia_lst,
  #componente_txt,#estado_comp_lst,#hallazgo_txt,#accion_txt
`, function(){
  $(this).removeClass("is-invalid");
});

// === Validación del formulario principal ===

function validarDiagnosticoForm(){
  // Limpia marcas previas
  _clearInvalid([
    "#id_recepcion_lst","#id_detalle_lst","#estado_lst","#descripcion_falla_txt",
    "#tiempo_txt","#costo_mano_txt","#costo_repuestos_txt","#aplica_garantia_lst"
  ]);

  if(!_trim("#id_recepcion_lst")){
    $("#id_recepcion_lst").addClass("is-invalid");
    mensaje_dialogo_info_ERROR("Seleccione recepción","ATENCIÓN");
    return false;
  }
  if(!_trim("#id_detalle_lst")){
    $("#id_detalle_lst").addClass("is-invalid");
    mensaje_dialogo_info_ERROR("Seleccione equipo","ATENCIÓN");
    return false;
  }
  if(!_trim("#estado_lst")){
    $("#estado_lst").addClass("is-invalid");
    mensaje_dialogo_info_ERROR("Seleccione estado","ATENCIÓN");
    return false;
  }
  if(!_trim("#descripcion_falla_txt")){
    $("#descripcion_falla_txt").addClass("is-invalid");
    mensaje_dialogo_info_ERROR("Ingrese descripción de la falla","ATENCIÓN");
    return false;
  }

  const t = _num("#tiempo_txt");
  if(t === null || t <= 0){
    $("#tiempo_txt").addClass("is-invalid");
    mensaje_dialogo_info_ERROR("El Tiempo Estimado debe ser mayor a 0","ATENCIÓN");
    return false;
  }

  const m = _num("#costo_mano_txt");
  if(m === null || m <= 0){
    $("#costo_mano_txt").addClass("is-invalid");
    mensaje_dialogo_info_ERROR("El Costo de Mano de Obra debe ser mayor a 0","ATENCIÓN");
    return false;
  }

  const r = _num("#costo_repuestos_txt");
  if(r === null || r <= 0){
    $("#costo_repuestos_txt").addClass("is-invalid");
    mensaje_dialogo_info_ERROR("El Costo de Repuestos debe ser mayor a 0","ATENCIÓN");
    return false;
  }

  if(!_trim("#aplica_garantia_lst")){
    $("#aplica_garantia_lst").addClass("is-invalid");
    mensaje_dialogo_info_ERROR("Seleccione si aplica garantía","ATENCIÓN");
    return false;
  }

  return true;
}



// === Validación del detalle de componentes ===
function validarDetalleDiagnosticoForm(){
  if(!_trim("#componente_txt")){
    mensaje_dialogo_info_ERROR("Ingrese componente","ATENCIÓN");
    return false;
  }
  if(!_trim("#estado_comp_lst")){
    mensaje_dialogo_info_ERROR("Seleccione estado del componente","ATENCIÓN");
    return false;
  }
  if(!_trim("#hallazgo_txt")){
    mensaje_dialogo_info_ERROR("Ingrese hallazgo","ATENCIÓN");
    return false;
  }
  if(!_trim("#accion_txt")){
    mensaje_dialogo_info_ERROR("Ingrese acción recomendada","ATENCIÓN");
    return false;
  }
  return true;
}

// Campos numéricos que deben limpiar el "0" inicial al escribir
const CAMPOS_NUM = '#tiempo_txt,#costo_mano_txt,#costo_repuestos_txt';

// Al enfocar: si está en 0, limpiamos; si tiene otro valor, lo seleccionamos
$(document).on('focus', CAMPOS_NUM, function () {
  const v = ($(this).val() || '').trim();
  if (v === '0' || /^0([.,]0+)?$/.test(v)) {
    $(this).val('');
  } else {
    this.select();
  }
});

// Al escribir: solo permitimos dígitos, coma o punto
$(document).on('input', CAMPOS_NUM, function () {
  this.value = this.value.replace(/[^0-9.,]/g, '');
});

$(document).on('blur', CAMPOS_NUM, function () {
  let v = ($(this).val() || '').trim().replace(',', '.');
  if (v === '' || isNaN(v)) v = '0';
  const n = parseFloat(v);
  $(this).val(Number.isFinite(n) ? n : 0);
  // Marca en rojo si no es > 0
  $(this).toggleClass('is-invalid', !(n > 0));
});

