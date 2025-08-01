function mostrarListarDepartamento(){
    let contenido =  dameContenido("paginas/referenciales/departamento/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaDepartamento();
}
//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------
function mostrarAgregarDepartamento(){
    let contenido =  dameContenido("paginas/referenciales/departamento/agregar.php");
    $("#contenido-principal").html(contenido);
}
//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------
function guardarDepartamento(){
    
    if($("#descripcion_txt").val().trim().length === 0){
        alert("debes ingresar una descripcion");
        return;
    }
    

//    
    //JSON
    let datos = {
        descripcion : $("#descripcion_txt").val(),
        estado : $("#estado_lst").val()
    };
    
    
    console.log(datos);
    if($("#id_departamento").val() === "0"){
        
        let res =  ejecutarAjax("controladores/departamento.php", 
        "guardar="+JSON.stringify(datos));
        console.log(res);
        alert("Guardado correctamente");
        mostrarListarDepartamento();
        limpiarDepartamento();
    }else{
        datos = {...datos, "id_departamento" : $("#id_departamento").val()};
        
        let res =  ejecutarAjax("controladores/departamento.php", 
        "actualizar="+JSON.stringify(datos));
        console.log(res);
        alert("Actualizado correctamente");
        mostrarListarDepartamento();
        limpiarDepartamento();
        
    }
    
}

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
function cargarTablaDepartamento(){
    //pide datos a al archivo persona php
    let datos = ejecutarAjax("controladores/departamento.php",
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
                    <td>${item.id_departamento}</td>
                    <td>${item.descripcion}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-departamento" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-departamento" title="Eliminar">
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
$(document).on("click", ".editar-departamento", function (evt) {
    let id = ($(this).closest("tr").find("td:eq(0)").text());
    mostrarAgregarDepartamento();
    
    let departamento = ejecutarAjax("controladores/departamento.php", 
    "leer_id="+id);
    
    let json_departamento = JSON.parse(departamento);
    
    $("#descripcion_txt").val(json_departamento.descripcion);
    $("#estado_lst").val(json_departamento.estado);
    $("#id_departamento").val(json_departamento.id_departamento);
    
    
});

//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
function limpiarDepartamento(){
   
    $("#descripcion_txt").val("");
    $("#id_departamento").val("0");
}
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
$(document).on("click", ".eliminar-departamento", function (evt) {
    let id = ($(this).closest("tr").find("td:eq(0)").text());
    
    let departamento = ejecutarAjax("controladores/departamento.php", 
    "eliminar="+id);
    
    console.log(departamento);
    alert("Eliminado");
    
    cargarTablaDepartamento();
});
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
$(document).on("keyup", "#b_departamento", function (evt) {
    //pide datos a al archivo persona php
    let datos = ejecutarAjax("controladores/departamento.php",
    "leer_descripcion="+$("#b_departamento").val());
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
                    <td>${item.id_departamento}</td>
                    <td>${item.descripcion}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-departamento" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-departamento" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
            
        });
        
    }
});

function cargarListaDepartamento(componente){
    let datos = ejecutarAjax("controladores/departamento.php", "leerActivo=1");
    console.log(datos);
    if(datos === "0"){
        $(componente).html("<option value='0'>Selecciona un departamento</option>");
    }else{
        let json_datos = JSON.parse(datos);
        $(componente).html("<option value='0'>Selecciona un departamento</option>");
        json_datos.map(function (item){
            $(componente).append(`<option value="${item.id_departamento}">${item.descripcion}</option>`);
            
        });
    }
}