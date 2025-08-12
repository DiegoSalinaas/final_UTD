// ========================= Variables globales =========================
let detallesRecepcion = [];
let listaClientes = [];

// ========================= Navegación =========================
function mostrarListarRecepcion(){
  let contenido = dameContenido("paginas/referenciales/recepcion/listar.php");
  $("#contenido-principal").html(contenido);
  cargarTablaRecepcion();
}
window.mostrarListarRecepcion = mostrarListarRecepcion;

function mostrarAgregarRecepcion(){
  let contenido = dameContenido("paginas/referenciales/recepcion/agregar.php");
  $("#contenido-principal").html(contenido);
  cargarListaClientes();
  detallesRecepcion = [];
  renderDetallesRecepcion();
  initAccesoriosUI(); // Inicializa chips de accesorios
}
window.mostrarAgregarRecepcion = mostrarAgregarRecepcion;

// ========================= Clientes =========================
function cargarListaClientes(selectedId = ""){
  let datos = ejecutarAjax("controladores/cliente.php","leer=1");
  if(datos !== "0"){
    listaClientes = JSON.parse(datos);
    renderListaClientes(listaClientes, selectedId);
  }
}

function renderListaClientes(arr, selectedId = "") {
  const $sel = $("#id_cliente_lst");
  $sel.html('<option value="">-- Seleccione un cliente --</option>');
  arr.forEach(c => {
    const id  = c.id_cliente ?? c.cod_cliente ?? c.id;
    const nom = c.nombre_apellido ?? c.nombre_cliente ?? c.nombre;
    $sel.append(`<option value="${id}">${nom}</option>`);
  });
  if (selectedId) $sel.val(selectedId).trigger('change'); // prellena al editar
}

$(document).on('change', '#id_cliente_lst', function () {
  const id = $(this).val();
  if (!id) {
    $('#telefono_txt').val('');
    $('#direccion_txt').val('');
    return;
  }
  const c = listaClientes.find(x =>
    String(x.id_cliente ?? x.cod_cliente ?? x.id) === String(id)
  );
  const tel = c?.telefono ?? c?.telefono_cliente ?? '';
  const dir = c?.direccion ?? c?.direccion_cliente ?? '';
  $('#telefono_txt').val(tel);
  $('#direccion_txt').val(dir);
});

// ========================= Accesorios entregados (chips) =========================
let accesoriosTmp = []; // array temporal de accesorios para el equipo en edición

function renderAccesoriosChips(){
  const $wrap = $("#accesorios_chips");
  if(accesoriosTmp.length === 0){
    $wrap.html('<span class="text-muted">Sin accesorios agregados.</span>');
    return;
  }
  const chips = accesoriosTmp.map((a,i)=>`
    <span class="badge bg-light text-dark border me-2 mb-2">
      ${a}
      <button type="button" class="btn btn-sm btn-link text-danger p-0 ms-1 remove-chip" data-i="${i}" title="Quitar">
        <i class="bi bi-x-circle"></i>
      </button>
    </span>
  `).join("");
  $wrap.html(chips);
}

function normalizarAccesorio(txt){ return txt.replace(/\s+/g,' ').trim(); }

function agregarAccesorioDesdeInput(){
  const raw = $("#accesorio_input").val() || "";
  const candidatos = raw.split(",").map(normalizarAccesorio).filter(Boolean);

  let agregados = 0;
  candidatos.forEach(item=>{
    const dup = accesoriosTmp.some(x => x.toLowerCase() === item.toLowerCase());
    if(!dup){ accesoriosTmp.push(item); agregados++; }
  });

  if(agregados === 0 && candidatos.length > 0){
    mensaje_dialogo_info_ERROR("Ese accesorio ya fue agregado o es inválido.","ATENCIÓN");
  }
  $("#accesorio_input").val("");
  renderAccesoriosChips();
}

// Click en botón Agregar
$(document).on("click", "#add_accesorio_btn", agregarAccesorioDesdeInput);

// Enter en el input
$(document).on("keydown", "#accesorio_input", function(e){
  if(e.key === "Enter"){ e.preventDefault(); agregarAccesorioDesdeInput(); }
});

// Quitar chip
$(document).on("click", ".remove-chip", function(){
  accesoriosTmp.splice($(this).data("i"),1);
  renderAccesoriosChips();
});

