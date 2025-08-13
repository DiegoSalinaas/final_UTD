<div class="container mt-4">
  <input type="hidden" id="id_punto" value="0">
  <div class="card shadow rounded-4">
    <div class="card-header bg-success text-white rounded-top-4">
      <h4 class="mb-0"><i class="bi bi-geo-fill me-2"></i> Agregar / Editar Punto</h4>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-6">
          <label for="nombre_txt" class="form-label">Nombre</label>
          <input type="text" id="nombre_txt" class="form-control" placeholder="Ej: Punto Central">
        </div>
        <div class="col-md-6">
          <label for="direccion_txt" class="form-label">Dirección</label>
          <input type="text" id="direccion_txt" class="form-control" placeholder="Ej: Calle 1 Nro 123">
        </div>
        <div class="col-md-6">
          <label for="ciudad_lst" class="form-label">Ciudad</label>
          <select id="ciudad_lst" class="form-select">
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
      <button class="btn btn-success me-2" onclick="guardarPunto(); return false;">
        <i class="bi bi-save me-1"></i> Guardar
      </button>
      <button class="btn btn-danger" onclick="mostrarListarPuntos(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
    </div>
  </div>
</div>
