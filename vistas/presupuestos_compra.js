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
    select.append(`<option value="${p.id_proveedor}">${p.razon_social}</option>`);
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
function cargarTablaPresupuesto(){
  let datos = ejecutarAjax("controladores/presupuestos_compra.php","leer=1");
  if(datos === "0"){
    $("#datos_tb").html("NO HAY REGISTROS");
  }else{
    $("#datos_tb").html("");
    let json = JSON.parse(datos);
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

function buscarPresupuesto(){
  const desc = encodeURIComponent($("#b_presupuesto").val() || "");
  const est  = encodeURIComponent($("#estado_filtro").val() || "");
  let datos = ejecutarAjax(
    "controladores/presupuestos_compra.php",
    "leer_descripcion="+desc+"&estado="+est
  );
  if(datos === "0"){
    $("#datos_tb").html("NO HAY REGISTROS");
  }else{
    $("#datos_tb").html("");
    let json = JSON.parse(datos);
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
            <button class="btn btn-info ver-detalle" ${disabled} title="Imprimir">
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
}

function imprimirPresupuesto(id){
  let presupuestoData = ejecutarAjax("controladores/presupuestos_compra.php", "leer_id=" + id);
  if (presupuestoData === "0") {
    alert("No se encontró el presupuesto");
    return;
  }

  let presupuesto = JSON.parse(presupuestoData);

  let detalleData = ejecutarAjax("controladores/detalle_presupuesto.php", "leer=1&id_presupuesto=" + id);
  let filas = "";
  if (detalleData !== "0") {
    JSON.parse(detalleData).forEach(function(d, i) {
      filas += `
        <tr>
          <td>${i + 1}</td>
          <td>${d.producto || d.id_producto}</td>
          <td>${fmt0(toNumberPY(d.cantidad))}</td>
          <td>${fmt2(toNumberPY(d.precio_unitario))}</td>
          <td>${fmt0(toNumberPY(d.subtotal))}</td>
        </tr>`;
    });
  }

  const estadoBadge = (String(presupuesto.estado || "").toUpperCase() === "APROBADO") ? "bg-success" :
                      (String(presupuesto.estado || "").toUpperCase() === "ANULADO") ? "bg-danger" : "bg-warning text-dark";

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Presupuesto #${presupuesto.id_presupuesto}</title>
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
      .total { margin-top:20px; font-size:16px; font-weight:700; text-align:right; }
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
        <h2 class="doc-title">Presupuesto #${presupuesto.id_presupuesto}</h2>
        <div class="meta">
          Proveedor: <strong>${presupuesto.proveedor || presupuesto.id_proveedor}</strong>
          &nbsp;·&nbsp; Estado: <span class="badge ${estadoBadge}">${presupuesto.estado || "PENDIENTE"}</span>
          &nbsp;·&nbsp; Fecha: <strong>${formatearFechaDMA(presupuesto.fecha)}</strong>
        </div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="lbl">Total Estimado</div>
        <div class="val">${fmt0(toNumberPY(presupuesto.total_estimado))}</div>
      </div>
      <div class="kpi">
        <div class="lbl">Moneda</div>
        <div class="val">PYG</div>
      </div>
      <div class="kpi">
        <div class="lbl">Validez</div>
        <div class="val">${presupuesto.validez} días</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Costo Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${filas || `<tr><td colspan="5">Sin productos</td></tr>`}
      </tbody>
    </table>

    <div class="total">
      Total Estimado: ${fmt0(toNumberPY(presupuesto.total_estimado))}
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
window.imprimirPresupuesto = imprimirPresupuesto;


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
