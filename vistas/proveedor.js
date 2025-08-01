function mostrarListarProveedor(){
    let contenido = dameContenido("paginas/referenciales/proveedor/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaProveedor();
}

function mostrarAgregarProveedor(callback = null){
    let contenido = dameContenido("paginas/referenciales/proveedor/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaCiudad("#ciudad_lst");
    if(callback){
        setTimeout(callback,100);
    }
}

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

function guardarProveedor(){
    if($("#razon_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar la razón social", "ATENCION");
        return;
    }
    if($("#ruc_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar el RUC");
        return;
    }
    if($("#direccion_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar la dirección");
        return;
    }
    if($("#telefono_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar el teléfono");
        return;
    }
    if($("#ciudad_lst").val()==="0"){
        mensaje_dialogo_info_ERROR("Debes seleccionar la ciudad");
        return;
    }

    let datos={
        razon_social: $("#razon_txt").val(),
        ruc: $("#ruc_txt").val(),
        direccion: $("#direccion_txt").val(),
        id_ciudad: $("#ciudad_lst").val(),
        telefono: $("#telefono_txt").val(),
        estado: $("#estado_lst").val()
    };

    if($("#id_proveedor").val()==="0"){
        let res = ejecutarAjax("controladores/proveedor.php","guardar="+JSON.stringify(datos));
        mensaje_dialogo_correcto("Guardado correctamente", 'GUARDADO');
        mostrarListarProveedor();
        limpiarProveedor();
    }else{
        datos = {...datos, id_proveedor: $("#id_proveedor").val()};
        let res = ejecutarAjax("controladores/proveedor.php","actualizar="+JSON.stringify(datos));
        mensaje_dialogo_correcto("Actualizado correctamente", 'ACTUALIZADO');
        mostrarListarProveedor();
        limpiarProveedor();
    }
}

function cargarTablaProveedor(){
    let datos = ejecutarAjax("controladores/proveedor.php","leer=1");
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json = JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.id_proveedor}</td>
                    <td>${it.razon_social}</td>
                    <td>${it.ruc}</td>
                    <td>${it.direccion}</td>
                    <td>${it.telefono}</td>
                    <td>${it.ciudad}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-proveedor" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-proveedor" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`);
        });
    }
}

$(document).on("click",".editar-proveedor",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarProveedor(function(){
        let datos=ejecutarAjax("controladores/proveedor.php","leer_id="+id);
        let json=JSON.parse(datos);
        $("#id_proveedor").val(json.id_proveedor);
        $("#razon_txt").val(json.razon_social);
        $("#ruc_txt").val(json.ruc);
        $("#direccion_txt").val(json.direccion);
        $("#telefono_txt").val(json.telefono);
        $("#ciudad_lst").val(json.id_ciudad);
        $("#estado_lst").val(json.estado);
    });
});

$(document).on("click", ".eliminar-proveedor", function () {
    let fila = $(this).closest("tr");
    let id = fila.find("td:eq(0)").text();
    let nombre = fila.find("td:eq(1)").text(); // Obtener la razón social del proveedor

    Swal.fire({
        title: `¿Eliminar proveedor "${nombre}"?`,
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let res = ejecutarAjax("controladores/proveedor.php", "eliminar=" + id);
            Swal.fire({
                icon: "success",
                title: "Proveedor eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
            });
            cargarTablaProveedor();
        }
    });
});


$(document).on("keyup","#b_proveedor",function(){
    buscarProveedor();
});

function buscarProveedor(){
    let datos=ejecutarAjax("controladores/proveedor.php","leer_descripcion="+$("#b_proveedor").val());
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json=JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.id_proveedor}</td>
                    <td>${it.razon_social}</td>
                    <td>${it.ruc}</td>
                    <td>${it.direccion}</td>
                    <td>${it.telefono}</td>
                    <td>${it.ciudad}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-proveedor" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-proveedor" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`);
        });
    }
}

function limpiarProveedor(){
    $("#id_proveedor").val("0");
    $("#razon_txt").val("");
    $("#ruc_txt").val("");
    $("#direccion_txt").val("");
    $("#telefono_txt").val("");
    $("#ciudad_lst").val("0");
    $("#estado_lst").val("ACTIVO");
}
