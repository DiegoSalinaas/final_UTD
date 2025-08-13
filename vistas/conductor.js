function mostrarListarConductor(){
    let contenido = dameContenido("paginas/referenciales/conductor/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaConductor();
}

function mostrarAgregarConductor(callback = null){
    let contenido = dameContenido("paginas/referenciales/conductor/agregar.php");
    $("#contenido-principal").html(contenido);
    if(callback){
        setTimeout(callback,100);
    }
}

function imprimirConductores() {
    let datos = ejecutarAjax("controladores/conductor.php", "leer=1");

    if (!datos || datos === "0") {
        alert("No hay conductores para imprimir.");
        return;
    }

    let json = JSON.parse(datos);
    let filas = "";
    json.forEach(c => {
        filas += `<tr><td>${c.id_conductor}</td><td>${c.nombre}</td><td>${c.cedula}</td><td>${c.telefono}</td><td>${c.licencia_conduccion}</td><td>${c.estado}</td></tr>`;
    });

    let ventana = window.open('', '', 'width=900,height=700');
    ventana.document.write(`
        <html>
        <head>
            <title>Reporte de Conductores</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="p-4">
            <h3 class="mb-4">🚗 Reporte de Conductores</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Cédula</th>
                        <th>Teléfono</th>
                        <th>Licencia</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        </body>
        </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
}

function guardarConductor(){
    if($("#nombre_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar el nombre", "ATENCION");
        return;
    }
    if($("#cedula_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar la cédula", "ATENCION");
        return;
    }
    if($("#telefono_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar el teléfono", "ATENCION");
        return;
    }
    if($("#licencia_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar la licencia", "ATENCION");
        return;
    }

    let datos={
        nombre: $("#nombre_txt").val().trim(),
        cedula: $("#cedula_txt").val().trim(),
        telefono: $("#telefono_txt").val().trim(),
        licencia_conduccion: $("#licencia_txt").val().trim(),
        estado: $("#estado_lst").val()
    };

    if($("#id_conductor").val()==="0"){
        let res = ejecutarAjax("controladores/conductor.php","guardar="+JSON.stringify(datos));
        if(res === "duplicado"){
            mensaje_dialogo_info_ERROR("La cédula ya está registrada", "ATENCION");
            return;
        }
        mensaje_confirmacion("Guardado correctamente");
        mostrarListarConductor();
        limpiarConductor();
    }else{
        datos = {...datos, id_conductor: $("#id_conductor").val()};
        let res = ejecutarAjax("controladores/conductor.php","actualizar="+JSON.stringify(datos));
        if(res === "duplicado"){
            mensaje_dialogo_info_ERROR("La cédula ya está registrada", "ATENCION");
            return;
        }
        mensaje_confirmacion("Actualizado correctamente");
        mostrarListarConductor();
        limpiarConductor();
    }
}

function cargarTablaConductor(){
    let datos = ejecutarAjax("controladores/conductor.php","leer=1");
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#datos_tb").html("");
        json.map(function(it){
            $("#datos_tb").append(`<tr>
                <td>${it.id_conductor}</td>
                <td>${it.nombre}</td>
                <td>${it.cedula}</td>
                <td>${it.telefono}</td>
                <td>${it.licencia_conduccion}</td>
                <td>${badgeEstado(it.estado)}</td>
                <td>
                    <button class="btn btn-warning editar-conductor"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-danger eliminar-conductor"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`);
        });
    }
}

$(document).on("click", ".editar-conductor", function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let conductor = ejecutarAjax("controladores/conductor.php","leer_id="+id);
    let json = JSON.parse(conductor);
    mostrarAgregarConductor(function(){
        $("#nombre_txt").val(json.nombre);
        $("#cedula_txt").val(json.cedula);
        $("#telefono_txt").val(json.telefono);
        $("#licencia_txt").val(json.licencia_conduccion);
        $("#estado_lst").val(json.estado);
        $("#id_conductor").val(json.id_conductor);
    });
});

$(document).on("click", ".eliminar-conductor", function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    if(confirm("¿Eliminar conductor?")){
        ejecutarAjax("controladores/conductor.php","eliminar="+id);
        cargarTablaConductor();
    }
});

$(document).on("keyup", "#b_conductor", function(){
    let datos = ejecutarAjax("controladores/conductor.php","leer_descripcion="+$("#b_conductor").val());
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#datos_tb").html("");
        json.map(function(it){
            $("#datos_tb").append(`<tr>
                <td>${it.id_conductor}</td>
                <td>${it.nombre}</td>
                <td>${it.cedula}</td>
                <td>${it.telefono}</td>
                <td>${it.licencia_conduccion}</td>
                <td>${badgeEstado(it.estado)}</td>
                <td>
                    <button class="btn btn-warning editar-conductor"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-danger eliminar-conductor"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`);
        });
    }
});

function limpiarConductor(){
    $("#nombre_txt").val("");
    $("#cedula_txt").val("");
    $("#telefono_txt").val("");
    $("#licencia_txt").val("");
    $("#estado_lst").val("ACTIVO");
    $("#id_conductor").val("0");
}
