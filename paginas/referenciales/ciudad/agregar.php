<div class="container mt-4">
  <input type="hidden" id="id_ciudad" value="0">
  <div class="card shadow rounded-4">
    <div class="card-header bg-success text-white rounded-top-4">
      <h4 class="mb-0"><i class="bi bi-geo-alt-fill me-2"></i> Agregar / Editar Ciudad</h4>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-6">
          <label for="descripcion_txt" class="form-label">Nombre de Ciudad</label>
          <input type="text" id="descripcion_txt" class="form-control" placeholder="Ej: Encarnación">
        </div>
        <div class="col-md-6">
          <label for="departamento_lst" class="form-label">Departamento</label>
          <select id="departamento_lst" class="form-select">
            <!-- Opciones dinámicas -->
          </select>
        </div>
        <div class="col-md-6">
          <label for="estado_lst" class="form-label">Estado</label>
          <select id="estado_lst" class="form-select">
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>
      </div>
    </div>
    <div class="card-footer text-end">
      <button class="btn btn-success me-2" onclick="guardarCiudad(); return false;">
        <i class="bi bi-save me-1"></i> Guardar
      </button>
      <button class="btn btn-danger" onclick="mostrarListarCiudad(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
    </div>
  </div>
</div>
