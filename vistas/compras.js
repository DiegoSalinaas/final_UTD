function mostrarListarCompras(){
    let contenido =  dameContenido("paginas/referenciales/compras/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaCompra();
}
//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------
function mostrarAgregarCompra(){
    let contenido =  dameContenido("paginas/referenciales/compras/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarUsuariosEnSelect();
    limpiarCompra();
}
//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------
function cargarUsuariosEnSelect(){
    let datos = ejecutarAjax("controladores/usuarioss.php", "leer=1");
     console.log("Respuesta usuarios:", datos);
    if(datos !== "0"){
        let usuarios = JSON.parse(datos);
        let select = $("#usuario_id_lst");
        select.html('<option value="">-- Seleccione un usuario --</option>');
        usuarios.map(function(u){
            select.append(`<option value="${u.usuario_id}">${u.nombre}</option>`);
        });
    }
}
//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------
function guardarCompra(){
    if($("#usuario_id_lst").val() === "" || $("#usuario_id_lst").val() === null){
        alert("Debe seleccionar un usuario");
        return;
    }
    if($("#fecha_txt").val().trim().length === 0){
        alert("Debe ingresar la fecha");
        return;
    }
    
    
    if($("#total_txt").val().trim().length === 0){
        alert("Debe ingresar el total");
        return;
    }
    let total = parseFloat($("#total_txt").val());
    if(isNaN(total) || total <= 0){
        alert("El total debe ser un número mayor a 0");
        return;
    }
    
    //JSON
    let datos = {
        usuario_id : $("#usuario_id_lst").val(),
        fecha : $("#fecha_txt").val(),
        total : total,
        metodo_pago : $("#metodo_pago_lst").val(),
        estado : $("#estado_lst").val(),
        referencia : $("#referencia_txt").val()
    };
    
    console.log(datos);
    if($("#compra_id").val() === "0"){
        let res =  ejecutarAjax("controladores/compras.php", "guardar="+JSON.stringify(datos));
        console.log(res);
        alert("Guardado correctamente");
        mostrarListarCompras();
        limpiarCompra();
    }else{
        datos = {...datos, "compra_id" : $("#compra_id").val()};
        let res =  ejecutarAjax("controladores/compras.php", "actualizar="+JSON.stringify(datos));
        console.log(res);
        alert("Actualizado correctamente");
        mostrarListarCompras();
        limpiarCompra();
    }
}


//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
function cargarTablaCompra(){
    let datos = ejecutarAjax("controladores/compras.php", "leer=1");
    console.log(datos);
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            $("#datos_tb").append(`
                <tr>
                    <td>${item.compra_id}</td>
                    <td>${item.nombre_usuario || item.usuario_id}</td>
                    <td>${item.fecha}</td>
                    <td>${item.total}</td>
                    <td>${item.metodo_pago}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>${item.referencia || ""}</td>
                    <td>
                        <button class="btn btn-warning editar-compra" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-compra" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
        
    }
}
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
$(document).on("click", ".editar-compra", function (evt) {
    let id = ($(this).closest("tr").find("td:eq(0)").text());
    mostrarAgregarCompra();
    
    let compra = ejecutarAjax("controladores/compras.php", "leer_id="+id);
    let json_compra = JSON.parse(compra);
    
    $("#compra_id").val(json_compra.compra_id);
    $("#usuario_id_lst").val(json_compra.usuario_id);
    $("#fecha_txt").val(json_compra.fecha);
    $("#total_txt").val(json_compra.total);
    $("#metodo_pago_lst").val(json_compra.metodo_pago);
    $("#estado_lst").val(json_compra.estado);
    $("#referencia_txt").val(json_compra.referencia);
});
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
function limpiarCompra(){
    $("#usuario_id_lst").val("");
    $("#fecha_txt").val("");
    $("#total_txt").val("");
    $("#metodo_pago_lst").val("Tarjeta");
    $("#estado_lst").val("pendiente");
    $("#referencia_txt").val("");
    $("#compra_id").val("0");
}
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
$(document).on("click", ".eliminar-compra", function (evt) {
    let id = ($(this).closest("tr").find("td:eq(0)").text());
    
    let compra = ejecutarAjax("controladores/compras.php", "eliminar="+id);
    
    console.log(compra);
    alert("Eliminado");
    
    cargarTablaCompra();
});
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
$(document).on("keyup", "#b_compra", function (evt) {
    let datos = ejecutarAjax("controladores/compras.php", "leer_descripcion="+$("#b_compra").val());
    console.log(datos);
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            $("#datos_tb").append(`
                <tr>
                    <td>${item.compra_id}</td>
                    <td>${item.nombre_usuario || item.usuario_id}</td>
                    <td>${item.fecha}</td>
                    <td>${item.total}</td>
                    <td>${item.metodo_pago}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>${item.referencia || ""}</td>
                    <td>
                        <button class="btn btn-warning editar-compra" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-compra" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
        
    }
});
