(function(){
 let detallesOC = [];
let listaPresupuestos = [];
let listaProductos = [];


})();

function getCantidad() {
  return parseFloat($('#cantidad_txt').val()) || 0;
}

function getPrecioUnitario() {
  // Lee el input (con puntos) y devuelve número entero
  return quitarDecimalesConvertir(String($('#precio_unitario_txt').val() || '0')) || 0;
}

function setTotalUI(total) {
  const formatted = formatearPY(total);
  const ids = [
    '#total_txt', '#total_lbl',
    '#total_orden_txt', '#total_orden_lbl',
    '#total_general', '#total_general_lbl',
    '#total', '#total_orden',
    '#total_oc_txt'
  ];
  ids.forEach(sel => {
    const $el = $(sel);
    if ($el.length) {
      if ($el.is('input,textarea')) $el.val(formatted);
      else $el.text(formatted);
    }
  });
}

function actualizarSubtotalUI() {
  const cant = getCantidad();
  const precio = getPrecioUnitario();
  const subtotal = cant * precio;
  $('#subtotal_txt').val(subtotal ? formatearPY(subtotal) : '');
}

function calcularTotalOrdenLocal() {
  const total = detallesOC.reduce((acc, d) => acc + (Number(d.subtotal) || 0), 0);
  setTotalUI(total);
}

// -----------------------------
// Listado
// -----------------------------
function mostrarListarOrdenes(){
  console.log("Entró en mostrarListarOrdenes()");
  let contenido = dameContenido("paginas/referenciales/orden_compra/listar.php");
  $("#contenido-principal").html(contenido);
  cargarTablaOrden();
}
window.mostrarListarOrdenes = mostrarListarOrdenes;

// -----------------------------
// Agregar / Editar
// -----------------------------
function mostrarAgregarOrden(){
  let contenido = dameContenido("paginas/referenciales/orden_compra/agregar.php");
  $("#contenido-principal").html(contenido);
  cargarListaPresupuestos();
  cargarListaProductos();
  limpiarOrden(); // ← ya no hace focus automático en cantidad
  let hoy = new Date();
  let fechaFormateada = hoy.toISOString().split('T')[0]; 
  $("#fecha_txt").val(fechaFormateada);
}
window.mostrarAgregarOrden = mostrarAgregarOrden;

// -----------------------------
// Presupuestos
// -----------------------------
function cargarListaPresupuestos(){
  let datos = ejecutarAjax("controladores/presupuestos_compra.php","leerPendiente=1");
  let select = $("#id_presupuesto_lst");

  if(datos !== "0"){
    listaPresupuestos = JSON.parse(datos);
    renderListaPresupuestos(listaPresupuestos);
  } else {
    select.html('<option value="">-- No hay presupuestos pendientes --</option>');
  }
}

function renderListaPresupuestos(arr){
  let select = $("#id_presupuesto_lst");
  select.html('<option value="">-- Seleccione un presupuesto --</option>');
  arr.forEach(function(p){
    select.append(
      `<option value="${p.id_presupuesto}" data-prov="${p.id_proveedor}" data-prov-nombre="${p.proveedor}">
        Presupuesto #${p.id_presupuesto}
      </option>`
    );
  });
}

// -----------------------------
// Productos
// -----------------------------
function cargarListaProductos(){
  // Si ya tenés otra carga, podés mantener la tuya.
  let datos = ejecutarAjax("controladores/productos.php","leer=1");
  if (datos !== "0") {
    listaProductos = JSON.parse(datos);
    renderListaProductos(listaProductos);
  } else {
    renderListaProductos([]);
  }
}

function renderListaProductos(arr){
  let select = $("#id_producto_lst");
  select.html('<option value="">-- Seleccione un producto --</option>');
  arr.forEach(function(p){
    select.append(`<option value="${p.producto_id}">${p.nombre}</option>`);
  });
}

