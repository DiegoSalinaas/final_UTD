function guardarProducto(){
    //validaciones
    if($("#nombre").val().trim().length === 0){
        alert("debes ingresar un nombre");
        return;
    }
    if($("#descripcion").val().trim().length === 0){
        alert("debes ingresar una descripcion");
        return;
    }
    if($("#precio").val().trim().length === 0){
        alert("debes ingresar un precio");
        return;
    }
    if($("#stock").val().trim().length === 0){
        alert("debes ingresar el Stock");
        return;
    }
    if($("#categoria").val().trim().length === 0){
        alert("debes ingresar una Categoria");
        return;
    }
    if($("#marca").val().trim().length === 0){
        alert("debes ingresar una Marca");
        return;
    }
    if($("#codigodebarra").val().trim().length === 0){
        alert("debes ingresar un Codigo de Barra");
        return;
    }

//    
    //JSON
    let datos = {
        nombre : $("#nombre").val(),
        descripcion : $("#descripcion").val(),
        precio : $("#precio").val(),
        stock : $("#stock").val(),
        categoria : $("#categoria").val(),
        marca : $("#marca").val(),
        codigodebarra : $("#codigodebarra").val(),
        estado : 'ACTIVO'
    };
    
    
    console.log(datos);
    if($("#id_producto").val() === "0"){
        
        let res =  ejecutarAjax("controladores/producto.php", 
        "guardar="+JSON.stringify(datos));
        console.log(res);
        alert("Guardado correctamente");
        cargarTablaProducto();
        limpiarProducto();
    }else{
        datos = {...datos, "id_producto" : $("#id_producto").val()};
        
        let res =  ejecutarAjax("controladores/producto.php", 
        "actualizar="+JSON.stringify(datos));
        console.log(res);
        alert("Actualizado correctamente");
        cargarTablaProducto();
        limpiarProducto();
        
    }
    
}

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
function cargarTablaProducto(){
    //pide datos a al archivo persona php
    let datos = ejecutarAjax("controladores/producto.php",
    "leer=1");
    //se muestra en consola
    console.log(datos);
    //se pregunta si hay datos
    if(datos === "0"){
        //esto pasa si no hay datos
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json_datos =  JSON.parse(datos);
        json_datos.map(function (item) {
            $("#datos_tb").append(`
                <tr>
                    <td>${item.id_producto}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>${item.precio}</td>
                    <td>${item.stock}</td>
                    <td>${item.categoria}</td>
                    <td>${item.marca}</td>
                    <td>${item.codigodebarra}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-producto">Editar</button>
                        <button class="btn btn-danger eliminar-producto">Eliminar</button>
                    </td>
                </tr>
            `);
            
        });
        
    }
}
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
window.onload =  function (evt) {
    cargarTablaProducto();
}
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
$(document).on("click", ".editar-producto", function (evt) {
    let id = ($(this).closest("tr").find("td:eq(0)").text());
    
    let producto = ejecutarAjax("controladores/producto.php", 
    "leer_id="+id);
    
    let json_producto = JSON.parse(producto);
    
    $("#nombre").val(json_producto.nombre);
    $("#descripcion").val(json_producto.descripcion);
    $("#precio").val(json_producto.precio);
    $("#stock").val(json_producto.stock);
    $("#categoria").val(json_producto.categoria);
    $("#marca").val(json_producto.marca);
    $("#codigodebarra").val(json_producto.codigodebarra);
    $("#id_producto").val(json_producto.id_producto);
    
    
});

//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
function limpiarProducto(){
    $("#nombre").val("");
    $("#descripcion").val("");
    $("#precio").val("");
    $("#stock").val("");
    $("#categoria").val("");
    $("#marca").val("");
    $("#codigodebarra").val("");
    $("#id_producto").val("0");
}
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
$(document).on("click", ".eliminar-producto", function (evt) {
    let id = ($(this).closest("tr").find("td:eq(0)").text());
    
    let producto = ejecutarAjax("controladores/producto.php", 
    "eliminar="+id);
    
    console.log(producto);
    alert("Eliminado");
    
    cargarTablaProducto();
});
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
$(document).on("keyup", "#busqueda_txt", function (evt) {
    //pide datos a al archivo persona php
    let datos = ejecutarAjax("controladores/producto.php",
    "leer_descripcion="+$("#busqueda_txt").val());
    //se muestra en consola
    console.log(datos);
    //se pregunta si hay datos
    if(datos === "0"){
        //esto pasa si no hay datos
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json_datos =  JSON.parse(datos);
        json_datos.map(function (item) {
            $("#datos_tb").append(`
                <tr>
                    <td>${item.id_producto}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>${item.precio}</td>
                    <td>${item.stock}</td>
                    <td>${item.categoria}</td>
                    <td>${item.marca}</td>
                    <td>${item.codigodebarra}</td>
                    <td>${item.fecha}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-producto">Editar</button>
                        <button class="btn btn-danger eliminar-producto">Eliminar</button>
                    </td>
                </tr>
            `);
            
        });
        
    }
});