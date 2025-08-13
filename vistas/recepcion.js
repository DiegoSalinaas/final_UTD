// ========================= Variables globales =========================
let detallesRecepcion = [];
let listaClientes = [];

function renderAccionesRecepcion(estado){
  const bloqueado = ['DIAGNOSTICADO','CERRADA'].includes((estado || '').toUpperCase());
  const attr = bloqueado ? ' style="opacity:.5;pointer-events:none;"' : '';
  return `
            <button class="btn btn-info btn-sm imprimir-recepcion" title="Imprimir"><i class="bi bi-printer"></i></button>
            <button class="btn btn-warning btn-sm editar-recepcion" title="Editar"${attr}><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-danger btn-sm cerrar-recepcion" title="Cerrar"${attr}><i class="bi bi-x-circle"></i></button>`;
}

// ========================= Navegación =========================
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
  initAccesoriosUI(); // Inicializa chips de accesorios
}
window.mostrarAgregarRecepcion = mostrarAgregarRecepcion;

// ========================= Clientes =========================
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
    const ruc = c.ruc ?? c.ruc_cliente ?? '';
    $sel.append(`<option value="${id}" data-ruc="${ruc}" data-nombre="${nom}">${nom}</option>`);
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
  const c = listaClientes.find(x =>
    String(x.id_cliente ?? x.cod_cliente ?? x.id) === String(id)
  );
  const tel = c?.telefono ?? c?.telefono_cliente ?? '';
  const dir = c?.direccion ?? c?.direccion_cliente ?? '';
  $('#telefono_txt').val(tel);
  $('#direccion_txt').val(dir);
});

