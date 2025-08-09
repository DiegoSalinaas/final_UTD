(function(){
 let detallesOC = [];
let listaPresupuestos = [];
let listaProductos = [];


})();
function mostrarListarOrdenes(){
    console.log("Entró en mostrarListarOrdenes()");
    let contenido = dameContenido("paginas/referenciales/orden_compra/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaOrden();
}
window.mostrarListarOrdenes = mostrarListarOrdenes;

function mostrarAgregarOrden(){
    let contenido = dameContenido("paginas/referenciales/orden_compra/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaPresupuestos();
    cargarListaProductos();
    limpiarOrden();
    let hoy = new Date();
    let fechaFormateada = hoy.toISOString().split('T')[0]; 
    $("#fecha_txt").val(fechaFormateada);
}
window.mostrarAgregarOrden = mostrarAgregarOrden;

function cargarListaPresupuestos(){
    let datos = ejecutarAjax("controladores/presupuestos_compra.php","leerPendiente=1");
    if(datos !== "0"){
        listaPresupuestos = JSON.parse(datos);
        renderListaPresupuestos(listaPresupuestos);
    }
}

function renderListaPresupuestos(arr){
    let select = $("#id_presupuesto_lst");
    select.html('<option value="">-- Seleccione un presupuesto --</option>');
    arr.forEach(function(p){
        select.append(`<option value="${p.id_presupuesto}" data-prov="${p.id_proveedor}" data-prov-nombre="${p.proveedor}">Presupuesto #${p.id_presupuesto}</option>`);
    });
}

function cargarListaPresupuestos(){
    let datos = ejecutarAjax("controladores/presupuestos_compra.php","leerPendiente=1");
    let select = $("#id_presupuesto_lst");

    if(datos !== "0"){
        listaPresupuestos = JSON.parse(datos);
        renderListaPresupuestos(listaPresupuestos);
    } else {
        // Si no hay presupuestos pendientes
        select.html('<option value="">-- No hay presupuestos pendientes --</option>');
    }
}
function renderListaProductos(arr){
    let select = $("#id_producto_lst");
    select.html('<option value="">-- Seleccione un producto --</option>');
    arr.forEach(function(p){
        select.append(`<option value="${p.producto_id}">${p.nombre}</option>`);
    });
}

$(document).on('change','#id_presupuesto_lst',function(){
   let id = $(this).val();
   if(id === ""){
       $("#proveedor_txt").val('');
       $("#id_proveedor").val('');
       detallesOC = [];
       renderDetallesOC();
       return;
   }
   let datos = ejecutarAjax("controladores/presupuestos_compra.php","leer_id="+id);
   if(datos !== "0"){
       let p = JSON.parse(datos);
       $("#proveedor_txt").val(p.proveedor || p.id_proveedor);
       $("#id_proveedor").val(p.id_proveedor);
       let det = ejecutarAjax("controladores/detalle_presupuesto.php","leer=1&id_presupuesto="+id);
       if(det !== "0"){       
           detallesOC = JSON.parse(det).map(d => ({id_producto: parseInt(d.id_producto), producto:d.producto, cantidad:d.cantidad, precio_unitario:d.precio_unitario, subtotal:d.subtotal}));
       }else{
           detallesOC = [];
       }
       renderDetallesOC();
   }
});

$(document).on('input','#cantidad_txt, #precio_unitario_txt', function(){
    const cant = parseFloat($('#cantidad_txt').val()) || 0;
    const precio = parseFloat($('#precio_unitario_txt').val()) || 0;
    const subtotal = cant * precio;
    $('#subtotal_txt').val(formatearPY(subtotal));
});

function agregarProductoExtra(){
    if($("#id_presupuesto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un presupuesto","ERROR");return;}
    if($("#id_producto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un producto","ERROR");return;}
    if($("#cantidad_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar la cantidad","ERROR");return;}
    if($("#precio_unitario_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar el costo","ERROR");return;}

    let idProducto = parseInt($("#id_producto_lst").val());
    if(detallesOC.some(d => d.id_producto === idProducto)){
        mensaje_dialogo_info_ERROR("El producto ya está cargado","ERROR");
        return;
    }

    let detalle = {
        id_producto: idProducto,
        producto: $("#id_producto_lst option:selected").text(),
        cantidad: $("#cantidad_txt").val(),
        precio_unitario: $("#precio_unitario_txt").val(),
        subtotal: (parseFloat($("#cantidad_txt").val()) || 0) * (parseFloat($("#precio_unitario_txt").val()) || 0)
    };

    detallesOC.push(detalle);
    renderDetallesOC();
    limpiarDetalleExtraForm();
}
window.agregarProductoExtra = agregarProductoExtra;

function limpiarDetalleExtraForm(){
    $("#id_producto_lst").val("").trigger("change");
    $("#cantidad_txt").val("").focus();
    $("#precio_unitario_txt").val("");
    $("#subtotal_txt").val("");
}

function renderDetallesOC(){
    let tbody = $("#detalle_oc_tb");
    tbody.html("");
    detallesOC.forEach(function(d){
        tbody.append(`<tr>
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td>${formatearPY(d.precio_unitario)}</td>
            <td>${formatearPY(d.subtotal)}</td>
            <td><button class="btn btn-danger btn-sm eliminar-detalle" data-id="${d.id_producto}"><i class="bi bi-trash"></i></button></td>
        </tr>`);
    });
}

$(document).on('click','.eliminar-detalle',function(){
    if(detallesOC.length <= 1){
        mensaje_dialogo_info_ERROR("No se puede eliminar todos los productos", "ERROR");
        return;
    }
    let idProducto = $(this).data('id');
    let idx = detallesOC.findIndex(d => d.id_producto == idProducto);
    if(idx !== -1){
        detallesOC.splice(idx,1);
        renderDetallesOC();
    }
});

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

function imprimirOrden(id, auto = true){
  let ordenData = ejecutarAjax("controladores/orden_compra.php","leer=1");
  if(ordenData === "0"){ alert("No se encontró la orden"); return; }
  let orden = JSON.parse(ordenData).find(o => String(o.id_orden) === String(id));
  if(!orden){ alert("No se encontró la orden"); return; }

  let detalleData = ejecutarAjax("controladores/detalle_orden_compra.php","leer=1&id_orden="+id);
  let filas = "";
  if(detalleData !== "0"){
    JSON.parse(detalleData).forEach(function(d, i){
      filas += `
        <tr>
          <td>${i + 1}</td>
          <td>${d.producto || d.id_producto}</td>
          <td>${d.cantidad}</td>
          <td>${formatearPY(d.precio_unitario)}</td>
          <td>${formatearPY(d.subtotal)}</td>
        </tr>`;
    });
  } else {
    filas = `<tr><td colspan="5">Sin ítems</td></tr>`;
  }

  const estadoTxt = (orden.estado || "GENERADA");
  const estadoUC = String(estadoTxt).toUpperCase();
  const estadoBadge =
      estadoUC === "APROBADA" || estadoUC === "APROBADO" ? "bg-success" :
      estadoUC === "ANULADA"  || estadoUC === "ANULADO"  ? "bg-danger"  :
      "bg-warning text-dark";

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Orden de Compra #${orden.id_orden}</title>
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
      .kpi-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; margin-bottom:20px; }
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
        <h2 class="doc-title">Orden de Compra #${orden.id_orden}</h2>
        <div class="meta">
          Proveedor: <strong>${orden.proveedor || orden.id_proveedor}</strong>
          &nbsp;·&nbsp; Estado: <span class="badge ${estadoBadge}">${estadoTxt}</span>
          &nbsp;·&nbsp; Fecha: <strong>${formatearFechaDMA(orden.fecha_emision)}</strong>
        </div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="lbl">Total</div>
        <div class="val">${formatearPY(orden.total)}</div>
      </div>
      <div class="kpi">
        <div class="lbl">Moneda</div>
        <div class="val">PYG</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>

    <div class="total">
      Total General: ${formatearPY(orden.total)}
    </div>

    <div class="footer">
      Documento generado automáticamente.
    </div>

    <script>${auto ? "window.print();" : ""}</script>
  </body>
  </html>
  `);
  v.document.close();
  v.focus();
}
window.imprimirOrden = imprimirOrden;


function limpiarOrden(){
    $("#id_orden").val("0");
    $("#id_presupuesto_lst").val("");
    $("#proveedor_txt").val("");
    $("#id_proveedor").val("");
    $("#fecha_txt").val("");
    limpiarDetalleExtraForm();
    detallesOC = [];
    renderDetallesOC();
}

function cargarTablaOrden(){
     console.log("Entró en cargarTablaOrden()");
    let datos = ejecutarAjax("controladores/orden_compra.php","leer=1");
    if(datos !== "0"){
        renderTablaOrden(JSON.parse(datos));
    }else{
        $("#orden_datos_tb").html("");
    }
}

function renderTablaOrden(arr){
    let tbody = $("#orden_datos_tb");
    tbody.html("");
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
        detallesOC = JSON.parse(det).map(d => ({id_producto: parseInt(d.id_producto), producto:d.producto, cantidad:d.cantidad, precio_unitario:d.precio_unitario, subtotal:d.subtotal}));
        renderDetallesOC();
    }
});

$(document).on('click','.anular-orden',function(){
    if($(this).prop('disabled')) return;
    if(confirm('¿Desea anular?')){
        let id = $(this).data('id');
        ejecutarAjax("controladores/orden_compra.php","anular="+id);
        cargarTablaOrden();
    }
});

$(document).on('click','.imprimir-orden',function(){
    if($(this).prop('disabled')) return;
    let id = $(this).data('id');
    imprimirOrden(id);
});

function buscarOrden(){
    let datos = ejecutarAjax("controladores/orden_compra.php","leer_descripcion="+$("#b_orden").val());
    if(datos !== "0"){
        renderTablaOrden(JSON.parse(datos));
    }else{
        $("#orden_datos_tb").html("");
    }
}
window.buscarOrden = buscarOrden;

$(document).on('keyup','#b_orden',function(){
    buscarOrden();
});

$(function(){
  $(document).on('click', '.listar-ordenes', function(e){
      e.preventDefault();
      console.log("Click detectado");
      mostrarListarOrdenes();
  });
});
