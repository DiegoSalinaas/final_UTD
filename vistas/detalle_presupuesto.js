const PRESUPUESTO_KEY = 'presupuestoDetalle';

function mostrarListarDetallePresupuesto(id = null){
    if(id !== null){
        sessionStorage.setItem(PRESUPUESTO_KEY, id);
    }
    let contenido = dameContenido("paginas/referenciales/detalle_presupuesto/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaDetallePresupuesto();
}

function mostrarAgregarDetallePresupuesto(){
    let contenido = dameContenido("paginas/referenciales/detalle_presupuesto/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaPresupuestos();
    cargarListaProductos();
    limpiarDetallePresupuesto();
}

function cargarListaPresupuestos(){
    let datos = ejecutarAjax("controladores/presupuestos_compra.php", "leer=1");
    if(datos !== "0"){
        let json = JSON.parse(datos);
        let select = $("#id_presupuesto_lst");
        select.html('<option value="">-- Seleccione un presupuesto --</option>');
        json.map(function(p){
            select.append(`<option value="${p.id_presupuesto}">${p.id_presupuesto} - ${p.proveedor}</option>`);
        });
        const actual = sessionStorage.getItem(PRESUPUESTO_KEY);
        if(actual){
            select.val(actual);
        }
    }
}

function cargarListaProductos(){
    let datos = ejecutarAjax("controladores/productos.php", "leer=1");
    if(datos !== "0"){
        let json = JSON.parse(datos);
        let select = $("#id_producto_lst");
        select.html('<option value="">-- Seleccione un producto --</option>');
        json.map(function(pr){
            select.append(`<option value="${pr.producto_id}">${pr.nombre}</option>`);
        });
    }
}

function guardarDetallePresupuesto(){
    if($("#id_presupuesto_lst").val() === ""){ alert("Debe seleccionar un presupuesto"); return; }
    if($("#id_producto_lst").val() === ""){ alert("Debe seleccionar un producto"); return; }
    if($("#cantidad_txt").val().trim().length===0){ alert("Debe ingresar la cantidad"); return; }
    if($("#precio_unitario_txt").val().trim().length===0){ alert("Debe ingresar el precio unitario"); return; }

    let datos = {
        id_presupuesto: $("#id_presupuesto_lst").val(),
        id_producto: $("#id_producto_lst").val(),
        cantidad: $("#cantidad_txt").val(),
        precio_unitario: $("#precio_unitario_txt").val(),
        subtotal: $("#subtotal_txt").val()
    };

    if($("#id_detalle").val() === "0"){
        ejecutarAjax("controladores/detalle_presupuesto.php", "guardar="+JSON.stringify(datos));
        alert("Guardado correctamente");
    }else{
        datos = {...datos, id_detalle: $("#id_detalle").val()};
        ejecutarAjax("controladores/detalle_presupuesto.php", "actualizar="+JSON.stringify(datos));
        alert("Actualizado correctamente");
    }
    mostrarListarDetallePresupuesto();
    limpiarDetallePresupuesto();
}

function cargarTablaDetallePresupuesto(){
    let params = "leer=1";
    const id = sessionStorage.getItem(PRESUPUESTO_KEY);
    if(id){
        params += "&id_presupuesto=" + id;
    }
    let datos = ejecutarAjax("controladores/detalle_presupuesto.php", params);
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json = JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.id_detalle}</td>
                    <td>${it.id_presupuesto}</td>
                    <td>${it.producto || it.id_producto}</td>
                    <td>${it.cantidad}</td>
                    <td>${it.precio_unitario}</td>
                    <td>${it.subtotal}</td>
                    <td>
                        <button class="btn btn-warning editar-detalle">Editar</button>
                        <button class="btn btn-danger eliminar-detalle">Eliminar</button>
                    </td>
                </tr>`);
        });
    }
}

$(document).on("click", ".editar-detalle", function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarDetallePresupuesto();
    let datos = ejecutarAjax("controladores/detalle_presupuesto.php", "leer_id="+id);
    let json = JSON.parse(datos);
    $("#id_detalle").val(json.id_detalle);
    $("#id_presupuesto_lst").val(json.id_presupuesto);
    $("#id_producto_lst").val(json.id_producto);
    $("#cantidad_txt").val(json.cantidad);
    $("#precio_unitario_txt").val(json.precio_unitario);
    $("#subtotal_txt").val(json.subtotal);
});

$(document).on("click", ".eliminar-detalle", function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    ejecutarAjax("controladores/detalle_presupuesto.php", "eliminar="+id);
    alert("Eliminado");
    cargarTablaDetallePresupuesto();
});

$(document).on("keyup", "#b_detalle_presupuesto", function(){
    buscarDetallePresupuesto();
});

function buscarDetallePresupuesto(){
    let params = "leer_descripcion="+$("#b_detalle_presupuesto").val();
    const id = sessionStorage.getItem(PRESUPUESTO_KEY);
    if(id){
        params += "&id_presupuesto=" + id;
    }
    let datos = ejecutarAjax("controladores/detalle_presupuesto.php", params);
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json = JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.id_detalle}</td>
                    <td>${it.id_presupuesto}</td>
                    <td>${it.producto || it.id_producto}</td>
                    <td>${it.cantidad}</td>
                    <td>${it.precio_unitario}</td>
                    <td>${it.subtotal}</td>
                    <td>
                        <button class="btn btn-warning editar-detalle">Editar</button>
                        <button class="btn btn-danger eliminar-detalle">Eliminar</button>
                    </td>
                </tr>`);
        });
    }
}

function limpiarDetallePresupuesto(){
    $("#id_detalle").val("0");
    const id = sessionStorage.getItem(PRESUPUESTO_KEY) || "";
    $("#id_presupuesto_lst").val(id);
    $("#id_producto_lst").val("");
    $("#cantidad_txt").val("");
    $("#precio_unitario_txt").val("");
    $("#subtotal_txt").val("");
}
