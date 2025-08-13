(function(){
let detallesRemision = [];
let listaClientes = [];
let listaProductos = [];
let listaConductores = [];
let listaPuntos = [];


})();


function mostrarListarRemision(){
  const contenido = dameContenido("paginas/referenciales/remision/listar.php");
  $("#contenido-principal").html(contenido);

  initFiltrosRemision();   // preparar select de estados
  buscarRemision();        // primera carga
}
window.mostrarListarRemision = mostrarListarRemision;

function mostrarAgregarRemision(){
  const contenido = dameContenido("paginas/referenciales/remision/agregar.php");
  $("#contenido-principal").html(contenido);

  cargarListaClientes();
  cargarListaProductos();
  cargarListaConductores();
  cargarListaPuntos();

  detallesRemision = [];
  renderDetallesRemision();
}
window.mostrarAgregarRemision = mostrarAgregarRemision;

/* =========================
   Cargar listas (combos)
   ========================= */
function cargarListaClientes(selectedId = ""){
  const datos = ejecutarAjax("controladores/cliente.php","leer=1");
  if(datos !== "0"){
    listaClientes = JSON.parse(datos);
    renderListaClientes(listaClientes, selectedId);
  }
}
function renderListaClientes(arr, selectedId = ""){
  const $select = $("#id_cliente_lst");
  $select.html('<option value="">-- Seleccione un cliente --</option>');
  arr.forEach(c => {
    const nombre = c.nombre_apellido;
    const ruc = c.ruc;
    $select.append(`
      <option value="${c.id_cliente}" data-ruc="${ruc}" data-nombre="${nombre}">
        ${nombre}
      </option>
    `);
  });
  if(selectedId) $select.val(selectedId).trigger('change');
}

// Abrir modal para agregar nuevo cliente
$(document).on('click', '#nuevo_cliente_btn', function(){
  const contenido = dameContenido('paginas/referenciales/cliente/agregar.php');
  const $modal = $('#modal_nuevo_cliente');
  $modal.find('.modal-body').html(contenido);
  $modal.find('.btn-success').attr('onclick','guardarClienteDesdeModal(); return false;');
  $modal.find('.btn-danger').attr('onclick',"$('#modal_nuevo_cliente').modal('hide'); return false;");
  cargarListaCiudad('#modal_nuevo_cliente #ciudad_lst');
  $modal.modal('show');
});

function guardarClienteDesdeModal(){
  const $m = $('#modal_nuevo_cliente');
  const nombre = $m.find('#nombre_txt').val().trim();
  const ruc = $m.find('#ruc_txt').val().trim();
  const dir = $m.find('#direccion_txt').val().trim();
  const tel = $m.find('#telefono_txt').val().trim();
  const ciudad = $m.find('#ciudad_lst').val();
  const estado = $m.find('#estado_lst').val();

  if(nombre.length===0){ mensaje_dialogo_info_ERROR('Debes ingresar el nombre y apellido', 'ATENCION'); return; }
  if(ruc.length===0){ mensaje_dialogo_info_ERROR('Debes ingresar el RUC', 'ATENCION'); return; }
  if(dir.length===0){ mensaje_dialogo_info_ERROR('Debes ingresar la Direccion', 'ATENCION'); return; }
  if(tel.length===0){ mensaje_dialogo_info_ERROR('Debes ingresar el Telefono', 'ATENCION'); return; }
  if(ciudad==="0" || ciudad===""){ mensaje_dialogo_info_ERROR('Debes ingresar la ciudad', 'ATENCION'); return; }
  if(!/^[0-9\-]+$/.test(ruc)){ mensaje_dialogo_info_ERROR('El RUC solo puede contener números y guiones (-)', 'ATENCIÓN'); return; }
  if(!/^[0-9+]+$/.test(tel)){ mensaje_dialogo_info_ERROR('El teléfono solo puede contener números y el símbolo +', 'ATENCIÓN');return; }

  let datos={
    nombre_apellido:nombre,
    ruc:ruc,
    direccion:dir,
    id_ciudad:ciudad,
    telefono:tel,
    estado:estado
  };

  let res = ejecutarAjax('controladores/cliente.php','guardar='+JSON.stringify(datos));
  if(res === 'duplicado'){ mensaje_dialogo_info_ERROR('El RUC ya esta registrado con otro cliente', 'ATENCION'); return; }
  mensaje_confirmacion('Guardado correctamente');

  // Obtener ID del nuevo cliente usando el RUC
  let nuevoId = '';
  let consulta = ejecutarAjax('controladores/cliente.php','leer_descripcion='+ruc);
  if(consulta !== '0'){
    let js = JSON.parse(consulta);
    let found = js.find(c=>c.ruc===ruc);
    if(found) nuevoId = found.id_cliente;
  }

  $m.modal('hide');
  cargarListaClientes(nuevoId);
}
window.guardarClienteDesdeModal = guardarClienteDesdeModal;

