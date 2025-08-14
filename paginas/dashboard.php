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
              <p class="fs-4 mb-0" id="total_proveedores">0</p>
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
              <p class="fs-4 mb-0" id="total_clientes">0</p>
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
              <p class="fs-4 mb-0" id="total_presupuestos">0</p>
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
              <p class="fs-4 mb-0" id="total_ordenes">0</p>
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
              <p class="fs-4 mb-0" id="total_remisiones">0</p>
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
              <p class="fs-4 mb-0" id="total_notas">0</p>
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
  <!-- Tables -->
  <div class="row g-3 mb-4">
    <div class="col-lg-4">
      <div class="card h-100">
        <div class="card-header">Últimos Presupuestos de Compra</div>
        <div class="card-body p-0">
          <div class="table-responsive" style="max-height:200px;">
            <table class="table mb-0">
              <thead><tr><th>Fecha</th><th>Proveedor</th><th>Monto</th><th>Estado</th></tr></thead>
              <tbody id="tbody_presupuestos">
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
              <tbody id="tbody_ordenes">
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
              <tbody id="tbody_recepciones">
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

