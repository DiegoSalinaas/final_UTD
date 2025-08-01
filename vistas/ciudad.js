function mostrarListarCiudad(){
    let contenido = dameContenido("paginas/referenciales/ciudad/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaCiudad();
}
//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------
function mostrarAgregarCiudad(){
    let contenido = dameContenido("paginas/referenciales/ciudad/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaDepartamento("#departamento_lst")
}
//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------
function imprimirCiudades() {
    let datos = ejecutarAjax("controladores/ciudad.php", "leer=1");

    if (!datos || datos === "0") {
        alert("No hay ciudades para imprimir.");
        return;
    }

    let json_datos = JSON.parse(datos);

    let filasTabla = "";
    json_datos.forEach(item => {
        filasTabla += `
            <tr>
                <td>${item.id_ciudad}</td>
                <td>${item.descripcion}</td>
                <td>${item.departamentos}</td>
                <td>${item.estado}</td>
            </tr>
        `;
    });

    let ventana = window.open('', '', 'width=900,height=700');
    ventana.document.write(`
        <html>
        <head>
            <title>Impresión de Ciudades</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 30px; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
                th { background-color: #f8f9fa; }
            </style>
        </head>
        <body>
            <h3 class="mb-4">📍 Reporte de Ciudades</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID Ciudad</th>
                        <th>Descripción</th>
                        <th>Departamento</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasTabla}
                </tbody>
            </table>
        </body>
        </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
}

 
//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------
function guardarCiudad(){

    if($("#descripcion_txt").val().trim().length === 0){
        alert("debes ingresar una descripcion");
        return;
    }
    if($("#departamento_lst").val() === "0"){
        alert("debes seleecionar un departamento");
        return;
    }


    //JSON
    let datos = {
        descripcion : $("#descripcion_txt").val(),
        id_departamento : $("#departamento_lst").val(),
        estado : $("#estado_lst").val()
    };


    console.log(datos);
    if($("#id_ciudad").val() === "0"){

        let res = ejecutarAjax("controladores/ciudad.php",
        "guardar="+JSON.stringify(datos));
        console.log(res);
        alert("Guardado correctamente");
        mostrarListarCiudad();
        limpiarCiudad();
    }else{
        datos = {...datos, "id_ciudad" : $("#id_ciudad").val()};

        let res = ejecutarAjax("controladores/ciudad.php",
        "actualizar="+JSON.stringify(datos));
        console.log(res);
        alert("Actualizado correctamente");
        mostrarListarCiudad();
        limpiarCiudad();

    }

}

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
function cargarTablaCiudad(){
    //pide datos a al archivo persona php
    let datos = ejecutarAjax("controladores/ciudad.php",
    "leer=1");
    //se muestra en consola
    console.log(datos);
    //se pregunta si hay datos
    if(datos === "0"){
        //esto pasa si no hay datos
        $("#datos_card").html("NO HAY REGISTROS");
    }else{
        $("#datos_card").html("");
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            $("#datos_card").append(`
            <div class="card col-md-5 m-2">
                <div class="card-header" style="color :#cecece;
                font-size: 13px;">
                Ciudad # <span class="id_ciudad_edicion">${item.id_ciudad}</span>
           </div>
           <div class="card-body">
               <div class="row">
                   <div class="col-12">
                       <b style="font-size: 17px;">${item.descripcion}</b>
                   </div>
                   <div class="col-8">
                       <i>${item.departamentos}</i>
                   </div>
                   <div class="col-4">
                       ${badgeEstado(item.estado)}
                   </div>
                   <div class="col-12">
                       <hr>
                   </div>
                   <div class="col-4">
                       <button class="btn btn-danger form-control eliminar-ciudad">
                           <i class="nav-icon bi bi-x-lg"> </i>
                       </button>
                   </div>
                   <div class="col-4">
                       <button class="btn btn-warning form-control editar-ciudad">
                           <i class="nav-icon bi bi-pencil-square"> </i>
                       </button>
                   </div>
                   <div class="col-4">
                       <button class="btn btn-primary form-control imprimir-ciudad">
    <i class="nav-icon bi bi-camera"> </i>
</button>

                   </div>
                   </div>

               </div>
           </div>`);

        });

    }
}

//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
$(document).on("click", ".editar-ciudad", function (evt) {
    let id = ($(this).closest(".card").find(".id_ciudad_edicion").text());
    mostrarAgregarCiudad();

    let ciudad = ejecutarAjax("controladores/ciudad.php",
    "leer_id="+id);
    console.log(ciudad);
    let json_ciudad = JSON.parse(ciudad);

    $("#descripcion_txt").val(json_ciudad.descripcion);
    $("#departamento_lst").val(json_ciudad.id_departamento);
    $("#estado_lst").val(json_ciudad.estado);
    $("#id_ciudad").val(json_ciudad.id_ciudad);


});

//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
function limpiarCiudad(){

    $("#descripcion_txt").val("");
    $("#id_departamento_txt").val("");
    $("#id_ciudad").val("0");
}
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
$(document).on("click", ".eliminar-ciudad", function (evt) {
    let id = ($(this).closest(".card").find(".id_ciudad_edicion").text());

    let ciudad = ejecutarAjax("controladores/ciudad.php",
    "eliminar="+id);

    console.log(ciudad);
    alert("Eliminado");

    cargarTablaCiudad();
});
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
$(document).on("keyup", "#b_ciudad", function (evt) {
 
    let datos = ejecutarAjax("controladores/ciudad.php",
    "leer_descripcion="+$("#b_ciudad").val());

     console.log(datos);
   
    if(datos === "0"){
      
        $("#datos_card").html("NO HAY REGISTROS");
    }else{
        $("#datos_card").html("");
        let json_datos =  JSON.parse(datos);
        json_datos.map(function (item) {
            $("#datos_card").append(`<div class="card col-md-5 m-2">
                <div class="card-header" style="color :#cecece;
                    font-size: 13px;">
               Ciudad #${item.id_ciudad}
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <b style="font-size: 17px;">${item.descripcion}</b>
                        </div>
                        <div class="col-8">
                            <i>${item.departamento}</i>
                        </div>
                        <div class="col-4">
                            ${badgeEstado(item.estado)}
                        </div>
                        <div class="col-12">
                            <hr>
                        </div>
                        <div class="col-4">
                            <button class="btn btn-danger form-control">
                                <i class="nav-icon bi bi-x-lg"></i> 
                            </button>
                        </div>
                        <div class="col-4">
                            <button class="btn btn-warning form-control">
                                <i class="nav-icon bi bi-pencil-square"></i>    
                            </button>
                        </div>
                        <div class="col-4">
                            <button class="btn btn-primary form-control">
                                <i class="nav-icon bi bi-camera"> </i>    
                            </button>
                        </div>
                    </div>
                </div> 
        </div>`);
            
        });
        
    }
});

$(document).on("click", ".imprimir-ciudad", function () {
    let id_ciudad = $(this).closest(".card").find(".id_ciudad_edicion").text().trim();

    if (!id_ciudad) {
        alert("No se pudo identificar la ciudad.");
        return;
    }

    let ciudad = ejecutarAjax("controladores/ciudad.php", "leer_id=" + id_ciudad);

    if (ciudad === "0") {
        alert("No se encontró la ciudad.");
        return;
    }

    let datos = JSON.parse(ciudad);

    let ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(`
        <html>
        <head>
            <title>Ciudad #${datos.id_ciudad}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 30px; font-size: 15px; }
                .info { margin-bottom: 15px; }
            </style>
        </head>
        <body>
            <h3 class="mb-4">📍 Ciudad #${datos.id_ciudad}</h3>
            <div class="info"><strong>Descripción:</strong> ${datos.descripcion}</div>
            <div class="info"><strong>Departamento:</strong> ${datos.departamentos}</div>
            <div class="info"><strong>Estado:</strong> ${datos.estado}</div>
        </body>
        </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
});



