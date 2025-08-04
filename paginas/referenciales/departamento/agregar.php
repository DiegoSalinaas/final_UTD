<div class="container mt-4">
  <input type="hidden" id="id_departamento" value="0">

  <div class="card shadow-lg rounded-4 border-0">
    <div class="card-header bg-success text-white rounded-top-4">
      <h4 class="mb-0">
        <i class="bi bi-map-fill me-2"></i> Agregar / Editar Departamento
      </h4>
    </div>

    <div class="card-body">
      <div class="row g-4">
        <!-- Descripción -->
        <div class="col-md-6">
          <label for="descripcion_txt" class="form-label fw-semibold">Descripción</label>
          <input type="text" id="descripcion_txt" class="form-control" placeholder="Ej. Central, Itapúa...">
        </div>

        <!-- Estado -->
        <div class="col-md-6">
          <label for="estado_lst" class="form-label fw-semibold">Estado</label>
          <select id="estado_lst" class="form-select">
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card-footer text-end bg-light rounded-bottom-4">
      <button class="btn btn-success me-2 shadow-sm" onclick="guardarDepartamento(); return false;">
        <i class="bi bi-save me-1"></i> Guardar
      </button>
      <button class="btn btn-danger shadow-sm" onclick="mostrarListarDepartamento(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
    </div>
  </div>
</div>