// -----------------------------
// Eventos de UI (presupuesto)
// -----------------------------
$(document).on('change','#id_presupuesto_lst',function(){
  let id = $(this).val();
  if(id === ""){
    $("#proveedor_txt").val('');
    $("#id_proveedor").val('');
    detallesOC = [];
    renderDetallesOC();
    calcularTotalOrdenLocal();
    return;
  }
  let datos = ejecutarAjax("controladores/presupuestos_compra.php","leer_id="+id);
  if(datos !== "0"){
    let p = JSON.parse(datos);
    $("#proveedor_txt").val(p.proveedor || p.id_proveedor);
    $("#id_proveedor").val(p.id_proveedor);

    let det = ejecutarAjax("controladores/detalle_presupuesto.php","leer=1&id_presupuesto="+id);
    if(det !== "0"){       
      // Aseguramos números
      detallesOC = JSON.parse(det).map(d => {
        const cant = parseFloat(d.cantidad) || 0;
        const precio = typeof d.precio_unitario === 'number'
          ? d.precio_unitario
          : quitarDecimalesConvertir(String(d.precio_unitario || '0'));
        const sub = cant * precio;
        return {
          id_producto: parseInt(d.id_producto),
          producto: d.producto,
          cantidad: cant,
          precio_unitario: precio,
          subtotal: sub
        };
      });
    } else {
      detallesOC = [];
    }
    renderDetallesOC();
    calcularTotalOrdenLocal();
  }
});

// -----------------------------
// Inputs de cantidad / precio
// -----------------------------
// Recalcular subtotal cuando se escribe en cantidad
$(document).on('input', '#cantidad_txt', function(){
  actualizarSubtotalUI();
});

// Formateo EN VIVO de precio con puntos y recálculo de subtotal
$(document).on('input', '#precio_unitario_txt', function(){
  const raw = String($(this).val());
  const digits = raw.replace(/\D/g, ''); // solo números
  if (digits.length === 0) {
    $(this).val('');
  } else {
    const n = parseInt(digits, 10) || 0;
    $(this).val(formatearPY(n)); // muestra puntos en vivo
  }
  actualizarSubtotalUI();
});

// Asegurar consistencia en blur (opcional, por si pegan texto)
$(document).on('blur', '#precio_unitario_txt', function(){
  const precio = getPrecioUnitario();
  $(this).val(precio ? formatearPY(precio) : '');
  actualizarSubtotalUI();
});

// -----------------------------
// Agregar producto extra
// -----------------------------
function agregarProductoExtra(){
  if($("#id_presupuesto_lst").val() === ""){
    mensaje_dialogo_info_ERROR("Debe seleccionar un presupuesto","ERROR");
    return;
  }
  if($("#id_producto_lst").val() === ""){
    mensaje_dialogo_info_ERROR("Debe seleccionar un producto","ERROR");
    return;
  }

  let cantidad = getCantidad();
  let precio = getPrecioUnitario();

  if(cantidad <= 0){
    mensaje_dialogo_info_ERROR("La cantidad debe ser mayor a 0","ERROR");
    return;
  }
  if(precio <= 0){
    mensaje_dialogo_info_ERROR("El precio unitario debe ser mayor a 0","ERROR");
    return;
  }

  let idProducto = parseInt($("#id_producto_lst").val());
  let idx = detallesOC.findIndex(d => d.id_producto === idProducto);

  if (idx !== -1) {
    // Si el producto ya estaba cargado, sumar la cantidad y actualizar precio y subtotal
    detallesOC[idx].cantidad += cantidad;
    detallesOC[idx].precio_unitario = precio;
    detallesOC[idx].subtotal = detallesOC[idx].cantidad * precio;
  } else {
    let detalle = {
      id_producto: idProducto,
      producto: $("#id_producto_lst option:selected").text(),
      cantidad: cantidad,
      precio_unitario: precio, // numérico sin puntos
      subtotal: cantidad * precio
    };
    detallesOC.push(detalle);
  }
  renderDetallesOC();
  calcularTotalOrdenLocal();
  limpiarDetalleExtraForm(true); // aquí sí enfocamos cantidad para seguir cargando
}
window.agregarProductoExtra = agregarProductoExtra;

function limpiarDetalleExtraForm(doFocus = true){
  $("#id_producto_lst").val("").trigger("change");
  $("#cantidad_txt").val("");
  $("#precio_unitario_txt").val("");
  $("#subtotal_txt").val("");
  if (doFocus) $("#cantidad_txt").focus(); // ← solo si corresponde
}

// -----------------------------
// Render tabla de detalles
// -----------------------------
function renderDetallesOC(){
  let tbody = $("#detalle_oc_tb");
  tbody.html("");
  detallesOC.forEach(function(d){
    tbody.append(`<tr>
      <td>${d.producto}</td>
      <td>${d.cantidad}</td>
      <td>${formatearPY(d.precio_unitario)}</td>
      <td>${formatearPY(d.subtotal)}</td>
      <td>
        <button class="btn btn-danger btn-sm eliminar-detalle" data-id="${d.id_producto}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>`);
  });
  // Por si alguien llama a render sin luego llamar al total
  calcularTotalOrdenLocal();
}

