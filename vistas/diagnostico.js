let detallesDiagnostico=[];
function mostrarListarDiagnostico(){let c=dameContenido("paginas/referenciales/diagnostico/listar.php");$("#contenido-principal").html(c);cargarTablaDiagnostico();}
window.mostrarListarDiagnostico=mostrarListarDiagnostico;

function mostrarAgregarDiagnostico(){let c=dameContenido("paginas/referenciales/diagnostico/agregar.php");$("#contenido-principal").html(c);detallesDiagnostico=[];cargarListaRecepciones();}
window.mostrarAgregarDiagnostico=mostrarAgregarDiagnostico;

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
    observaciones: _trim("#observaciones_txt"),
    creado_por: 1
  };
  datos.costo_total_estimado = datos.costo_mano_obra_estimado + datos.costo_repuestos_estimado;

  let id = $("#id_diagnostico").val();
  if(id === "0"){
    id = ejecutarAjax("controladores/diagnostico.php","guardar="+JSON.stringify(datos));
    detallesDiagnostico.forEach(d=>{
      d = {...d, id_diagnostico:id};
      ejecutarAjax("controladores/detalle_diagnostico.php","guardar="+JSON.stringify(d));
    });
  }else{
    datos = {...datos, id_diagnostico:id, modificado_por:1};
    ejecutarAjax("controladores/diagnostico.php","actualizar="+JSON.stringify(datos));
    ejecutarAjax("controladores/detalle_diagnostico.php","eliminar_por_diagnostico="+id);
    detallesDiagnostico.forEach(d=>{
      d = {...d, id_diagnostico:id};
      ejecutarAjax("controladores/detalle_diagnostico.php","guardar="+JSON.stringify(d));
    });
  }
  mensaje_confirmacion("Guardado correctamente");
  mostrarListarDiagnostico();
}
window.guardarDiagnostico = guardarDiagnostico;

// Helpers
function _trim(id){ return ($(id).val() || "").toString().trim(); }
function _num(id){ let v = parseFloat($(id).val()); return isNaN(v) ? null : v; }