// Abrir modal para agregar nuevo cliente
$(document).on('click', '#nuevo_cliente_btn', function(){
  const contenido = dameContenido('paginas/referenciales/cliente/agregar.php');
  const $modal = $('#modal_nuevo_cliente');
  $modal.find('.modal-body').html(contenido);
  // reemplazar acciones de los botones del formulario cargado
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

  // Obtener ID del nuevo cliente usando el RUC
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

// ========================= Accesorios entregados (chips) =========================
let accesoriosTmp = []; // array temporal de accesorios para el equipo en edición

function renderAccesoriosChips(){
  const $wrap = $("#accesorios_chips");
  if(accesoriosTmp.length === 0){
    $wrap.html('<span class="text-muted">Sin accesorios agregados.</span>');
    return;
  }
  const chips = accesoriosTmp.map((a,i)=>`
    <span class="badge bg-light text-dark border me-2 mb-2">
      ${a}
      <button type="button" class="btn btn-sm btn-link text-danger p-0 ms-1 remove-chip" data-i="${i}" title="Quitar">
        <i class="bi bi-x-circle"></i>
      </button>
    </span>
  `).join("");
  $wrap.html(chips);
}

function normalizarAccesorio(txt){ return txt.replace(/\s+/g,' ').trim(); }

function agregarAccesorioDesdeInput(){
  const raw = $("#accesorio_input").val() || "";
  const candidatos = raw.split(",").map(normalizarAccesorio).filter(Boolean);

  let agregados = 0;
  candidatos.forEach(item=>{
    const dup = accesoriosTmp.some(x => x.toLowerCase() === item.toLowerCase());
    if(!dup){ accesoriosTmp.push(item); agregados++; }
  });

  if(agregados === 0 && candidatos.length > 0){
    mensaje_dialogo_info_ERROR("Ese accesorio ya fue agregado o es inválido.","ATENCIÓN");
  }
  $("#accesorio_input").val("");
  renderAccesoriosChips();
}

// Click en botón Agregar
$(document).on("click", "#add_accesorio_btn", agregarAccesorioDesdeInput);

// Enter en el input
$(document).on("keydown", "#accesorio_input", function(e){
  if(e.key === "Enter"){ e.preventDefault(); agregarAccesorioDesdeInput(); }
});

// Quitar chip
$(document).on("click", ".remove-chip", function(){
  accesoriosTmp.splice($(this).data("i"),1);
  renderAccesoriosChips();
});

// Inicializar UI de accesorios (al abrir el formulario o tras guardar un equipo)
function initAccesoriosUI(){
  accesoriosTmp = [];
  $("#accesorio_input").val("");
  renderAccesoriosChips();
}

// ========================= Detalle de recepción (equipos) =========================
function agregarDetalleRecepcion(){
  if($("#nombre_equipo_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar el nombre del equipo","ERROR");return;}
  if($("#marca_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la marca","ERROR");return;}
  if($("#modelo_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar el modelo","ERROR");return;}
  if($("#numero_serie_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar el número de serie","ERROR");return;}
  if($("#falla_txt").val().trim().length===0){mensaje_dialogo_info_ERROR("Debe ingresar la falla reportada","ERROR");return;}

  const detalle = {
    nombre_equipo: $("#nombre_equipo_txt").val().trim(),
    marca: $("#marca_txt").val().trim(),
    modelo: $("#modelo_txt").val().trim(),
    numero_serie: $("#numero_serie_txt").val().trim(),
    falla_reportada: $("#falla_txt").val().trim(),
    accesorios_entregados: accesoriosTmp.join(", "), // chips -> string
    diagnostico_preliminar: $("#diagnostico_txt").val().trim(),
    observaciones_detalle: $("#observaciones_detalle_txt").val().trim()
  };

  detallesRecepcion.push(detalle);
  renderDetallesRecepcion();

  // limpiar para el siguiente equipo
  $("#nombre_equipo_txt, #marca_txt, #modelo_txt, #numero_serie_txt, #falla_txt, #diagnostico_txt, #observaciones_detalle_txt").val('');
  initAccesoriosUI();
}
window.agregarDetalleRecepcion = agregarDetalleRecepcion;

function renderDetallesRecepcion(){
  let tbody = $("#detalle_recepcion_tb");
  tbody.html('');
  detallesRecepcion.forEach((d,i)=>{
    tbody.append(`<tr>
      <td>${d.nombre_equipo}</td>
      <td>${d.marca}</td>
      <td>${d.modelo}</td>
      <td>${d.numero_serie}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarDetalleRecepcion(${i}); return false;">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>`);
  });
}

function eliminarDetalleRecepcion(index){
  detallesRecepcion.splice(index,1);
  renderDetallesRecepcion();
}
window.eliminarDetalleRecepcion = eliminarDetalleRecepcion;

// ========================= Guardar recepción =========================
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

// ========================= Tabla / Búsqueda =========================
function cargarTablaRecepcion(){
  const filtros = {
    leer: 1,
    buscar: $("#b_recepcion").val(),
    estado: $("#estado_filtro").val(),
    desde: $("#f_desde").val(),
    hasta: $("#f_hasta").val()
  };

  let datos = ejecutarAjax("controladores/recepcion.php", filtros);
  const $tb = $("#recepcion_datos_tb");
  if(datos === "0"){
    $tb.html("NO HAY REGISTROS");
    $("#recepcion_count").text(0);
  }else{
    let json = JSON.parse(datos);
    $tb.html('');
    json.forEach(function(it){
      const acciones = renderAccionesRecepcion(it.estado);
      $tb.append(`
        <tr>
          <td>${it.id_recepcion}</td>
          <td>${it.fecha_recepcion}</td>
          <td>${it.nombre_cliente}</td>
          <td>${it.telefono}</td>
          <td>${it.direccion}</td>
          <td>${badgeEstado(it.estado)}</td>
          <td>${acciones}</td>
        </tr>`);
    });
    $("#recepcion_count").text(json.length);
  }
}

// Eventos de filtros
$(document).on('input', '#b_recepcion', cargarTablaRecepcion);
$(document).on('change', '#estado_filtro, #f_desde, #f_hasta', cargarTablaRecepcion);
$(document).on('click', '#limpiar_busqueda_btn', function(){
  $('#b_recepcion').val('');
  $('#estado_filtro').val('');
  $('#f_desde').val('');
  $('#f_hasta').val('');
  cargarTablaRecepcion();
});

// ========================= Impresión =========================
function imprimirRecepcion(id, auto = true, copias = 1){
  const datos = ejecutarAjax("controladores/recepcion.php","leer_id="+id);
  if(datos === "0"){ alert("Recepción no encontrada"); return; }
  const rec = JSON.parse(datos);

  const detData = ejecutarAjax("controladores/detalle_recepcion.php","leer=1&id_recepcion="+id);
  const detalles = detData === "0" ? [] : JSON.parse(detData);

  const filas = detalles.length ? detalles.map((d,i)=>`
    <tr>
      <td class="text-center">${i+1}</td>
      <td class="text-start">${d.nombre_equipo || ""}</td>
      <td class="text-start">${d.marca || ""}</td>
      <td class="text-start">${d.modelo || ""}</td>
      <td class="text-start">${d.numero_serie || ""}</td>
      <td class="text-start">${(d.falla_reportada || "").toString()}</td>
      <td class="text-start">${(d.accesorios_entregados || "").toString()}</td>
      <td class="text-start">${(d.diagnostico_preliminar || "").toString()}</td>
      <td class="text-start">${(d.observaciones_detalle || "").toString()}</td>
    </tr>
  `).join("") : `<tr><td colspan="9" class="text-center">Sin equipos</td></tr>`;

  const estadoTxt = rec.estado || "ACTIVO";
  const estUC = String(estadoTxt).toUpperCase();
  const estadoBadge =
      estUC === "ANULADO"       ? "bg-danger" :
      estUC === "DIAGNOSTICADO" ? "bg-info text-dark" :
      estUC === "PENDIENTE"     ? "bg-warning text-dark" :
      estUC === "CERRADA"       ? "bg-primary" :
      estUC === "ACTIVO"        ? "bg-success" :
                                  "bg-secondary";

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
        ${estUC === "ANULADO" ? `<div class="watermark">ANULADO</div>` : ""}

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
            <div class="doc-tipo">RECEPCIÓN</div>
            <div class="doc-num">#${rec.id_recepcion}</div>
            <span class="badge ${estadoBadge}">${estadoTxt}</span>
            <div class="doc-fecha">${formatearFechaDMA(rec.fecha_recepcion)}</div>
            <span class="copia">${etiqueta}</span>
          </div>
        </header>

        <div class="doc-info">
          <div class="pair"><span class="lbl">Cliente:</span> <span class="val">${rec.nombre_cliente || ""}</span></div>
          <div class="pair"><span class="lbl">Tel.:</span>    <span class="val">${rec.telefono || ""}</span></div>
          <div class="pair"><span class="lbl">Dirección:</span> <span class="val">${rec.direccion || "—"}</span></div>
          <div class="pair"><span class="lbl">Equipos:</span> <span class="val">${detalles.length}</span></div>
          ${rec.observaciones ? `<div class="observ"><span class="lbl">Obs.:</span> <span class="val">${rec.observaciones}</span></div>` : ""}
        </div>

        <table class="tabla">
          <thead>
            <tr>
              <th class="text-center" style="width:50px">#</th>
              <th class="text-start">Equipo</th>
              <th class="text-start" style="width:120px">Marca</th>
              <th class="text-start" style="width:140px">Modelo</th>
              <th class="text-start" style="width:140px">N° Serie</th>
              <th class="text-start">Falla Reportada</th>
              <th class="text-start">Accesorios</th>
              <th class="text-start">Diagnóstico</th>
              <th class="text-start">Observaciones</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>

        <div class="firmas">
          <div class="fbox"><div class="linea"></div><div class="ftxt">Recibido por</div></div>
          <div class="fbox"><div class="linea"></div><div class="ftxt">Cliente</div></div>
          <div class="fbox"><div class="linea"></div><div class="ftxt">Técnico</div></div>
        </div>

        <footer class="doc-footer">Documento generado automáticamente — ${new Date().toLocaleString()}</footer>
      </section>
    `);
  }

  const v = window.open('', '', 'width=1024,height=720');
  v.document.write(`
  <html>
  <head>
    <title>Recepción #${rec.id_recepcion}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      @page { size: A4; margin: 14mm; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { color:#111; font-family: "Segoe UI", Arial, sans-serif; }
      .doc { position: relative; page-break-after: always; }
      .doc:last-of-type { page-break-after: auto; }

      /* Header alineado (logo | empresa | doc) */
      .doc-header{
        display:grid;
        grid-template-columns: auto 1fr auto;
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

      /* Repetir encabezado/pie en cada página impresa */
      thead{ display: table-header-group; }
      tfoot{ display: table-footer-group; }

      /* Firmas y footer */
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
window.imprimirRecepcion = imprimirRecepcion;


// ========================= Acciones tabla =========================
$(document).on("click",".editar-recepcion",function(){
  const estado = $(this).closest("tr").find("td:eq(5)").text().trim().toUpperCase();
  if(estado === "DIAGNOSTICADO" || estado === "CERRADA"){
    const msg = estado === "CERRADA"
      ? "La recepción ya está cerrada y no se puede editar ni cerrar."
      : "El campo está siendo utilizado y no se puede editar ni cerrar.";
    Swal.fire("Atención",msg,"info");
    return;
  }
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
    // Accesorios: si necesitás editar por-detalle, podés usar setAccesoriosFromString(d.accesorios_entregados) al seleccionar el detalle.
  },100);
});

$(document).on("click",".imprimir-recepcion",function(){
  let id=$(this).closest("tr").find("td:eq(0)").text();
  imprimirRecepcion(id);
});

$(document).on("click",".cerrar-recepcion",function(){
  const estado = $(this).closest("tr").find("td:eq(5)").text().trim().toUpperCase();
  if(estado === "DIAGNOSTICADO" || estado === "CERRADA"){
    const msg = estado === "CERRADA"
      ? "La recepción ya está cerrada y no se puede editar ni cerrar."
      : "El campo está siendo utilizado y no se puede editar ni cerrar.";
    Swal.fire("Atención",msg,"info");
    return;
  }
  let id=$(this).closest("tr").find("td:eq(0)").text();
  Swal.fire({
    title:"¿Cerrar recepción?",
    text:"Esta acción marcará la recepción como cerrada.",
    icon:"warning",
    showCancelButton:true,
    confirmButtonText:"Sí, eliminar",
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