// -----------------------------
// Eliminar detalle
// -----------------------------
$(document).on('click','.eliminar-detalle',function(){
  if(detallesOC.length <= 1){
    mensaje_dialogo_info_ERROR("No se puede eliminar todos los productos", "ERROR");
    return;
  }
  let idProducto = $(this).data('id');
  let idx = detallesOC.findIndex(d => d.id_producto == idProducto);
  if(idx !== -1){
    detallesOC.splice(idx,1);
    renderDetallesOC(); // ya recalcula total
  }
});

// -----------------------------
// Guardar / Actualizar
// -----------------------------
function guardarOrden(){
  if($("#id_presupuesto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un presupuesto","ERROR");return;}
  if($("#fecha_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la fecha","ERROR");return;}
  if(detallesOC.length === 0){mensaje_dialogo_info_ERROR("No hay productos en el presupuesto seleccionado","ERROR");return;}

  let datos = {
    id_presupuesto: $("#id_presupuesto_lst").val(),
    id_proveedor: $("#id_proveedor").val(),
    fecha_emision: $("#fecha_txt").val()
  };
  let idOrden = $("#id_orden").val();
  let mensaje;

  if(idOrden === "0"){
    idOrden = ejecutarAjax("controladores/orden_compra.php","guardar="+JSON.stringify(datos));
    detallesOC.forEach(function(d){
      let det = {
        id_orden: idOrden,
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal
      };
      ejecutarAjax("controladores/detalle_orden_compra.php","guardar="+JSON.stringify(det));
    });
    mensaje = "Guardado correctamente";
  }else{
    datos = {...datos, id_orden: idOrden};
    ejecutarAjax("controladores/orden_compra.php","actualizar="+JSON.stringify(datos));
    ejecutarAjax("controladores/detalle_orden_compra.php","eliminar_por_orden="+idOrden);
    detallesOC.forEach(function(d){
      let det = {
        id_orden: idOrden,
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal
      };
      ejecutarAjax("controladores/detalle_orden_compra.php","guardar="+JSON.stringify(det));
    });
    mensaje = "Actualizado correctamente";
  }

  mensaje_confirmacion("REALIZADO", mensaje).then(() => {
    imprimirOrden(idOrden, true);
    mostrarListarOrdenes();
  });
}
window.guardarOrden = guardarOrden;

