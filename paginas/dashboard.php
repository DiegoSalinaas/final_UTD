<div class="container-fluid">
  <!-- Summary Cards -->
  <div class="row g-3 mb-4">
    <div class="col-sm-6 col-xl-3">
      <a href="#" class="text-decoration-none" onclick="mostrarListarProveedor(); return false;">
        <div class="card text-bg-primary h-100">
          <div class="card-body d-flex align-items-center">
            <i class="bi bi-truck fs-1 me-3"></i>
            <div>
              <h6 class="card-title mb-0">Proveedores</h6>
              <p class="fs-4 mb-0">0</p>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div class="col-sm-6 col-xl-3">
      <a href="#" class="text-decoration-none" onclick="mostrarListarCliente(); return false;">
        <div class="card text-bg-success h-100">
          <div class="card-body d-flex align-items-center">
            <i class="bi bi-people fs-1 me-3"></i>
            <div>
              <h6 class="card-title mb-0">Clientes</h6>
              <p class="fs-4 mb-0">0</p>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div class="col-sm-6 col-xl-3">
      <a href="#" class="text-decoration-none" onclick="mostrarListarPresupuestos(); return false;">
        <div class="card text-bg-warning h-100">
          <div class="card-body d-flex align-items-center">
            <i class="bi bi-clipboard-data fs-1 me-3"></i>
            <div>
              <h6 class="card-title mb-0">Presupuestos</h6>
              <p class="fs-4 mb-0">0</p>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div class="col-sm-6 col-xl-3">
      <a href="#" class="text-decoration-none" onclick="mostrarListarOrdenes(); return false;">
        <div class="card text-bg-info h-100">
          <div class="card-body d-flex align-items-center">
            <i class="bi bi-receipt fs-1 me-3"></i>
            <div>
              <h6 class="card-title mb-0">Órdenes de Compra</h6>
              <p class="fs-4 mb-0">0</p>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div class="col-sm-6 col-xl-3">
      <a href="#" class="text-decoration-none" onclick="mostrarListarRemision(); return false;">
        <div class="card text-bg-secondary h-100">
          <div class="card-body d-flex align-items-center">
            <i class="bi bi-truck-front fs-1 me-3"></i>
            <div>
              <h6 class="card-title mb-0">Remisiones</h6>
              <p class="fs-4 mb-0">0</p>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div class="col-sm-6 col-xl-3">
      <a href="#" class="text-decoration-none" onclick="mostrarListarNotaCredito(); return false;">
        <div class="card text-bg-danger h-100">
          <div class="card-body d-flex align-items-center">
            <i class="bi bi-file-earmark-minus fs-1 me-3"></i>
            <div>
              <h6 class="card-title mb-0">Notas de Crédito</h6>
              <p class="fs-4 mb-0">0</p>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>

  <!-- Charts -->
  <div class="row g-3 mb-4">
    <div class="col-lg-6">
      <div class="card">
        <div class="card-header">Compras y Ventas por mes</div>
        <div class="card-body"><div id="chart-compras-ventas"></div></div>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="card">
        <div class="card-header">Órdenes de compra por estado</div>
        <div class="card-body"><div id="chart-ordenes-estado"></div></div>
      </div>
    </div>
  </div>
  <div class="row g-3 mb-4">
    <div class="col-lg-12">
      <div class="card">
        <div class="card-header">Servicios abiertos por tipo</div>
        <div class="card-body"><div id="chart-servicios"></div></div>
      </div>
    </div>
  </div>

  <!-- Tables -->
  <div class="row g-3 mb-4">
    <div class="col-lg-4">
      <div class="card h-100">
        <div class="card-header">Últimos Presupuestos de Compra</div>
        <div class="card-body p-0">
          <div class="table-responsive" style="max-height:200px;">
            <table class="table mb-0">
              <thead><tr><th>Fecha</th><th>Proveedor</th><th>Monto</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>-</td><td>-</td><td>-</td><td>-</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card h-100">
        <div class="card-header">Últimas Órdenes de Compra</div>
        <div class="card-body p-0">
          <div class="table-responsive" style="max-height:200px;">
            <table class="table mb-0">
              <thead><tr><th>Fecha</th><th>Nro</th><th>Proveedor</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>-</td><td>-</td><td>-</td><td>-</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card h-100">
        <div class="card-header">Últimas Recepciones de Servicio</div>
        <div class="card-body p-0">
          <div class="table-responsive" style="max-height:200px;">
            <table class="table mb-0">
              <thead><tr><th>Fecha</th><th>Cliente</th><th>Equipo</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>-</td><td>-</td><td>-</td><td>-</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="row g-3">
    <div class="col-md-3">
      <button class="btn btn-primary w-100" onclick="mostrarAgregarPresupuesto(); return false;">Crear nuevo presupuesto</button>
    </div>
    <div class="col-md-3">
      <button class="btn btn-success w-100" onclick="mostrarAgregarOrden(); return false;">Emitir nueva orden de compra</button>
    </div>
    <div class="col-md-3">
      <button class="btn btn-info w-100" onclick="mostrarAgregarRecepcion(); return false;">Registrar recepción de servicio</button>
    </div>
    <div class="col-md-3">
      <button class="btn btn-danger w-100" onclick="mostrarAgregarNotaCredito(); return false;">Emitir nota de crédito</button>
    </div>
  </div>
</div>

<script>
  var opcionesBarra = {
    chart: {type: 'bar', height: 300},
    series: [
      {name: 'Compras', data: [10,20,15,30,25,35]},
      {name: 'Ventas', data: [5,15,10,25,20,30]}
    ],
    xaxis: {categories: ['Ene','Feb','Mar','Abr','May','Jun']}
  };
  var chart1 = new ApexCharts(document.querySelector('#chart-compras-ventas'), opcionesBarra);
  chart1.render();

  var opcionesPie = {
    chart: {type: 'pie', height: 300},
    series: [44,33,23],
    labels: ['Pendiente','Aprobado','Anulado']
  };
  var chart2 = new ApexCharts(document.querySelector('#chart-ordenes-estado'), opcionesPie);
  chart2.render();

  var opcionesHBar = {
    chart: {type: 'bar', height: 300},
    plotOptions: {bar: {horizontal: true}},
    series: [{data: [5,3,4]}],
    xaxis: {categories: ['Cliente A','Cliente B','Cliente C']}
  };
  var chart3 = new ApexCharts(document.querySelector('#chart-servicios'), opcionesHBar);
  chart3.render();
</script>
