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

function cargarListaClientes(selectedId = ""){
    let datos = ejecutarAjax("controladores/cliente.php","leer=1");
    if(datos !== "0"){
        listaClientes = JSON.parse(datos);
        let select = $("#id_cliente_lst");
        select.html('<option value="">-- Seleccione un cliente --</option>');
        listaClientes.forEach(c => select.append(`
          <option value="${c.id_cliente}" data-ruc="${c.ruc}">
            ${c.nombre_apellido} | ruc: ${c.ruc}
          </option>`));
        if(selectedId){ select.val(selectedId).trigger('change'); }
    }
}

$(document).on('change','#id_cliente_lst',function(){
    let ruc = $("#id_cliente_lst option:selected").data('ruc') || '';
    $('#ruc_cliente_txt').val(ruc);
});

// Abrir modal para agregar nuevo cliente
$(document).on('click', '#nuevo_cliente_btn', function(){
    const contenido = dameContenido('paginas/referenciales/cliente/agregar.php');
    const $modal = $('#modal_nuevo_cliente');
    $modal.find('.modal-body').html(contenido);
    $modal.find('.btn-success').attr('onclick','guardarClienteDesdeModal(); return false;');
    $modal.find('.btn-danger').attr('onclick',"$('#modal_nuevo_cliente').modal('hide'); return false;");
    cargarListaCiudad('#modal_nuevo_cliente #ciudad_lst');
    $modal.modal('show');
});

function guardarClienteDesdeModal(){
    const $m = $('#modal_nuevo_cliente');
    const nombre = $m.find('#nombre_txt').val().trim();
    const ruc = $m.find('#ruc_txt').val().trim();
    const dir = $m.find('#direccion_txt').val().trim();
    const tel = $m.find('#telefono_txt').val().trim();
    const ciudad = $m.find('#ciudad_lst').val();
    const estado = $m.find('#estado_lst').val();

    if(nombre.length===0){ mensaje_dialogo_info_ERROR('Debes ingresar el nombre y apellido', 'ATENCION'); return; }
    if(ruc.length===0){ mensaje_dialogo_info_ERROR('Debes ingresar el RUC', 'ATENCION'); return; }
    if(dir.length===0){ mensaje_dialogo_info_ERROR('Debes ingresar la Direccion', 'ATENCION'); return; }
    if(tel.length===0){ mensaje_dialogo_info_ERROR('Debes ingresar el Telefono', 'ATENCION'); return; }
    if(ciudad==="0" || ciudad===""){ mensaje_dialogo_info_ERROR('Debes ingresar la ciudad', 'ATENCION'); return; }
    if(!/^[0-9\-]+$/.test(ruc)){ mensaje_dialogo_info_ERROR('El RUC solo puede contener números y guiones (-)', 'ATENCIÓN'); return; }
    if(!/^[0-9+]+$/.test(tel)){ mensaje_dialogo_info_ERROR('El teléfono solo puede contener números y el símbolo +', 'ATENCIÓN'); return; }

    let datos={
        nombre_apellido:nombre,
        ruc:ruc,
        direccion:dir,
        id_ciudad:ciudad,
        telefono:tel,
        estado:estado
    };

    let res = ejecutarAjax('controladores/cliente.php','guardar='+JSON.stringify(datos));
    if(res === 'duplicado'){ mensaje_dialogo_info_ERROR('El RUC ya esta registrado con otro cliente', 'ATENCION'); return; }
    mensaje_confirmacion('Guardado correctamente');

    let nuevoId = '';
    let consulta = ejecutarAjax('controladores/cliente.php','leer_descripcion='+ruc);
    if(consulta !== '0'){
        let js = JSON.parse(consulta);
        let found = js.find(c=>c.ruc===ruc);
        if(found) nuevoId = found.id_cliente;
    }

    $m.modal('hide');
    cargarListaClientes(nuevoId);
}
window.guardarClienteDesdeModal = guardarClienteDesdeModal;

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

