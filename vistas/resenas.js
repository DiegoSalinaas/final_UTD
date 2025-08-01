function mostrarListarResenas(){
    let contenido = dameContenido("paginas/referenciales/resenas/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaResena();
}

let listaUsuarios = [];
let listaEbooks = [];

function mostrarAgregarResena(){
    let contenido = dameContenido("paginas/referenciales/resenas/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarUsuariosEnSelect();
    cargarEbooksEnSelect();
    limpiarResena();
}

function cargarUsuariosEnSelect(){
    let datos = ejecutarAjax("controladores/usuarioss.php", "leer=1");
    if(datos !== "0"){
        listaUsuarios = JSON.parse(datos);
        renderListaUsuarios(listaUsuarios);
    }
}

function renderListaUsuarios(arr){
    let select = $("#usuario_id_lst");
    select.html('<option value="">-- Seleccione un usuario --</option>');
    arr.forEach(u => {
        select.append(`<option value="${u.usuario_id}">${u.nombre}</option>`);
    });
}

function filtrarUsuarios(texto){
    let filtrados = listaUsuarios.filter(u =>
        u.nombre.toLowerCase().includes(texto.toLowerCase())
    );
    renderListaUsuarios(filtrados);
}

function cargarEbooksEnSelect(){
    let datos = ejecutarAjax("controladores/ebooks.php", "leer=1");
    if(datos !== "0"){
        listaEbooks = JSON.parse(datos);
        renderListaEbooks(listaEbooks);
    }
}

function renderListaEbooks(arr){
    let select = $("#ebook_id_lst");
    select.html('<option value="">-- Seleccione un ebook --</option>');
    arr.forEach(e => {
        select.append(`<option value="${e.ebook_id}">${e.titulo}</option>`);
    });
}

function filtrarEbooks(texto){
    let filtrados = listaEbooks.filter(e =>
        e.titulo.toLowerCase().includes(texto.toLowerCase())
    );
    renderListaEbooks(filtrados);
}

function limpiarResena(){
    $("#resena_id").val("0");
    $("#usuario_id_lst").val("");
    $("#ebook_id_lst").val("");
    $("#filtro_usuario").val("");
    $("#filtro_ebook").val("");
    $("#puntuacion_lst").val("1");
    $("#comentario_txt").val("");
    $("#fecha_txt").val(new Date().toISOString().slice(0,10));
    renderListaUsuarios(listaUsuarios);
    renderListaEbooks(listaEbooks);
}

function guardarResena(){
    if($("#usuario_id_lst").val() === "" || $("#usuario_id_lst").val() === null){
        alert("Debe seleccionar un usuario");
        return;
    }
    if($("#ebook_id_lst").val() === "" || $("#ebook_id_lst").val() === null){
        alert("Debe seleccionar un ebook");
        return;
    }
    if($("#fecha_txt").val().trim().length === 0){
        alert("Debe ingresar la fecha");
        return;
    }
    if($("#comentario_txt").val().trim() === ""){
        alert("Debe ingresar un comentario");
        return;
    }
    let puntuacion = parseInt($("#puntuacion_lst").val());
    if(isNaN(puntuacion) || puntuacion < 1 || puntuacion > 5){
        alert("La puntuación debe estar entre 1 y 5");
        return;
    }

    let datos = {
        usuario_id: $("#usuario_id_lst").val(),
        ebook_id: $("#ebook_id_lst").val(),
        puntuacion: puntuacion,
        comentario: $("#comentario_txt").val().trim(),
        fecha: $("#fecha_txt").val()
    };

    if($("#resena_id").val() === "0"){
        let res = ejecutarAjax("controladores/resenas.php", "guardar="+JSON.stringify(datos));
        alert("Reseña guardada correctamente");
    } else {
        datos.resena_id = $("#resena_id").val();
        let res = ejecutarAjax("controladores/resenas.php", "actualizar="+JSON.stringify(datos));
        alert("Reseña actualizada correctamente");
    }
    mostrarListarResenas();
}

function cargarTablaResena(){
    let datos = ejecutarAjax("controladores/resenas.php", "leer=1");
    if(datos === "0"){
        $("#datos_tb").html("<tr><td colspan='7'>NO HAY REGISTROS</td></tr>");
    } else {
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
        json_datos.forEach(item => {
            $("#datos_tb").append(`
                <tr>
                    <td>${item.resena_id}</td>
                    <td>${item.nombre_usuario || item.usuario_id}</td>
                    <td>${item.titulo_ebook || item.ebook_id}</td>
                    <td>${item.puntuacion}</td>
                    <td>${item.comentario}</td>
                    <td>${item.fecha}</td>
                    <td>
                        <button class="btn btn-warning editar-resena" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-resena" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
}


$(document).on("click", ".editar-resena", function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarResena();
    setTimeout(() => {
        let resena = ejecutarAjax("controladores/resenas.php", "leer_id="+id);
        let json = JSON.parse(resena);
        $("#resena_id").val(json.resena_id);
        $("#usuario_id_lst").val(json.usuario_id);
        $("#ebook_id_lst").val(json.ebook_id);
        $("#puntuacion_lst").val(json.puntuacion);
        $("#comentario_txt").val(json.comentario);
        $("#fecha_txt").val(json.fecha);
    }, 300);
});

$(document).on("click", ".eliminar-resena", function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    if(confirm("¿Está seguro de eliminar esta reseña?")){
        ejecutarAjax("controladores/resenas.php", "eliminar="+id);
        alert("Reseña eliminada");
        cargarTablaResena();
    }
});


$(document).on("keyup", "#b_resena", function(){
    let filtro = $(this).val();
    let datos = ejecutarAjax("controladores/resenas.php", "leer_descripcion="+filtro);
    if(datos === "0"){
        $("#datos_tb").html("<tr><td colspan='7'>NO HAY REGISTROS</td></tr>");
    } else {
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
        json_datos.forEach(item => {
            $("#datos_tb").append(`
                <tr>
                    <td>${item.resena_id}</td>
                    <td>${item.nombre_usuario || item.usuario_id}</td>
                    <td>${item.titulo_ebook || item.ebook_id}</td>
                    <td>${item.puntuacion}</td>
                    <td>${item.comentario}</td>
                    <td>${item.fecha}</td>
                    <td>
                        <button class="btn btn-warning editar-resena" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-resena" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
});

$(document).on("keyup", "#filtro_usuario", function(){
    filtrarUsuarios($(this).val());
});

$(document).on("keyup", "#filtro_ebook", function(){
    filtrarEbooks($(this).val());
});


function ejecutarAjax(url, parametros){
    let resultado = null;
    $.ajax({
        url: url,
        type: "POST",
        data: parametros,
        async: false,
        success: function(respuesta){
            resultado = respuesta;
        },
        error: function(err){
            console.error("Error en AJAX: ", err);
        }
    });
    return resultado;
}

