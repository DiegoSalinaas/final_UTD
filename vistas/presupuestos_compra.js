function mostrarListarPresupuestos(){
    let contenido = dameContenido("paginas/referenciales/presupuestos_compra/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaPresupuesto();
}

function mostrarAgregarPresupuesto(){
    let contenido = dameContenido("paginas/referenciales/presupuestos_compra/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaProveedores();
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

function guardarPresupuesto(){
    if($("#id_proveedor_lst").val() === "" || $("#id_proveedor_lst").val() === null){
        alert("Debe seleccionar un proveedor");
        return;
    }
    if($("#fecha_txt").val().trim().length===0){
        alert("Debe ingresar la fecha");
        return;
    }
    if($("#total_txt").val().trim().length===0){
        alert("Debe ingresar el total estimado");
        return;
    }
    let datos = {
        id_proveedor: $("#id_proveedor_lst").val(),
        fecha: $("#fecha_txt").val(),
        total_estimado: $("#total_txt").val()
    };
    if($("#id_presupuesto").val() === "0"){
        ejecutarAjax("controladores/presupuestos_compra.php","guardar="+JSON.stringify(datos));
        alert("Guardado correctamente");
    }else{
        datos = {...datos, id_presupuesto: $("#id_presupuesto").val()};
        ejecutarAjax("controladores/presupuestos_compra.php","actualizar="+JSON.stringify(datos));
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
});

$(document).on("click",".eliminar-presupuesto",function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    ejecutarAjax("controladores/presupuestos_compra.php","eliminar="+id);
    alert("Eliminado");
    cargarTablaPresupuesto();
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
                        <button class="btn btn-warning editar-presupuesto">Editar</button>
                        <button class="btn btn-danger eliminar-presupuesto">Eliminar</button>
                    </td>
                </tr>`);
        });
    }
}

function limpiarPresupuesto(){
    $("#id_presupuesto").val("0");
    $("#id_proveedor_lst").val("");
    $("#fecha_txt").val("");
    $("#total_txt").val("");
}