function imprimirNotaCredito(id, copias = 1, auto = true) {
  const ncJson = ejecutarAjax("controladores/nota_credito.php","leer_id="+id);
  if (ncJson === "0") { alert("No se encontró la nota de crédito"); return; }
  const nota = JSON.parse(ncJson);

  const detJson = ejecutarAjax("controladores/detalle_nota_credito.php","leer=1&id_nota_credito="+id);
  const detalles = detJson === "0" ? [] : JSON.parse(detJson);

  const est = (nota.estado || "GENERADA");
  const estUC = est.toUpperCase();
  const estadoBadge =
    estUC.includes("APROB") ? "bg-success" :
    estUC.includes("ANUL")  ? "bg-danger"  :
    "bg-warning text-dark";

  const filas = detalles.length ? detalles.map((d,i)=>`
    <tr>
      <td class="text-center">${i+1}</td>
      <td class="text-start">${d.producto || d.id_producto || ""}</td>
      <td class="text-end">${fmt0(toNumberPY(d.cantidad))}</td>
      <td class="text-end">${formatearPY(toNumberPY(d.precio_unitario))}</td>
      <td class="text-end">${formatearPY(toNumberPY(d.total_linea))}</td>
      <td class="text-start">${d.motivo ? String(d.motivo) : ""}</td>
    </tr>
  `).join("") : `<tr><td colspan="6" class="text-center">Sin ítems</td></tr>`;

  // Datos de empresa (ajusta a tu realidad)
  const EMPRESA = {
    nombre: "HARD INFORMATICA S.A.",
    ruc: "84945944-4",
    dir: "Av. Siempre Viva 123 - Asunción",
    tel: "(021) 376-548",
    email: "ventas@hardinformatica.com"
  };

  const etiquetas = ["ORIGINAL", "DUPLICADO", "TRIPLICADO", "COPIA 4"];
  const bloques = [];
  for (let i = 0; i < Math.max(1, copias); i++) {
    const etiqueta = etiquetas[i] || `COPIA ${i+1}`;
    bloques.push(`
      <section class="doc">
        ${estUC.includes("ANUL") ? `<div class="watermark">ANULADO</div>` : ""}

        <header class="doc-header">
          <div class="doc-logo"><img src="images/logo.png" alt="Logo" onerror="this.style.display='none'"></div>
          <div class="doc-empresa">
            <h1>${EMPRESA.nombre}</h1>
            <div class="emp-meta">
              RUC: ${EMPRESA.ruc} &nbsp;•&nbsp; ${EMPRESA.dir}<br>
              Tel.: ${EMPRESA.tel} &nbsp;•&nbsp; ${EMPRESA.email}
            </div>
          </div>
          <div class="doc-right">
            <div class="doc-tipo">NOTA DE CRÉDITO</div>
            <div class="doc-num">#${nota.numero_nota || nota.id_nota_credito}</div>
            <span class="badge ${estadoBadge}">${est}</span>
            <div class="doc-fecha">${formatearFechaDMA(nota.fecha_emision)}</div>
            <span class="copia">${etiqueta}</span>
          </div>
        </header>

        <div class="doc-info">
          <div class="pair"><span class="lbl">Cliente:</span> <span class="val">${nota.cliente || nota.id_cliente || ""}</span></div>
          <div class="pair"><span class="lbl">RUC:</span>     <span class="val">${nota.ruc_cliente || ""}</span></div>
          <div class="pair"><span class="lbl">Moneda:</span>  <span class="val">PYG</span></div>
          <div class="pair"><span class="lbl">Total:</span>    <span class="val">${formatearPY(toNumberPY(nota.total))}</span></div>
          ${nota.motivo_general ? `<div class="observ"><span class="lbl">Motivo:</span> <span class="val">${nota.motivo_general}</span></div>` : ""}
        </div>

        <table class="tabla">
          <thead>
            <tr>
              <th class="text-center" style="width:60px">#</th>
              <th class="text-start">Producto</th>
              <th class="text-end" style="width:90px">Cantidad</th>
              <th class="text-end" style="width:110px">Precio Unit.</th>
              <th class="text-end" style="width:120px">Subtotal</th>
              <th class="text-start" style="width:180px">Motivo</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>

        <div class="total">Total General: ${formatearPY(toNumberPY(nota.total))}</div>

        <div class="firmas">
          <div class="fbox"><div class="linea"></div><div class="ftxt">Emitido por</div></div>
          <div class="fbox"><div class="linea"></div><div class="ftxt">Autorizado por</div></div>
          <div class="fbox"><div class="linea"></div><div class="ftxt">Cliente</div></div>
        </div>

        <footer class="doc-footer">Documento generado automáticamente — ${new Date().toLocaleString()}</footer>
      </section>
    `);
  }

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Nota de Crédito #${nota.numero_nota || nota.id_nota_credito}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      @page { size: A4; margin: 14mm; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { color:#111; font-family: "Segoe UI", Arial, sans-serif; }
      .doc { position: relative; page-break-after: always; }
      .doc:last-of-type { page-break-after: auto; }

      /* Header alineado */
      .doc-header{
        display:grid;
        grid-template-columns: auto 1fr auto; /* logo | empresa | doc */
        align-items:center;
        gap:16px;
        border-bottom:2px solid #0d6efd;
        padding-bottom:10px;
        margin-bottom:14px;
      }
      .doc-logo img{ height:70px; display:block; }
      .doc-empresa{ display:flex; flex-direction:column; justify-content:center; }
      .doc-empresa h1{ font-size:20px; font-weight:800; margin:0 0 4px 0; letter-spacing:.2px; text-align:center; }
      .emp-meta{ font-size:12px; color:#555; line-height:1.35; text-align:center; }

      .doc-right{ text-align:right; display:flex; flex-direction:column; gap:6px; align-items:flex-end; }
      .doc-right .doc-tipo{ font-size:14px; font-weight:700; color:#0d6efd; letter-spacing:1.2px; }
      .doc-right .doc-num{ font-size:18px; font-weight:800; }
      .doc-right .doc-fecha{ font-size:12px; color:#555; }
      .doc-right .badge{ font-size:12px; }
      .doc-right .copia{
        background:#f1f3f5; border:1px solid #dee2e6; padding:2px 8px; border-radius:12px; font-size:11px;
      }

      /* Info en pares */
      .doc-info{
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap:6px 12px;
        margin-bottom:10px;
        font-size:13px;
        align-items:center;
      }
      .doc-info .pair{ display:flex; align-items:center; gap:6px; white-space:nowrap; }
      .doc-info .lbl{ color:#6c757d; min-width:90px; font-weight:600; }
      .doc-info .val{ font-weight:600; }
      .doc-info .observ{ grid-column: 1 / -1; }

      /* Tabla */
      table.tabla{ width:100%; border-collapse:collapse; margin-top:10px; }
      .tabla thead th{
        background:#e9f2ff;
        border:1px solid #cfe2ff !important;
        font-weight:700;
        padding:6px 8px;
      }
      .tabla td{
        border:1px solid #e9ecef;
        padding:7px 8px;
        font-size:12.5px;
        vertical-align:top;
      }
      .text-center{text-align:center;} .text-start{text-align:left;} .text-end{text-align:right;}
      thead{ display: table-header-group; }
      tfoot{ display: table-footer-group; }

      /* Total y firmas */
      .total{ margin-top:14px; font-size:16px; font-weight:700; text-align:right; }
      .firmas{ display:grid; grid-template-columns: repeat(3, 1fr); gap:22px; margin-top:18px; }
      .firmas .linea{ border-bottom:1px solid #000; height:28px; }
      .firmas .ftxt{ text-align:center; font-size:12px; color:#444; margin-top:6px; }

      .doc-footer{ margin-top:10px; font-size:11px; color:#6c757d; text-align:right; }

      /* Watermark ANULADO */
      .watermark{
        position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
        font-size:100px; opacity:0.07; transform: rotate(-22deg); font-weight:900; color:#dc3545;
        pointer-events:none; user-select:none;
      }

      @media print { .no-print{ display:none !important; } }
    </style>
  </head>
  <body>
    ${bloques.join("")}
    <script>${auto ? "window.print();" : ""}</script>
  </body>
  </html>`);
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
    const buscar = $("#b_nota_credito").val();
    const estado = $("#estado_filtro").val();
    const fDesde = $("#f_desde").val();
    const fHasta = $("#f_hasta").val();

    let datos = ejecutarAjax("controladores/nota_credito.php", `leer=1&buscar=${encodeURIComponent(buscar)}&estado=${estado}&f_desde=${fDesde}&f_hasta=${fHasta}`);

    if(datos === "0"){
        $("#nota_credito_datos_tb").html("NO HAY REGISTROS");
        $("#nota_credito_count").text("0");
    }else{
        let json = JSON.parse(datos);
        $("#nota_credito_datos_tb").html("");
        $("#nota_credito_count").text(json.length);
        json.map(function(it){
            const disabled = it.estado === 'ANULADO' ? 'disabled' : '';
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
                        <button class="btn btn-warning btn-sm editar-nota" ${disabled} title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm anular-nota" ${disabled} title="Anular"><i class="bi bi-x-circle"></i></button>
                    </td>
                </tr>`);
        });
    }
}
window.cargarTablaNotaCredito = cargarTablaNotaCredito;

// Filtros
$(document).on('input', '#b_nota_credito', cargarTablaNotaCredito);
$(document).on('change', '#estado_filtro', cargarTablaNotaCredito);
$(document).on('change', '#f_desde, #f_hasta', cargarTablaNotaCredito);

$(document).on('click', '#limpiar_busqueda_btn', function(){
    $('#b_nota_credito').val('');
    $('#estado_filtro').val('');
    $('#f_desde').val('');
    $('#f_hasta').val('');
    cargarTablaNotaCredito();
});

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
