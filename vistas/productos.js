function mostrarListarProductos(){
    let contenido = dameContenido("paginas/referenciales/productos/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaProductos();
}

function mostrarAgregarProducto(callback = null){
    let contenido = dameContenido("paginas/referenciales/productos/agregar.php");
    $("#contenido-principal").html(contenido);
    if(callback){
        setTimeout(callback,100);
    }
}

function guardarProducto(){
    if($("#nombre_txt").val().trim().length===0){
        alert("Debes ingresar el nombre");
        return;
    }
    if($("#precio_txt").val().trim().length===0){
        alert("Debes ingresar el precio");
        return;
    }
    if($("#iva_txt").val().trim().length===0){
        alert("Debes ingresar el IVA");
        return;
    }

    let datos = {
        nombre: $("#nombre_txt").val(),
        descripcion: $("#descripcion_txt").val(),
        precio: $("#precio_txt").val(),
        iva: $("#iva_txt").val(),
        estado: $("#estado_lst").val()
    };

    if($("#producto_id").val() === "0"){
        let res = ejecutarAjax("controladores/productos.php","guardar="+JSON.stringify(datos));
        alert("Guardado correctamente");
        mostrarListarProductos();
        limpiarProducto();
    }else{
        datos = {...datos, producto_id: $("#producto_id").val()};
        let res = ejecutarAjax("controladores/productos.php","actualizar="+JSON.stringify(datos));
        alert("Actualizado correctamente");
        mostrarListarProductos();
        limpiarProducto();
    }
}

function cargarTablaProductos(){
    let datos = ejecutarAjax("controladores/productos.php","leer=1");
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json = JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.producto_id}</td>
                    <td>${it.nombre}</td>
                    <td>${it.descripcion}</td>
                    <td>${it.precio}</td>
                    <td>${it.iva}</td>
                    <td>${it.estado}</td>
                    <td>
                        <button class="btn btn-warning editar-producto">Editar</button>
                        <button class="btn btn-danger eliminar-producto">Eliminar</button>
                    </td>
                </tr>`);
        });
    }
}

$(document).on("click",".editar-producto",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarProducto(function(){
        let datos=ejecutarAjax("controladores/productos.php","leer_id="+id);
        let json=JSON.parse(datos);
        $("#producto_id").val(json.producto_id);
        $("#nombre_txt").val(json.nombre);
        $("#descripcion_txt").val(json.descripcion);
        $("#precio_txt").val(json.precio);
        $("#iva_txt").val(json.iva);
        $("#estado_lst").val(json.estado);
    });
});

$(document).on("click",".eliminar-producto",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    let res=ejecutarAjax("controladores/productos.php","eliminar="+id);
    alert("Eliminado correctamente");
    cargarTablaProductos();
});

$(document).on("keyup","#b_producto",function(){
    buscarProducto();
});

function buscarProducto(){
    let datos=ejecutarAjax("controladores/productos.php","leer_descripcion="+$("#b_producto").val());
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json=JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.producto_id}</td>
                    <td>${it.nombre}</td>
                    <td>${it.descripcion}</td>
                    <td>${it.precio}</td>
                    <td>${it.iva}</td>
                    <td>${it.estado}</td>
                    <td>
                        <button class="btn btn-warning editar-producto">Editar</button>
                        <button class="btn btn-danger eliminar-producto">Eliminar</button>
                    </td>
                </tr>`);
        });
    }
}

function limpiarProducto(){
    $("#producto_id").val("0");
    $("#nombre_txt").val("");
    $("#descripcion_txt").val("");
    $("#precio_txt").val("");
    $("#iva_txt").val("");
    $("#estado_lst").val("ACTIVO");
}
