let detalles = [];

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
}

function cargarListaProveedores(){
    let datos = ejecutarAjax("controladores/proveedor.php","leer=1");
    if(datos !== "0"){
        let json = JSON.parse(datos);
        let select = $("#id_proveedor_lst");
        select.html('<option value="">-- Seleccione un proveedor --</option>');
        json.map(function(p){
            select.append(`<option value="${p.id_proveedor}">${p.razon_social}</option>`);
        });
    }
}

function cargarListaProductos(){
    let datos = ejecutarAjax("controladores/productos.php", "leer=1");
    if(datos !== "0"){
        let json = JSON.parse(datos);
        let select = $("#id_producto_lst");
        select.html('<option value="">-- Seleccione un producto --</option>');
        json.map(function(p){
            select.append(`<option value="${p.producto_id}">${p.nombre}</option>`);
        });
    }
}

function agregarDetalle(){
    if($("#id_producto_lst").val() === ""){ alert("Debe seleccionar un producto"); return; }
    if($("#cantidad_txt").val().trim().length===0){ alert("Debe ingresar la cantidad"); return; }
    if($("#precio_unitario_txt").val().trim().length===0){ alert("Debe ingresar el precio unitario"); return; }
    let detalle = {
        id_detalle: 0,
        id_producto: $("#id_producto_lst").val(),
        producto: $("#id_producto_lst option:selected").text(),
        cantidad: $("#cantidad_txt").val(),
        precio_unitario: $("#precio_unitario_txt").val(),
        subtotal: $("#subtotal_txt").val()
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
            <td><button class="btn btn-danger btn-sm quitar-detalle" data-idx="${idx}">Eliminar</button></td>
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
        alert("Debe seleccionar un proveedor");
        return;
    }
    if($("#fecha_txt").val().trim().length===0){
        alert("Debe ingresar la fecha");
        return;
    }
    if(detalles.length === 0){
        alert("Debe agregar al menos un producto");
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
        alert("Guardado correctamente");
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
        alert("Actualizado correctamente");
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
            $("#datos_tb").append(`
                <tr>
                    <td>${it.id_presupuesto}</td>
                    <td>${it.proveedor}</td>
                    <td>${it.fecha}</td>
                    <td>${it.total_estimado}</td>
                    <td>
                        <button class="btn btn-info ver-detalle">Imprimir</button>
                        <button class="btn btn-warning editar-presupuesto">Editar</button>
                        <button class="btn btn-danger eliminar-presupuesto">Eliminar</button>
                    </td>
                </tr>`);
        });
    }
}

$(document).on("click",".editar-presupuesto",function(){
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
        detalles = JSON.parse(det);
        renderDetalles();
    }
});

$(document).on("click",".ver-detalle",function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    imprimirPresupuesto(id);
});

$(document).on("click",".eliminar-presupuesto",function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    ejecutarAjax("controladores/presupuestos_compra.php","eliminar="+id);
    alert("Eliminado");
    cargarTablaPresupuesto();
});

$(document).on("click",".quitar-detalle",function(){
    let idx = $(this).data("idx");
    detalles.splice(idx,1);
    renderDetalles();
});

$(document).on("keyup","#b_presupuesto",function(){
    buscarPresupuesto();
});

function buscarPresupuesto(){
    let datos = ejecutarAjax("controladores/presupuestos_compra.php","leer_descripcion="+$("#b_presupuesto").val());
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json = JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.id_presupuesto}</td>
                    <td>${it.proveedor}</td>
                    <td>${it.fecha}</td>
                    <td>${it.total_estimado}</td>
                    <td>
                        <button class="btn btn-info ver-detalle">Detalles</button>
                        <button class="btn btn-warning editar-presupuesto">Editar</button>
                        <button class="btn btn-danger eliminar-presupuesto">Eliminar</button>
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
        JSON.parse(detalleData).forEach(function(d){
            filas += `<tr><td>${d.producto || d.id_producto}</td><td>${d.cantidad}</td><td>${d.precio_unitario}</td><td>${d.subtotal}</td></tr>`;
        });
    }
    let win = window.open('', '', 'width=900,height=700');
    win.document.write(`
        <html>
        <head>
            <title>Presupuesto #${presupuesto.id_presupuesto}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>body{padding:30px;font-size:14px;} table{width:100%;border-collapse:collapse;} th,td{padding:8px;border:1px solid #ccc;text-align:left;} th{background:#f8f9fa;}</style>
        </head>
        <body>
            <h3 class="mb-4">Presupuesto #${presupuesto.id_presupuesto}</h3>
            <p><strong>Proveedor:</strong> ${presupuesto.proveedor || presupuesto.id_proveedor}</p>
            <p><strong>Fecha:</strong> ${formatearFechaDMA(presupuesto.fecha)}</p>
            <p><strong>Total Estimado:</strong> ${presupuesto.total_estimado}</p>
            <table class="table table-bordered">
                <thead>
                    <tr><th>Producto</th><th>Cantidad</th><th>Precio Unitario</th><th>Subtotal</th></tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        </body>
        </html>
    `);
    win.document.close();
    win.focus();
    win.print();
}

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
