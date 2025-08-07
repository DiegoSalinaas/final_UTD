
(function(){
 let detallesRemision = [];
let listaClientes = [];
let listaProductos = [];


})();
function mostrarListarRemision(){
    let contenido = dameContenido("paginas/referenciales/remision/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaRemision();
}
window.mostrarListarRemision = mostrarListarRemision;

function mostrarAgregarRemision(){
    let contenido = dameContenido("paginas/referenciales/remision/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaClientes();
    cargarListaProductos();
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
    arr.forEach(p => select.append(`<option value="${p.producto_id}" data-precio="${p.precio}">${p.nombre}</option>`));
}

$(document).on('input','#cantidad_txt, #precio_unitario_txt', function(){
    const cant = parseFloat($('#cantidad_txt').val()) || 0;
    const precio = parseFloat($('#precio_unitario_txt').val()) || 0;
    const subtotal = cant * precio;
    $('#subtotal_txt').val(formatearPY(subtotal));
});

function agregarDetalleRemision(){
    if($("#id_producto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un producto","ERROR");return;}
    if($("#cantidad_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar la cantidad","ERROR");return;}
    if($("#precio_unitario_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar el precio","ERROR");return;}
    if(parseFloat($("#precio_unitario_txt").val()) <= 0){mensaje_dialogo_info_ERROR("El precio debe ser mayor que 0","ERROR");return;}

    let detalle = {
        id_producto: $("#id_producto_lst").val(),
        producto: $("#id_producto_lst option:selected").text(),
        cantidad: $("#cantidad_txt").val(),
        precio_unitario: $("#precio_unitario_txt").val(),
        subtotal: (parseFloat($("#cantidad_txt").val()) || 0) * (parseFloat($("#precio_unitario_txt").val()) || 0)
    };
console.log("✔ Detalles a guardar:", JSON.stringify(detallesRemision, null, 2));


    detallesRemision.push(detalle);
    renderDetallesRemision();
    limpiarDetalleRemisionForm();
}
window.agregarDetalleRemision = agregarDetalleRemision;

function limpiarDetalleRemisionForm(){
    $("#id_producto_lst").val("");
    $("#cantidad_txt").val("");
    $("#precio_unitario_txt").val("");
    $("#subtotal_txt").val("");
}

function renderDetallesRemision(){
    let tbody = $("#detalle_remision_tb");
    tbody.html("");
    let total = 0;
    detallesRemision.forEach((d,i) => {
        total += parseFloat(d.subtotal);
        tbody.append(`<tr>
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td>${formatearPY(d.precio_unitario)}</td>
            <td>${formatearPY(d.subtotal)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDetalleRemision(${i}); return false;"><i class="bi bi-trash"></i></button></td>
        </tr>`);
    });
    $("#total_general_txt").text(formatearPY(total));
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

    if ($("#fecha_txt").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ERROR");
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
        estado: $("#estado_txt").val()
    };

    
    let idRemision = $("#id_remision").val();

    if (idRemision === "0") {
        idRemision = ejecutarAjax("controladores/remision.php", "guardar=" + JSON.stringify(datos));
        console.log("🟢 ID de remisión generado:", idRemision); 

        if (!idRemision || isNaN(idRemision)) {
            mensaje_dialogo_info_ERROR("Error al guardar la remisión. ID inválido.", "ERROR");
            return;
        }

        detallesRemision.forEach(function (d) {
            let det = { ...d, id_remision: idRemision };
            ejecutarAjax("controladores/detalle_remision.php", "guardar=" + JSON.stringify(det));
        });
    } else {
        datos = { ...datos, id_remision: idRemision };
        ejecutarAjax("controladores/remision.php", "actualizar=" + JSON.stringify(datos));
        ejecutarAjax("controladores/detalle_remision.php", "eliminar_por_remision=" + idRemision);
        detallesRemision.forEach(function (d) {
            let det = { ...d, id_remision: idRemision };
            ejecutarAjax("controladores/detalle_remision.php", "guardar=" + JSON.stringify(det));
        });
    }

    mensaje_confirmacion("Guardado correctamente");
    mostrarListarRemision();
}


window.guardarRemision = guardarRemision;

function cargarTablaRemision(){
    let datos = ejecutarAjax("controladores/remision.php","leer=1");
    if(datos === "0"){
        $("#remision_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#remision_datos_tb").html("");
        json.map(function(it){
            $("#remision_datos_tb").append(`
                <tr>
                    <td>${it.id_remision}</td>
                    <td>${it.fecha_remision}</td>
                    <td>${it.cliente}</td>
                    <td>${formatearPY(it.total)}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning btn-sm editar-remision" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-remision" title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}

function buscarRemision(){
    let b = $("#b_remision").val();
    let datos = ejecutarAjax("controladores/remision.php","leer_descripcion="+b);
    if(datos === "0"){
        $("#remision_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#remision_datos_tb").html("");
        json.map(function(it){
            $("#remision_datos_tb").append(`
                <tr>
                    <td>${it.id_remision}</td>
                    <td>${it.fecha_remision}</td>
                    <td>${it.cliente}</td>
                    <td>${formatearPY(it.total)}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning btn-sm editar-remision" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-remision" title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}
window.buscarRemision = buscarRemision;

$(document).on("click",".editar-remision",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarRemision();
    setTimeout(function(){
        let datos=ejecutarAjax("controladores/remision.php","leer_id="+id);
        let json=JSON.parse(datos);
        $("#id_remision").val(json.id_remision);
        $("#id_cliente_lst").val(json.id_cliente);
        $("#fecha_txt").val(json.fecha_remision);
        $("#observacion_txt").val(json.observacion);
        $("#estado_txt").val(json.estado);
        
        let det=ejecutarAjax("controladores/detalle_remision.php","leer=1&id_remision="+id);
        if(det !== "0"){
            detallesRemision=JSON.parse(det).map(d=>({id_producto:d.id_producto,producto:d.producto,cantidad:d.cantidad,precio_unitario:d.precio_unitario,subtotal:d.subtotal}));
        }else{
            detallesRemision=[];
        }
        renderDetallesRemision();
    },100);
});

$(document).on("click",".anular-remision",function(){
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