// Inicializar UI de accesorios (al abrir el formulario o tras guardar un equipo)
function initAccesoriosUI(){
  accesoriosTmp = [];
  $("#accesorio_input").val("");
  renderAccesoriosChips();
}

// ========================= Detalle de recepción (equipos) =========================
function agregarDetalleRecepcion(){
  if($("#nombre_equipo_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar el nombre del equipo","ERROR");return;}
  if($("#marca_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la marca","ERROR");return;}
  if($("#modelo_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar el modelo","ERROR");return;}
  if($("#numero_serie_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar el número de serie","ERROR");return;}
  if($("#falla_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la falla reportada","ERROR");return;}

  const detalle = {
    nombre_equipo: $("#nombre_equipo_txt").val().trim(),
    marca: $("#marca_txt").val().trim(),
    modelo: $("#modelo_txt").val().trim(),
    numero_serie: $("#numero_serie_txt").val().trim(),
    falla_reportada: $("#falla_txt").val().trim(),
    accesorios_entregados: accesoriosTmp.join(", "), // chips -> string
    diagnostico_preliminar: $("#diagnostico_txt").val().trim(),
    observaciones_detalle: $("#observaciones_detalle_txt").val().trim()
  };

  detallesRecepcion.push(detalle);
  renderDetallesRecepcion();

  // limpiar para el siguiente equipo
  $("#nombre_equipo_txt, #marca_txt, #modelo_txt, #numero_serie_txt, #falla_txt, #diagnostico_txt, #observaciones_detalle_txt").val('');
  initAccesoriosUI();
}
window.agregarDetalleRecepcion = agregarDetalleRecepcion;

function renderDetallesRecepcion(){
  let tbody = $("#detalle_recepcion_tb");
  tbody.html('');
  detallesRecepcion.forEach((d,i)=>{
    tbody.append(`<tr>
      <td>${d.nombre_equipo}</td>
      <td>${d.marca}</td>
      <td>${d.modelo}</td>
      <td>${d.numero_serie}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarDetalleRecepcion(${i}); return false;">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>`);
  });
}

function eliminarDetalleRecepcion(index){
  detallesRecepcion.splice(index,1);
  renderDetallesRecepcion();
}
window.eliminarDetalleRecepcion = eliminarDetalleRecepcion;

// ========================= Guardar recepción =========================
function guardarRecepcion(){
  if($("#id_cliente_lst").val()===""){mensaje_dialogo_info_ERROR("Debe seleccionar un cliente","ERROR");return;}
  if($("#fecha_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la fecha","ERROR");return;}
  if(detallesRecepcion.length===0){mensaje_dialogo_info_ERROR("Debe agregar al menos un equipo","ERROR");return;}

  let datos = {
    fecha_recepcion: $("#fecha_txt").val(),
    id_cliente: $("#id_cliente_lst").val(),
    nombre_cliente: $("#id_cliente_lst option:selected").text().trim(),
    telefono: $("#telefono_txt").val(),
    direccion: $("#direccion_txt").val(),
    estado: $("#estado_lst").val(),
    observaciones: $("#observaciones_txt").val()
  };

  let idRecepcion = $("#id_recepcion").val();
  if(idRecepcion === "0"){
    idRecepcion = ejecutarAjax("controladores/recepcion.php","guardar="+JSON.stringify(datos));
    detallesRecepcion.forEach(function(d){
      let det = {...d, id_recepcion:idRecepcion};
      ejecutarAjax("controladores/detalle_recepcion.php","guardar="+JSON.stringify(det));
    });
  }else{
    datos = {...datos, id_recepcion:idRecepcion};
    ejecutarAjax("controladores/recepcion.php","actualizar="+JSON.stringify(datos));
    ejecutarAjax("controladores/detalle_recepcion.php","eliminar_por_recepcion="+idRecepcion);
    detallesRecepcion.forEach(function(d){
      let det = {...d, id_recepcion:idRecepcion};
      ejecutarAjax("controladores/detalle_recepcion.php","guardar="+JSON.stringify(det));
    });
  }
  mensaje_confirmacion("Guardado correctamente");
  mostrarListarRecepcion();
}
window.guardarRecepcion = guardarRecepcion;

