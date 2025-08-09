<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Listado de Diagnósticos</h4>
    <button class="btn btn-primary" onclick="mostrarAgregarDiagnostico(); return false;"><i class="bi bi-plus-circle"></i> Agregar</button>
  </div>
  <div class="card border-0 bg-light bg-opacity-75 rounded-4 shadow-sm mb-4">
    <div class="card-body">
      <div class="row g-3 align-items-end">
        <div class="col-md-12">
          <label for="b_diagnostico" class="form-label fw-semibold">
            <i class="bi bi-search me-2"></i> Buscar diagnóstico
          </label>
          <input type="text" id="b_diagnostico" class="form-control form-control-lg" placeholder="Buscar por cliente, recepción, fecha o estado...">
        </div>
      </div>
    </div>
  </div>
  <div class="card shadow-sm rounded-4">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle text-center">
          <thead class="table-light">
            <tr><th>#</th><th>Recepción</th><th>Fecha</th><th>Estado</th><th>Operaciones</th></tr>
          </thead>
          <tbody id="diagnostico_datos_tb"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>
