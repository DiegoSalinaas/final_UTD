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

function imprimirClientes() {
    let datos = ejecutarAjax("controladores/cliente.php", "leer=1");

    if (!datos || datos === "0") {
        alert("No hay clientes para imprimir.");
        return;
    }

    let json = JSON.parse(datos);
    let filasTabla = "";

    json.forEach(c => {
        filasTabla += `
            <tr>
                <td>${c.id_cliente}</td>
                <td>${c.nombre_apellido}</td>
                <td>${c.ruc}</td>
                <td>${c.direccion}</td>
                <td>${c.telefono}</td>
                <td>${c.ciudad}</td>
                <td>${c.estado}</td>
            </tr>
        `;
    });

    let ventana = window.open('', '', 'width=900,height=700');
    ventana.document.write(`
        <html>
        <head>
            <title>Reporte de Clientes</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 30px; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
                th { background-color: #f8f9fa; }
            </style>
        </head>
        <body>
            <h3 class="mb-4">👥 Reporte de Clientes</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre y Apellido</th>
                        <th>RUC</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Ciudad</th>
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
        mensaje_dialogo_info_ERROR("Debes ingresar el RUC", "ATENCION");
        return;
    }
    if($("#direccion_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar la Direccion", "ATENCION");
        return;
    }
    if($("#telefono_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar el Telefono", "ATENCION");
        return;
    }
    if($("#ciudad_lst").val()==="0"){
       mensaje_dialogo_info_ERROR("Debes ingresar la ciudad", "ATENCION");
        return;
    }

    let datos={
        nombre_apellido: $("#nombre_txt").val().trim(),
        ruc: $("#ruc_txt").val().trim(),
        direccion: $("#direccion_txt").val().trim(),
        id_ciudad: $("#ciudad_lst").val(),
        telefono: $("#telefono_txt").val().trim(),
        estado: $("#estado_lst").val()
    };

    if($("#id_cliente").val()==="0"){
        let res = ejecutarAjax("controladores/cliente.php","guardar="+JSON.stringify(datos));
        if(res === "duplicado"){
            mensaje_dialogo_info_ERROR("El RUC ya existe", "ATENCION");
            return;
        }
        mensaje_confirmacion("Guardado correctamente");
        mostrarListarCliente();
        limpiarCliente();
    }else{
        datos = {...datos, id_cliente: $("#id_cliente").val()};
        let res = ejecutarAjax("controladores/cliente.php","actualizar="+JSON.stringify(datos));
        if(res === "duplicado"){
            mensaje_dialogo_info_ERROR("El RUC ya existe", "ATENCION");
            return;
        }
        mensaje_confirmacion("Actualizado correctamente");
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
                    <td>${it.telefono}</td>
                    <td>${it.ciudad}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-cliente" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-cliente" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
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
        $("#telefono_txt").val(json.telefono);
        $("#ciudad_lst").val(json.id_ciudad);
        $("#estado_lst").val(json.estado);
    });
});

$(document).on("click", ".eliminar-cliente", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();

    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        reverseButtons: true
    }).then((result) => {
        if (!result.isConfirmed) return;

        let res = ejecutarAjax("controladores/cliente.php", "eliminar=" + id);

        if (res.includes("foreign key constraint")) {
            // El cliente está relacionado → solo desactivar
            ejecutarAjax("controladores/cliente.php", "actualizar_estado=" + id);
            Swal.fire({
                icon: "info",
                title: "Cliente relacionado",
                text: "Fue desactivado automáticamente.",
                showConfirmButton: false,
                timer: 2000
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
            });
        }

        cargarTablaCliente();
    });
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
                    <td>${it.telefono}</td>
                    <td>${it.ciudad}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-cliente" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-cliente" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
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
    $("#telefono_txt").val("");
    $("#ciudad_lst").val("0");
    $("#estado_lst").val("ACTIVO");
}
