function mostrarListarCliente(){
    let contenido = dameContenido("paginas/referenciales/cliente/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaCliente();
}

function mostrarAgregarCliente(callback = null){
    let contenido = dameContenido("paginas/referenciales/cliente/agregar.php");
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

function guardarCliente(){
    if($("#nombre_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar el nombre y apellido", "ATENCION");
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
        nombre_apellido: $("#nombre_txt").val(),
        ruc: $("#ruc_txt").val(),
        direccion: $("#direccion_txt").val(),
        id_ciudad: $("#ciudad_lst").val(),
        estado: $("#estado_lst").val()
    };

    if($("#id_cliente").val()==="0"){
        let res = ejecutarAjax("controladores/cliente.php","guardar="+JSON.stringify(datos));
        alert("Guardado correctamente");
        mostrarListarCliente();
        limpiarCliente();
    }else{
        datos = {...datos, id_cliente: $("#id_cliente").val()};
        let res = ejecutarAjax("controladores/cliente.php","actualizar="+JSON.stringify(datos));
        alert("Actualizado correctamente");
        mostrarListarCliente();
        limpiarCliente();
    }
}

function cargarTablaCliente(){
    let datos = ejecutarAjax("controladores/cliente.php","leer=1");
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json = JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.id_cliente}</td>
                    <td>${it.nombre_apellido}</td>
                    <td>${it.ruc}</td>
                    <td>${it.direccion}</td>
                    <td>${it.ciudad}</td>
                    <td>${it.estado}</td>
                    <td>
                        <button class="btn btn-warning editar-cliente">Editar</button>
                        <button class="btn btn-danger eliminar-cliente">Eliminar</button>
                    </td>
                </tr>`);
        });
    }
}

$(document).on("click",".editar-cliente",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarCliente(function(){
        let datos=ejecutarAjax("controladores/cliente.php","leer_id="+id);
        let json=JSON.parse(datos);
        $("#id_cliente").val(json.id_cliente);
        $("#nombre_txt").val(json.nombre_apellido);
        $("#ruc_txt").val(json.ruc);
        $("#direccion_txt").val(json.direccion);
        $("#ciudad_lst").val(json.id_ciudad);
        $("#estado_lst").val(json.estado);
    });
});

$(document).on("click",".eliminar-cliente",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    let res=ejecutarAjax("controladores/cliente.php","eliminar="+id);
    alert("Eliminado correctamente");
    cargarTablaCliente();
});

$(document).on("keyup","#b_cliente",function(){
    buscarCliente();
});

function buscarCliente(){
    let datos=ejecutarAjax("controladores/cliente.php","leer_descripcion="+$("#b_cliente").val());
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json=JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.id_cliente}</td>
                    <td>${it.nombre_apellido}</td>
                    <td>${it.ruc}</td>
                    <td>${it.direccion}</td>
                    <td>${it.ciudad}</td>
                    <td>${it.estado}</td>
                    <td>
                        <button class="btn btn-warning editar-cliente">Editar</button>
                        <button class="btn btn-danger eliminar-cliente">Eliminar</button>
                    </td>
                </tr>`);
        });
    }
}

function limpiarCliente(){
    $("#id_cliente").val("0");
    $("#nombre_txt").val("");
    $("#ruc_txt").val("");
    $("#direccion_txt").val("");
    $("#ciudad_lst").val("0");
    $("#estado_lst").val("ACTIVO");
}
