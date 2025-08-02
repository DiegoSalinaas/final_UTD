let detallesOC = [];
let listaPresupuestos = [];

function mostrarListarOrdenes(){
    let contenido = dameContenido("paginas/referenciales/orden_compra/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaOrden();
}

function mostrarAgregarOrden(){
    let contenido = dameContenido("paginas/referenciales/orden_compra/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaPresupuestos();
    limpiarOrden();
}

function cargarListaPresupuestos(){
    let datos = ejecutarAjax("controladores/presupuestos_compra.php","leer=1");
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

function renderDetallesOC(){
    let tbody = $("#detalle_oc_tb");
    tbody.html("");
    detallesOC.forEach(function(d){
        tbody.append(`<tr>
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td>${formatearPY(d.precio_unitario)}</td>
            <td>${formatearPY(d.subtotal)}</td>
        </tr>`);
    });
}

function guardarOrden(){
    if($("#id_presupuesto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un presupuesto","ERROR");return;}
    if($("#fecha_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la fecha","ERROR");return;}
    if(detallesOC.length === 0){mensaje_dialogo_info_ERROR("No hay productos en el presupuesto seleccionado","ERROR");return;}
    let datos = {
        id_presupuesto: $("#id_presupuesto_lst").val(),
        id_proveedor: $("#id_proveedor").val(),
        fecha_emision: $("#fecha_txt").val()
    };
    if($("#id_orden").val() === "0"){
        let id = ejecutarAjax("controladores/orden_compra.php","guardar="+JSON.stringify(datos));
        detallesOC.forEach(function(d){
            let det = {
                id_orden: id,
                id_producto: d.id_producto,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario,
                subtotal: d.subtotal
            };
            ejecutarAjax("controladores/detalle_orden_compra.php","guardar="+JSON.stringify(det));
        });
        mensaje_confirmacion("REALIZADO","Guardado correctamente");
    }else{
        datos = {...datos, id_orden: $("#id_orden").val()};
        ejecutarAjax("controladores/orden_compra.php","actualizar="+JSON.stringify(datos));
        ejecutarAjax("controladores/detalle_orden_compra.php","eliminar_por_orden="+$("#id_orden").val());
        detallesOC.forEach(function(d){
            let det = {
                id_orden: $("#id_orden").val(),
                id_producto: d.id_producto,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario,
                subtotal: d.subtotal
            };
            ejecutarAjax("controladores/detalle_orden_compra.php","guardar="+JSON.stringify(det));
        });
        mensaje_confirmacion("REALIZADO","Actualizado correctamente");
    }
    mostrarListarOrdenes();
}

function limpiarOrden(){
    $("#id_orden").val("0");
    $("#id_presupuesto_lst").val("");
    $("#proveedor_txt").val("");
    $("#id_proveedor").val("");
    $("#fecha_txt").val("");
    detallesOC = [];
    renderDetallesOC();
}

function cargarTablaOrden(){
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
                <button class="btn btn-danger btn-sm eliminar-orden" data-id="${o.id_orden}" title="Eliminar"><i class="bi bi-trash"></i></button>
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
    $("#id_presupuesto_lst").val(json.id_presupuesto).trigger('change');
    $("#fecha_txt").val(json.fecha_emision);
});

$(document).on('click','.eliminar-orden',function(){
    if(confirm('¿Desea eliminar?')){
        let id = $(this).data('id');
        ejecutarAjax("controladores/orden_compra.php","eliminar="+id);
        cargarTablaOrden();
    }
});

function buscarOrden(){
    let datos = ejecutarAjax("controladores/orden_compra.php","leer_descripcion="+$("#b_orden").val());
    if(datos !== "0"){
        renderTablaOrden(JSON.parse(datos));
    }else{
        $("#orden_datos_tb").html("");
    }
}

$(document).on('keyup','#b_orden',function(){
    buscarOrden();
});

// Expose functions to the global scope so they can be used
// from inline HTML event handlers.
window.mostrarListarOrdenes = mostrarListarOrdenes;
window.mostrarAgregarOrden = mostrarAgregarOrden;
window.guardarOrden = guardarOrden;
window.buscarOrden = buscarOrden;

