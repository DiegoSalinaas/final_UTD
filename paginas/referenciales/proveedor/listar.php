<div class="container mt-4">
  <div class="shadow-lg rounded-4 p-4 bg-white bg-opacity-75 position-relative">
    <!-- Título y botón -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-primary fw-bold mb-0">
        <i class="bi bi-diagram-3 me-2"></i> Proveedores
      </h3>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary shadow-sm d-flex align-items-center" onclick="imprimirProveedores(); return false;">
          <i class="bi bi-printer-fill me-2"></i> Imprimir
        </button>
        <button class="btn btn-success shadow-sm d-flex align-items-center" onclick="mostrarAgregarProveedor(); return false;">
          <i class="bi bi-plus-circle me-2"></i> Nuevo Proveedor
        </button>
      </div>
    </div>

    <!-- Buscador -->
    <div class="card border-0 bg-light bg-opacity-75 rounded-4 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-8">
            <label for="b_proveedor" class="form-label fw-semibold">
              <i class="bi bi-search me-2"></i> Buscar proveedor
            </label>
            <input type="text" id="b_proveedor" class="form-control form-control-lg" placeholder="Buscar por nombre, RUC, ciudad...">
          </div>
          <div class="col-md-4">
            <button class="btn btn-outline-primary btn-lg w-100 shadow-sm" onclick="buscarProveedor(); return false;">
              <i class="bi bi-search me-2"></i> Buscar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle text-center border rounded-4 overflow-hidden shadow-sm">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Razón Social</th>
            <th>RUC</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Estado</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody id="datos_tb">
          <!-- Contenido dinámico -->
        </tbody>
      </table>
    </div>
  </div>
</div>