// -----------------------------
// Imprimir
// -----------------------------
function imprimirOrden(id, auto = true, copias = 2) {
  // Traer cabecera por ID (mejor que leer=1 y filtrar)
  const ordenJson = ejecutarAjax("controladores/orden_compra.php", "leer_id=" + id);
  if (ordenJson === "0") { alert("No se encontró la orden"); return; }
  const orden = JSON.parse(ordenJson);

  // Detalles
  const detData = ejecutarAjax("controladores/detalle_orden_compra.php", "leer=1&id_orden=" + id);
  const detalles = detData !== "0" ? JSON.parse(detData) : [];

  // Helpers locales por si faltan
  const toNumPY = (v) => {
    if (typeof v === "number") return v;
    if (v == null) return 0;
    const s = String(v).trim();
    if (!s) return 0;
    // usa tu helper si lo tenés
    try { return quitarDecimalesConvertir ? quitarDecimalesConvertir(s) : Number(s.replace(/\./g, "").replace(",", ".")) || 0; } catch { return Number(s.replace(/\./g, "").replace(",", ".")) || 0; }
  };
  const fmtPY = (n) => (typeof formatearPY === "function" ? formatearPY(n) : new Intl.NumberFormat("es-PY",{maximumFractionDigits:0}).format(Math.round(n||0)));
  const fDMA  = (f) => (typeof formatearFechaDMA === "function" ? formatearFechaDMA(f) : f);

  // Estados
  const est = (orden.estado || "EMITIDA");
  const estUC = est.toUpperCase();
  const estadoBadge =
    estUC.includes("APROB") ? "bg-success" :
    estUC.includes("ANUL")  ? "bg-danger"  :
    "bg-warning text-dark";

  // Filas y total calculado si hace falta
  let totalCalc = 0;
  const filas = detalles.length ? detalles.map((d, i) => {
    const cant   = toNumPY(d.cantidad);
    const precio = toNumPY(d.precio_unitario);
    const sub    = d.subtotal != null ? toNumPY(d.subtotal) : (cant * precio);
    totalCalc   += sub;
    return `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td class="text-start">${d.producto || d.id_producto || ""}</td>
        <td class="text-end">${cant}</td>
        <td class="text-end">${fmtPY(precio)}</td>
        <td class="text-end">${fmtPY(sub)}</td>
      </tr>`;
  }).join("") : `<tr><td colspan="5" class="text-center">Sin ítems</td></tr>`;

  const totalMostrar = toNumPY(orden.total) > 0 ? toNumPY(orden.total) : totalCalc;

  // Datos empresa (ajusta)
  const EMPRESA = {
    nombre: "HARD INFORMATICA S.A.",
    ruc: "84945944-4",
    dir: "Av. Siempre Viva 123 - Asunción",
    tel: "(021) 376-548",
    email: "ventas@hardinformatica.com"
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
            <div class="doc-tipo">ORDEN DE COMPRA</div>
            <div class="doc-num">#${orden.id_orden}</div>
            <span class="badge ${estadoBadge}">${est}</span>
            <div class="doc-fecha">${fDMA(orden.fecha_emision)}</div>
            <span class="copia">${etiqueta}</span>
          </div>
        </header>

        <div class="doc-info">
          <div class="pair"><span class="lbl">Proveedor:</span> <span class="val">${orden.proveedor || orden.id_proveedor || ""}</span></div>
          <div class="pair"><span class="lbl">Moneda:</span> <span class="val">PYG</span></div>
          ${orden.condicion ? `<div class="pair"><span class="lbl">Condición:</span> <span class="val">${orden.condicion}</span></div>` : ""}
          ${orden.observacion ? `<div class="observ"><span class="lbl">Obs.:</span> <span class="val">${orden.observacion}</span></div>` : ""}
        </div>

        <table class="tabla">
          <thead>
            <tr>
              <th class="text-center" style="width:60px">#</th>
              <th class="text-start">Producto</th>
              <th class="text-end" style="width:90px">Cantidad</th>
              <th class="text-end" style="width:110px">Precio Unit.</th>
              <th class="text-end" style="width:120px">Subtotal</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>

        <div class="total">Total General: ${fmtPY(totalMostrar)}</div>

        <div class="firmas">
          <div class="fbox"><div class="linea"></div><div class="ftxt">Solicitado por</div></div>

          <div class="fbox"><div class="linea"></div><div class="ftxt">Proveedor</div></div>
        </div>

        <footer class="doc-footer">Documento generado automáticamente — ${new Date().toLocaleString()}</footer>
      </section>
    `);
  }

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Orden de Compra #${orden.id_orden}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      @page { size: A4; margin: 14mm; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { color:#111; font-family: "Segoe UI", Arial, sans-serif; }
      .doc { position: relative; page-break-after: always; }
      .doc:last-of-type { page-break-after: auto; }

      /* Header alineado */
      .doc-header{
        display:grid;
        grid-template-columns: auto 1fr auto; /* logo | empresa | OC */
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
      .doc-info .observ{ grid-column: 1 / -1; }

      /* Tabla */
      table.tabla{ width:100%; border-collapse:collapse; margin-top:10px; }
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

      /* Repetir encabezado/pie en cada página */
      thead{ display: table-header-group; }
      tfoot{ display: table-footer-group; }

      /* Total y firmas */
      .total{ margin-top:14px; font-size:16px; font-weight:700; text-align:right; }
      .firmas{ display:grid; grid-template-columns: repeat(3, 1fr); gap:22px; margin-top:18px; }
      .firmas .linea{ border-bottom:1px solid #000; height:28px; }
      .firmas .ftxt{ text-align:center; font-size:12px; color:#444; margin-top:6px; }

      .doc-footer{ margin-top:10px; font-size:11px; color:#6c757d; text-align:right; }

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
window.imprimirOrden = imprimirOrden;


// -----------------------------
// Utilidades de pantalla
// -----------------------------
function limpiarOrden(){
  $("#id_orden").val("0");
  $("#id_presupuesto_lst").val("");
  $("#proveedor_txt").val("");
  $("#id_proveedor").val("");
  $("#fecha_txt").val("");
  limpiarDetalleExtraForm(false); // ← sin foco automático
  detallesOC = [];
  renderDetallesOC(); // recalcula total
}

// -----------------------------
// Listado / Búsqueda
// -----------------------------
function cargarTablaOrden(){
  buscarOrden();
}

function renderTablaOrden(arr){
  let tbody = $("#orden_datos_tb");
  tbody.html("");

  // Asegurarse de que 'arr' sea iterable. Si el backend devuelve un
  // objeto o un valor no esperado, convertirlo a un arreglo vacío para
  // evitar errores de ejecución al usar `forEach`.
  if (!Array.isArray(arr)) {
    arr = [];
  }

  arr.forEach(function(o){
    const disabled = o.estado === 'ANULADO' ? 'disabled' : '';
    tbody.append(`<tr>
      <td>${o.id_orden}</td>
      <td>${formatearFechaDMA(o.fecha_emision)}</td>
      <td>${o.proveedor || o.id_proveedor}</td>
      <td>${formatearPY(o.total)}</td>
      <td>${badgeEstado(o.estado)}</td>
      <td>
        <button class="btn btn-info btn-sm imprimir-orden" data-id="${o.id_orden}" title="Imprimir">
          <i class="bi bi-printer"></i>
        </button>
        <button class="btn btn-warning btn-sm editar-orden" ${disabled} data-id="${o.id_orden}" title="Editar">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-danger btn-sm anular-orden" ${disabled} data-id="${o.id_orden}" title="Anular">
          <i class="bi bi-x-circle"></i>
        </button>
      </td>
    </tr>`);
  });
}

$(document).on('click','.editar-orden',function(){
  if($(this).prop('disabled')) return;
  let id = $(this).data('id');
  let datos = ejecutarAjax("controladores/orden_compra.php","leer_id="+id);
  if(datos === "0"){ alert("No se encontró la orden"); return; }
  let json = JSON.parse(datos);
  mostrarAgregarOrden();
  $("#id_orden").val(json.id_orden);
  let sel = $("#id_presupuesto_lst");
  if(sel.find(`option[value='${json.id_presupuesto}']`).length === 0){
    sel.append(`<option value="${json.id_presupuesto}" data-prov="${json.id_proveedor}" data-prov-nombre="${json.proveedor || ''}">Presupuesto #${json.id_presupuesto}</option>`);
  }
  sel.val(json.id_presupuesto);
  $("#proveedor_txt").val(json.proveedor || json.id_proveedor);
  $("#id_proveedor").val(json.id_proveedor);
  $("#fecha_txt").val(json.fecha_emision);

  let det = ejecutarAjax("controladores/detalle_orden_compra.php","leer=1&id_orden="+id);
  if(det !== "0"){       
    detallesOC = JSON.parse(det).map(d => {
      const cant = parseFloat(d.cantidad) || 0;
      const precio = typeof d.precio_unitario === 'number'
        ? d.precio_unitario
        : quitarDecimalesConvertir(String(d.precio_unitario || '0'));
      const sub = cant * precio;
      return {
        id_producto: parseInt(d.id_producto),
        producto: d.producto,
        cantidad: cant,
        precio_unitario: precio,
        subtotal: sub
      };
    });
    renderDetallesOC(); // recalcula total
  }
});

