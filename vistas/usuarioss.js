function mostrarListarUsuarioss() {
    let contenido = dameContenido("paginas/referenciales/usuarioss/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaUsuarioss();
}
//------------------------------------------------------------------
function mostrarAgregarUsuarioss(callback = null) {
    let contenido = dameContenido("paginas/referenciales/usuarioss/agregar.php");
    $("#contenido-principal").html(contenido);

    if (callback) {
        setTimeout(callback, 100); 
    }
}
//------------------------------------------------------------------
function guardarUsuarioss() {
    let nombre = $("#nombre_txt").val().trim();
    let email = $("#email_txt").val().trim();
    let fecha_registro = $("#fecha_registro_txt").val().trim();
    let tipo_usuario = $("#tipo_usuario_txt").val().trim();
    let estado = $("#estado_lst").val();

    if (nombre.length === 0) {
        alert("Debes ingresar un nombre");
        return;
    }
    if (email.length === 0) {
        alert("Debes ingresar un email");
        return;
    }
    if (fecha_registro.length === 0) {
        alert("Debes ingresar la fecha de registro");
        return;
    }
    if (tipo_usuario.length === 0) {
        alert("Debes ingresar el tipo de usuario");
        return;
    }
    if (estado === null || estado === "") {
        alert("Debes seleccionar un estado");
        return;
    }

    let datos = {
        nombre: nombre,
        email: email,
        fecha_registro: fecha_registro,
        tipo_usuario: tipo_usuario,
        estado: estado
    };

    console.log(datos);

    if ($("#usuario_id").val() === "0") {
        let res = ejecutarAjax("controladores/usuarioss.php", "guardar=" + JSON.stringify(datos));
        console.log(res);
        alert("Guardado correctamente");
        mostrarListarUsuarioss();
        limpiarUsuarioss();
    } else {
        datos = { ...datos, "usuario_id": $("#usuario_id").val() };
        let res = ejecutarAjax("controladores/usuarioss.php", "actualizar=" + JSON.stringify(datos));
        console.log(res);
        alert("Actualizado correctamente");
        mostrarListarUsuarioss();
        limpiarUsuarioss();
    }
}

//------------------------------------------------------------------
function cargarTablaUsuarioss() {
    let datos = ejecutarAjax("controladores/usuarioss.php", "leer=1");
    console.log(datos);

    if (datos === "0") {
        $("#datos_tb").html("NO HAY REGISTROS");
    } else {
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            $("#datos_tb").append(`
                <tr>
                    <td>${item.usuario_id}</td>
                    <td>${item.nombre}</td>
                    <td>${item.email}</td>
                    <td>${item.fecha_registro}</td>
                    <td>${item.tipo_usuario}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-usuarioss" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-usuarioss" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
}
//------------------------------------------------------------------
$(document).on("click", ".editar-usuarioss", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();

    mostrarAgregarUsuarioss(function () {
        let datos = ejecutarAjax("controladores/usuarioss.php", "leer_id=" + id);
        let json = JSON.parse(datos);

        $("#usuario_id").val(json.usuario_id);
        $("#nombre_txt").val(json.nombre);
        $("#email_txt").val(json.email);
        $("#fecha_registro_txt").val(json.fecha_registro);
        console.log("tipo_usuario:", json.tipo_usuario);
        console.log("estado:", json.estado);
        $("#tipo_usuario_txt").val(json.tipo_usuario.toUpperCase()).trigger('change');
        $("#estado_lst").val(json.estado.toUpperCase()).trigger('change');
    });
});


//------------------------------------------------------------------
$(document).on("click", ".eliminar-usuarioss", function () {
    let id = ($(this).closest("tr").find("td:eq(0)").text());
    let res = ejecutarAjax("controladores/usuarioss.php", "eliminar=" + id);
    console.log(res);
    alert("Eliminado correctamente");
    cargarTablaUsuarioss();
});
//------------------------------------------------------------------
$(document).on("keyup", "#b_usuarioss", function () {
    let datos = ejecutarAjax("controladores/usuarioss.php",
        "leer_descripcion=" + $("#b_usuarioss").val());

    console.log(datos);

    if (datos === "0") {
        $("#datos_tb").html("NO HAY REGISTROS");
    } else {
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
       
        json_datos.map(function (item) {
          
            $("#datos_tb").append(`
                <tr>
                    <td>${item.usuario_id}</td>
                    <td>${item.nombre}</td>
                    <td>${item.email}</td>
                    <td>${item.fecha_registro}</td>
                    <td>${item.tipo_usuario}</td>
                    <td>${badgeEstado(item.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-usuarioss" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-usuarioss" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
});
//------------------------------------------------------------------
function limpiarUsuarioss() {
    $("#usuario_id").val("0");
    $("#nombre_txt").val("");
    $("#email_txt").val("");
    $("#fecha_registro_txt").val("");
    $("#tipo_usuario_txt").val("");
    $("#estado_lst").val("ACTIVO");
}
