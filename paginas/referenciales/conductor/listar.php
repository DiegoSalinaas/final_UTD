<div class="container mt-4">
  <div class="shadow-lg rounded-4 p-4 bg-white bg-opacity-75 position-relative">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-primary fw-bold mb-0">
        <i class="bi bi-person-vcard me-2"></i> Conductores
      </h3>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary shadow-sm d-flex align-items-center" onclick="imprimirConductores(); return false;">
          <i class="bi bi-printer-fill me-2"></i> Imprimir
        </button>
        <button class="btn btn-success shadow-sm d-flex align-items-center" onclick="mostrarAgregarConductor(); return false;">
          <i class="bi bi-plus-circle me-2"></i> Nuevo Conductor
        </button>
      </div>
    </div>

    <div class="card border-0 bg-light bg-opacity-75 rounded-4 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-12">
            <label for="b_conductor" class="form-label fw-semibold">
              <i class="bi bi-search me-2"></i> Buscar conductor
            </label>
            <input type="text" id="b_conductor" class="form-control form-control-lg" placeholder="Buscar por nombre, cédula o teléfono...">
          </div>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle text-center border rounded-4 overflow-hidden shadow-sm">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Teléfono</th>
            <th>Licencia</th>
            <th>Estado</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody id="datos_tb">
        </tbody>
      </table>
    </div>
  </div>
</div>
