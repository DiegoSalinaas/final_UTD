let detalles = [];
let listaProveedores = [];
let listaProductos = [];



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

function agregarDetalle(){
    if($("#id_producto_lst").val() === ""){
        mensaje_dialogo_info_ERROR("Debe seleccionar un producto", "ERROR");
        return;
    }
    if($("#cantidad_txt").val().trim().length === 0){
        mensaje_dialogo_info_ERROR("Debe ingresar la cantidad", "ERROR");
        return;
    }
    if(parseFloat($("#cantidad_txt").val()) <= 0){
        mensaje_dialogo_info_ERROR("La cantidad debe ser mayor a cero", "ERROR");
        return;
    }
    if($("#precio_unitario_txt").val().trim().length === 0){
        mensaje_dialogo_info_ERROR("Debe ingresar el costo", "ERROR");
        return;
    }
    if(parseFloat($("#precio_unitario_txt").val()) <= 0){
        mensaje_dialogo_info_ERROR("El costo debe ser mayor a cero", "ERROR");
        return;
    }

    let idProducto = parseInt($("#id_producto_lst").val());
    if(detalles.some(d => d.id_producto === idProducto)){
        mensaje_dialogo_info_ERROR("El producto ya está cargado", "ERROR");
        return;
    }

    let detalle = {
        id_detalle: 0,
        id_producto: idProducto,
        producto: $("#id_producto_lst option:selected").text(),
        cantidad: $("#cantidad_txt").val(),
        precio_unitario: $("#precio_unitario_txt").val(),
        subtotal: (parseFloat($("#cantidad_txt").val()) || 0) * (parseFloat($("#precio_unitario_txt").val()) || 0)
    };

    detalles.push(detalle);
    renderDetalles();
    limpiarDetalleForm();
}


function renderDetalles(){
    let tbody = $("#detalle_tb");
    tbody.html("");
    detalles.forEach(function(d,idx){
        tbody.append(`<tr>
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td>${d.precio_unitario}</td>
            <td>${d.subtotal}</td>
            <td><button class="btn btn-danger btn-sm quitar-detalle" data-idx="${idx}" title="Eliminar">
                <i class="bi bi-trash"></i>
            </button></td>
        </tr>`);
    });
    calcularTotal();
}

function limpiarDetalleForm(){
    $("#id_producto_lst").val("");
    $("#cantidad_txt").val("");
    $("#precio_unitario_txt").val("");
    $("#subtotal_txt").val("");
}

function calcularTotal(){
    let total = detalles.reduce(function(t,d){ return t + parseFloat(d.subtotal); },0);
    $("#total_txt").val(total.toFixed(2));
}

function guardarPresupuesto(){
    if($("#id_proveedor_lst").val() === "" || $("#id_proveedor_lst").val() === null){
        mensaje_dialogo_info_ERROR("Debe seleccionar un proveedor", "ERROR");
        return;
    }
    if($("#fecha_txt").val().trim().length===0){
       mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ERROR");
        return;
    }
    if(detalles.length === 0){
        mensaje_dialogo_info_ERROR("Debe agregar al menos un producto", "ERROR");
        return;
    }
    if(detalles.some(d => parseFloat(d.cantidad) <= 0 || parseFloat(d.precio_unitario) <= 0)){
        mensaje_dialogo_info_ERROR("Los productos deben tener cantidad y costo mayores a cero", "ERROR");
        return;
    }
    let datos = {
        id_proveedor: $("#id_proveedor_lst").val(),
        fecha: $("#fecha_txt").val(),
        total_estimado: $("#total_txt").val()
    };
    if($("#id_presupuesto").val() === "0"){
        let id = ejecutarAjax("controladores/presupuestos_compra.php","guardar="+JSON.stringify(datos));
        detalles.forEach(function(d){
            let det = {
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
                let det = {
                    id_detalle: d.id_detalle,
                    id_presupuesto: $("#id_presupuesto").val(),
                    id_producto: d.id_producto,
                    cantidad: d.cantidad,
                    precio_unitario: d.precio_unitario,
                    subtotal: d.subtotal
                };
                ejecutarAjax("controladores/detalle_presupuesto.php","actualizar="+JSON.stringify(det));
            }else{
                let det = {
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
                    <td>${it.proveedor}</td>
                    <td>${it.fecha}</td>
                    <td>${formatearPY(it.total_estimado)}</td>
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
    $("#total_txt").val(json.total_estimado);

    // Cargar datos del detalle asociado
    let det = ejecutarAjax("controladores/detalle_presupuesto.php","leer=1&id_presupuesto="+id);
    if(det !== "0"){
        detalles = JSON.parse(det).map(d => ({...d, id_producto: parseInt(d.id_producto)}));
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
    let datos = ejecutarAjax(
        "controladores/presupuestos_compra.php",
        "leer_descripcion="+$("#b_presupuesto").val()+"&estado="+$("#estado_filtro").val()
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
                    <td>${it.proveedor}</td>
                    <td>${it.fecha}</td>
                    <td>${formatearPY(it.total_estimado)}</td>
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
    let presupuestoData = ejecutarAjax("controladores/presupuestos_compra.php","leer_id="+id);
    if(presupuestoData === "0"){ alert("No se encontró el presupuesto"); return; }
    let presupuesto = JSON.parse(presupuestoData);

    let detalleData = ejecutarAjax("controladores/detalle_presupuesto.php","leer=1&id_presupuesto="+id);
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
    }

    const estadoBadge = (String(presupuesto.estado||"").toUpperCase()==="APROBADO") ? "bg-success" :
                        (String(presupuesto.estado||"").toUpperCase()==="ANULADO") ? "bg-danger" : "bg-warning text-dark";

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
          <div class="val">${formatearPY(presupuesto.total_estimado)}</div>
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
            <th>Costo Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${filas || `<tr><td colspan="5">Sin productos</td></tr>`}
        </tbody>
      </table>

      <div class="total">
        Total Estimado: ${formatearPY(presupuesto.total_estimado)}
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
    $("#total_txt").val("");
    $("#id_producto_lst").val("");
    $("#cantidad_txt").val("");
    $("#precio_unitario_txt").val("");
    $("#subtotal_txt").val("");
    detalles = [];
    renderDetalles();
}