function cargarListaProductos(){
  const datos = ejecutarAjax("controladores/productos.php","leerActivo=1&tipo=PRODUCTO");
  if(datos !== "0"){
    listaProductos = JSON.parse(datos);
    renderListaProductos(listaProductos);
  }
}
function renderListaProductos(arr){
  const $select = $("#id_producto_lst");
  $select.html('<option value="">-- Seleccione un producto --</option>');
  arr
    .filter(p => p.tipo === 'PRODUCTO')
    .forEach(p => $select.append(`<option value="${p.producto_id}">${p.nombre}</option>`));
}

function cargarListaConductores(){
  const datos = ejecutarAjax("controladores/conductor.php","leerActivo=1");
  if(datos !== "0"){
    listaConductores = JSON.parse(datos);
    renderListaConductores(listaConductores);
  }
}
function renderListaConductores(arr){
  const $select = $("#id_conductor_lst");
  $select.html('<option value="">-- Seleccione un conductor --</option>');
  arr
    .filter(c => c.estado === 'ACTIVO')
    .forEach(c => $select.append(`<option value="${c.id_conductor}">${c.nombre}</option>`));
}

function cargarListaPuntos(){
  const datos = ejecutarAjax("controladores/puntos.php","leer=1");
  if(datos !== "0"){
    listaPuntos = JSON.parse(datos);
    renderListaPuntos(listaPuntos);
  }
}
function renderListaPuntos(arr){
  const $salida  = $("#punto_salida_lst");
  const $llegada = $("#punto_llegada_lst");
  $salida.html('<option value="">-- Seleccione punto --</option>');
  $llegada.html('<option value="">-- Seleccione punto --</option>');
  arr
    .filter(p => p.estado === "ACTIVO")
    .forEach(p => {
      $salida.append(`<option value="${p.id_punto}">${p.nombre}</option>`);
      $llegada.append(`<option value="${p.id_punto}">${p.nombre}</option>`);
    });
}

/* =========================
   Detalles (ABM in-memory)
   ========================= */
function agregarDetalleRemision(){
  if($("#id_producto_lst").val() === ""){
    mensaje_dialogo_info_ERROR("Debe seleccionar un producto","ERROR"); return;
  }
  if($("#cantidad_txt").val().trim().length === 0){
    mensaje_dialogo_info_ERROR("Debe ingresar la cantidad","ERROR"); return;
  }
  if(parseFloat($("#cantidad_txt").val()) <= 0){
    mensaje_dialogo_info_ERROR("La cantidad debe ser mayor que 0","ERROR"); return;
  }
  if(detallesRemision.some(d => d.id_producto === $("#id_producto_lst").val())){
    mensaje_dialogo_info_ERROR("El producto ya fue agregado","ERROR"); return;
  }

  const cantidad = parseFloat($("#cantidad_txt").val()) || 0;
  const detalle = {
    id_producto: $("#id_producto_lst").val(),
    producto: $("#id_producto_lst option:selected").text(),
    cantidad: cantidad
  };

  detallesRemision.push(detalle);
  renderDetallesRemision();
  limpiarDetalleRemisionForm();
}
window.agregarDetalleRemision = agregarDetalleRemision;

