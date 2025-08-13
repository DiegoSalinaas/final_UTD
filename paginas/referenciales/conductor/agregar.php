<div class="container mt-4">
  <input type="hidden" id="id_conductor" value="0">
  <div class="card shadow-lg rounded-4 border-0">
    <div class="card-header bg-success text-white rounded-top-4">
      <h4 class="mb-0"><i class="bi bi-person-vcard me-2"></i> Agregar / Editar Conductor</h4>
    </div>
    <div class="card-body">
      <div class="row g-4">
        <div class="col-md-6">
          <label for="nombre_txt" class="form-label fw-semibold">Nombre</label>
          <input type="text" id="nombre_txt" class="form-control" placeholder="Ej. Juan Pérez">
        </div>
        <div class="col-md-6">
          <label for="cedula_txt" class="form-label fw-semibold">Cédula</label>
          <input type="text" id="cedula_txt" class="form-control" placeholder="Ej. 1234567">
        </div>
        <div class="col-md-6">
          <label for="telefono_txt" class="form-label fw-semibold">Teléfono</label>
          <input type="text" id="telefono_txt" class="form-control" placeholder="Ej. 0981 123456">
        </div>
        <div class="col-md-6">
          <label for="licencia_txt" class="form-label fw-semibold">Licencia de Conducción</label>
          <input type="text" id="licencia_txt" class="form-control" placeholder="Ej. B">
        </div>
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
      <button class="btn btn-success me-2" onclick="guardarConductor(); return false;">
        <i class="bi bi-save me-1"></i> Guardar
      </button>
      <button class="btn btn-danger" onclick="mostrarListarConductor(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
    </div>
  </div>
</div>
