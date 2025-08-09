let detallesDiagnostico=[];
function mostrarListarDiagnostico(){let c=dameContenido("paginas/referenciales/diagnostico/listar.php");$("#contenido-principal").html(c);cargarTablaDiagnostico();}
window.mostrarListarDiagnostico=mostrarListarDiagnostico;

function mostrarAgregarDiagnostico(){let c=dameContenido("paginas/referenciales/diagnostico/agregar.php");$("#contenido-principal").html(c);detallesDiagnostico=[];cargarListaRecepciones();}
window.mostrarAgregarDiagnostico=mostrarAgregarDiagnostico;

function cargarListaRecepciones(selId=""){let d=ejecutarAjax("controladores/recepcion.php","leer=1"),$s=$("#id_recepcion_lst");$s.html('<option value="">-- Seleccione --</option>');if(d!=="0"){JSON.parse(d).forEach(r=>$s.append(`<option value="${r.id_recepcion}">${r.id_recepcion} - ${r.nombre_cliente}</option>`));if(selId)$s.val(selId);}}
$(document).on("change","#id_recepcion_lst",function(){let id=$(this).val(),$s=$("#id_detalle_lst");$s.html('<option value="">-- Equipo --</option>');if(id){let det=ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+id);if(det!=="0")JSON.parse(det).forEach(d=>$s.append(`<option value="${d.id_detalle}">${d.nombre_equipo}</option>`));}});

function agregarDetalleDiagnostico(){if($("#componente_txt").val().trim()===''){mensaje_dialogo_info_ERROR("Ingrese componente","ERROR");return;}let det={componente:$("#componente_txt").val().trim(),estado_componente:$("#estado_comp_lst").val(),hallazgo:$("#hallazgo_txt").val().trim(),accion_recomendada:$("#accion_txt").val().trim(),id_repuesto:null,cantidad_repuesto:0,costo_unitario_estimado:0,costo_linea_estimado:0,nota_adicional:null};detallesDiagnostico.push(det);renderDetallesDiagnostico();$("#componente_txt,#hallazgo_txt,#accion_txt").val('');}
window.agregarDetalleDiagnostico=agregarDetalleDiagnostico;

function renderDetallesDiagnostico(){let tb=$("#detalle_diagnostico_tb");tb.html('');detallesDiagnostico.forEach((d,i)=>tb.append(`<tr><td>${d.componente}</td><td>${d.estado_componente}</td><td>${d.hallazgo}</td><td>${d.accion_recomendada}</td><td><button class="btn btn-danger btn-sm" onclick="eliminarDetalleDiagnostico(${i});return false;"><i class="bi bi-trash"></i></button></td></tr>`));}

function eliminarDetalleDiagnostico(i){detallesDiagnostico.splice(i,1);renderDetallesDiagnostico();}
window.eliminarDetalleDiagnostico=eliminarDetalleDiagnostico;

function guardarDiagnostico(){if($("#id_recepcion_lst").val()===''){mensaje_dialogo_info_ERROR("Seleccione recepción","ERROR");return;}if(detallesDiagnostico.length===0){mensaje_dialogo_info_ERROR("Debe agregar detalle","ERROR");return;}let datos={id_recepcion:$("#id_recepcion_lst").val(),id_detalle_recepcion:$("#id_detalle_lst").val()||null,estado:$("#estado_lst").val(),descripcion_falla:$("#descripcion_falla_txt").val().trim(),tiempo_estimado_horas:parseFloat($("#tiempo_txt").val()||0),costo_mano_obra_estimado:parseFloat($("#costo_mano_txt").val()||0),costo_repuestos_estimado:parseFloat($("#costo_repuestos_txt").val()||0),aplica_garantia:$("#aplica_garantia_lst").val(),observaciones:$("#observaciones_txt").val().trim(),creado_por:1};datos.costo_total_estimado=datos.costo_mano_obra_estimado+datos.costo_repuestos_estimado;let id=$("#id_diagnostico").val();if(id==="0"){id=ejecutarAjax("controladores/diagnostico.php","guardar="+JSON.stringify(datos));detallesDiagnostico.forEach(d=>{d={...d,id_diagnostico:id};ejecutarAjax("controladores/detalle_diagnostico.php","guardar="+JSON.stringify(d));});}else{datos={...datos,id_diagnostico:id,modificado_por:1};ejecutarAjax("controladores/diagnostico.php","actualizar="+JSON.stringify(datos));ejecutarAjax("controladores/detalle_diagnostico.php","eliminar_por_diagnostico="+id);detallesDiagnostico.forEach(d=>{d={...d,id_diagnostico:id};ejecutarAjax("controladores/detalle_diagnostico.php","guardar="+JSON.stringify(d));});}mensaje_confirmacion("Guardado correctamente");mostrarListarDiagnostico();}
window.guardarDiagnostico=guardarDiagnostico;

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




function cargarTablaDiagnostico(){let datos=ejecutarAjax("controladores/diagnostico.php","leer=1");if(datos==="0"){$("#diagnostico_datos_tb").html("NO HAY REGISTROS");}else{let js=JSON.parse(datos);$("#diagnostico_datos_tb").html('');js.forEach(it=>{$("#diagnostico_datos_tb").append(`<tr><td>${it.id_diagnostico}</td><td>${it.id_recepcion} - ${it.nombre_cliente}</td><td>${it.fecha_inicio}</td><td>${badgeEstado(it.estado)}</td><td><button class="btn btn-secondary btn-sm imprimir-diagnostico" data-id="${it.id_diagnostico}"><i class="bi bi-printer"></i></button> <button class="btn btn-warning btn-sm editar-diagnostico" data-id="${it.id_diagnostico}"><i class="bi bi-pencil-square"></i></button> <button class="btn btn-danger btn-sm eliminar-diagnostico" data-id="${it.id_diagnostico}"><i class="bi bi-trash"></i></button></td></tr>`);});}}

function cargarDiagnostico(id){let d=ejecutarAjax("controladores/diagnostico.php","leer_id="+id);if(d!=='0'){let j=JSON.parse(d);mostrarAgregarDiagnostico();$("#id_diagnostico").val(j.id_diagnostico);$("#estado_lst").val(j.estado);$("#descripcion_falla_txt").val(j.descripcion_falla);$("#observaciones_txt").val(j.observaciones);$("#tiempo_txt").val(j.tiempo_estimado_horas);$("#costo_mano_txt").val(j.costo_mano_obra_estimado);$("#costo_repuestos_txt").val(j.costo_repuestos_estimado);$("#aplica_garantia_lst").val(j.aplica_garantia);cargarListaRecepciones(j.id_recepcion);let detRec=ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+j.id_recepcion);if(detRec!=='0'){let arr=JSON.parse(detRec),$s=$("#id_detalle_lst");arr.forEach(e=>$s.append(`<option value="${e.id_detalle}">${e.nombre_equipo}</option>`));$s.val(j.id_detalle_recepcion);}let det=ejecutarAjax("controladores/detalle_diagnostico.php","leer=1&id_diagnostico="+id);if(det!=='0'){detallesDiagnostico=JSON.parse(det);renderDetallesDiagnostico();}}}
$(document).on("click",".editar-diagnostico",function(){cargarDiagnostico($(this).data('id'));});
$(document).on("click",".eliminar-diagnostico",function(){if(confirm("¿Eliminar?")){ejecutarAjax("controladores/diagnostico.php","eliminar="+$(this).data('id'));cargarTablaDiagnostico();}});
$(document).on("click",".imprimir-diagnostico",function(){imprimirDiagnostico($(this).data('id'));});
