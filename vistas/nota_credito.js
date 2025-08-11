(function(){
    let detallesNota = [];
    let listaClientes = [];
    let listaProductos = [];
    window.detallesNota = detallesNota;
})();

function mostrarListarNotaCredito(){
    let contenido = dameContenido("paginas/referenciales/nota_credito/listar.php");
    $("#contenido-principal").html(contenido);
    cargarTablaNotaCredito();
}
window.mostrarListarNotaCredito = mostrarListarNotaCredito;

function mostrarAgregarNotaCredito(){
    let contenido = dameContenido("paginas/referenciales/nota_credito/agregar.php");
    $("#contenido-principal").html(contenido);
    cargarListaClientes();
    cargarListaProductos();
    detallesNota = [];
    renderDetallesNota();
    let hoy = new Date();
    let fechaFormateada = hoy.toISOString().split('T')[0]; 
    $("#fecha_txt").val(fechaFormateada);
    $("#motivo_general_txt").val("");
}

window.mostrarAgregarNotaCredito = mostrarAgregarNotaCredito;

function cargarListaClientes(){
    let datos = ejecutarAjax("controladores/cliente.php","leer=1");
    if(datos !== "0"){
        listaClientes = JSON.parse(datos);
        let select = $("#id_cliente_lst");
        select.html('<option value="">-- Seleccione un cliente --</option>');
        listaClientes.forEach(c => select.append(`<option value="${c.id_cliente}" data-ruc="${c.ruc}">${c.nombre_apellido}</option>`));
    }
}

$(document).on('change','#id_cliente_lst',function(){
    let ruc = $("#id_cliente_lst option:selected").data('ruc') || '';
    $('#ruc_cliente_txt').val(ruc);
});

function cargarListaProductos(){
    let datos = ejecutarAjax("controladores/productos.php","leerActivo=1");
    if(datos !== "0"){
        listaProductos = JSON.parse(datos);
        let select = $("#id_producto_lst");
        select.html('<option value="">-- Seleccione un producto --</option>');
        listaProductos.forEach(p => select.append(`<option value="${p.producto_id}" data-precio="${p.precio}" data-descripcion="${p.nombre}">${p.nombre}</option>`));
    }
}

$(document).on('change','#id_producto_lst',function(){
    let desc = $("#id_producto_lst option:selected").data('descripcion') || '';
    $('#descripcion_txt').val(desc);
});

function obtenerPrecioUnitario(){
    return quitarDecimalesConvertir(String($('#precio_unitario_txt').val() || '0')) || 0;
}

function actualizarSubtotalNC(){
    const cant = parseFloat($('#cantidad_txt').val()) || 0;
    const precio = obtenerPrecioUnitario();
    const subtotal = cant * precio;
    $('#subtotal_txt').val(formatearPY(subtotal));
}

$(document).on('input','#cantidad_txt', actualizarSubtotalNC);

$(document).on('input','#precio_unitario_txt', function(){
    const raw = String($(this).val());
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 0) {
        $(this).val('');
    } else {
        const n = parseInt(digits,10) || 0;
        $(this).val(formatearPY(n));
    }
    actualizarSubtotalNC();
});

function agregarDetalleNotaCredito(){
    if($("#id_producto_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un producto","ERROR");return;}
    if($("#cantidad_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar la cantidad","ERROR");return;}
    if(parseFloat($("#cantidad_txt").val()) <= 0){mensaje_dialogo_info_ERROR("La cantidad debe ser mayor que 0","ERROR");return;}
    if($("#precio_unitario_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar el precio","ERROR");return;}
    if(obtenerPrecioUnitario() <= 0){mensaje_dialogo_info_ERROR("El precio debe ser mayor que 0","ERROR");return;}

    if(detallesNota.some(d => d.id_producto === $("#id_producto_lst").val())){
        mensaje_dialogo_info_ERROR("El producto ya fue agregado","ERROR");
        return;
    }

    const motivoItem = $("#motivo_item_txt").val().trim();
    if(motivoItem.length === 0){
        mensaje_dialogo_info_ERROR("Debe ingresar el motivo del ítem","ERROR");
        $("#motivo_item_txt").focus();
        return;
    }

    const cantidad = parseFloat($("#cantidad_txt").val()) || 0;
    const precio = obtenerPrecioUnitario();
    const subtotal = cantidad * precio;
    let detalle = {
        id_producto: $("#id_producto_lst").val(),
        producto: $("#id_producto_lst option:selected").text(),
        descripcion: $("#descripcion_txt").val(),
        cantidad: cantidad,
        precio_unitario: precio,
        subtotal: subtotal,
        total_linea: subtotal,
        motivo: motivoItem, // 👈 queda guardado
        observacion: $("#observacion_txt").val()
    };
    detallesNota.push(detalle);
    renderDetallesNota();
    limpiarDetalleNotaForm();
}

window.agregarDetalleNotaCredito = agregarDetalleNotaCredito;

