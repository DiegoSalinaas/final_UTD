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
        alert("Debes ingresar la razón social");
        return;
    }
    if($("#ruc_txt").val().trim().length===0){
        alert("Debes ingresar el RUC");
        return;
    }
    if($("#direccion_txt").val().trim().length===0){
        alert("Debes ingresar la dirección");
        return;
    }
    if($("#ciudad_lst").val()==="0"){
        alert("Debes seleccionar la ciudad");
        return;
    }

    let datos={
        razon_social: $("#razon_txt").val(),
        ruc: $("#ruc_txt").val(),
        direccion: $("#direccion_txt").val(),
        id_ciudad: $("#ciudad_lst").val(),
        estado: $("#estado_lst").val()
    };

    if($("#id_proveedor").val()==="0"){
        let res = ejecutarAjax("controladores/proveedor.php","guardar="+JSON.stringify(datos));
        alert("Guardado correctamente");
        mostrarListarProveedor();
        limpiarProveedor();
    }else{
        datos = {...datos, id_proveedor: $("#id_proveedor").val()};
        let res = ejecutarAjax("controladores/proveedor.php","actualizar="+JSON.stringify(datos));
        alert("Actualizado correctamente");
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
                    <td>${it.ciudad}</td>
                    <td>${it.estado}</td>
                    <td>
                        <button class="btn btn-warning editar-proveedor">Editar</button>
                        <button class="btn btn-danger eliminar-proveedor">Eliminar</button>
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
        $("#ciudad_lst").val(json.id_ciudad);
        $("#estado_lst").val(json.estado);
    });
});

$(document).on("click",".eliminar-proveedor",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    let res=ejecutarAjax("controladores/proveedor.php","eliminar="+id);
    alert("Eliminado correctamente");
    cargarTablaProveedor();
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
                    <td>${it.ciudad}</td>
                    <td>${it.estado}</td>
                    <td>
                        <button class="btn btn-warning editar-proveedor">Editar</button>
                        <button class="btn btn-danger eliminar-proveedor">Eliminar</button>
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
    $("#ciudad_lst").val("0");
    $("#estado_lst").val("ACTIVO");
}