// ========================= Tabla / Búsqueda =========================
function cargarTablaRecepcion(){
  let datos = ejecutarAjax("controladores/recepcion.php","leer=1");
  if(datos === "0"){
    $("#recepcion_datos_tb").html("NO HAY REGISTROS");
  }else{
    let json = JSON.parse(datos);
    $("#recepcion_datos_tb").html('');
    json.map(function(it){
      let acciones = `<button class="btn btn-info btn-sm imprimir-recepcion" title="Imprimir"><i class="bi bi-printer"></i></button>`;
      if(it.estado !== "DIAGNOSTICADO"){
        acciones += ` <button class="btn btn-warning btn-sm editar-recepcion" title="Editar"><i class="bi bi-pencil-square"></i></button> <button class="btn btn-danger btn-sm eliminar-recepcion" title="Eliminar"><i class="bi bi-trash"></i></button>`;
      }
      $("#recepcion_datos_tb").append(`
        <tr>
          <td>${it.id_recepcion}</td>
          <td>${it.fecha_recepcion}</td>
          <td>${it.nombre_cliente}</td>
          <td>${it.telefono}</td>
          <td>${it.direccion}</td>
          <td>${badgeEstado(it.estado)}</td>
          <td>${acciones}</td>
        </tr>`);
    });
  }
}

function buscarRecepcion(){
  let b = $("#b_recepcion").val();
  let datos = ejecutarAjax("controladores/recepcion.php","leer_descripcion="+b);
  if(datos === "0"){
    $("#recepcion_datos_tb").html("NO HAY REGISTROS");
  }else{
    let json = JSON.parse(datos);
    $("#recepcion_datos_tb").html('');
    json.map(function(it){
      let acciones = `<button class="btn btn-info btn-sm imprimir-recepcion" title="Imprimir"><i class="bi bi-printer"></i></button>`;
      if(it.estado !== "DIAGNOSTICADO"){
        acciones += ` <button class="btn btn-warning btn-sm editar-recepcion" title="Editar"><i class="bi bi-pencil-square"></i></button> <button class="btn btn-danger btn-sm eliminar-recepcion" title="Eliminar"><i class="bi bi-trash"></i></button>`;
      }
      $("#recepcion_datos_tb").append(`
        <tr>
          <td>${it.id_recepcion}</td>
          <td>${it.fecha_recepcion}</td>
          <td>${it.nombre_cliente}</td>
          <td>${it.telefono}</td>
          <td>${it.direccion}</td>
          <td>${badgeEstado(it.estado)}</td>
          <td>${acciones}</td>
        </tr>`);
    });
  }
}
window.buscarRecepcion = buscarRecepcion;

