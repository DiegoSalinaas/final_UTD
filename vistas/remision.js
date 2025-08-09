
(function(){
 let detallesRemision = [];
let listaClientes = [];
let listaProductos = [];


})();
function mostrarListarRemision(){
    let contenido = dameContenido("paginas/referenciales/remision/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaRemision();
}
window.mostrarListarRemision = mostrarListarRemision;

function mostrarAgregarRemision(){
    let contenido = dameContenido("paginas/referenciales/remision/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaClientes();
    cargarListaProductos();
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
    arr.forEach(p => select.append(`<option value="${p.producto_id}" data-precio="${p.precio}">${p.nombre}</option>`));
}

$(document).on('input','#cantidad_txt, #precio_unitario_txt', function(){
    const cant = parseFloat($('#cantidad_txt').val()) || 0;
    const precio = parseFloat($('#precio_unitario_txt').val()) || 0;
    const subtotal = cant * precio;
    $('#subtotal_txt').val(formatearPY(subtotal));
});

function agregarDetalleRemision(){
    if($("#id_producto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un producto","ERROR");return;}
    if($("#cantidad_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar la cantidad","ERROR");return;}
    if(parseFloat($("#cantidad_txt").val()) <= 0){mensaje_dialogo_info_ERROR("La cantidad debe ser mayor que 0","ERROR");return;}
    if($("#precio_unitario_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar el precio","ERROR");return;}
    if(parseFloat($("#precio_unitario_txt").val()) <= 0){mensaje_dialogo_info_ERROR("El precio debe ser mayor que 0","ERROR");return;}

    let detalle = {
        id_producto: $("#id_producto_lst").val(),
        producto: $("#id_producto_lst option:selected").text(),
        cantidad: $("#cantidad_txt").val(),
        precio_unitario: $("#precio_unitario_txt").val(),
        subtotal: (parseFloat($("#cantidad_txt").val()) || 0) * (parseFloat($("#precio_unitario_txt").val()) || 0)
    };
console.log("✔ Detalles a guardar:", JSON.stringify(detallesRemision, null, 2));


    detallesRemision.push(detalle);
    renderDetallesRemision();
    limpiarDetalleRemisionForm();
}
window.agregarDetalleRemision = agregarDetalleRemision;

function limpiarDetalleRemisionForm(){
    $("#id_producto_lst").val("");
    $("#cantidad_txt").val("");
    $("#precio_unitario_txt").val("");
    $("#subtotal_txt").val("");
}

function renderDetallesRemision(){
    let tbody = $("#detalle_remision_tb");
    tbody.html("");
    let total = 0;
    detallesRemision.forEach((d,i) => {
        total += parseFloat(d.subtotal);
        tbody.append(`<tr>
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td>${formatearPY(d.precio_unitario)}</td>
            <td>${formatearPY(d.subtotal)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDetalleRemision(${i}); return false;"><i class="bi bi-trash"></i></button></td>
        </tr>`);
    });
    $("#total_general_txt").text(formatearPY(total));
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

    if ($("#fecha_txt").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ERROR");
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
        estado: $("#estado_txt").val()
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
    let datos = ejecutarAjax("controladores/remision.php","leer=1");
    if(datos === "0"){
        $("#remision_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#remision_datos_tb").html("");
        json.map(function(it){
            $("#remision_datos_tb").append(`
                <tr>
                    <td>${it.id_remision}</td>
                    <td>${it.fecha_remision}</td>
                    <td>${it.cliente}</td>
                    <td>${formatearPY(it.total)}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-info btn-sm imprimir-remision" title="Imprimir"><i class="bi bi-printer"></i></button>
                        <button class="btn btn-warning btn-sm editar-remision" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-remision" title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}

function buscarRemision(){
    let b = $("#b_remision").val();
    let datos = ejecutarAjax("controladores/remision.php","leer_descripcion="+b);
    if(datos === "0"){
        $("#remision_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#remision_datos_tb").html("");
        json.map(function(it){
            $("#remision_datos_tb").append(`
                <tr>
                    <td>${it.id_remision}</td>
                    <td>${it.fecha_remision}</td>
                    <td>${it.cliente}</td>
                    <td>${formatearPY(it.total)}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-info btn-sm imprimir-remision" title="Imprimir"><i class="bi bi-printer"></i></button>
                        <button class="btn btn-warning btn-sm editar-remision" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-remision" title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}
window.buscarRemision = buscarRemision;

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
        <td>${formatearPY(d.precio_unitario)}</td>
        <td>${formatearPY(d.subtotal)}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="5">Sin ítems</td></tr>`;

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
      .kpi-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; margin-bottom:20px; }
      .kpi { border:1px solid #e9ecef; border-radius:12px; padding:14px; background:#f8f9fa; }
      .kpi .lbl { font-size:12px; color:#6c757d; margin-bottom:4px; text-transform:uppercase; letter-spacing:.3px; }
      .kpi .val { font-size:15px; font-weight:600; }
      table { width:100%; border-collapse:collapse; }
      thead th { background:#e9f2ff; border-bottom:1px solid #cfe2ff !important; font-weight:700; }
      th, td { border:1px solid #e9ecef; padding:8px; font-size:12.5px; vertical-align:top; text-align:center; }
      .total { margin-top:20px; font-size:16px; font-weight:700; text-align:right; }
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
          &nbsp;·&nbsp; Estado: <span class="badge ${estadoBadge}">${estadoTxt}</span>
          &nbsp;·&nbsp; Fecha: <strong>${formatearFechaDMA(rem.fecha_remision)}</strong>
          ${rem.observacion ? `&nbsp;·&nbsp; Obs.: <strong>${rem.observacion}</strong>` : ""}
        </div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="lbl">Total</div>
        <div class="val">${formatearPY(rem.total || 0)}</div>
      </div>
      <div class="kpi">
        <div class="lbl">Moneda</div>
        <div class="val">PYG</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>

    <div class="total">
      Total General: ${formatearPY(rem.total || 0)}
    </div>

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
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarRemision();
    setTimeout(function(){
        let datos=ejecutarAjax("controladores/remision.php","leer_id="+id);
        let json=JSON.parse(datos);
        $("#id_remision").val(json.id_remision);
        $("#id_cliente_lst").val(json.id_cliente);
        $("#fecha_txt").val(json.fecha_remision);
        $("#observacion_txt").val(json.observacion);
        $("#estado_txt").val(json.estado);
        
        let det=ejecutarAjax("controladores/detalle_remision.php","leer=1&id_remision="+id);
        if(det !== "0"){
            detallesRemision=JSON.parse(det).map(d=>({id_producto:d.id_producto,producto:d.producto,cantidad:d.cantidad,precio_unitario:d.precio_unitario,subtotal:d.subtotal}));
        }else{
            detallesRemision=[];
        }
        renderDetallesRemision();
    },100);
});

$(document).on("click",".anular-remision",function(){
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