function limpiarDetalleRemisionForm(){
  $("#id_producto_lst").val("");
  $("#cantidad_txt").val("");
}

function renderDetallesRemision(){
  const $tbody = $("#detalle_remision_tb");
  $tbody.html("");
  detallesRemision.forEach((d,i) => {
    $tbody.append(`
      <tr>
        <td class="text-start">${d.producto}</td>
        <td class="text-end">${d.cantidad}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="eliminarDetalleRemision(${i}); return false;">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `);
  });
}

function eliminarDetalleRemision(index){
  detallesRemision.splice(index,1);
  renderDetallesRemision();
}
window.eliminarDetalleRemision = eliminarDetalleRemision;

/* =========================
   Guardar / actualizar
   ========================= */
function guardarRemision() {
  console.log("guardarRemision ejecutada");

  if ($("#id_cliente_lst").val() === "") {
    mensaje_dialogo_info_ERROR("Debe seleccionar un cliente", "ERROR"); return;
  }
  if ($("#id_conductor_lst").val() === "") {
    mensaje_dialogo_info_ERROR("Debe seleccionar un conductor", "ERROR"); return;
  }
  if ($("#movil_txt").val().trim().length === 0) {
    mensaje_dialogo_info_ERROR("Debe ingresar el móvil", "ERROR"); return;
  }
  if ($("#fecha_txt").val().trim().length === 0) {
    mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ERROR"); return;
  }
  if ($("#punto_salida_lst").val() === "" || $("#punto_llegada_lst").val() === "") {
    mensaje_dialogo_info_ERROR("Debe seleccionar los puntos de salida y llegada", "ERROR"); return;
  }
  if ($("#punto_salida_lst").val() === $("#punto_llegada_lst").val()) {
    mensaje_dialogo_info_ERROR("Punto de salida y llegada no pueden ser iguales", "ERROR"); return;
  }
  if ($("#tipo_transporte_lst").val() === "") {
    mensaje_dialogo_info_ERROR("Debe seleccionar el tipo de transporte", "ERROR"); return;
  }
  if (detallesRemision.length === 0) {
    mensaje_dialogo_info_ERROR("Debe agregar al menos un producto", "ERROR"); return;
  }

  let datos = {
    id_cliente: $("#id_cliente_lst").val(),
    fecha_remision: $("#fecha_txt").val(),
    observacion: $("#observacion_txt").val(),
    estado: $("#estado_txt").val(),
    id_conductor: $("#id_conductor_lst").val(),
    movil: $("#movil_txt").val(),
    id_punto_salida: $("#punto_salida_lst").val(),
    id_punto_llegada: $("#punto_llegada_lst").val(),
    tipo_transporte: $("#tipo_transporte_lst").val(),
    factura_relacionada: $("#factura_relacionada_txt").val()
  };

  let idRemision = $("#id_remision").val();

  if (idRemision === "0") {
    // Crear
    const raw = ejecutarAjax("controladores/remision.php", "guardar=" + JSON.stringify(datos));
    console.log("🟢 Respuesta cruda del servidor:", JSON.stringify(raw));

    const idStr = String(raw).trim();
    const idNum = Number(idStr);

    if (!Number.isInteger(idNum) || idNum <= 0) {
      mensaje_dialogo_info_ERROR("Error al guardar la remisión. ID inválido o inserción fallida.", "ERROR");
      console.error("ID devuelto no válido:", { idStr, idNum });
      return;
    }

    idRemision = String(idNum);
    console.log("✅ ID de remisión generado:", idRemision);

    // Guardar detalles
    for (const d of detallesRemision) {
      const det = {
        id_remision: Number(idRemision),
        id_producto: Number(d.id_producto),
        cantidad: Number(d.cantidad)
      };

      const rdet = ejecutarAjax("controladores/detalle_remision.php","guardar=" + JSON.stringify(det));
      const clean = String(rdet).replace(/<[^>]*>/g, "").trim().toUpperCase();

      console.log("🧪 Respuesta detalle (raw):", rdet, "→ (clean):", clean);
      if (clean !== "OK" && clean !== "1") {
        console.error("❌ Detalle no guardado:", det, "respuesta:", rdet);
        mensaje_dialogo_info_ERROR("No se pudo guardar un detalle. Revise productos y cantidades.","ERROR");
        return;
      } else {
        console.log("✅ Detalle guardado:", det);
      }
    }

  } else {
    // Actualizar
    datos = { ...datos, id_remision: idRemision };
    const rupd = ejecutarAjax("controladores/remision.php", "actualizar=" + JSON.stringify(datos));
    if (rupd !== "1") {
      mensaje_dialogo_info_ERROR("No se pudo actualizar la remisión.", "ERROR");
      console.error("Respuesta actualizar:", rupd);
      return;
    }
    ejecutarAjax("controladores/detalle_remision.php", "eliminar_por_remision=" + idRemision);
    for (const d of detallesRemision) {
      const det = {
        id_remision: idRemision,
        id_producto: Number(d.id_producto),
        cantidad: Number(d.cantidad)
      };
      const rdet = ejecutarAjax("controladores/detalle_remision.php", "guardar=" + JSON.stringify(det));
      if (String(rdet).trim().toUpperCase() !== "OK" && String(rdet).trim() !== "1") {
        mensaje_dialogo_info_ERROR("No se pudo guardar un detalle al actualizar.", "ERROR");
        console.error("Detalle no guardado:", det, "respuesta:", rdet);
        return;
      }
    }
  }

  mensaje_confirmacion("Guardado correctamente");
  mostrarListarRemision();
}
window.guardarRemision = guardarRemision;

