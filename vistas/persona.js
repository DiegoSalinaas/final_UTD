function guardarPersona(){
    //validaciones
    if($("#nombre").val().trim().length === 0){
        alert("debes ingresar un nombre");
        return;
    }
    if($("#cedula").val().trim().length === 0){
        alert("debes ingresar una cedula");
        return;
    }
    if($("#fecha").val().trim().length === 0){
        alert("debes ingresar una fecha");
        return;
    }
    if($("#ciudad").val().trim().length === 0){
        alert("debes ingresar una ciudad");
        return;
    }
    if($("#foto").val().trim().length === 0){
        alert("debes ingresar una foto");
        return;
    }
    if($("#pass").val().trim().length === 0){
        alert("debes ingresar una contraseña");
        return;
    }

//    
    //JSON
    let datos = {
        nombre : $("#nombre").val(),
        cedula : $("#cedula").val(),
        fecha : $("#fecha").val(),
        ciudad : $("#ciudad").val(),
        color : $("#color").val(),
        foto : $("#foto").val(),
        estado : 'ACTIVO',
        pass : $("#pass").val()
    };
    
    
    console.log(datos);
    if($("#id_persona").val() === "0"){
        
        let res =  ejecutarAjax("controladores/persona.php", 
        "guardar="+JSON.stringify(datos));
        console.log(res);
        alert("Guardado correctamente");
        cargarTablaPersona();
        limpiarPersona();
    }else{
        datos = {...datos, "id_persona" : $("#id_persona").val()};
        
        let res =  ejecutarAjax("controladores/persona.php", 
        "actualizar="+JSON.stringify(datos));
        console.log(res);
        alert("Actualizado correctamente");
        cargarTablaPersona();
        limpiarPersona();
        
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
                    <td>${item.id_persona}</td>
                    <td>${item.nombre}</td>
                    <td>${item.cedula}</td>
                    <td>${item.fecha}</td>
                    <td>${item.ciudad}</td>
                    <td>${item.color}</td>
                    <td>${item.foto}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-persona" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-persona" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
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
    cargarTablaPersona();
}
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
$(document).on("click", ".editar-persona", function (evt) {
    let id = ($(this).closest("tr").find("td:eq(0)").text());
    
    let persona = ejecutarAjax("controladores/persona.php", 
    "leer_id="+id);
    
    let json_persona = JSON.parse(persona);
    
    $("#nombre").val(json_persona.nombre);
    $("#cedula").val(json_persona.cedula);
    $("#fecha").val(json_persona.fecha);
    $("#ciudad").val(json_persona.ciudad);
    $("#color").val(json_persona.color);
    $("#pass").val(json_persona.contrasena);
    $("#id_persona").val(json_persona.id_persona);
    
    
});

//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
function limpiarPersona(){
    $("#nombre").val("");
    $("#cedula").val("");
    $("#fecha").val("");
    $("#ciudad").val("");
    $("#color").val("");
    $("#pass").val("");
    $("#id_persona").val("0");
}
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
$(document).on("click", ".eliminar-persona", function (evt) {
    let id = ($(this).closest("tr").find("td:eq(0)").text());
    
    let persona = ejecutarAjax("controladores/persona.php", 
    "eliminar="+id);
    
    console.log(persona);
    alert("Eliminado");
    
    cargarTablaPersona();
});
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
$(document).on("keyup", "#busqueda_txt", function (evt) {
    //pide datos a al archivo persona php
    let datos = ejecutarAjax("controladores/persona.php",
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
                    <td>${item.id_persona}</td>
                    <td>${item.nombre}</td>
                    <td>${item.cedula}</td>
                    <td>${item.fecha}</td>
                    <td>${item.ciudad}</td>
                    <td>${item.color}</td>
                    <td>${item.foto}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-persona" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-persona" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
            
        });
        
    }
});