function mostrarListarEbooks() {
    let contenido = dameContenido("paginas/referenciales/ebooks/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaEbook();
}

function mostrarAgregarEbook() {
    let contenido = dameContenido("paginas/referenciales/ebooks/agregar.php");
    $("#contenido-principal").html(contenido);
}

function guardarEbook() {
    // Validaciones
    if ($("#titulo_txt").val().trim().length === 0) {
        alert("Debe ingresar un título");
        return;
    }
    if ($("#autor_txt").val().trim().length === 0) {
        alert("Debe ingresar un autor");
        return;
    }
    if ($("#isbn_txt").val().trim().length === 0) {
        alert("Debe ingresar un ISBN");
        return;
    }
    if ($("#precio_txt").val().trim().length === 0) {
        alert("Debe ingresar un precio");
        return;
    }
    let precio = parseFloat($("#precio_txt").val());
    if (isNaN(precio) || precio <= 0) {
        alert("El precio debe ser un número mayor a 0");
        return;
    }

    // Datos a enviar
    let datos = {
        titulo: $("#titulo_txt").val(),
        autor: $("#autor_txt").val(),
        isbn: $("#isbn_txt").val(),
        formato: $("#formato_lst").val(),
        precio: precio
    };

    if ($("#ebook_id").val() === "0") {
        let res = ejecutarAjax("controladores/ebooks.php", "guardar=" + JSON.stringify(datos));
        alert("Guardado correctamente");
    } else {
        datos = { ...datos, ebook_id: $("#ebook_id").val() };
        let res = ejecutarAjax("controladores/ebooks.php", "actualizar=" + JSON.stringify(datos));
        alert("Actualizado correctamente");
    }

    mostrarListarEbooks();
    limpiarEbook();
}



function cargarTablaEbook() {
    let datos = ejecutarAjax("controladores/ebooks.php", "leer=1");
    if (datos === "0") {
        $("#datos_tb").html("NO HAY REGISTROS");
    } else {
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            $("#datos_tb").append(`
                <tr>
                    <td>${item.ebook_id}</td>
                    <td>${item.titulo}</td>
                    <td>${item.autor}</td>
                    <td>${item.isbn}</td>
                    <td>${item.formato}</td>
                    <td>${item.precio}</td>
                    <td>
                        <button class="btn btn-warning editar-ebook" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-ebook" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
}

$(document).on("click", ".editar-ebook", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarEbook();
    let ebook = ejecutarAjax("controladores/ebooks.php", "leer_id=" + id);
    let json = JSON.parse(ebook);
    $("#ebook_id").val(json.ebook_id);
    $("#titulo_txt").val(json.titulo);
    $("#autor_txt").val(json.autor);
    $("#isbn_txt").val(json.isbn);
    $("#formato_lst").val(json.formato);
    $("#precio_txt").val(json.precio);
});

$(document).on("click", ".eliminar-ebook", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    ejecutarAjax("controladores/ebooks.php", "eliminar=" + id);
    alert("Eliminado correctamente");
    cargarTablaEbook();
});

$(document).on("keyup", "#b_ebook", function () {
    let datos = ejecutarAjax("controladores/ebooks.php", "leer_descripcion=" + $(this).val());
    if (datos === "0") {
        $("#datos_tb").html("NO HAY REGISTROS");
    } else {
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            $("#datos_tb").append(`
                <tr>
                    <td>${item.ebook_id}</td>
                    <td>${item.titulo}</td>
                    <td>${item.autor}</td>
                    <td>${item.isbn}</td>
                    <td>${item.formato}</td>
                    <td>${item.precio}</td>
                    <td>
                        <button class="btn btn-warning editar-ebook" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-ebook" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
});

function limpiarEbook() {
    $("#ebook_id").val("0");
    $("#titulo_txt").val("");
    $("#autor_txt").val("");
    $("#isbn_txt").val("");
    $("#formato_lst").val("PDF");
    $("#precio_txt").val("");
}