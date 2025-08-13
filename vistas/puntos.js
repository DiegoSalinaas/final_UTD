function mostrarListarPuntos(){
    let contenido = dameContenido("paginas/referenciales/puntos/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaPuntos();
}
//------------------------------------------------------------------
function mostrarAgregarPuntos(callback=null){
    let contenido = dameContenido("paginas/referenciales/puntos/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaCiudad("#ciudad_lst");
    if(callback){
        setTimeout(callback,100);
    }
}
//------------------------------------------------------------------
function cargarListaCiudad(componente){
    let datos = ejecutarAjax("controladores/ciudad.php","leer=1");
    if(datos === "0"){
        $(componente).html("<option value='0'>Selecciona una ciudad</option>");
    }else{
        let json = JSON.parse(datos);
        $(componente).html("<option value='0'>Selecciona una ciudad</option>");
        json.map(function(it){
            $(componente).append(`<option value="${it.id_ciudad}">${it.descripcion}</option>`);
        });
    }
}
//------------------------------------------------------------------
function guardarPunto(){
    if($("#nombre_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar el nombre", "ATENCION");
        return;
    }
    if($("#ciudad_lst").val()==="0"){
        mensaje_dialogo_info_ERROR("Debes seleccionar una ciudad", "ATENCION");
        return;
    }
    let datos = {
        nombre : $("#nombre_txt").val(),
        direccion : $("#direccion_txt").val(),
        id_ciudad : $("#ciudad_lst").val(),
        estado : $("#estado_lst").val()
    };
    if($("#id_punto").val()==="0"){
        let res = ejecutarAjax("controladores/puntos.php","guardar="+JSON.stringify(datos));
        if(res === "duplicado"){
            mensaje_dialogo_info_ERROR("El punto ya existe","ERROR");
            return;
        }
        mensaje_dialogo_correcto("Guardado correctamente","GUARDADO");
        mostrarListarPuntos();
        limpiarPunto();
    }else{
        datos = {...datos, id_punto: $("#id_punto").val()};
        let res = ejecutarAjax("controladores/puntos.php","actualizar="+JSON.stringify(datos));
        if(res === "duplicado"){
            mensaje_dialogo_info_ERROR("El punto ya existe","ERROR");
            return;
        }
        mensaje_dialogo_correcto("Actualizado correctamente","ACTUALIZADO");
        mostrarListarPuntos();
        limpiarPunto();
    }
}
//------------------------------------------------------------------
function cargarTablaPuntos(){
    let datos = ejecutarAjax("controladores/puntos.php","leer=1");
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json = JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`<tr>
                <td>${it.id_punto}</td>
                <td>${it.nombre}</td>
                <td>${it.direccion}</td>
                <td>${it.ciudad}</td>
                <td>${badgeEstado(it.estado)}</td>
                <td>
                    <button class="btn btn-warning editar-punto" title="Editar"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-danger eliminar-punto" title="Eliminar"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`);
        });
    }
}
//------------------------------------------------------------------
$(document).on("click",".editar-punto",function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarPuntos(function(){
        let datos = ejecutarAjax("controladores/puntos.php","leer_id="+id);
        let json = JSON.parse(datos);
        $("#id_punto").val(json.id_punto);
        $("#nombre_txt").val(json.nombre);
        $("#direccion_txt").val(json.direccion);
        $("#ciudad_lst").val(json.id_ciudad);
        $("#estado_lst").val(json.estado);
    });
});
//------------------------------------------------------------------
$(document).on("click",".eliminar-punto",function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
        title: "¿Eliminar punto?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        reverseButtons: true
    }).then((result)=>{
        if(result.isConfirmed){
            ejecutarAjax("controladores/puntos.php","eliminar="+id);
            Swal.fire({icon:"success",title:"Punto eliminado correctamente",showConfirmButton:false,timer:1500});
            cargarTablaPuntos();
        }
    });
});
//------------------------------------------------------------------
$(document).on("keyup","#b_punto",function(){
    buscarPunto();
});
function buscarPunto(){
    let datos = ejecutarAjax("controladores/puntos.php","leer_descripcion="+$("#b_punto").val());
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json = JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`<tr>
                <td>${it.id_punto}</td>
                <td>${it.nombre}</td>
                <td>${it.direccion}</td>
                <td>${it.ciudad}</td>
                <td>${badgeEstado(it.estado)}</td>
                <td>
                    <button class="btn btn-warning editar-punto" title="Editar"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-danger eliminar-punto" title="Eliminar"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`);
        });
    }
}
//------------------------------------------------------------------
function limpiarPunto(){
    $("#id_punto").val("0");
    $("#nombre_txt").val("");
    $("#direccion_txt").val("");
    $("#ciudad_lst").val("0");
    $("#estado_lst").val("ACTIVO");
}
