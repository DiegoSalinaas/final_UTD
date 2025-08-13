
(function(){
let detallesRemision = [];
let listaClientes = [];
let listaProductos = [];
let listaConductores = [];
let listaPuntos = [];


})();
function mostrarListarRemision(){
    let contenido = dameContenido("paginas/referenciales/remision/listar.php");
    $("#contenido-principal").html(contenido);
    buscarRemision();
}
window.mostrarListarRemision = mostrarListarRemision;

function mostrarAgregarRemision(){
    let contenido = dameContenido("paginas/referenciales/remision/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaClientes();
    cargarListaProductos();
    cargarListaConductores();
    cargarListaPuntos();
    detallesRemision = [];
    renderDetallesRemision();
}
window.mostrarAgregarRemision = mostrarAgregarRemision;

function cargarListaClientes(){
    let datos = ejecutarAjax("controladores/cliente.php","leer=1");
    if(datos !== "0"){
        listaClientes = JSON.parse(datos);
        renderListaClientes(listaClientes);
    }
}

function renderListaClientes(arr){
    let select = $("#id_cliente_lst");
    select.html('<option value="">-- Seleccione un cliente --</option>');
    arr.forEach(c => select.append(`<option value="${c.id_cliente}">${c.nombre_apellido}</option>`));
}

function cargarListaProductos(){
    let datos = ejecutarAjax("controladores/productos.php","leerActivo=1");
    if(datos !== "0"){
        listaProductos = JSON.parse(datos);
        renderListaProductos(listaProductos);
    }
}

function renderListaProductos(arr){
    let select = $("#id_producto_lst");
    select.html('<option value="">-- Seleccione un producto --</option>');
    arr.forEach(p => select.append(`<option value="${p.producto_id}">${p.nombre}</option>`));
}

function cargarListaConductores(){
    let datos = ejecutarAjax("controladores/conductor.php","leer=1");
    if(datos !== "0"){
        listaConductores = JSON.parse(datos);
        renderListaConductores(listaConductores);
    }
}

function renderListaConductores(arr){
    let select = $("#id_conductor_lst");
    select.html('<option value="">-- Seleccione un conductor --</option>');
    arr.forEach(c => select.append(`<option value="${c.id_conductor}">${c.nombre}</option>`));
}

function cargarListaPuntos(){
    let datos = ejecutarAjax("controladores/puntos.php","leer=1");
    if(datos !== "0"){
        listaPuntos = JSON.parse(datos);
        renderListaPuntos(listaPuntos);
    }
}

function renderListaPuntos(arr){
    let selectSalida = $("#punto_salida_lst");
    let selectLlegada = $("#punto_llegada_lst");
    selectSalida.html('<option value="">-- Seleccione punto --</option>');
    selectLlegada.html('<option value="">-- Seleccione punto --</option>');
    arr.forEach(p => {
        selectSalida.append(`<option value="${p.id_punto}">${p.nombre}</option>`);
        selectLlegada.append(`<option value="${p.id_punto}">${p.nombre}</option>`);
    });
}

// Precios y subtotales eliminados

function agregarDetalleRemision(){
    if($("#id_producto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un producto","ERROR");return;}
    if($("#cantidad_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar la cantidad","ERROR");return;}
    if(parseFloat($("#cantidad_txt").val()) <= 0){mensaje_dialogo_info_ERROR("La cantidad debe ser mayor que 0","ERROR");return;}

    if(detallesRemision.some(d => d.id_producto === $("#id_producto_lst").val())){
        mensaje_dialogo_info_ERROR("El producto ya fue agregado","ERROR");
        return;
    }
    let cantidad = parseFloat($("#cantidad_txt").val()) || 0;

    let detalle = {
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
    let tbody = $("#detalle_remision_tb");
    tbody.html("");
    detallesRemision.forEach((d,i) => {
        tbody.append(`<tr>
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDetalleRemision(${i}); return false;"><i class="bi bi-trash"></i></button></td>
        </tr>`);
    });
}

function eliminarDetalleRemision(index){
    detallesRemision.splice(index,1);
    renderDetallesRemision();
}
window.eliminarDetalleRemision = eliminarDetalleRemision;

function guardarRemision() {
    console.log("guardarRemision ejecutada");

    if ($("#id_cliente_lst").val() === "") {
        mensaje_dialogo_info_ERROR("Debe seleccionar un cliente", "ERROR");
        return;
    }

    if ($("#id_conductor_lst").val() === "") {
        mensaje_dialogo_info_ERROR("Debe seleccionar un conductor", "ERROR");
        return;
    }

    if ($("#movil_txt").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debe ingresar el móvil", "ERROR");
        return;
    }

    if ($("#fecha_txt").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ERROR");
        return;
    }

    if ($("#punto_salida_lst").val() === "" || $("#punto_llegada_lst").val() === "") {
        mensaje_dialogo_info_ERROR("Debe seleccionar los puntos de salida y llegada", "ERROR");
        return;
    }

    if ($("#punto_salida_lst").val() === $("#punto_llegada_lst").val()) {
        mensaje_dialogo_info_ERROR("Punto de salida y llegada no pueden ser iguales", "ERROR");
        return;
    }

    if ($("#tipo_transporte_lst").val() === "") {
        mensaje_dialogo_info_ERROR("Debe seleccionar el tipo de transporte", "ERROR");
        return;
    }

    if (detallesRemision.length === 0) {
        mensaje_dialogo_info_ERROR("Debe agregar al menos un producto", "ERROR");
        return;
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

    
   // ...
let idRemision = $("#id_remision").val();

if (idRemision === "0") {
  const raw = ejecutarAjax("controladores/remision.php", "guardar=" + JSON.stringify(datos));
  console.log("🟢 Respuesta cruda del servidor:", JSON.stringify(raw));

  // Normalizar
  const idStr = String(raw).trim();
  const idNum = Number(idStr);

  // Validar correctamente
  if (!Number.isInteger(idNum) || idNum <= 0) {
    mensaje_dialogo_info_ERROR("Error al guardar la remisión. ID inválido o inserción fallida.", "ERROR");
    console.error("ID devuelto no válido:", { idStr, idNum });
    return;
  }

  idRemision = String(idNum); // úsalo consistente como string numérica
  console.log("✅ ID de remisión generado:", idRemision);

  // Guardar detalles
  // --- Guardar detalles ---
for (const d of detallesRemision) {
  const det = {
    id_remision: Number(idRemision),
    id_producto: Number(d.id_producto),
    cantidad: Number(d.cantidad)
  };

  const rdet = ejecutarAjax(
    "controladores/detalle_remision.php",
    "guardar=" + JSON.stringify(det)
  );

  // Normalizar por si llega con tags HTML o saltos
  const clean = String(rdet).replace(/<[^>]*>/g, "").trim().toUpperCase();

  console.log("🧪 Respuesta detalle (raw):", rdet, "→ (clean):", clean);

  // Aceptar "OK" o "1" como éxito
  if (clean !== "OK" && clean !== "1") {
    console.error("❌ Detalle no guardado:", det, "respuesta:", rdet);
    mensaje_dialogo_info_ERROR(
      "No se pudo guardar un detalle. Revise productos y cantidades.",
      "ERROR"
    );
    return; // aborta si falla un detalle
  } else {
    console.log("✅ Detalle guardado:", det);
  }
}

} else {
  // --- Actualizar ---
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
    if (rdet !== "1") {
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

function cargarTablaRemision(){
    buscarRemision();
}

function buscarRemision(){
    let b = $("#b_remision").val();
    let estado = $("#estado_filtro").val();
    let desde = $("#f_desde").val();
    let hasta = $("#f_hasta").val();

    let datos = ejecutarAjax(
        "controladores/remision.php",
        "leer_descripcion="+encodeURIComponent(b)+"&estado="+estado+"&desde="+desde+"&hasta="+hasta
    );
    if(datos === "0"){
        $("#remision_datos_tb").html("NO HAY REGISTROS");
        $("#remision_count").text(0);
    }else{
        let json = JSON.parse(datos);
        $("#remision_datos_tb").html("");
        json.map(function(it){
            const disabled = it.estado === 'ANULADO' ? 'disabled' : '';
            $("#remision_datos_tb").append(`
                <tr>
                    <td>${it.id_remision}</td>
                    <td>${it.fecha_remision}</td>
                    <td>${it.cliente}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-info btn-sm imprimir-remision" title="Imprimir"><i class="bi bi-printer"></i></button>
                        <button class="btn btn-warning btn-sm editar-remision" ${disabled} title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-remision" ${disabled} title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
        $("#remision_count").text(json.length);
    }
}
window.buscarRemision = buscarRemision;

$(document).on("keyup", "#b_remision", function(){
    buscarRemision();
});

$(document).on("change", "#estado_filtro, #f_desde, #f_hasta", function(){
    buscarRemision();
});

$(document).on("click", "#limpiar_busqueda_btn", function(){
    $("#b_remision").val('');
    $("#estado_filtro").val('');
    $("#f_desde").val('');
    $("#f_hasta").val('');
    buscarRemision();
});

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

  // Datos de tu empresa (ajusta a gusto)
  const EMPRESA = {
    nombre: "HARD INFORMATICA S.A.",
    ruc: "84945944-4",
    direccion: "Av. Siempre Viva 123 - Asunción",
    telefono: "(021) 376-548",
    email: "ventas@hardinformatica.com"
  };

  // Genera bloques por copia
  const bloques = [];
  const etiquetas = ["ORIGINAL", "DUPLICADO", "TRIPLICADO", "COPIA 4"];
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
    <h1>HARD INFORMATICA S.A.</h1>
    <div class="emp-meta">
      RUC: 84945944-4 &nbsp;•&nbsp; Av. Siempre Viva 123 - Asunción<br>
      Tel.: (021) 376-548 &nbsp;•&nbsp; ventas@hardinformatica.com
    </div>
  </div>

  <div class="doc-right">
    <div class="doc-tipo">REMISIÓN</div>
    <div class="doc-num">#${rem.id_remision}</div>
    <div class="doc-fecha">${formatearFechaDMA(rem.fecha_remision)}</div>
  </div>
</header>


        <div class="doc-info">
          <div><span class="lbl">Cliente:</span> <span class="val">${rem.cliente || rem.id_cliente || ""}</span></div>
          <div><span class="lbl">Conductor:</span> <span class="val">${rem.conductor || ""}</span></div>
          <div><span class="lbl">Móvil:</span> <span class="val">${rem.movil || ""}</span></div>
          <div><span class="lbl">Salida:</span> <span class="val">${rem.punto_salida || ""}</span></div>
          <div><span class="lbl">Llegada:</span> <span class="val">${rem.punto_llegada || ""}</span></div>
          <div><span class="lbl">Tipo Transporte:</span> <span class="val">${rem.tipo_transporte || ""}</span></div>
          <div><span class="lbl">Factura Rel.:</span> <span class="val">${rem.factura_relacionada || ""}</span></div>
          <div><span class="lbl">Fecha:</span> <span class="val">${formatearFechaDMA(rem.fecha_remision)}</span></div>
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
          <tbody>
            ${filas}
          </tbody>
        </table>

        <div class="firmas">
          <div class="fbox">
            <div class="linea"></div>
            <div class="ftxt">Entregado por</div>
          </div>
          <div class="fbox">
            <div class="linea"></div>
            <div class="ftxt">Recibido por</div>
          </div>
          <div class="fbox">
            <div class="linea"></div>
            <div class="ftxt">Aclaración / CI</div>
          </div>
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
    align-items:center;                   /* centra verticalmente todo */
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
    justify-content:center; /* centra verticalmente respecto al logo */
  }
  .doc-empresa h1{
    font-size:20px;
    font-weight:800;
    letter-spacing:.2px;
    margin:0 0 4px 0;
    line-height:1.1;
    text-align:center; /* luce mejor centrado en el bloque del medio */
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
    background:#f1f3f5;
    border:1px solid #dee2e6;
    padding:2px 8px;
    border-radius:12px;
    font-size:11px;
  }

  /* ===== Bloque de datos (pares Etiqueta: Valor) ===== */
  .doc-info{
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* columnas adaptables */
    gap:6px 12px;
    margin-bottom:10px;
    font-size:13px;
    align-items:center;
  }
  .doc-info .pair{
    display:flex;
    align-items:center;
    gap:6px;
    white-space:nowrap; /* evita saltos entre etiqueta y valor */
  }
  .doc-info .lbl{
    color:#6c757d;
    min-width:80px;     /* compacto y consistente */
    font-weight:600;
  }
  .doc-info .val{ font-weight:600; }
  .doc-info .observ{ grid-column: 1 / -1; } /* observación ocupa todo el ancho */

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

  /* Repetir encabezado/pie de tabla en cada página impresa */
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

  /* ===== Modo impresión ===== */
  @media print{
    .no-print{ display:none !important; }
  }
</style>

  </head>
  <body>
    ${bloques.join("")}
    <script>
      // numeración simple por página (opcional): los navegadores modernos ya muestran #
      window.print();
    </script>
  </body>
  </html>`);
  v.document.close();
  v.focus();
}



$(document).on("click",".editar-remision",function(){
    if($(this).prop('disabled')) return;
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarRemision();
    setTimeout(function(){
        let datos=ejecutarAjax("controladores/remision.php","leer_id="+id);
        let json=JSON.parse(datos);
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
        
        let det=ejecutarAjax("controladores/detalle_remision.php","leer=1&id_remision="+id);
        if(det !== "0"){
            detallesRemision=JSON.parse(det).map(d=>({id_producto:d.id_producto,producto:d.producto,cantidad:d.cantidad}));
        }else{
            detallesRemision=[];
        }
        renderDetallesRemision();
    },100);
});

$(document).on("click",".anular-remision",function(){
    if($(this).prop('disabled')) return;
    let id=$(this).closest("tr").find("td:eq(0)").text();
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
    let id=$(this).closest("tr").find("td:eq(0)").text();
    imprimirRemision(id);
});
