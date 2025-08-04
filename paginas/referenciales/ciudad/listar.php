<div class="container mt-4">
  <div class="card shadow-sm border-0 rounded-4 p-4 bg-white">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">
        <i class="bi bi-geo-alt-fill icono-tecnologia"></i> Listado de Ciudades
      </h4>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="imprimirCiudades(); return false;">
          <i class="bi bi-printer-fill me-1"></i> Imprimir
        </button>
        <button class="btn btn-primary" onclick="mostrarAgregarCiudad(); return false;">
          <i class="bi bi-plus-circle me-1"></i> Agregar
        </button>
      </div>
    </div>

    <!-- Buscador -->
    <div class="row g-3 align-items-end mb-3">
      <div class="col-md-8">
        <label for="b_ciudad" class="form-label">
          <i class="bi bi-search icono-tecnologia"></i> Buscador
        </label>
        <input type="text" id="b_ciudad" class="form-control" placeholder="Buscar Ciudades...">
      </div>
      <div class="col-md-4">
        <button class="btn btn-dark w-100" onclick="buscarCiudad(); return false;">
          <i class="bi bi-search me-1"></i> Buscar
        </button>
      </div>
    </div>

    <!-- Cards -->
    <div class="row mt-4" id="datos_card">
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-header text-muted small rounded-top-4">
            Ciudad #<span class="id_ciudad_edicion">1</span>
          </div>
          <div class="card-body">
            <h5 class="card-title fw-bold">NOMBRE CIUDAD</h5>
            <p class="mb-1"><i class="bi bi-diagram-3"></i> Departamento: <strong>Nombre Departamento</strong></p>
            <span class="badge bg-success mb-3">Activo</span>
            <hr>
            <div class="d-flex justify-content-between">
              <button class="btn btn-outline-danger w-100 me-1">
                <i class="bi bi-x-lg"></i>
              </button>
              <button class="btn btn-outline-warning w-100 me-1">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-outline-primary w-100 imprimir-ciudad">
                <i class="bi bi-camera"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Más tarjetas dinámicas acá -->
    </div>
  </div>
</div>
