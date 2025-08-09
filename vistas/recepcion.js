let detallesRecepcion = [];
let listaClientes = [];

function mostrarListarRecepcion(){
    let contenido = dameContenido("paginas/referenciales/recepcion/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaRecepcion();
}
window.mostrarListarRecepcion = mostrarListarRecepcion;

function mostrarAgregarRecepcion(){
    let contenido = dameContenido("paginas/referenciales/recepcion/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaClientes();
    detallesRecepcion = [];
    renderDetallesRecepcion();
}
window.mostrarAgregarRecepcion = mostrarAgregarRecepcion;

function cargarListaClientes(selectedId = ""){
    let datos = ejecutarAjax("controladores/cliente.php","leer=1");
    if(datos !== "0"){
        listaClientes = JSON.parse(datos);
        renderListaClientes(listaClientes, selectedId);
    }
}

function renderListaClientes(arr, selectedId = "") {
  const $sel = $("#id_cliente_lst");
  $sel.html('<option value="">-- Seleccione un cliente --</option>');
  arr.forEach(c => {
    const id  = c.id_cliente ?? c.cod_cliente ?? c.id;
    const nom = c.nombre_apellido ?? c.nombre_cliente ?? c.nombre;
    $sel.append(`<option value="${id}">${nom}</option>`);
  });
  if (selectedId) $sel.val(selectedId).trigger('change'); // prellena al editar
}



$(document).on('change', '#id_cliente_lst', function () {
  const id = $(this).val();
  if (!id) {
    $('#telefono_txt').val('');
    $('#direccion_txt').val('');
    return;
  }
  // Busca el cliente en el arreglo ya cargado
  const c = listaClientes.find(x => 
    String(x.id_cliente ?? x.cod_cliente ?? x.id) === String(id)
  );

  const tel = c?.telefono ?? c?.telefono_cliente ?? '';
  const dir = c?.direccion ?? c?.direccion_cliente ?? '';
  $('#telefono_txt').val(tel);
  $('#direccion_txt').val(dir);
});



function agregarDetalleRecepcion(){
    if($("#nombre_equipo_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar el nombre del equipo","ERROR");return;}
    if($("#marca_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la marca","ERROR");return;}
    if($("#modelo_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar el modelo","ERROR");return;}
    if($("#numero_serie_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar el número de serie","ERROR");return;}
    if($("#falla_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la falla reportada","ERROR");return;}

    let detalle = {
        nombre_equipo: $("#nombre_equipo_txt").val().trim(),
        marca: $("#marca_txt").val().trim(),
        modelo: $("#modelo_txt").val().trim(),
        numero_serie: $("#numero_serie_txt").val().trim(),
        falla_reportada: $("#falla_txt").val().trim(),
        accesorios_entregados: $("#accesorios_txt").val().trim(),
        diagnostico_preliminar: $("#diagnostico_txt").val().trim(),
        observaciones_detalle: $("#observaciones_detalle_txt").val().trim()
    };
    detallesRecepcion.push(detalle);
    renderDetallesRecepcion();
    limpiarDetalleRecepcionForm();
}
window.agregarDetalleRecepcion = agregarDetalleRecepcion;

function limpiarDetalleRecepcionForm(){
    $("#nombre_equipo_txt").val('');
    $("#marca_txt").val('');
    $("#modelo_txt").val('');
    $("#numero_serie_txt").val('');
    $("#falla_txt").val('');
    $("#accesorios_txt").val('');
    $("#diagnostico_txt").val('');
    $("#observaciones_detalle_txt").val('');
}

function renderDetallesRecepcion(){
    let tbody = $("#detalle_recepcion_tb");
    tbody.html('');
    detallesRecepcion.forEach((d,i)=>{
        tbody.append(`<tr>
            <td>${d.nombre_equipo}</td>
            <td>${d.marca}</td>
            <td>${d.modelo}</td>
            <td>${d.numero_serie}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDetalleRecepcion(${i}); return false;"><i class="bi bi-trash"></i></button></td>
        </tr>`);
    });
}

function eliminarDetalleRecepcion(index){
    detallesRecepcion.splice(index,1);
    renderDetallesRecepcion();
}
window.eliminarDetalleRecepcion = eliminarDetalleRecepcion;

function guardarRecepcion(){
    if($("#id_cliente_lst").val()===""){mensaje_dialogo_info_ERROR("Debe seleccionar un cliente","ERROR");return;}
    if($("#fecha_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la fecha","ERROR");return;}
    if(detallesRecepcion.length===0){mensaje_dialogo_info_ERROR("Debe agregar al menos un equipo","ERROR");return;}

    let datos = {
  fecha_recepcion: $("#fecha_txt").val(),
  id_cliente: $("#id_cliente_lst").val(),
  nombre_cliente: $("#id_cliente_lst option:selected").text().trim(),
  telefono: $("#telefono_txt").val(),
  direccion: $("#direccion_txt").val(),
  estado: $("#estado_lst").val(),
  observaciones: $("#observaciones_txt").val()
};


    let idRecepcion = $("#id_recepcion").val();
    if(idRecepcion === "0"){
        idRecepcion = ejecutarAjax("controladores/recepcion.php","guardar="+JSON.stringify(datos));
        detallesRecepcion.forEach(function(d){
            let det = {...d, id_recepcion:idRecepcion};
            ejecutarAjax("controladores/detalle_recepcion.php","guardar="+JSON.stringify(det));
        });
    }else{
        datos = {...datos, id_recepcion:idRecepcion};
        ejecutarAjax("controladores/recepcion.php","actualizar="+JSON.stringify(datos));
        ejecutarAjax("controladores/detalle_recepcion.php","eliminar_por_recepcion="+idRecepcion);
        detallesRecepcion.forEach(function(d){
            let det = {...d, id_recepcion:idRecepcion};
            ejecutarAjax("controladores/detalle_recepcion.php","guardar="+JSON.stringify(det));
        });
    }
    mensaje_confirmacion("Guardado correctamente");
    mostrarListarRecepcion();
}
window.guardarRecepcion = guardarRecepcion;

function cargarTablaRecepcion(){
    let datos = ejecutarAjax("controladores/recepcion.php","leer=1");
    if(datos === "0"){
        $("#recepcion_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#recepcion_datos_tb").html('');
        json.map(function(it){
            $("#recepcion_datos_tb").append(`
                <tr>
                    <td>${it.id_recepcion}</td>
                    <td>${it.fecha_recepcion}</td>
                    <td>${it.nombre_cliente}</td>
                    <td>${it.telefono}</td>
                    <td>${it.direccion}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-info btn-sm imprimir-recepcion" title="Imprimir"><i class="bi bi-printer"></i></button>
                        <button class="btn btn-warning btn-sm editar-recepcion" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm cerrar-recepcion" title="Cerrar"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}

function buscarRecepcion(){
    let b = $("#b_recepcion").val();
    let datos = ejecutarAjax("controladores/recepcion.php","leer_descripcion="+b);
    if(datos === "0"){
        $("#recepcion_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#recepcion_datos_tb").html('');
        json.map(function(it){
            $("#recepcion_datos_tb").append(`
                <tr>
                    <td>${it.id_recepcion}</td>
                    <td>${it.fecha_recepcion}</td>
                    <td>${it.nombre_cliente}</td>
                    <td>${it.telefono}</td>
                    <td>${it.direccion}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-info btn-sm imprimir-recepcion" title="Imprimir"><i class="bi bi-printer"></i></button>
                        <button class="btn btn-warning btn-sm editar-recepcion" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm cerrar-recepcion" title="Cerrar"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}
window.buscarRecepcion = buscarRecepcion;

function imprimirRecepcion(id){
    let datos = ejecutarAjax("controladores/recepcion.php","leer_id="+id);
    if(datos === "0"){ alert("Recepción no encontrada"); return; }
    let rec = JSON.parse(datos);
    let detData = ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+id);
    let detalles = detData === "0" ? [] : JSON.parse(detData);

    let filas = detalles.map((d,i)=>`<tr>
            <td>${i+1}</td>
            <td>${d.nombre_equipo}</td>
            <td>${d.marca}</td>
            <td>${d.modelo}</td>
            <td>${d.numero_serie}</td>
            <td>${d.falla_reportada}</td>
            <td>${d.accesorios_entregados}</td>
            <td>${d.diagnostico_preliminar}</td>
            <td>${d.observaciones_detalle}</td>
        </tr>`).join('');

    let win = window.open('', '', 'width=900,height=700');
    win.document.write(`
    <html>
    <head>
        <title>Recepción #${rec.id_recepcion}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body{padding:40px;font-size:13pt;font-family:'Segoe UI',sans-serif;color:#000;}
            .titulo{text-align:center;margin-bottom:20px;}
            .info{margin-bottom:20px;}
            table{width:100%;border-collapse:collapse;}
            th,td{border:1px solid #ccc;padding:8px;text-align:center;}
            th{background-color:#f0f0f0;}
            @media print{.no-print{display:none;}}
        </style>
    </head>
    <body>
        <div class="titulo">
            <h2>Recepción N° ${rec.id_recepcion}</h2>
            <p><small>Fecha: ${formatearFechaDMA(rec.fecha_recepcion)}</small></p>
        </div>
        <div class="info">
            <strong>Cliente:</strong> ${rec.nombre_cliente}<br>
            <strong>Teléfono:</strong> ${rec.telefono}<br>
            <strong>Dirección:</strong> ${rec.direccion}<br>
            <strong>Estado:</strong> ${rec.estado}<br>
            <strong>Observaciones:</strong> ${rec.observaciones || ''}<br>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Equipo</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>N° Serie</th>
                    <th>Falla Reportada</th>
                    <th>Accesorios</th>
                    <th>Diagnóstico</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
    </body>
    </html>
    `);
    win.document.close();
    win.focus();
    win.print();
}

window.imprimirRecepcion = imprimirRecepcion;

$(document).on("click",".editar-recepcion",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarRecepcion();
    setTimeout(function(){
        let datos = ejecutarAjax("controladores/recepcion.php","leer_id="+id);
        let json = JSON.parse(datos);
        $("#id_recepcion").val(json.id_recepcion);
        $("#fecha_txt").val(json.fecha_recepcion);
        $("#observaciones_txt").val(json.observaciones);
        $("#estado_lst").val(json.estado);
        cargarListaClientes(json.id_cliente);
        let det = ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+id);
        if(det !== "0"){
            detallesRecepcion = JSON.parse(det);
        }else{
            detallesRecepcion = [];
        }
        renderDetallesRecepcion();
    },100);
});

$(document).on("click",".imprimir-recepcion",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    imprimirRecepcion(id);
});

$(document).on("click",".cerrar-recepcion",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
        title:"¿Cerrar recepción?",
        text:"Esta acción marcará la recepción como cerrada.",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText:"Sí, cerrar",
        cancelButtonText:"Cancelar",
        confirmButtonColor:"#dc3545",
        cancelButtonColor:"#6c757d",
        reverseButtons:true
    }).then((result)=>{
        if(result.isConfirmed){
            ejecutarAjax("controladores/recepcion.php","cerrar="+id);
            mensaje_confirmacion("Recepción cerrada");
            cargarTablaRecepcion();
        }
    });
});
