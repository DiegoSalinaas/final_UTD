(function(){
    let detallesNota = [];
    let listaClientes = [];
    let listaProductos = [];
    window.detallesNota = detallesNota;
})();

function mostrarListarNotaCredito(){
    let contenido = dameContenido("paginas/referenciales/nota_credito/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaNotaCredito();
}
window.mostrarListarNotaCredito = mostrarListarNotaCredito;

function mostrarAgregarNotaCredito(){
    let contenido = dameContenido("paginas/referenciales/nota_credito/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaClientes();
    cargarListaProductos();
    detallesNota = [];
    renderDetallesNota();
}
window.mostrarAgregarNotaCredito = mostrarAgregarNotaCredito;

function cargarListaClientes(){
    let datos = ejecutarAjax("controladores/cliente.php","leer=1");
    if(datos !== "0"){
        listaClientes = JSON.parse(datos);
        let select = $("#id_cliente_lst");
        select.html('<option value="">-- Seleccione un cliente --</option>');
        listaClientes.forEach(c => select.append(`<option value="${c.id_cliente}" data-ruc="${c.ruc}">${c.nombre_apellido}</option>`));
    }
}

$(document).on('change','#id_cliente_lst',function(){
    let ruc = $("#id_cliente_lst option:selected").data('ruc') || '';
    $('#ruc_cliente_txt').val(ruc);
});

function cargarListaProductos(){
    let datos = ejecutarAjax("controladores/productos.php","leerActivo=1");
    if(datos !== "0"){
        listaProductos = JSON.parse(datos);
        let select = $("#id_producto_lst");
        select.html('<option value="">-- Seleccione un producto --</option>');
        listaProductos.forEach(p => select.append(`<option value="${p.producto_id}" data-precio="${p.precio}" data-descripcion="${p.nombre}">${p.nombre}</option>`));
    }
}

$(document).on('change','#id_producto_lst',function(){
    let desc = $("#id_producto_lst option:selected").data('descripcion') || '';
    $('#descripcion_txt').val(desc);
});

$(document).on('input','#cantidad_txt, #precio_unitario_txt', function(){
    const cant = parseFloat($('#cantidad_txt').val()) || 0;
    const precio = parseFloat($('#precio_unitario_txt').val()) || 0;
    const subtotal = cant * precio;
    $('#subtotal_txt').val(formatearPY(subtotal));
});

function agregarDetalleNotaCredito(){
    if($("#id_producto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un producto","ERROR");return;}
    if($("#cantidad_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar la cantidad","ERROR");return;}
    if(parseFloat($("#cantidad_txt").val()) <= 0){mensaje_dialogo_info_ERROR("La cantidad debe ser mayor que 0","ERROR");return;}
    if($("#precio_unitario_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar el precio","ERROR");return;}
    if(parseFloat($("#precio_unitario_txt").val()) <= 0){mensaje_dialogo_info_ERROR("El precio debe ser mayor que 0","ERROR");return;}

    let detalle = {
        id_producto: $("#id_producto_lst").val(),
        producto: $("#id_producto_lst option:selected").text(),
        descripcion: $("#descripcion_txt").val(),
        cantidad: $("#cantidad_txt").val(),
        precio_unitario: $("#precio_unitario_txt").val(),
        subtotal: (parseFloat($("#cantidad_txt").val()) || 0) * (parseFloat($("#precio_unitario_txt").val()) || 0),
        total_linea: (parseFloat($("#cantidad_txt").val()) || 0) * (parseFloat($("#precio_unitario_txt").val()) || 0),
        motivo: $("#motivo_item_txt").val(),
        observacion: $("#observacion_txt").val()
    };
    detallesNota.push(detalle);
    renderDetallesNota();
    limpiarDetalleNotaForm();
}
window.agregarDetalleNotaCredito = agregarDetalleNotaCredito;

function limpiarDetalleNotaForm(){
    $("#id_producto_lst").val("");
    $("#descripcion_txt").val("");
    $("#cantidad_txt").val("");
    $("#precio_unitario_txt").val("");
    $("#subtotal_txt").val("");
    $("#motivo_item_txt").val("");
    $("#observacion_txt").val("");
}

function renderDetallesNota(){
    let tbody = $("#detalle_nota_tb");
    tbody.html("");
    let total = 0;
    detallesNota.forEach((d,i) => {
        total += parseFloat(d.total_linea);
        tbody.append(`<tr>
            <td>${d.producto}</td>
            <td>${d.descripcion}</td>
            <td>${d.cantidad}</td>
            <td>${formatearPY(d.precio_unitario)}</td>
            <td>${formatearPY(d.total_linea)}</td>
            <td>${d.motivo}</td>
            <td>${d.observacion}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDetalleNota(${i}); return false;"><i class="bi bi-trash"></i></button></td>
        </tr>`);
    });
    $("#total_general_txt").val(formatearPY(total));
}

function eliminarDetalleNota(index){
    detallesNota.splice(index,1);
    renderDetallesNota();
}
window.eliminarDetalleNota = eliminarDetalleNota;

function guardarNotaCredito(){
    if($("#id_cliente_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un cliente","ERROR");return;}
    if($("#fecha_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar la fecha","ERROR");return;}
    if(detallesNota.length === 0){mensaje_dialogo_info_ERROR("Debe agregar al menos un item","ERROR");return;}

    let total = detallesNota.reduce((acc,d)=>acc+parseFloat(d.total_linea),0);

    let datos = {
        fecha_emision: $("#fecha_txt").val(),
        motivo_general: $("#motivo_general_txt").val(),
        referencia_tipo: $("#referencia_tipo_txt").val(),
        referencia_id: $("#referencia_id_txt").val(),
        id_cliente: $("#id_cliente_lst").val(),
        ruc_cliente: $("#ruc_cliente_txt").val(),
        estado: $("#estado_txt").val(),
        total: total
    };

    let idNota = $("#id_nota_credito").val();
    if(idNota === "0"){
        idNota = ejecutarAjax("controladores/nota_credito.php","guardar="+JSON.stringify(datos));
        detallesNota.forEach(function(d){
            let det = { ...d, id_nota_credito: idNota };
            ejecutarAjax("controladores/detalle_nota_credito.php","guardar="+JSON.stringify(det));
        });
    }else{
        datos = { ...datos, id_nota_credito: idNota };
        ejecutarAjax("controladores/nota_credito.php","actualizar="+JSON.stringify(datos));
        ejecutarAjax("controladores/detalle_nota_credito.php","eliminar_por_nota="+idNota);
        detallesNota.forEach(function(d){
            let det = { ...d, id_nota_credito: idNota };
            ejecutarAjax("controladores/detalle_nota_credito.php","guardar="+JSON.stringify(det));
        });
    }
    mensaje_confirmacion("Guardado correctamente");
    mostrarListarNotaCredito();
}
window.guardarNotaCredito = guardarNotaCredito;

function cargarTablaNotaCredito(){
    let datos = ejecutarAjax("controladores/nota_credito.php","leer=1");
    if(datos === "0"){
        $("#nota_credito_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#nota_credito_datos_tb").html("");
        json.map(function(it){
            $("#nota_credito_datos_tb").append(`
                <tr>
                    <td>${it.id_nota_credito}</td>
                    <td>${it.numero_nota}</td>
                    <td>${it.fecha_emision}</td>
                    <td>${it.cliente}</td>
                    <td>${formatearPY(it.total)}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning btn-sm editar-nota" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-nota" title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}
window.cargarTablaNotaCredito = cargarTablaNotaCredito;

function buscarNotaCredito(){
    let b = $("#b_nota_credito").val();
    let datos = ejecutarAjax("controladores/nota_credito.php","leer_descripcion="+b);
    if(datos === "0"){
        $("#nota_credito_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#nota_credito_datos_tb").html("");
        json.map(function(it){
            $("#nota_credito_datos_tb").append(`
                <tr>
                    <td>${it.id_nota_credito}</td>
                    <td>${it.numero_nota}</td>
                    <td>${it.fecha_emision}</td>
                    <td>${it.cliente}</td>
                    <td>${formatearPY(it.total)}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning btn-sm editar-nota" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-nota" title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}
window.buscarNotaCredito = buscarNotaCredito;

$(document).on("click",".editar-nota",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarNotaCredito();
    setTimeout(function(){
        let datos=ejecutarAjax("controladores/nota_credito.php","leer_id="+id);
        let json=JSON.parse(datos);
        $("#id_nota_credito").val(json.id_nota_credito);
        $("#id_cliente_lst").val(json.id_cliente).trigger('change');
        $("#fecha_txt").val(json.fecha_emision);
        $("#motivo_general_txt").val(json.motivo_general);
        $("#referencia_tipo_txt").val(json.referencia_tipo);
        $("#referencia_id_txt").val(json.referencia_id);
        $("#numero_nota_txt").val(json.numero_nota);
        $("#ruc_cliente_txt").val(json.ruc_cliente);
        $("#estado_txt").val(json.estado);
        let det=ejecutarAjax("controladores/detalle_nota_credito.php","leer=1&id_nota_credito="+id);
        if(det !== "0"){
            detallesNota=JSON.parse(det).map(d=>({id_producto:d.id_producto,producto:d.producto,descripcion:d.descripcion,cantidad:d.cantidad,precio_unitario:d.precio_unitario,subtotal:d.subtotal,total_linea:d.total_linea,motivo:d.motivo,observacion:d.observacion}));
        }else{
            detallesNota=[];
        }
        renderDetallesNota();
    },100);
});

$(document).on("click",".anular-nota",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
        title:"¿Anular nota de crédito?",
        text:"Esta acción marcará la nota como anulada.",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText:"Sí, anular",
        cancelButtonText:"Cancelar",
        confirmButtonColor:"#dc3545",
        cancelButtonColor:"#6c757d",
        reverseButtons:true
    }).then((result)=>{
        if(result.isConfirmed){
            ejecutarAjax("controladores/nota_credito.php","anular="+id);
            mensaje_confirmacion("Anulado correctamente");
            cargarTablaNotaCredito();
        }
    });
});
