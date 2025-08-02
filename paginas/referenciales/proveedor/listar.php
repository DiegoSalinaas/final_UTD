<div class="container mt-4">
  <div class="seccion-con-banner shadow-sm rounded-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">
        <i class="bi bi-diagram-3 icono-tecnologia"></i> Listado de Proveedores
      </h4>
      <button class="btn boton-agregar" onclick="mostrarAgregarProveedor(); return false;">
        <i class="bi bi-plus-circle me-1"></i> Agregar
      </button>
    </div>

    <div class="card border-0 bg-white bg-opacity-75 rounded-4 shadow-sm">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-8">
            <label for="b_proveedor" class="form-label">
              <i class="bi bi-search icono-tecnologia"></i> Buscador
            </label>
            <input type="text" id="b_proveedor" class="form-control" placeholder="Buscar proveedores...">
          </div>
          <div class="col-md-4">
            <button class="btn btn-dark w-100" onclick="buscarProveedor(); return false;">
              <i class="bi bi-search me-1"></i> Buscar
            </button>
          </div>
        </div>

        <div class="table-responsive mt-4">
          <table class="table table-bordered table-hover align-middle text-center bg-white rounded-3">
            <thead class="table-light">
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
            <tbody id="datos_tb"></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