$(document).on('click', '.anular-orden', function () {
  if ($(this).prop('disabled')) return;

  const id = $(this).data('id');

  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción anulará la orden de compra y no se podrá revertir.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, anular',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      ejecutarAjax("controladores/orden_compra.php", "anular=" + id);
      cargarTablaOrden();

      Swal.fire({
        title: 'Anulado',
        text: 'La orden de compra ha sido anulada correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
});


$(document).on('click','.imprimir-orden',function(){
  if($(this).prop('disabled')) return;
  let id = $(this).data('id');
  imprimirOrden(id);
});

function buscarOrden(){
  let b = $("#b_orden").val();
  let estado = $("#estado_filtro").val();
  let desde = $("#f_desde").val();
  let hasta = $("#f_hasta").val();

  let datos = ejecutarAjax(
    "controladores/orden_compra.php",
    "leer_descripcion="+encodeURIComponent(b)+"&estado="+estado+"&desde="+desde+"&hasta="+hasta
  );
  if(datos !== "0"){
    renderTablaOrden(JSON.parse(datos));
  }else{
    $("#orden_datos_tb").html("NO HAY REGISTROS");
  }
}
window.buscarOrden = buscarOrden;

$(document).on('keyup','#b_orden',function(){
  buscarOrden();
});
$(document).on('change','#estado_filtro, #f_desde, #f_hasta',function(){
  buscarOrden();
});
$(document).on('click','#limpiar_busqueda_btn',function(){
  $("#b_orden").val('');
  $("#estado_filtro").val('');
  $("#f_desde").val('');
  $("#f_hasta").val('');
  buscarOrden();
});

$(function(){
  $(document).on('click', '.listar-ordenes', function(e){
    e.preventDefault();
    console.log("Click detectado");
    mostrarListarOrdenes();
  });
});