/* =========================
   Listado / búsqueda
   ========================= */
function initFiltrosRemision(){
  const $est = $("#estado_filtro");
  $est.html(`
    <option value="">-- Todos --</option>
    <option value="EMITIDO">EMITIDO</option>
    <option value="ANULADO">ANULADO</option>
  `);
}

/* Badge visual coherente */
function badgeEstado(estado){
  const e = String(estado || "").toUpperCase();
  if (e.includes("ANUL")) return '<span class="badge bg-danger">ANULADO</span>';
  if (e.includes("EMIT")) return '<span class="badge bg-primary">EMITIDO</span>';
  return `<span class="badge bg-secondary">${estado || "-"}</span>`;
}

function cargarTablaRemision(){
  buscarRemision();
}

function buscarRemision(){
  const b      = $("#b_remision").val() || "";
  const estado = $("#estado_filtro").val() || "";
  const desde  = $("#f_desde").val() || "";
  const hasta  = $("#f_hasta").val() || "";

  const params = {
    leer_descripcion: b.trim(),
    estado: estado,
    desde: desde,
    hasta: hasta
  };

  let resp = ejecutarAjax(
    "controladores/remision.php",
    params
  );
  
  if(resp === "0" || !resp){
    $("#remision_datos_tb").html("NO HAY REGISTROS");
    $("#remision_count").text(0);
    return;
  }

  // Limpieza de posibles tags o BOM
  const clean = String(resp).replace(/^[\ufeff\s]+|<[^>]*>/g, "").trim();
  let json;
  try {
    json = JSON.parse(clean);
  } catch(e){
    console.error("❌ JSON inválido en buscarRemision():", resp);
    $("#remision_datos_tb").html("ERROR AL CARGAR DATOS");
    $("#remision_count").text(0);
    return;
  }

  $("#remision_datos_tb").html("");
  json.forEach(function(it){
    const disabled = String(it.estado).toUpperCase() === 'ANULADO' ? 'disabled' : '';
    $("#remision_datos_tb").append(`
      <tr>
        <td>${it.id_remision}</td>
        <td>${it.fecha_remision}</td>
        <td class="text-start">${it.cliente || ""}</td>
        <td>${badgeEstado(it.estado)}</td>
        <td>
          <button class="btn btn-info btn-sm imprimir-remision" title="Imprimir"><i class="bi bi-printer"></i></button>
          <button class="btn btn-warning btn-sm editar-remision" ${disabled} title="Editar"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-danger btn-sm anular-remision" ${disabled} title="Anular"><i class="bi bi-x-circle"></i></button>
        </td>
      </tr>
    `);
  });
  $("#remision_count").text(json.length);
}
window.buscarRemision = buscarRemision;

