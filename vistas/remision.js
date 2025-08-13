
(function(){
let detallesRemision = [];
let listaClientes = [];
let listaProductos = [];
let listaConductores = [];
let listaPuntos = [];


})();
function mostrarListarRemision(){
    let contenido = dameContenido("paginas/referenciales/remision/listar.php");
    $("#contenido-principal").html(contenido);
    buscarRemision();
}
window.mostrarListarRemision = mostrarListarRemision;

function mostrarAgregarRemision(){
    let contenido = dameContenido("paginas/referenciales/remision/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaClientes();
    cargarListaProductos();
    cargarListaConductores();
    cargarListaPuntos();
    detallesRemision = [];
    renderDetallesRemision();
}
window.mostrarAgregarRemision = mostrarAgregarRemision;

function cargarListaClientes(){
    let datos = ejecutarAjax("controladores/cliente.php","leer=1");
    if(datos !== "0"){
        listaClientes = JSON.parse(datos);
        renderListaClientes(listaClientes);
    }
}

function renderListaClientes(arr){
    let select = $("#id_cliente_lst");
    select.html('<option value="">-- Seleccione un cliente --</option>');
    arr.forEach(c => select.append(`<option value="${c.id_cliente}">${c.nombre_apellido}</option>`));
}

function cargarListaProductos(){
    let datos = ejecutarAjax("controladores/productos.php","leerActivo=1");
    if(datos !== "0"){
        listaProductos = JSON.parse(datos);
        renderListaProductos(listaProductos);
    }
}

function renderListaProductos(arr){
    let select = $("#id_producto_lst");
    select.html('<option value="">-- Seleccione un producto --</option>');
    arr.forEach(p => select.append(`<option value="${p.producto_id}">${p.nombre}</option>`));
}

function cargarListaConductores(){
    let datos = ejecutarAjax("controladores/conductor.php","leer=1");
    if(datos !== "0"){
        listaConductores = JSON.parse(datos);
        renderListaConductores(listaConductores);
    }
}

function renderListaConductores(arr){
    let select = $("#id_conductor_lst");
    select.html('<option value="">-- Seleccione un conductor --</option>');
    arr.forEach(c => select.append(`<option value="${c.id_conductor}">${c.nombre}</option>`));
}

function cargarListaPuntos(){
    let datos = ejecutarAjax("controladores/puntos.php","leer=1");
    if(datos !== "0"){
        listaPuntos = JSON.parse(datos);
        renderListaPuntos(listaPuntos);
    }
}

function renderListaPuntos(arr){
    let selectSalida = $("#punto_salida_lst");
    let selectLlegada = $("#punto_llegada_lst");
    selectSalida.html('<option value="">-- Seleccione punto --</option>');
    selectLlegada.html('<option value="">-- Seleccione punto --</option>');
    arr.forEach(p => {
        selectSalida.append(`<option value="${p.id_punto}">${p.nombre}</option>`);
        selectLlegada.append(`<option value="${p.id_punto}">${p.nombre}</option>`);
    });
}

// Precios y subtotales eliminados

function agregarDetalleRemision(){
    if($("#id_producto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un producto","ERROR");return;}
    if($("#cantidad_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar la cantidad","ERROR");return;}
    if(parseFloat($("#cantidad_txt").val()) <= 0){mensaje_dialogo_info_ERROR("La cantidad debe ser mayor que 0","ERROR");return;}

    if(detallesRemision.some(d => d.id_producto === $("#id_producto_lst").val())){
        mensaje_dialogo_info_ERROR("El producto ya fue agregado","ERROR");
        return;
    }
    let cantidad = parseFloat($("#cantidad_txt").val()) || 0;

    let detalle = {
        id_producto: $("#id_producto_lst").val(),
        producto: $("#id_producto_lst option:selected").text(),
        cantidad: cantidad
    };

    detallesRemision.push(detalle);
    renderDetallesRemision();
    limpiarDetalleRemisionForm();
}
window.agregarDetalleRemision = agregarDetalleRemision;

function limpiarDetalleRemisionForm(){
    $("#id_producto_lst").val("");
    $("#cantidad_txt").val("");
}

function renderDetallesRemision(){
    let tbody = $("#detalle_remision_tb");
    tbody.html("");
    detallesRemision.forEach((d,i) => {
        tbody.append(`<tr>
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDetalleRemision(${i}); return false;"><i class="bi bi-trash"></i></button></td>
        </tr>`);
    });
}

function eliminarDetalleRemision(index){
    detallesRemision.splice(index,1);
    renderDetallesRemision();
}
window.eliminarDetalleRemision = eliminarDetalleRemision;

function guardarRemision() {
    console.log("guardarRemision ejecutada");

    if ($("#id_cliente_lst").val() === "") {
        mensaje_dialogo_info_ERROR("Debe seleccionar un cliente", "ERROR");
        return;
    }

    if ($("#id_conductor_lst").val() === "") {
        mensaje_dialogo_info_ERROR("Debe seleccionar un conductor", "ERROR");
        return;
    }

    if ($("#movil_txt").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debe ingresar el móvil", "ERROR");
        return;
    }

    if ($("#fecha_txt").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ERROR");
        return;
    }

    if ($("#punto_salida_lst").val() === "" || $("#punto_llegada_lst").val() === "") {
        mensaje_dialogo_info_ERROR("Debe seleccionar los puntos de salida y llegada", "ERROR");
        return;
    }

    if ($("#punto_salida_lst").val() === $("#punto_llegada_lst").val()) {
        mensaje_dialogo_info_ERROR("Punto de salida y llegada no pueden ser iguales", "ERROR");
        return;
    }

    if ($("#tipo_transporte_lst").val() === "") {
        mensaje_dialogo_info_ERROR("Debe seleccionar el tipo de transporte", "ERROR");
        return;
    }

    if (detallesRemision.length === 0) {
        mensaje_dialogo_info_ERROR("Debe agregar al menos un producto", "ERROR");
        return;
    }

    let datos = {
        id_cliente: $("#id_cliente_lst").val(),
        fecha_remision: $("#fecha_txt").val(),
        observacion: $("#observacion_txt").val(),
        estado: $("#estado_txt").val(),
        id_conductor: $("#id_conductor_lst").val(),
        movil: $("#movil_txt").val(),
        id_punto_salida: $("#punto_salida_lst").val(),
        id_punto_llegada: $("#punto_llegada_lst").val(),
        tipo_transporte: $("#tipo_transporte_lst").val(),
        factura_relacionada: $("#factura_relacionada_txt").val()
    };

    
    let idRemision = $("#id_remision").val();

    if (idRemision === "0") {
        idRemision = ejecutarAjax("controladores/remision.php", "guardar=" + JSON.stringify(datos));
        console.log("🟢 ID de remisión generado:", idRemision); 

        if (!idRemision || isNaN(idRemision)) {
            mensaje_dialogo_info_ERROR("Error al guardar la remisión. ID inválido.", "ERROR");
            return;
        }

        detallesRemision.forEach(function (d) {
            let det = { ...d, id_remision: idRemision };
            ejecutarAjax("controladores/detalle_remision.php", "guardar=" + JSON.stringify(det));
        });
    } else {
        datos = { ...datos, id_remision: idRemision };
        ejecutarAjax("controladores/remision.php", "actualizar=" + JSON.stringify(datos));
        ejecutarAjax("controladores/detalle_remision.php", "eliminar_por_remision=" + idRemision);
        detallesRemision.forEach(function (d) {
            let det = { ...d, id_remision: idRemision };
            ejecutarAjax("controladores/detalle_remision.php", "guardar=" + JSON.stringify(det));
        });
    }

    mensaje_confirmacion("Guardado correctamente");
    mostrarListarRemision();
}


window.guardarRemision = guardarRemision;

function cargarTablaRemision(){
    buscarRemision();
}

function buscarRemision(){
    let b = $("#b_remision").val();
    let estado = $("#estado_filtro").val();
    let desde = $("#f_desde").val();
    let hasta = $("#f_hasta").val();

    let datos = ejecutarAjax(
        "controladores/remision.php",
        "leer_descripcion="+encodeURIComponent(b)+"&estado="+estado+"&desde="+desde+"&hasta="+hasta
    );
    if(datos === "0"){
        $("#remision_datos_tb").html("NO HAY REGISTROS");
        $("#remision_count").text(0);
    }else{
        let json = JSON.parse(datos);
        $("#remision_datos_tb").html("");
        json.map(function(it){
            const disabled = it.estado === 'ANULADO' ? 'disabled' : '';
            $("#remision_datos_tb").append(`
                <tr>
                    <td>${it.id_remision}</td>
                    <td>${it.fecha_remision}</td>
                    <td>${it.cliente}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-info btn-sm imprimir-remision" title="Imprimir"><i class="bi bi-printer"></i></button>
                        <button class="btn btn-warning btn-sm editar-remision" ${disabled} title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-remision" ${disabled} title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
        $("#remision_count").text(json.length);
    }
}
window.buscarRemision = buscarRemision;

$(document).on("keyup", "#b_remision", function(){
    buscarRemision();
});

$(document).on("change", "#estado_filtro, #f_desde, #f_hasta", function(){
    buscarRemision();
});

$(document).on("click", "#limpiar_busqueda_btn", function(){
    $("#b_remision").val('');
    $("#estado_filtro").val('');
    $("#f_desde").val('');
    $("#f_hasta").val('');
    buscarRemision();
});

function imprimirRemision(id){
  const datos = ejecutarAjax("controladores/remision.php","leer_id="+id);
  if(datos === "0"){ alert("Remisión no encontrada"); return; }
  const rem = JSON.parse(datos);

  const detData = ejecutarAjax("controladores/detalle_remision.php","leer=1&id_remision="+id);
  const detalles = detData === "0" ? [] : JSON.parse(detData);

  let filas = detalles.length
    ? detalles.map((d,i)=>`
      <tr>
        <td>${i+1}</td>
        <td>${d.producto || d.id_producto || ""}</td>
        <td>${d.cantidad}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="3">Sin ítems</td></tr>`;

  const estadoTxt = rem.estado || "EMITIDA";
  const estUC = String(estadoTxt).toUpperCase();
  const estadoBadge =
      estUC === "APROBADA" || estUC === "APROBADO" ? "bg-success" :
      estUC === "ANULADA"  || estUC === "ANULADO"  ? "bg-danger"  :
      "bg-warning text-dark";

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Remisión #${rem.id_remision}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      @page { size: A4; margin: 16mm; }
      body { color:#111; font-family: "Segoe UI", Arial, sans-serif; }
      .doc-header { display:flex; align-items:center; border-bottom:2px solid #0d6efd; padding-bottom:10px; margin-bottom:18px; }
      .doc-logo { flex:0 0 auto; }
      .doc-logo img { height:110px; }
      .doc-info { flex:1; padding-left:20px; display:flex; flex-direction:column; justify-content:flex-end; }
        .doc-title { margin:0; font-weight:800; letter-spacing:.3px; font-size:26px; }
        .meta { font-size:14px; color:#555; margin-top:6px; }
        table { width:100%; border-collapse:collapse; }
      thead th { background:#e9f2ff; border-bottom:1px solid #cfe2ff !important; font-weight:700; }
      th, td { border:1px solid #e9ecef; padding:8px; font-size:12.5px; vertical-align:top; text-align:center; }
        .footer { margin-top:20px; font-size:11px; color:#6c757d; text-align:right; }
        @media print { .no-print { display:none !important; } }
      </style>
  </head>
  <body>
    <div class="doc-header">
      <div class="doc-logo">
        <img src="images/logo.png" alt="Logo">
      </div>
      <div class="doc-info">
        <h2 class="doc-title">Remisión #${rem.id_remision}</h2>
        <div class="meta">
          Cliente: <strong>${rem.cliente || rem.id_cliente || ""}</strong>
          &nbsp;·&nbsp; Conductor: <strong>${rem.conductor || ""}</strong>
          &nbsp;·&nbsp; Móvil: <strong>${rem.movil || ""}</strong>
          &nbsp;·&nbsp; Salida: <strong>${rem.punto_salida || ""}</strong>
          &nbsp;·&nbsp; Llegada: <strong>${rem.punto_llegada || ""}</strong>
          &nbsp;·&nbsp; Tipo: <strong>${rem.tipo_transporte || ""}</strong>
          &nbsp;·&nbsp; Factura: <strong>${rem.factura_relacionada || ""}</strong>
          &nbsp;·&nbsp; Estado: <span class="badge ${estadoBadge}">${estadoTxt}</span>
          &nbsp;·&nbsp; Fecha: <strong>${formatearFechaDMA(rem.fecha_remision)}</strong>
          ${rem.observacion ? `&nbsp;·&nbsp; Obs.: <strong>${rem.observacion}</strong>` : ""}
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>

    <div class="footer">
      Documento generado automáticamente.
    </div>

    <script>window.print();</script>
  </body>
  </html>
  `);
  v.document.close();
  v.focus();
}
window.imprimirRemision = imprimirRemision;


$(document).on("click",".editar-remision",function(){
    if($(this).prop('disabled')) return;
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarRemision();
    setTimeout(function(){
        let datos=ejecutarAjax("controladores/remision.php","leer_id="+id);
        let json=JSON.parse(datos);
        $("#id_remision").val(json.id_remision);
        $("#id_cliente_lst").val(json.id_cliente);
        $("#id_conductor_lst").val(json.id_conductor);
        $("#movil_txt").val(json.movil);
        $("#punto_salida_lst").val(json.id_punto_salida);
        $("#punto_llegada_lst").val(json.id_punto_llegada);
        $("#tipo_transporte_lst").val(json.tipo_transporte);
        $("#factura_relacionada_txt").val(json.factura_relacionada);
        $("#fecha_txt").val(json.fecha_remision);
        $("#observacion_txt").val(json.observacion);
        $("#estado_txt").val(json.estado);
        
        let det=ejecutarAjax("controladores/detalle_remision.php","leer=1&id_remision="+id);
        if(det !== "0"){
            detallesRemision=JSON.parse(det).map(d=>({id_producto:d.id_producto,producto:d.producto,cantidad:d.cantidad}));
        }else{
            detallesRemision=[];
        }
        renderDetallesRemision();
    },100);
});

$(document).on("click",".anular-remision",function(){
    if($(this).prop('disabled')) return;
    let id=$(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
        title:"¿Anular remisión?",
        text:"Esta acción marcará la remisión como anulada.",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText:"Sí, anular",
        cancelButtonText:"Cancelar",
        confirmButtonColor:"#dc3545",
        cancelButtonColor:"#6c757d",
        reverseButtons:true
    }).then((result)=>{
        if(result.isConfirmed){
            ejecutarAjax("controladores/remision.php","anular="+id);
            mensaje_confirmacion("Anulado correctamente");
            cargarTablaRemision();
        }
    });
});

$(document).on("click",".imprimir-remision",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    imprimirRemision(id);
});
