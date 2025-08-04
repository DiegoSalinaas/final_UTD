function mostrarListarProductos(){
    let contenido = dameContenido("paginas/referenciales/productos/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaProductos();
}

function mostrarAgregarProducto(callback = null){
    let contenido = dameContenido("paginas/referenciales/productos/agregar.php");
    $("#contenido-principal").html(contenido);
    if(callback){
        setTimeout(callback,100);
    }
}

function imprimirProductos() {
    let datos = ejecutarAjax("controladores/productos.php", "leer=1");

    if (!datos || datos === "0") {
        alert("No hay productos para imprimir.");
        return;
    }

    let json = JSON.parse(datos);
    let filasTabla = "";

    json.forEach(p => {
        filasTabla += `
            <tr>
                <td>${p.producto_id}</td>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>${formatearPY(p.precio)}</td>
                <td>${p.tipo}</td>
                <td>${p.estado}</td>
            </tr>
        `;
    });

    const fechaHoy = new Date().toLocaleDateString();

    let ventana = window.open('', '', 'width=900,height=700');
    ventana.document.write(`
        <html>
        <head>
            <title>📦 Reporte de Productos</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    padding: 40px;
                    font-family: 'Segoe UI', sans-serif;
                    font-size: 13px;
                    color: #212529;
                }
                h2 {
                    margin-bottom: 5px;
                }
                .encabezado {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .tabla-productos th {
                    background-color: #0d6efd;
                    color: white;
                    text-align: center;
                }
                .tabla-productos td {
                    text-align: center;
                }
                .footer {
                    margin-top: 30px;
                    text-align: right;
                    font-size: 12px;
                    color: #6c757d;
                }
            </style>
        </head>
        <body>
            <div class="encabezado">
                <div>
                    <h2>📦 Reporte de Productos</h2>
                    <small>Fecha de impresión: ${fechaHoy}</small>
                </div>
                <div>
               
             <img src="/UTCDP1MENU/images/LOGO.png" width="100">

                </div>
            </div>
            <table class="table table-bordered table-hover table-striped tabla-productos">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasTabla}
                </tbody>
            </table>

            <div class="footer">
                Sistema generado automáticamente - ${new Date().toLocaleTimeString()}
            </div>
        </body>
        </html>
    `);

    ventana.document.close();
    ventana.focus();
    ventana.print();
}


function guardarProducto(){
    if($("#nombre_txt").val().trim().length===0){
         mensaje_dialogo_info_ERROR("Debes ingresar el Nombre", "ERROR");
        return;
    }
    if($("#precio_txt").val().trim().length===0){
        mensaje_dialogo_info_ERROR("Debes ingresar el Precio", "ERROR");
        return;
    }
    if($("#tipo_lst").val()==="0"){
        mensaje_dialogo_info_ERROR("Debes Seleccionar el tipo", "ERROR");
        return;
    }

    let datos = {
        nombre: $("#nombre_txt").val(),
        descripcion: $("#descripcion_txt").val(),
        precio: $("#precio_txt").val(),
        tipo: $("#tipo_lst").val(),
        estado: $("#estado_lst").val()
    };

    if($("#producto_id").val() === "0"){
        let res = ejecutarAjax("controladores/productos.php","guardar="+JSON.stringify(datos));
        mensaje_confirmacion("REALIZADO", "Guardado correctamente");
        mostrarListarProductos();
        limpiarProducto();
    }else{
        datos = {...datos, producto_id: $("#producto_id").val()};
        let res = ejecutarAjax("controladores/productos.php","actualizar="+JSON.stringify(datos));
       mensaje_confirmacion("REALIZADO", "Actualizado correctamente");
        mostrarListarProductos();
        limpiarProducto();
    }
}

function cargarTablaProductos(){
    let datos = ejecutarAjax("controladores/productos.php","leer=1");
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json = JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.producto_id}</td>
                    <td>${it.nombre}</td>
                    <td>${it.descripcion}</td>
                    <td>${formatearPY(it.precio)}</td>
                    <td>${it.tipo}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-producto" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-producto" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`);
        });
    }
}

$(document).on("click",".editar-producto",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarProducto(function(){
        let datos=ejecutarAjax("controladores/productos.php","leer_id="+id);
        let json=JSON.parse(datos);
        $("#producto_id").val(json.producto_id);
        $("#nombre_txt").val(json.nombre);
        $("#descripcion_txt").val(json.descripcion);
        $("#precio_txt").val(json.precio);
        $("#tipo_lst").val(json.tipo);
        $("#estado_lst").val(json.estado);
    });
});

$(document).on("click", ".eliminar-producto", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();

    Swal.fire({
        title: "¿Estás seguro?",
        text: "El producto será eliminado permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let res = ejecutarAjax("controladores/productos.php", "eliminar=" + id);
            Swal.fire({
                icon: "success",
                title: "Producto eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
            });
            cargarTablaProductos();
        }
    });
});


$(document).on("keyup","#b_producto",function(){
    buscarProducto();
});

$(document).on("change","#tipo_filtro",function(){
    buscarProducto();
});

function buscarProducto(){
    let datos=ejecutarAjax("controladores/productos.php","leer_descripcion="+$("#b_producto").val()+"&tipo="+$("#tipo_filtro").val());
    if(datos === "0"){
        $("#datos_tb").html("NO HAY REGISTROS");
    }else{
        $("#datos_tb").html("");
        let json=JSON.parse(datos);
        json.map(function(it){
            $("#datos_tb").append(`
                <tr>
                    <td>${it.producto_id}</td>
                    <td>${it.nombre}</td>
                    <td>${it.descripcion}</td>
                    <td>${formatearPY(it.precio)}</td>
                    <td>${it.tipo}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-warning editar-producto" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger eliminar-producto" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`);
        });
    }
}

function limpiarProducto(){
    $("#producto_id").val("0");
    $("#nombre_txt").val("");
    $("#descripcion_txt").val("");
    $("#precio_txt").val("");
    $("#tipo_lst").val("0");
    $("#estado_lst").val("ACTIVO");
}
