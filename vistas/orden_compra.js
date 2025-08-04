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
           detallesOC = JSON.parse(det).map(d => ({id_producto:d.id_producto,producto:d.producto,cantidad:d.cantidad,precio_unitario:d.precio_unitario,subtotal:d.subtotal}));
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

    let detalle = {
        id_producto: $("#id_producto_lst").val(),
        producto: $("#id_producto_lst option:selected").text(),
        cantidad: $("#cantidad_txt").val(),
        precio_unitario: $("#precio_unitario_txt").val(),
        subtotal: (parseFloat($("#cantidad_txt").val()) || 0) * (parseFloat($("#precio_unitario_txt").val()) || 0)
    };

    detallesOC.push(detalle);
    renderDetallesOC();

    let idPresupuesto = $("#id_presupuesto_lst").val();
    let detPres = {
        id_presupuesto: idPresupuesto,
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.subtotal
    };
    ejecutarAjax("controladores/detalle_presupuesto.php","guardar="+JSON.stringify(detPres));

    let presObj = listaPresupuestos.find(p => p.id_presupuesto == idPresupuesto);
    if(presObj){
        let nuevoTotal = (parseFloat(presObj.total_estimado) || 0) + parseFloat(detalle.subtotal);
        let upd = {id_presupuesto:idPresupuesto, fecha: presObj.fecha, id_proveedor: presObj.id_proveedor, total_estimado:nuevoTotal};
        ejecutarAjax("controladores/presupuestos_compra.php","actualizar="+JSON.stringify(upd));
        presObj.total_estimado = nuevoTotal;
    }

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
    let idProducto = $(this).data('id');
    let idx = detallesOC.findIndex(d => d.id_producto == idProducto);
    if(idx !== -1){
        let detalle = detallesOC[idx];
        detallesOC.splice(idx,1);
        renderDetallesOC();
        let idPresupuesto = $("#id_presupuesto_lst").val();
        if(idPresupuesto){
            let datos = {id_presupuesto:idPresupuesto, id_producto:idProducto};
            ejecutarAjax("controladores/detalle_presupuesto.php","eliminar_producto="+JSON.stringify(datos));
            let presData = ejecutarAjax("controladores/presupuestos_compra.php","leer_id="+idPresupuesto);
            if(presData !== "0"){
                let pres = JSON.parse(presData);
                let nuevoTotal = (parseFloat(pres.total_estimado) || 0) - parseFloat(detalle.subtotal);
                let upd = {id_presupuesto:idPresupuesto, fecha: pres.fecha, id_proveedor: pres.id_proveedor, total_estimado:nuevoTotal};
                ejecutarAjax("controladores/presupuestos_compra.php","actualizar="+JSON.stringify(upd));
                let presObj = listaPresupuestos.find(p => p.id_presupuesto == idPresupuesto);
                if(presObj){ presObj.total_estimado = nuevoTotal; }
            }
        }
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
    let orden = JSON.parse(ordenData).find(o => o.id_orden == id);
    if(!orden){ alert("No se encontró la orden"); return; }
    let detalleData = ejecutarAjax("controladores/detalle_orden_compra.php","leer=1&id_orden="+id);
    let filas = "";
    if(detalleData !== "0"){
        JSON.parse(detalleData).forEach(function(d){
            filas += `<tr>
                <td>${d.producto || d.id_producto}</td>
                <td>${d.cantidad}</td>
                <td>${formatearPY(d.precio_unitario)}</td>
                <td>${formatearPY(d.subtotal)}</td>
            </tr>`;
        });
    }
    let win = window.open('', '', 'width=900,height=700');
 win.document.write(`
  <html>
  <head>
    <title>Orden de Compra #${orden.id_orden}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      body {
        padding: 40px;
        font-size: 13pt;
        font-family: 'Segoe UI', sans-serif;
        color: #000;
      }
      .titulo {
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
        margin-bottom: 20px;
        text-align: center;
      }
      .info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .info div {
        width: 48%;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: center;
      }
      th {
        background-color: #f0f0f0;
      }
      .total {
        margin-top: 20px;
        text-align: right;
        font-size: 16pt;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 10pt;
        color: #555;
      }
      @media print {
        .no-print { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="titulo">
      <h2>Orden de Compra N° ${orden.id_orden}</h2>
      <p><small>Documento generado automáticamente</small></p>
    </div>

    <div class="info">
      <div>
        <strong>Proveedor:</strong> ${orden.proveedor || orden.id_proveedor}<br>
        <strong>Fecha de Emisión:</strong> ${formatearFechaDMA(orden.fecha_emision)}
      </div>
      <div>
        <strong>Estado:</strong> ${orden.estado || "GENERADA"}<br>
        <strong>Total:</strong> ${formatearPY(orden.total)}
      </div>
    </div>

    <table class="table">
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
        ${JSON.parse(detalleData).map((d, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${d.producto || d.id_producto}</td>
            <td>${d.cantidad}</td>
            <td>${formatearPY(d.precio_unitario)}</td>
            <td>${formatearPY(d.subtotal)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total">
      Total General: ${formatearPY(orden.total)}
    </div>

    
  </body>
  </html>
`);

    win.document.close();
    win.focus();
    if(auto){ win.print(); }
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
        tbody.append(`<tr>
            <td>${o.id_orden}</td>
            <td>${formatearFechaDMA(o.fecha_emision)}</td>
            <td>${o.proveedor || o.id_proveedor}</td>
            <td>${formatearPY(o.total)}</td>
            <td>${badgeEstado(o.estado)}</td>
            <td>
                <button class="btn btn-warning btn-sm editar-orden" data-id="${o.id_orden}" title="Editar"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm anular-orden" data-id="${o.id_orden}" title="Anular"><i class="bi bi-x-circle"></i></button>
                <button class="btn btn-secondary btn-sm imprimir-orden" data-id="${o.id_orden}" title="Imprimir"><i class="bi bi-printer"></i></button>
            </td>
        </tr>`);
    });
}

$(document).on('click','.editar-orden',function(){
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
        detallesOC = JSON.parse(det).map(d => ({id_producto:d.id_producto,producto:d.producto,cantidad:d.cantidad,precio_unitario:d.precio_unitario,subtotal:d.subtotal}));
        renderDetallesOC();
    }
});

$(document).on('click','.anular-orden',function(){
    if(confirm('¿Desea anular?')){
        let id = $(this).data('id');
        ejecutarAjax("controladores/orden_compra.php","anular="+id);
        cargarTablaOrden();
    }
});

$(document).on('click','.imprimir-orden',function(){
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
