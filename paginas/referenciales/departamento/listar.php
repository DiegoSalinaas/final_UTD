<div class="container mt-4">
  <div class="seccion-con-banner shadow-sm rounded-4 position-relative">
    

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">
        <i class="bi bi-map icono-tecnologia"></i> Listado de Departamentos
      </h4>
      <button class="btn boton-agregar" onclick="mostrarAgregarDepartamento(); return false;">
        <i class="bi bi-plus-circle me-1"></i> Agregar
      </button>
    </div>

    <div class="card border-0 bg-white bg-opacity-75 rounded-4 shadow-sm">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-8">
            <label for="b_departamento" class="form-label">
              <i class="bi bi-search icono-tecnologia"></i> Buscador
            </label>
            <input type="text" id="b_departamento" class="form-control" placeholder="Buscar por Descripción o Estado...">
          </div>
          <div class="col-md-4">
            <button class="btn btn-dark w-100" onclick="buscarDepartamento(); return false;">
              <i class="bi bi-search me-1"></i> Buscar
            </button>
          </div>
        </div>

        <div class="table-responsive mt-4">
          <table class="table table-bordered table-hover align-middle text-center table-modern">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Descripción</th>
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