/* Handlers de filtros/búsqueda */
$(document).on("keyup", "#b_remision", function(){ buscarRemision(); });
$(document).on("change", "#estado_filtro, #f_desde, #f_hasta", function(){ buscarRemision(); });

$(document).on("click", "#limpiar_busqueda_btn", function(){
  $("#b_remision").val('');
  $("#estado_filtro").val('');
  $("#f_desde").val('');
  $("#f_hasta").val('');
  buscarRemision();
});

/* =========================
   Impresión “premium”
   ========================= */
function imprimirRemision(id, copias = 2) {
  const datos = ejecutarAjax("controladores/remision.php","leer_id="+id);
  if (datos === "0") { alert("Remisión no encontrada"); return; }
  const rem = JSON.parse(datos);

  const detData = ejecutarAjax("controladores/detalle_remision.php","leer=1&id_remision="+id);
  const detalles = detData === "0" ? [] : JSON.parse(detData);

  const estadoTxt = (rem.estado || "EMITIDA");
  const estUC = String(estadoTxt).toUpperCase();
  const estadoBadge =
    estUC.includes("APROB") ? "bg-success" :
    estUC.includes("ANUL")  ? "bg-danger"  :
    "bg-warning text-dark";

  const filas = (detalles.length ? detalles : [{producto:"—",cantidad:"—"}]).map((d, i) => `
    <tr>
      <td class="text-center">${i + 1}</td>
      <td class="text-start">${(d.producto || d.id_producto || "").toString()}</td>
      <td class="text-end">${d.cantidad}</td>
    </tr>
  `).join("");

  // Empresa (ajusta si corresponde)
  const EMPRESA = {
    nombre: "HARD INFORMATICA S.A.",
    ruc: "84945944-4",
    direccion: "Av. Siempre Viva 123 - Asunción",
    telefono: "(021) 376-548",
    email: "ventas@hardinformatica.com"
  };

  const etiquetas = ["ORIGINAL", "DUPLICADO", "TRIPLICADO", "COPIA 4"];
  const bloques = [];
  for (let i = 0; i < Math.max(1, copias); i++) {
    const etiqueta = etiquetas[i] || `COPIA ${i+1}`;
    bloques.push(`
      <section class="doc">
        ${estUC.includes("ANUL") ? `<div class="watermark">ANULADO</div>` : ""}
        <header class="doc-header">
          <div class="doc-logo">
            <img src="images/logo.png" alt="Logo" onerror="this.style.display='none'">
          </div>
          <div class="doc-empresa">
            <h1>${EMPRESA.nombre}</h1>
            <div class="emp-meta">
              RUC: ${EMPRESA.ruc} &nbsp;•&nbsp; ${EMPRESA.direccion}<br>
              Tel.: ${EMPRESA.telefono} &nbsp;•&nbsp; ${EMPRESA.email}
            </div>
          </div>
          <div class="doc-right">
            <div class="doc-tipo">REMISIÓN</div>
            <div class="doc-num">#${rem.id_remision}</div>
            <div class="doc-fecha">${formatearFechaDMA(rem.fecha_remision)}</div>
            <span class="copia">${etiqueta}</span>
          </div>
        </header>

        <div class="doc-info">
          <div class="pair"><span class="lbl">Cliente:</span> <span class="val">${rem.cliente || rem.id_cliente || ""}</span></div>
          <div class="pair"><span class="lbl">Conductor:</span> <span class="val">${rem.conductor || ""}</span></div>
          <div class="pair"><span class="lbl">Móvil:</span> <span class="val">${rem.movil || ""}</span></div>
          <div class="pair"><span class="lbl">Salida:</span> <span class="val">${rem.punto_salida || ""}</span></div>
          <div class="pair"><span class="lbl">Llegada:</span> <span class="val">${rem.punto_llegada || ""}</span></div>
          <div class="pair"><span class="lbl">Tipo Transporte:</span> <span class="val">${rem.tipo_transporte || ""}</span></div>
          <div class="pair"><span class="lbl">Factura Rel.:</span> <span class="val">${rem.factura_relacionada || ""}</span></div>
          <div class="pair"><span class="lbl">Fecha:</span> <span class="val">${formatearFechaDMA(rem.fecha_remision)}</span></div>
          ${rem.observacion ? `<div class="observ"><span class="lbl">Obs.:</span> <span class="val">${rem.observacion}</span></div>` : ""}
        </div>

        <table class="tabla">
          <thead>
            <tr>
              <th style="width:60px" class="text-center">#</th>
              <th class="text-start">Producto</th>
              <th style="width:140px" class="text-end">Cantidad</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>

        <div class="firmas">
          <div class="fbox"><div class="linea"></div><div class="ftxt">Entregado por</div></div>
          <div class="fbox"><div class="linea"></div><div class="ftxt">Recibido por</div></div>
          <div class="fbox"><div class="linea"></div><div class="ftxt">Aclaración / CI</div></div>
        </div>

        <footer class="doc-footer">
          Documento generado automáticamente — ${new Date().toLocaleString()}
        </footer>
      </section>
    `);
  }

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Remisión #${rem.id_remision}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      @page { size: A4; margin: 14mm 14mm 16mm 14mm; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { color:#111; font-family: "Segoe UI", Arial, sans-serif; }
      .doc { position: relative; page-break-after: always; }
      .doc:last-of-type { page-break-after: auto; }

      /* ===== Encabezado ===== */
      .doc-header{
        display:grid;
        grid-template-columns: auto 1fr auto; /* logo | empresa | remisión */
        align-items:center;
        gap:16px;
        border-bottom:2px solid #0d6efd;
        padding-bottom:10px;
        margin-bottom:14px;
      }
      .doc-logo{ display:flex; align-items:center; }
      .doc-logo img{ height:70px; display:block; }

      .doc-empresa{
        display:flex;
        flex-direction:column;
        justify-content:center;
      }
      .doc-empresa h1{
        font-size:20px;
        font-weight:800;
        letter-spacing:.2px;
        margin:0 0 4px 0;
        line-height:1.1;
        text-align:center;
      }
      .emp-meta{
        font-size:12px;
        color:#555;
        line-height:1.35;
        text-align:center;
      }

      .doc-right{
        text-align:right;
        display:flex;
        flex-direction:column;
        gap:6px;
        align-items:flex-end;
      }
      .doc-right .doc-tipo{ font-size:14px; letter-spacing:1.2px; font-weight:700; color:#0d6efd; }
      .doc-right .doc-num{ font-size:18px; font-weight:800; }
      .doc-right .doc-fecha{ font-size:12px; color:#555; }
      .doc-right .badge{ font-size:12px; }
      .doc-right .copia{
        background:#f1f3f5; border:1px solid #dee2e6; padding:2px 8px; border-radius:12px; font-size:11px;
      }

      /* ===== Bloque de datos ===== */
      .doc-info{
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap:6px 12px;
        margin-bottom:10px;
        font-size:13px;
        align-items:center;
      }
      .doc-info .pair{ display:flex; align-items:center; gap:6px; white-space:nowrap; }
      .doc-info .lbl{ color:#6c757d; min-width:80px; font-weight:600; }
      .doc-info .val{ font-weight:600; }
      .doc-info .observ{ grid-column: 1 / -1; }

      /* ===== Tabla ===== */
      table.tabla{ width:100%; border-collapse:collapse; }
      .tabla thead th{
        background:#e9f2ff;
        border:1px solid #cfe2ff !important;
        font-weight:700;
        padding:6px 8px;
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

      /* ===== Firmas ===== */
      .firmas{
        display:grid;
        grid-template-columns: repeat(3, 1fr);
        gap:22px;
        margin-top:18px;
      }
      .firmas .linea{ border-bottom:1px solid #000; height:28px; }
      .firmas .ftxt{ text-align:center; font-size:12px; color:#444; margin-top:6px; }

      /* ===== Footer ===== */
      .doc-footer{ margin-top:10px; font-size:11px; color:#6c757d; text-align:right; }

      /* ===== Watermark ANULADO ===== */
      .watermark{
        position:absolute; inset:0;
        display:flex; align-items:center; justify-content:center;
        font-size:100px; opacity:0.07; transform: rotate(-22deg);
        font-weight:900; color:#dc3545;
        pointer-events:none; user-select:none;
      }

      @media print{ .no-print{ display:none !important; } }
    </style>
  </head>
  <body>
    ${bloques.join("")}
    <script>window.print();</script>
  </body>
  </html>`);
  v.document.close();
  v.focus();
}
window.imprimirRemision = imprimirRemision;

/* =========================
   Editar / Anular / Imprimir
   ========================= */
$(document).on("click",".editar-remision",function(){
  if($(this).prop('disabled')) return;
  const id = $(this).closest("tr").find("td:eq(0)").text();

  mostrarAgregarRemision();
  setTimeout(function(){
    const datos = ejecutarAjax("controladores/remision.php","leer_id="+id);
    const json  = JSON.parse(datos);

    $("#id_remision").val(json.id_remision);
    $("#id_cliente_lst").val(json.id_cliente);
    $("#id_conductor_lst").val(json.id_conductor);
    $("#movil_txt").val(json.movil);
    $("#punto_salida_lst").val(json.id_punto_salida);
    $("#punto_llegada_lst").val(json.id_punto_llegada);
    $("#tipo_transporte_lst").val(json.tipo_transporte);
    $("#factura_relacionada_txt").val(json.factura_relacionada);
    $("#fecha_txt").val(json.fecha_remision);
    $("#observacion_txt").val(json.observacion);
    $("#estado_txt").val(json.estado);

    const det = ejecutarAjax("controladores/detalle_remision.php","leer=1&id_remision="+id);
    if(det !== "0"){
      detallesRemision = JSON.parse(det).map(d => ({
        id_producto: d.id_producto,
        producto: d.producto,
        cantidad: d.cantidad
      }));
    } else {
      detallesRemision = [];
    }
    renderDetallesRemision();
  }, 100);
});

$(document).on("click",".anular-remision",function(){
  if($(this).prop('disabled')) return;
  const id = $(this).closest("tr").find("td:eq(0)").text();

  Swal.fire({
    title:"¿Anular remisión?",
    text:"Esta acción marcará la remisión como anulada.",
    icon:"warning",
    showCancelButton:true,
    confirmButtonText:"Sí, anular",
    cancelButtonText:"Cancelar",
    confirmButtonColor:"#dc3545",
    cancelButtonColor:"#6c757d",
    reverseButtons:true
  }).then((result)=>{
    if(result.isConfirmed){
      ejecutarAjax("controladores/remision.php","anular="+id);
      mensaje_confirmacion("Anulado correctamente");
      cargarTablaRemision();
    }
  });
});

$(document).on("click",".imprimir-remision",function(){
  const id = $(this).closest("tr").find("td:eq(0)").text();
  imprimirRemision(id);
});