function limpiarDetalleNotaForm(){
    $("#id_producto_lst").val("");
    $("#descripcion_txt").val("");
    $("#cantidad_txt").val("");
    $("#precio_unitario_txt").val("");
    $("#subtotal_txt").val("");
    $("#motivo_item_txt").val("");
    $("#observacion_txt").val("");
}

function renderDetallesNota(){
    let tbody = $("#detalle_nota_tb");
    tbody.html("");
    let total = 0;
    detallesNota.forEach((d,i) => {
        total += parseFloat(d.total_linea);
        tbody.append(`<tr>
            <td>${d.producto}</td>
            <td>${d.descripcion}</td>
            <td>${d.cantidad}</td>
            <td>${formatearPY(d.precio_unitario)}</td>
            <td>${formatearPY(d.total_linea)}</td>
            <td>${d.motivo}</td>
            <td>${d.observacion}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDetalleNota(${i}); return false;"><i class="bi bi-trash"></i></button></td>
        </tr>`);
    });
    $("#total_general_txt").val(formatearPY(total));
}

function eliminarDetalleNota(index){
    detallesNota.splice(index,1);
    renderDetallesNota();
}
window.eliminarDetalleNota = eliminarDetalleNota;

function imprimirNotaCredito(id){
  let datos = ejecutarAjax("controladores/nota_credito.php","leer_id="+id);
  if(datos === "0"){ alert("No se encontró la nota de crédito"); return; }
  let nota = JSON.parse(datos);

  let detData = ejecutarAjax("controladores/detalle_nota_credito.php","leer=1&id_nota_credito="+id);
  let detalles = detData === "0" ? [] : JSON.parse(detData);

  let filas = detalles.length
    ? detalles.map((d,i)=>`
      <tr>
        <td>${i+1}</td>
        <td>${d.producto || d.id_producto}</td>
        <td>${d.cantidad}</td>
        <td>${formatearPY(d.precio_unitario)}</td>
        <td>${formatearPY(d.total_linea)}</td>
        <td>${d.motivo || ''}</td>
      </tr>
    `).join('')
    : `<tr><td colspan="6">Sin ítems</td></tr>`;

  const estadoTxt = (nota.estado || "GENERADA");
  const estadoUC = String(estadoTxt).toUpperCase();
  const estadoBadge =
      estadoUC === "APROBADA" || estadoUC === "APROBADO" ? "bg-success" :
      estadoUC === "ANULADA"  || estadoUC === "ANULADO"  ? "bg-danger"  :
      "bg-warning text-dark";

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Nota de Crédito #${nota.id_nota_credito}</title>
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
        <h2 class="doc-title">Nota de Crédito #${nota.numero_nota}</h2>
        <div class="meta">
          Cliente: <strong>${nota.cliente || nota.id_cliente}</strong>
          &nbsp;·&nbsp; RUC: <strong>${nota.ruc_cliente || ""}</strong>
          &nbsp;·&nbsp; Estado: <span class="badge ${estadoBadge}">${estadoTxt}</span>
          &nbsp;·&nbsp; Fecha: <strong>${formatearFechaDMA(nota.fecha_emision)}</strong>
        </div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="lbl">Motivo General</div>
        <div class="val">${nota.motivo_general || ""}</div>
      </div>
      <div class="kpi">
        <div class="lbl">Total</div>
        <div class="val">${formatearPY(nota.total)}</div>
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
          <th>Motivo</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>

    <div class="total">
      Total General: ${formatearPY(nota.total)}
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
window.imprimirNotaCredito = imprimirNotaCredito;


function guardarNotaCredito(){
    if($("#id_cliente_lst").val() === ""){mensaje_dialogo_info_ERROR("Debe seleccionar un cliente","ERROR");return;}
    if($("#fecha_txt").val().trim().length === 0){mensaje_dialogo_info_ERROR("Debe ingresar la fecha","ERROR");return;}
    if(detallesNota.length === 0){mensaje_dialogo_info_ERROR("Debe agregar al menos un item","ERROR");return;}

  
    const motivoGeneral = $("#motivo_general_txt").val().trim();
if(motivoGeneral.length === 0){
    mensaje_dialogo_info_ERROR("Debe ingresar el Motivo General de la nota de crédito","ATENCIÓN");
    return;
}


    const faltantes = detallesNota
        .map((d,i)=>({index:i+1, motivo:(d.motivo||"").trim()}))
        .filter(x=>x.motivo.length === 0);

    if(faltantes.length > 0){
        mensaje_dialogo_info_ERROR(`Hay ${faltantes.length} ítem(s) sin motivo. Corrija antes de guardar.`, "ATENCIÓN");
        return;
    }

    let total = detallesNota.reduce((acc,d)=>acc+(parseFloat(d.total_linea)||0),0);

    let datos = {
        fecha_emision: $("#fecha_txt").val(),
        motivo_general: motivoGeneral, // ← usa el valor validado
        id_cliente: $("#id_cliente_lst").val(),
        ruc_cliente: $("#ruc_cliente_txt").val(),
        estado: $("#estado_txt").val(),
        total: total
    };
 



    let idNota = $("#id_nota_credito").val();
    if(idNota === "0"){
        idNota = ejecutarAjax("controladores/nota_credito.php","guardar="+JSON.stringify(datos));
        detallesNota.forEach(function(d){
            let det = { ...d, id_nota_credito: idNota };
            ejecutarAjax("controladores/detalle_nota_credito.php","guardar="+JSON.stringify(det));
        });
    }else{
        datos = { ...datos, id_nota_credito: idNota };
        ejecutarAjax("controladores/nota_credito.php","actualizar="+JSON.stringify(datos));
        ejecutarAjax("controladores/detalle_nota_credito.php","eliminar_por_nota="+idNota);
        detallesNota.forEach(function(d){
            let det = { ...d, id_nota_credito: idNota };
            ejecutarAjax("controladores/detalle_nota_credito.php","guardar="+JSON.stringify(det));
        });
    }
    mensaje_confirmacion("Guardado correctamente");
    mostrarListarNotaCredito();
}

window.guardarNotaCredito = guardarNotaCredito;

function cargarTablaNotaCredito(){
    let datos = ejecutarAjax("controladores/nota_credito.php","leer=1");
    if(datos === "0"){
        $("#nota_credito_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#nota_credito_datos_tb").html("");
        json.map(function(it){
            $("#nota_credito_datos_tb").append(`
                <tr>
                    <td>${it.id_nota_credito}</td>
                    <td>${it.numero_nota}</td>
                    <td>${it.fecha_emision}</td>
                    <td>${it.cliente}</td>
                    <td>${formatearPY(it.total)}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-info btn-sm imprimir-nota" title="Imprimir"><i class="bi bi-printer"></i></button>
                        <button class="btn btn-warning btn-sm editar-nota" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-nota" title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}
window.cargarTablaNotaCredito = cargarTablaNotaCredito;

function buscarNotaCredito(){
    let b = $("#b_nota_credito").val();
    let datos = ejecutarAjax("controladores/nota_credito.php","leer_descripcion="+b);
    if(datos === "0"){
        $("#nota_credito_datos_tb").html("NO HAY REGISTROS");
    }else{
        let json = JSON.parse(datos);
        $("#nota_credito_datos_tb").html("");
        json.map(function(it){
            $("#nota_credito_datos_tb").append(`
                <tr>
                    <td>${it.id_nota_credito}</td>
                    <td>${it.numero_nota}</td>
                    <td>${it.fecha_emision}</td>
                    <td>${it.cliente}</td>
                    <td>${formatearPY(it.total)}</td>
                    <td>${badgeEstado(it.estado)}</td>
                    <td>
                        <button class="btn btn-info btn-sm imprimir-nota" title="Imprimir"><i class="bi bi-printer"></i></button>
                        <button class="btn btn-warning btn-sm editar-nota" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-nota" title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}
window.buscarNotaCredito = buscarNotaCredito;

$(document).on("click",".imprimir-nota",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    imprimirNotaCredito(id);
});

$(document).on("click",".editar-nota",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    mostrarAgregarNotaCredito();
    setTimeout(function(){
        let datos=ejecutarAjax("controladores/nota_credito.php","leer_id="+id);
        let json=JSON.parse(datos);
        $("#id_nota_credito").val(json.id_nota_credito);
        $("#id_cliente_lst").val(json.id_cliente).trigger('change');
        $("#fecha_txt").val(json.fecha_emision);
        $("#motivo_general_txt").val(json.motivo_general);
        $("#numero_nota_txt").val(json.numero_nota);
        $("#ruc_cliente_txt").val(json.ruc_cliente);
        $("#estado_txt").val(json.estado);
        let det=ejecutarAjax("controladores/detalle_nota_credito.php","leer=1&id_nota_credito="+id);
        if(det !== "0"){
            detallesNota=JSON.parse(det).map(d=>({id_producto:d.id_producto,producto:d.producto,descripcion:d.descripcion,cantidad:d.cantidad,precio_unitario:d.precio_unitario,subtotal:d.subtotal,total_linea:d.total_linea,motivo:d.motivo,observacion:d.observacion}));
        }else{
            detallesNota=[];
        }
        renderDetallesNota();
    },100);
});

$(document).on("click",".anular-nota",function(){
    let id=$(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
        title:"¿Anular nota de crédito?",
        text:"Esta acción marcará la nota como anulada.",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText:"Sí, anular",
        cancelButtonText:"Cancelar",
        confirmButtonColor:"#dc3545",
        cancelButtonColor:"#6c757d",
        reverseButtons:true
    }).then((result)=>{
        if(result.isConfirmed){
            ejecutarAjax("controladores/nota_credito.php","anular="+id);
            mensaje_confirmacion("Anulado correctamente");
            cargarTablaNotaCredito();
        }
    });
});
