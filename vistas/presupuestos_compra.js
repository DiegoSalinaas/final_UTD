let detalles = [];
let listaProveedores = [];
let listaProductos = [];

/* =========================
   Helpers de formato/número
   ========================= */
function toNumberPY(v) {
  if (v == null) return 0;
  v = String(v).trim();
  if (v === "") return 0;
  v = v.replace(/\s/g, "");

  const hasComma = v.includes(",");
  const hasDot = v.includes(".");

  if (hasComma && hasDot) {
    // Si hay ambos símbolos, el último encontrado es el separador decimal
    if (v.lastIndexOf(",") > v.lastIndexOf(".")) {
      v = v.replace(/\./g, "").replace(",", ".");
    } else {
      v = v.replace(/,/g, "");
    }
  } else if (hasComma) {
    // Solo comas -> decimal, puntos como miles
    v = v.replace(/\./g, "").replace(",", ".");
  } else if (hasDot) {
    const parts = v.split(".");
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      // Múltiples puntos o 3 dígitos al final -> todos son miles
      v = v.replace(/\./g, "");
    }
    // Si no, se asume punto decimal y se deja tal cual
  }

  return Number(v) || 0;
}

function fmt0(n) {
  return new Intl.NumberFormat("es-PY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(n || 0));
}

function fmt2(n) {
  return new Intl.NumberFormat("es-PY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(n || 0));
}

/* =========================
   Navegación / vistas
   ========================= */
function mostrarListarPresupuestos(){
  let contenido = dameContenido("paginas/referenciales/presupuestos_compra/listar.php");
  $("#contenido-principal").html(contenido);
  cargarTablaPresupuesto();
}

function mostrarAgregarPresupuesto(){
  let contenido = dameContenido("paginas/referenciales/presupuestos_compra/agregar.php");
  $("#contenido-principal").html(contenido);
  cargarListaProveedores();
  cargarListaProductos();
  limpiarPresupuesto();
  dameFechaActual("fecha_txt");
}

/* =========================
   Proveedores / Productos
   ========================= */
function cargarListaProveedores(){
  let datos = ejecutarAjax("controladores/proveedor.php","leerActivo=1");
  if(datos !== "0"){
    listaProveedores = JSON.parse(datos);
    renderListaProveedores(listaProveedores);
  }
}

function renderListaProveedores(arr){
  let select = $("#id_proveedor_lst");
  select.html('<option value="">-- Seleccione un proveedor --</option>');
  arr.forEach(function(p){
    select.append(`
      <option value="${p.id_proveedor}" data-ruc="${p.ruc}">
        ${p.razon_social} | ruc: ${p.ruc}
      </option>
    `);
  });
}

function filtrarProveedores(texto){
  let filtrados = listaProveedores.filter(function(p){
    return p.razon_social.toLowerCase().includes(texto.toLowerCase());
  });
  renderListaProveedores(filtrados);
}

function cargarListaProductos(){
  let datos = ejecutarAjax("controladores/productos.php", "leerActivo=1");
  if(datos !== "0"){
    listaProductos = JSON.parse(datos);
    renderListaProductos(listaProductos);
  }
}

function renderListaProductos(arr){
  let select = $("#id_producto_lst");
  select.html('<option value="">-- Seleccione un producto --</option>');
  arr.forEach(function(p){
    select.append(`<option value="${p.producto_id}">${p.nombre}</option>`);
  });
}

function filtrarProductos(texto){
  let filtrados = listaProductos.filter(function(p){
    return p.nombre.toLowerCase().includes(texto.toLowerCase());
  });
  renderListaProductos(filtrados);
}

/* =========================
   Subtotal en vivo (inputs)
   ========================= */
// Cantidad (solo dígitos, con miles en vivo)
$(document).on("input", "#cantidad_txt", function(){
  let digits = this.value.replace(/\D/g, "");
  if (digits === "") { this.value = ""; }
  else { this.value = fmt0(Number(digits)); }
});
$(document).on("paste", "#cantidad_txt", function(e){
  e.preventDefault();
  const text = (e.originalEvent || e).clipboardData.getData('text') || '';
  const digits = text.replace(/\D/g,'');
  this.value = digits ? fmt0(Number(digits)) : '';
  $("#cantidad_txt").trigger("input"); // para recalcular subtotal
});

// Costo unitario: permitir 0-9 . , en input; formato bonito en blur
$(document).on("input", "#precio_unitario_txt", function(){
  this.value = this.value.replace(/[^0-9.,]/g, "");
});
$(document).on("paste", "#precio_unitario_txt", function(e){
  e.preventDefault();
  const text = (e.originalEvent || e).clipboardData.getData('text') || '';
  this.value = text.replace(/[^0-9.,]/g,"");
  $("#precio_unitario_txt").trigger("input");
});
$(document).on("blur", "#precio_unitario_txt", function(){
  const num = toNumberPY(this.value);
  this.value = fmt2(num);
});

// Recalcular subtotal en vivo (leer cantidad/costo normalizados)
$(document).on("input", "#cantidad_txt, #precio_unitario_txt", function(){
  const cant   = toNumberPY($("#cantidad_txt").val());
  const precio = toNumberPY($("#precio_unitario_txt").val());
  const subtotal = cant * precio;
  $("#subtotal_txt").val(fmt0(subtotal));
});

/* =========================
   Detalle (agregar / render / editar in-line)
   ========================= */
function agregarDetalle(){
  const idProdSel = $("#id_producto_lst").val();
  if(!idProdSel){
    mensaje_dialogo_info_ERROR("Debe seleccionar un producto", "ERROR");
    return;
  }
  const cant = toNumberPY($("#cantidad_txt").val());
  if(cant <= 0){
    mensaje_dialogo_info_ERROR("La cantidad debe ser mayor a cero", "ERROR");
    return;
  }
  const precio = toNumberPY($("#precio_unitario_txt").val());
  if(precio <= 0){
    mensaje_dialogo_info_ERROR("El costo debe ser mayor a cero", "ERROR");
    return;
  }

  const idProducto = parseInt(idProdSel, 10);
  const productoTxt = $("#id_producto_lst option:selected").text();

  // ---- PREVENIR DUPLICADOS: sumar cantidad si ya existe
  const existing = detalles.find(d => d.id_producto === idProducto);
  if (existing) {
    existing.cantidad = (Number(existing.cantidad) || 0) + cant;
    // Mantener el último costo ingresado (comenta la siguiente línea si no querés cambiarlo)
    existing.precio_unitario = precio;
    existing.subtotal = existing.cantidad * existing.precio_unitario;
  } else {
    const subtotal = cant * precio;
    const detalle = {
      id_detalle: 0,
      id_producto: idProducto,
      producto: productoTxt,
      cantidad: cant,                 // NUMÉRICO
      precio_unitario: precio,        // NUMÉRICO
      subtotal: subtotal              // NUMÉRICO
    };
    detalles.push(detalle);
  }

  renderDetalles();
  limpiarDetalleForm();
}

function renderDetalles(){
  let tbody = $("#detalle_tb");
  tbody.html("");
  detalles.forEach(function(d,idx){
    tbody.append(`
      <tr data-idx="${idx}">
        <td class="text-start">${d.producto}</td>
        <td>
          <input type="text" class="form-control form-control-sm text-end edit-cant" data-idx="${idx}" value="${fmt0(d.cantidad)}">
        </td>
        <td>
          <input type="text" class="form-control form-control-sm text-end edit-precio" data-idx="${idx}" value="${fmt2(d.precio_unitario)}">
        </td>
        <td class="text-end subtotal-cell" data-idx="${idx}">${fmt0(d.subtotal)}</td>
        <td>
          <button class="btn btn-danger btn-sm quitar-detalle" data-idx="${idx}" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `);
  });
  calcularTotal();
}

// Edición in-line: CANTIDAD con miles en vivo
$(document).on("input", ".edit-cant", function(){
  const idx = Number($(this).data("idx"));
  let digits = this.value.replace(/\D/g, "");
  if (digits === "") {
    this.value = "";
    detalles[idx].cantidad = 0;
  } else {
    const n = Number(digits);
    this.value = fmt0(n);
    detalles[idx].cantidad = n;
  }
  detalles[idx].subtotal = detalles[idx].cantidad * (Number(detalles[idx].precio_unitario) || 0);
  $(`.subtotal-cell[data-idx="${idx}"]`).text(fmt0(detalles[idx].subtotal));
  calcularTotal();
});

// Edición in-line: PRECIO (limpieza en input, formato en blur)
$(document).on("input", ".edit-precio", function(){
  this.value = this.value.replace(/[^0-9.,]/g, "");
  const idx = Number($(this).data("idx"));
  detalles[idx].precio_unitario = toNumberPY(this.value);
  detalles[idx].subtotal = (Number(detalles[idx].cantidad) || 0) * detalles[idx].precio_unitario;
  $(`.subtotal-cell[data-idx="${idx}"]`).text(fmt0(detalles[idx].subtotal));
  calcularTotal();
});
$(document).on("blur", ".edit-precio", function(){
  const idx = Number($(this).data("idx"));
  this.value = fmt2(detalles[idx].precio_unitario);
});

function limpiarDetalleForm(){
  $("#id_producto_lst").val("");
  $("#cantidad_txt").val("");
  $("#precio_unitario_txt").val("");
  $("#subtotal_txt").val("");
}

function calcularTotal(){
  const total = detalles.reduce((t,d) => t + (Number(d.subtotal) || 0), 0);
  $("#total_txt").val(fmt0(total));
}

/* =========================
   Guardar / actualizar
   ========================= */
function guardarPresupuesto(){
  const idProv = $("#id_proveedor_lst").val();
  if(!idProv){
    mensaje_dialogo_info_ERROR("Debe seleccionar un proveedor", "ERROR");
    return;
  }
  if(($("#fecha_txt").val() || "").trim().length===0){
    mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ERROR");
    return;
  }
  const validez = parseInt($("#validez_txt").val(),10);
  if(isNaN(validez) || validez <= 0){
    mensaje_dialogo_info_ERROR("Debe ingresar la validez en días", "ERROR");
    return;
  }
  if(detalles.length === 0){
    mensaje_dialogo_info_ERROR("Debe agregar al menos un producto", "ERROR");
    return;
  }
  if(detalles.some(d => (Number(d.cantidad) <= 0 || Number(d.precio_unitario) <= 0))){
    mensaje_dialogo_info_ERROR("Los productos deben tener cantidad y costo mayores a cero", "ERROR");
    return;
  }

  const totalNum = toNumberPY($("#total_txt").val());
  let datos = {
    id_proveedor: idProv,
    fecha: $("#fecha_txt").val(),
    total_estimado: totalNum,
    validez: validez
  };

  if($("#id_presupuesto").val() === "0"){
    const id = ejecutarAjax("controladores/presupuestos_compra.php","guardar="+JSON.stringify(datos));
    detalles.forEach(function(d){
      const det = {
        id_presupuesto: id,
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal
      };
      ejecutarAjax("controladores/detalle_presupuesto.php","guardar="+JSON.stringify(det));
    });
    mensaje_confirmacion("REALIZADO", "Guardado correctamente");
  }else{
    datos = {...datos, id_presupuesto: $("#id_presupuesto").val()};
    ejecutarAjax("controladores/presupuestos_compra.php","actualizar="+JSON.stringify(datos));
    detalles.forEach(function(d){
      if(d.id_detalle && d.id_detalle != 0){
        const det = {
          id_detalle: d.id_detalle,
          id_presupuesto: $("#id_presupuesto").val(),
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
          subtotal: d.subtotal
        };
        ejecutarAjax("controladores/detalle_presupuesto.php","actualizar="+JSON.stringify(det));
      }else{
        const det = {
          id_presupuesto: $("#id_presupuesto").val(),
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
          subtotal: d.subtotal
        };
        ejecutarAjax("controladores/detalle_presupuesto.php","guardar="+JSON.stringify(det));
      }
    });
    mensaje_confirmacion("REALIZADO", "Actualizado correctamente");
  }
  mostrarListarPresupuestos();
  limpiarPresupuesto();
}

/* =========================
   Listado / búsqueda
   ========================= */
function renderTablaPresupuestos(datos){
  if(datos === "0"){
    $("#datos_tb").html("NO HAY REGISTROS");
    $("#presupuesto_count").text("0");
    return;
  }
  const json = JSON.parse(datos);
  $("#presupuesto_count").text(json.length);
  $("#datos_tb").html("");
  json.map(function(it){
    const disabled = it.estado === 'ANULADO' ? 'disabled' : '';
    $("#datos_tb").append(`
      <tr>
        <td>${it.id_presupuesto}</td>
        <td class="text-start">${it.proveedor}</td>
        <td>${it.fecha}</td>
        <td>${it.validez}</td>
        <td class="text-end">${fmt0(toNumberPY(it.total_estimado))}</td>
        <td>${badgeEstado(it.estado)}</td>
        <td>
          <button class="btn btn-info ver-detalle" title="Imprimir">
            <i class="bi bi-printer"></i>
          </button>
          <button class="btn btn-warning editar-presupuesto" ${disabled} title="Editar">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-danger anular-presupuesto" ${disabled} title="Anular">
            <i class="bi bi-x-circle"></i>
          </button>
        </td>
      </tr>`);
  });
}

function cargarTablaPresupuesto(){
  const datos = ejecutarAjax("controladores/presupuestos_compra.php","leer=1");
  renderTablaPresupuestos(datos);
}

$(document).on("click",".editar-presupuesto",function(){
  if($(this).prop('disabled')) return;
  let id = $(this).closest("tr").find("td:eq(0)").text();
  mostrarAgregarPresupuesto();

  let datos = ejecutarAjax("controladores/presupuestos_compra.php","leer_id="+id);
  let json = JSON.parse(datos);
  $("#id_presupuesto").val(json.id_presupuesto);
  $("#id_proveedor_lst").val(json.id_proveedor);
  $("#fecha_txt").val(json.fecha);
  $("#validez_txt").val(json.validez);
  $("#total_txt").val(fmt0(toNumberPY(json.total_estimado)));

  let det = ejecutarAjax("controladores/detalle_presupuesto.php","leer=1&id_presupuesto="+id);
  if(det !== "0"){
    detalles = JSON.parse(det).map(d => ({
      ...d,
      id_producto: parseInt(d.id_producto,10),
      cantidad: Number(d.cantidad) || toNumberPY(d.cantidad),
      precio_unitario: Number(d.precio_unitario) || toNumberPY(d.precio_unitario),
      subtotal: Number(d.subtotal) || toNumberPY(d.subtotal)
    }));
    renderDetalles();
  }
});

$(document).on("click",".ver-detalle",function(){
  if($(this).prop('disabled')) return;
  let id = $(this).closest("tr").find("td:eq(0)").text();
  imprimirPresupuesto(id);
});

$(document).on("click",".anular-presupuesto",function(){
  if($(this).prop('disabled')) return;
  let id = $(this).closest("tr").find("td:eq(0)").text();
  ejecutarAjax("controladores/presupuestos_compra.php","anular="+id);
  mensaje_confirmacion("Realizado","Presupuesto Anulado");
  cargarTablaPresupuesto();
});

$(document).on("click",".quitar-detalle",function(){
  if(detalles.length <= 1){
    mensaje_dialogo_info_ERROR("No se puede eliminar todos los productos", "ERROR");
    return;
  }
  let idx = $(this).data("idx");
  detalles.splice(idx,1);
  renderDetalles();
});

$(document).on("keyup","#filtro_proveedor",function(){
  filtrarProveedores($(this).val());
});

$(document).on("keyup","#filtro_producto",function(){
  filtrarProductos($(this).val());
});

$(document).on("keyup","#b_presupuesto",function(){
  buscarPresupuesto();
});

$(document).on("change","#estado_filtro",function(){
  buscarPresupuesto();
});

$(document).on("change","#f_desde, #f_hasta", function(){
  buscarPresupuesto();
});

function buscarPresupuesto(){
  const desc   = encodeURIComponent($("#b_presupuesto").val() || "");
  const est    = encodeURIComponent($("#estado_filtro").val() || "");
  const fDesde = encodeURIComponent($("#f_desde").val() || "");
  const fHasta = encodeURIComponent($("#f_hasta").val() || "");
  const datos = ejecutarAjax(
    "controladores/presupuestos_compra.php",
    "leer_descripcion="+desc+"&estado="+est+"&f_desde="+fDesde+"&f_hasta="+fHasta
  );
  renderTablaPresupuestos(datos);
}

$(document).on("click", "#limpiar_busqueda_btn", function(){
  $("#b_presupuesto").val("");
  $("#estado_filtro").val("");
  $("#f_desde").val("");
  $("#f_hasta").val("");
  buscarPresupuesto();
});

function imprimirPresupuesto(id) {
  const presupuestoData = ejecutarAjax("controladores/presupuestos_compra.php", "leer_id=" + id);
  if (presupuestoData === "0") {
    alert("No se encontró el presupuesto");
    return;
  }
  const presupuesto = JSON.parse(presupuestoData);

  const detalleData = ejecutarAjax("controladores/detalle_presupuesto.php", "leer=1&id_presupuesto=" + id);
  const detalles = detalleData !== "0" ? JSON.parse(detalleData) : [];

  const estadoTxt = presupuesto.estado || "PENDIENTE";
  const estUC = estadoTxt.toUpperCase();
  const estadoBadge =
    estUC === "APROBADO" ? "bg-success" :
    estUC === "ANULADO"  ? "bg-danger" :
    "bg-warning text-dark";

  const filas = detalles.length ? detalles.map((d,i) => `
    <tr>
      <td class="text-center">${i+1}</td>
      <td class="text-start">${d.producto || d.id_producto || ""}</td>
      <td class="text-end">${fmt0(toNumberPY(d.cantidad))}</td>
      <td class="text-end">${fmt2(toNumberPY(d.precio_unitario))}</td>
      <td class="text-end">${fmt0(toNumberPY(d.subtotal))}</td>
    </tr>
  `).join("") : `<tr><td colspan="5" class="text-center">Sin productos</td></tr>`;

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Presupuesto #${presupuesto.id_presupuesto}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      @page { size: A4; margin: 14mm; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { color:#111; font-family: "Segoe UI", Arial, sans-serif; }

      .doc-header {
        display:grid;
        grid-template-columns: auto 1fr auto;
        align-items:center;
        gap:16px;
        border-bottom:2px solid #0d6efd;
        padding-bottom:10px;
        margin-bottom:14px;
      }
      .doc-logo img { height:70px; }
      .doc-empresa { display:flex; flex-direction:column; justify-content:center; }
      .doc-empresa h1 { font-size:20px; font-weight:800; margin:0 0 4px 0; }
      .emp-meta { font-size:12px; color:#555; line-height:1.35; }
      .doc-right { text-align:right; }
      .doc-right .doc-tipo { font-size:14px; font-weight:700; color:#0d6efd; }
      .doc-right .doc-num { font-size:18px; font-weight:800; }
      .doc-right .doc-fecha { font-size:12px; color:#555; }

      .doc-info {
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap:6px 12px;
        margin-bottom:10px;
        font-size:13px;
      }
      .doc-info .pair { display:flex; align-items:center; gap:6px; white-space:nowrap; }
      .doc-info .lbl { color:#6c757d; min-width:90px; font-weight:600; }
      .doc-info .val { font-weight:600; }
      .doc-info .observ { grid-column: 1 / -1; }

      table { width:100%; border-collapse:collapse; margin-top:10px; }
      thead th {
        background:#e9f2ff;
        border:1px solid #cfe2ff !important;
        font-weight:700;
        padding:6px 8px;
      }
      td {
        border:1px solid #e9ecef;
        padding:7px 8px;
        font-size:12.5px;
        vertical-align:top;
      }
      .text-center { text-align:center; }
      .text-start { text-align:left; }
      .text-end { text-align:right; }

      thead { display: table-header-group; }
      tfoot { display: table-footer-group; }

      .total { margin-top:20px; font-size:16px; font-weight:700; text-align:right; }
      .firmas {
        display:grid;
        grid-template-columns: repeat(3, 1fr);
        gap:22px;
        margin-top:18px;
      }
      .firmas .linea { border-bottom:1px solid #000; height:28px; }
      .firmas .ftxt { text-align:center; font-size:12px; color:#444; margin-top:6px; }

      .doc-footer { margin-top:10px; font-size:11px; color:#6c757d; text-align:right; }
    </style>
  </head>
  <body>
    <div class="doc-header">
      <div class="doc-logo">
        <img src="images/logo.png" alt="Logo">
      </div>
      <div class="doc-empresa">
        <h1>HARD INFORMATICA S.A.</h1>
        <div class="emp-meta">
          RUC: 84945944-4 &nbsp;•&nbsp; Av. Siempre Viva 123 - Asunción<br>
          Tel.: (021) 376-548 &nbsp;•&nbsp; ventas@hardinformatica.com
        </div>
      </div>
      <div class="doc-right">
        <div class="doc-tipo">PRESUPUESTO</div>
        <div class="doc-num">#${presupuesto.id_presupuesto}</div>
        <div class="doc-fecha">${formatearFechaDMA(presupuesto.fecha)}</div>
      </div>
    </div>

    <div class="doc-info">
      <div class="pair"><span class="lbl">Proveedor:</span> <span class="val">${presupuesto.proveedor || presupuesto.id_proveedor}</span></div>
      <div class="pair"><span class="lbl">Estado:</span> <span class="val badge ${estadoBadge}">${estadoTxt}</span></div>
      <div class="pair"><span class="lbl">Moneda:</span> <span class="val">PYG</span></div>
      <div class="pair"><span class="lbl">Validez:</span> <span class="val">${presupuesto.validez} días</span></div>
    </div>

    <table>
      <thead>
        <tr>
          <th class="text-center" style="width:50px">#</th>
          <th class="text-start">Producto</th>
          <th class="text-end" style="width:90px">Cantidad</th>
          <th class="text-end" style="width:110px">Costo Unitario</th>
          <th class="text-end" style="width:110px">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>

    <div class="total">
      Total Estimado: ${fmt0(toNumberPY(presupuesto.total_estimado))}
    </div>

    <div class="firmas">
      <div><div class="linea"></div><div class="ftxt">Preparado por</div></div>
      <div><div class="linea"></div><div class="ftxt">Aprobado por</div></div>
      <div><div class="linea"></div><div class="ftxt">Proveedor</div></div>
    </div>

    <div class="doc-footer">
      Documento generado automáticamente.
    </div>

    <script>window.print();</script>
  </body>
  </html>
  `);
  v.document.close();
  v.focus();
}



function limpiarPresupuesto(){
  $("#id_presupuesto").val("0");
  $("#id_detalle").val("0");
  $("#id_proveedor_lst").val("");
  $("#fecha_txt").val("");
  $("#validez_txt").val("");
  $("#total_txt").val("");
  $("#id_producto_lst").val("");
  $("#cantidad_txt").val("");
  $("#precio_unitario_txt").val("");
  $("#subtotal_txt").val("");
  detalles = [];
  renderDetalles();
}
