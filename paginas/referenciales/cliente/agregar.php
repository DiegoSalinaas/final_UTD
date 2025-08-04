<div class="container mt-4">
  <input type="hidden" id="id_cliente" value="0">

  <div class="card shadow-lg rounded-4 border-0">
    <div class="card-header bg-success text-white rounded-top-4">
      <h4 class="mb-0">
        <i class="bi bi-person-plus-fill me-2"></i> Agregar / Editar Cliente
      </h4>
    </div>

    <div class="card-body">
      <div class="row g-4">
        <!-- Nombre y Apellido -->
        <div class="col-md-6">
          <label for="nombre_txt" class="form-label fw-semibold">Nombre y Apellido</label>
          <input type="text" id="nombre_txt" class="form-control" placeholder="Ej. María López">
        </div>

        <!-- RUC -->
        <div class="col-md-6">
          <label for="ruc_txt" class="form-label fw-semibold">RUC</label>
          <input type="text" id="ruc_txt" class="form-control" placeholder="Ej. 1234567-8">
        </div>

        <!-- Dirección -->
        <div class="col-md-6">
          <label for="direccion_txt" class="form-label fw-semibold">Dirección</label>
          <input type="text" id="direccion_txt" class="form-control" placeholder="Ej. Calle 4 y Gral. Díaz">
        </div>

        <!-- Teléfono -->
        <div class="col-md-6">
          <label for="telefono_txt" class="form-label fw-semibold">Teléfono</label>
          <input type="text" id="telefono_txt" class="form-control" placeholder="Ej. 0981 123456">
        </div>

        <!-- Ciudad -->
        <div class="col-md-6">
          <label for="ciudad_lst" class="form-label fw-semibold">Ciudad</label>
          <select id="ciudad_lst" class="form-select">
            <option value="">-- Seleccione una ciudad --</option>
            <!-- Opciones dinámicas -->
          </select>
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
      <button class="btn btn-success me-2 shadow-sm" onclick="guardarCliente(); return false;">
        <i class="bi bi-save me-1"></i> Guardar
      </button>
      <button class="btn btn-danger shadow-sm" onclick="mostrarListarCliente(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
    </div>
  </div>
</div>