// ========================= Impresión =========================
function imprimirRecepcion(id){
  const datos = ejecutarAjax("controladores/recepcion.php","leer_id="+id);
  if(datos === "0"){ alert("Recepción no encontrada"); return; }
  const rec = JSON.parse(datos);

  const detData = ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+id);
  const detalles = detData === "0" ? [] : JSON.parse(detData);

  let filas = detalles.length
    ? detalles.map((d,i)=>`
        <tr>
          <td>${i+1}</td>
          <td>${d.nombre_equipo || ""}</td>
          <td>${d.marca || ""}</td>
          <td>${d.modelo || ""}</td>
          <td>${d.numero_serie || ""}</td>
          <td class="text-start">${(d.falla_reportada || "").toString()}</td>
          <td class="text-start">${(d.accesorios_entregados || "").toString()}</td>
          <td class="text-start">${(d.diagnostico_preliminar || "").toString()}</td>
          <td class="text-start">${(d.observaciones_detalle || "").toString()}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="9">Sin equipos</td></tr>`;

  const estadoTxt = rec.estado || "ACTIVO";
  const estadoUC  = String(estadoTxt).toUpperCase();
  const estadoBadge =
      estadoUC === "ACTIVO"      ? "bg-primary" :
      estadoUC === "ANULADO"     ? "bg-danger"  :
      estadoUC === "PENDIENTE"   ? "bg-warning text-dark" :
                                   "bg-secondary";

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Recepción #${rec.id_recepcion}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      @page { size: A4; margin: 16mm; }
      body { color:#111; font-family: "Segoe UI", Arial, sans-serif; }
      .doc-header { display:flex; align-items:center; border-bottom:2px solid #0d6efd; padding-bottom:10px; margin-bottom:18px; }
      .doc-logo { flex:0 0 auto; }
      .doc-logo img { height:110px; }
      .doc-info { flex:1; padding-left:20px; display:flex; flex-direction:column; justify-content:flex-end; }
      .doc-title { margin:0; font-weight:800; letter-spacing:.3px; font-size:26px; }
      .meta { font-size:14px; color:#555; margin-top:6px; }
      .kpi-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:20px; }
      .kpi { border:1px solid #e9ecef; border-radius:12px; padding:14px; background:#f8f9fa; }
      .kpi .lbl { font-size:12px; color:#6c757d; margin-bottom:4px; text-transform:uppercase; letter-spacing:.3px; }
      .kpi .val { font-size:15px; font-weight:600; }
      table { width:100%; border-collapse:collapse; }
      thead th { background:#e9f2ff; border-bottom:1px solid #cfe2ff !important; font-weight:700; }
      th, td { border:1px solid #e9ecef; padding:8px; font-size:12.5px; vertical-align:top; text-align:center; }
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
        <h2 class="doc-title">Recepción #${rec.id_recepcion}</h2>
        <div class="meta">
          Cliente: <strong>${rec.nombre_cliente || ""}</strong>
          &nbsp;·&nbsp; Tel.: <strong>${rec.telefono || ""}</strong>
          &nbsp;·&nbsp; Estado: <span class="badge ${estadoBadge}">${estadoTxt}</span>
          &nbsp;·&nbsp; Fecha: <strong>${formatearFechaDMA(rec.fecha_recepcion)}</strong>
        </div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="lbl">Dirección</div>
        <div class="val">${rec.direccion || "—"}</div>
      </div>
      <div class="kpi">
        <div class="lbl">Observaciones</div>
        <div class="val">${rec.observaciones || "—"}</div>
      </div>
      <div class="kpi">
        <div class="lbl">Total de equipos</div>
        <div class="val">${detalles.length}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Equipo</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>N° Serie</th>
          <th>Falla Reportada</th>
          <th>Accesorios</th>
          <th>Diagnóstico</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>

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
window.imprimirRecepcion = imprimirRecepcion;

// ========================= Acciones tabla =========================
$(document).on("click",".editar-recepcion",function(){
  let id=$(this).closest("tr").find("td:eq(0)").text();
  mostrarAgregarRecepcion();
  setTimeout(function(){
    let datos = ejecutarAjax("controladores/recepcion.php","leer_id="+id);
    let json = JSON.parse(datos);
    $("#id_recepcion").val(json.id_recepcion);
    $("#fecha_txt").val(json.fecha_recepcion);
    $("#observaciones_txt").val(json.observaciones);
    $("#estado_lst").val(json.estado);
    cargarListaClientes(json.id_cliente);
    let det = ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+id);
    if(det !== "0"){
      detallesRecepcion = JSON.parse(det);
    }else{
      detallesRecepcion = [];
    }
    renderDetallesRecepcion();
    // Accesorios: si necesitás editar por-detalle, podés usar setAccesoriosFromString(d.accesorios_entregados) al seleccionar el detalle.
  },100);
});

$(document).on("click",".imprimir-recepcion",function(){
  let id=$(this).closest("tr").find("td:eq(0)").text();
  imprimirRecepcion(id);
});

$(document).on("click",".eliminar-recepcion",function(){
  let id=$(this).closest("tr").find("td:eq(0)").text();
  Swal.fire({
    title:"¿Eliminar recepción?",
    text:"Esta acción eliminará la recepción.",
    icon:"warning",
    showCancelButton:true,
    confirmButtonText:"Sí, eliminar",
    cancelButtonText:"Cancelar",
    confirmButtonColor:"#dc3545",
    cancelButtonColor:"#6c757d",
    reverseButtons:true
  }).then((result)=>{
    if(result.isConfirmed){
      ejecutarAjax("controladores/recepcion.php","eliminar="+id);
      mensaje_confirmacion("Recepción eliminada");
      cargarTablaRecepcion();
    }
  });
});
