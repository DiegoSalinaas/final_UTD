function mostrarListarCategorias(){
    let contenido = dameContenido("paginas/referenciales/categorias/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaCategoria();
}
//------------------------------------------------------------------
function mostrarAgregarCategoria(){
    let contenido = dameContenido("paginas/referenciales/categorias/agregar.php");
    $("#contenido-principal").html(contenido);
}
//------------------------------------------------------------------
function guardarCategoria() {
    if ($("#nombre_txt").val().trim().length === 0) {
        alert("Debes ingresar un nombre");
        return;
    }

    if ($("#descripcion_txt").val().trim().length === 0) {
        alert("Debes ingresar una descripción");
        return;
    }

    if ($("#fecha_creacion_txt").val().trim().length === 0) {
        alert("Debes ingresar la fecha de creación");
        return;
    }

    let ordenValor = parseInt($("#orden_txt").val());
    if (isNaN(ordenValor) || ordenValor <= 0) {
        alert("El valor del orden debe ser mayor a 0");
        return;
    }

    let datos = {
        nombre: $("#nombre_txt").val(),
        descripcion: $("#descripcion_txt").val(),
        activa: $("#activa_lst").val() === "1" ? 1 : 0,
        fecha_creacion: $("#fecha_creacion_txt").val(),
        orden: ordenValor
    };

    console.log(datos);

    if ($("#categoria_id").val() === "0") {
        let res = ejecutarAjax("controladores/categorias.php", "guardar=" + JSON.stringify(datos));
        console.log(res);
        alert("Guardado correctamente");
        mostrarListarCategorias();
        limpiarCategoria();
    } else {
        datos = { ...datos, "categoria_id": $("#categoria_id").val() };
        let res = ejecutarAjax("controladores/categorias.php", "actualizar=" + JSON.stringify(datos));
        console.log(res);
        alert("Actualizado correctamente");
        mostrarListarCategorias();
        limpiarCategoria();
    }
}

//------------------------------------------------------------------
function cargarTablaCategoria(){
    let datos = ejecutarAjax("controladores/categorias.php", "leer=1");
    console.log(datos);

    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    } else {
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
        json_datos.map(function(item){
            $("#datos_tb").append(`
                <tr>
                    <td>${item.categoria_id}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion || ""}</td>
                    <td>${item.activa == 1 ? "ACTIVA" : "INACTIVA"}</td>
                    <td>${item.fecha_creacion}</td>
                    <td>${item.orden}</td>
                    <td>
                        <button class="btn btn-warning editar-categoria" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-categoria" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
}
//------------------------------------------------------------------
$(document).on("click", ".editar-categoria", function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarCategoria();

    let datos = ejecutarAjax("controladores/categorias.php", "leer_id=" + id);
    let json = JSON.parse(datos);

    $("#categoria_id").val(json.categoria_id);
    $("#nombre_txt").val(json.nombre);
    $("#descripcion_txt").val(json.descripcion);
    $("#activa_lst").val(json.activa == 1 ? "1" : "0");
    $("#fecha_creacion_txt").val(json.fecha_creacion);
    $("#orden_txt").val(json.orden);
});
//------------------------------------------------------------------
function limpiarCategoria(){
    $("#categoria_id").val("0");
    $("#nombre_txt").val("");
    $("#descripcion_txt").val("");
    $("#activa_lst").val("1");
    $("#fecha_creacion_txt").val("");
    $("#orden_txt").val("0");
}
//------------------------------------------------------------------
$(document).on("click", ".eliminar-categoria", function(){
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let datos = ejecutarAjax("controladores/categorias.php", "eliminar=" + id);
    console.log(datos);
    alert("Eliminado correctamente");
    cargarTablaCategoria();
});
//------------------------------------------------------------------
$(document).on("keyup", "#b_categoria", function(){
    let datos = ejecutarAjax("controladores/categorias.php", "leer_descripcion=" + $("#b_categoria").val());
    console.log(datos);

    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    } else {
        $("#datos_tb").html("");
        let json_datos = JSON.parse(datos);
        json_datos.map(function(item){
            $("#datos_tb").append(`
                <tr>
                    <td>${item.categoria_id}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion || ""}</td>
                    <td>${item.activa == 1 ? "ACTIVA" : "INACTIVA"}</td>
                    <td>${item.fecha_creacion}</td>
                    <td>${item.orden}</td>
                    <td>
                        <button class="btn btn-warning editar-categoria" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-categoria" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
});