function imprimirDiagnostico(id){
  const d = ejecutarAjax("controladores/diagnostico.php","leer_id="+id);
  if(d==="0"){ alert("No se encontró el diagnóstico"); return; }
  const diag = JSON.parse(d);

  // Obtener nombre del equipo
  let nombreEquipo = "";
  try{
    const detRec = ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+diag.id_recepcion);
    if(detRec !== "0"){
      const arr = JSON.parse(detRec);
      const match = arr.find(x => String(x.id_detalle) === String(diag.id_detalle_recepcion));
      nombreEquipo = match ? (match.nombre_equipo || match.modelo || "") : "";
    }
  }catch(e){/* ignore */}

  // Detalle de componentes
  let filas = "";
  const det = ejecutarAjax("controladores/detalle_diagnostico.php","leer=1&id_diagnostico="+id);
  if(det !== "0"){
    JSON.parse(det).forEach(e=>{
      const ok = (String(e.estado_componente||"").toUpperCase()==="OK") ? "✔" : "";
      filas += `
        <tr>
          <td>${e.componente||""}</td>
          <td><span class="badge rounded-pill ${String(e.estado_componente||"").toUpperCase()==="OK" ? "bg-success" : "bg-secondary"}">${e.estado_componente||""}</span></td>
          <td>${ok}</td>
          <td class="text-start">${e.hallazgo||""}</td>
          <td class="text-start">${e.accion_recomendada||""}</td>
        </tr>`;
    });
  }

  const tiempoEst = diag.tiempo_estimado_horas || 0;
  const manoObra  = (typeof formatearPY==="function") ? formatearPY(diag.costo_mano_obra_estimado||0) : (diag.costo_mano_obra_estimado||0);
  const repuestos = (typeof formatearPY==="function") ? formatearPY(diag.costo_repuestos_estimado||0) : (diag.costo_repuestos_estimado||0);
  const garantiaSi = (String(diag.aplica_garantia||"").toUpperCase()==="SI" || diag.aplica_garantia===1);
  const garantiaTxt = garantiaSi ? "Sí" : "No";
  const garantiaBadge = garantiaSi ? "bg-success" : "bg-danger";
  const estadoBadge = (String(diag.estado||"").toUpperCase()==="FINALIZADO") ? "bg-primary" : "bg-warning text-dark";

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
    <html>
    <head>
      <title>Diagnóstico #${diag.id_diagnostico}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        @page { size: A4; margin: 16mm; }
        body { color:#111; font-family: "Segoe UI", Arial, sans-serif; }
        .doc-header { display:flex; align-items:center; border-bottom:2px solid #0d6efd; padding-bottom:10px; margin-bottom:18px; }
        .doc-logo { flex:0 0 auto; }
        .doc-logo img { height:110px; }
        .doc-info { flex:1; padding-left:15px; }
        .doc-title { margin:0; font-weight:800; letter-spacing:.3px; }
        .meta { font-size:12px; color:#555; margin-top:4px; }
        .kpi-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; }
        .kpi { border:1px solid #e9ecef; border-radius:12px; padding:14px; background:#f8f9fa; }
        .kpi .lbl { font-size:12px; color:#6c757d; margin-bottom:4px; text-transform:uppercase; letter-spacing:.3px; }
        .kpi .val { font-size:15px; font-weight:600; }
        .section { margin-top:18px; }
        .section .section-title { font-size:13px; font-weight:700; color:#0d6efd; text-transform:uppercase; letter-spacing:.4px; margin-bottom:8px; }
        .note-box { border:1px dashed #cfe2ff; background:#f8fbff; border-radius:10px; padding:12px; min-height:60px; }
        table { width:100%; border-collapse:collapse; }
        thead th { background:#e9f2ff; border-bottom:1px solid #cfe2ff !important; font-weight:700; }
        th, td { border:1px solid #e9ecef; padding:8px; font-size:12.5px; vertical-align:top; }
        .text-start { text-align:left; }
        .footer { margin-top:20px; font-size:11px; color:#6c757d; text-align:right; }
        @media print { .no-print { display:none !important; } }
      </style>
    </head>
    <body>
      <div class="doc-header">
        <div class="doc-logo">
          <img src="images/logo.png" alt="Logo">
        </div>
        <div class="doc-info">
          <h2 class="doc-title">Diagnóstico #${diag.id_diagnostico}</h2>
          <div class="meta">
            Recepción: <strong>${diag.id_recepcion || ""}</strong>
            &nbsp;·&nbsp; Estado: <span class="badge ${estadoBadge}">${diag.estado || ""}</span>
            &nbsp;·&nbsp; Fecha inicio: <strong>${diag.fecha_inicio || ""}</strong>
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi">
          <div class="lbl">Equipo</div>
          <div class="val">${nombreEquipo || ""}</div>
        </div>
        <div class="kpi">
          <div class="lbl">Tiempo Est. (h)</div>
          <div class="val">${tiempoEst}</div>
        </div>
        <div class="kpi">
          <div class="lbl">Costo Mano Obra</div>
          <div class="val">${manoObra}</div>
        </div>
        <div class="kpi">
          <div class="lbl">Costo Repuestos</div>
          <div class="val">${repuestos}</div>
        </div>
        <div class="kpi">
          <div class="lbl">Garantía</div>
          <div class="val"><span class="badge ${garantiaBadge}">${garantiaTxt}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Descripción de Falla</div>
        <div class="note-box">${(diag.descripcion_falla || "").replaceAll("\\n","<br>")}</div>
      </div>

      <div class="section">
        <div class="section-title">Observaciones</div>
        <div class="note-box">${(diag.observaciones || "").replaceAll("\\n","<br>")}</div>
      </div>

      <div class="section">
        <div class="section-title">Componentes</div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th style="width:22%">Componente</th>
              <th style="width:12%">Estado</th>
              <th style="width:6%">OK</th>
              <th style="width:30%">Hallazgo</th>
              <th style="width:30%">Acción Recomendada</th>
            </tr>
          </thead>
          <tbody>
            ${filas || `<tr><td colspan="5" class="text-start">Sin componentes</td></tr>`}
          </tbody>
        </table>
      </div>

      <div class="footer">
        Documento generado automáticamente.
      </div>

      <script>window.print();</script>
    </body>
    </html>
  `);
  v.document.close();
  v.focus();
}
window.imprimirDiagnostico = imprimirDiagnostico;




function cargarTablaDiagnostico(filtro=""){let q=filtro?"leer_descripcion="+filtro:"leer=1",datos=ejecutarAjax("controladores/diagnostico.php",q);if(datos==="0"){$("#diagnostico_datos_tb").html("NO HAY REGISTROS");}else{let js=JSON.parse(datos);$("#diagnostico_datos_tb").html('');js.forEach(it=>{$("#diagnostico_datos_tb").append(`<tr><td>${it.id_diagnostico}</td><td>${it.id_recepcion} - ${it.nombre_cliente}</td><td>${it.fecha_inicio}</td><td>${badgeEstado(it.estado)}</td><td><button class="btn btn-secondary btn-sm imprimir-diagnostico" data-id="${it.id_diagnostico}"><i class="bi bi-printer"></i></button> <button class="btn btn-warning btn-sm editar-diagnostico" data-id="${it.id_diagnostico}"><i class="bi bi-pencil-square"></i></button> <button class="btn btn-danger btn-sm eliminar-diagnostico" data-id="${it.id_diagnostico}"><i class="bi bi-trash"></i></button></td></tr>`);});}}

function cargarDiagnostico(id){let d=ejecutarAjax("controladores/diagnostico.php","leer_id="+id);if(d!=='0'){let j=JSON.parse(d);mostrarAgregarDiagnostico();$("#id_diagnostico").val(j.id_diagnostico);$("#estado_lst").val(j.estado);$("#descripcion_falla_txt").val(j.descripcion_falla);$("#observaciones_txt").val(j.observaciones);$("#tiempo_txt").val(j.tiempo_estimado_horas);$("#costo_mano_txt").val(j.costo_mano_obra_estimado);$("#costo_repuestos_txt").val(j.costo_repuestos_estimado);$("#aplica_garantia_lst").val(j.aplica_garantia);cargarListaRecepciones(j.id_recepcion);let detRec=ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+j.id_recepcion);if(detRec!=='0'){let arr=JSON.parse(detRec),$s=$("#id_detalle_lst");arr.forEach(e=>$s.append(`<option value="${e.id_detalle}">${e.nombre_equipo}</option>`));$s.val(j.id_detalle_recepcion);}let det=ejecutarAjax("controladores/detalle_diagnostico.php","leer=1&id_diagnostico="+id);if(det!=='0'){detallesDiagnostico=JSON.parse(det);renderDetallesDiagnostico();}}}
$(document).on("click",".editar-diagnostico",function(){cargarDiagnostico($(this).data('id'));});
$(document).on("click",".eliminar-diagnostico",function(){if(confirm("¿Eliminar?")){ejecutarAjax("controladores/diagnostico.php","eliminar="+$(this).data('id'));cargarTablaDiagnostico();}});
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

