<div class="container mt-4">
  <input type="hidden" id="producto_id" value="0">

  <div class="card shadow-lg rounded-4 border-0">
    <div class="card-header bg-success text-white rounded-top-4">
      <h4 class="mb-0">
        <i class="bi bi-box-seam me-2"></i> Agregar / Editar Producto
      </h4>
    </div>

    <div class="card-body">
      <div class="row g-4">
        <!-- Nombre -->
        <div class="col-md-6">
          <label for="nombre_txt" class="form-label fw-semibold">Nombre del Producto</label>
          <input type="text" id="nombre_txt" class="form-control" placeholder="Ej. Monitor LED 24''">
        </div>

        <!-- Precio -->
        <div class="col-md-6">
          <label for="precio_txt" class="form-label fw-semibold">Precio (Gs.)</label>
          <input type="text" id="precio_txt" class="form-control" placeholder="0.00">
        </div>

        <!-- Tipo -->
        <div class="col-md-6">
          <label for="tipo_lst" class="form-label fw-semibold">Tipo</label>
          <select id="tipo_lst" class="form-select">
            <option value="0">-- Seleccione --</option>
            <option value="PRODUCTO">PRODUCTO</option>
            <option value="SERVICIO">SERVICIO</option>
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

        <!-- Descripción -->
        <div class="col-12">
          <label for="descripcion_txt" class="form-label fw-semibold">Descripción</label>
          <textarea id="descripcion_txt" class="form-control" rows="3" placeholder="Breve descripción del producto o servicio..."></textarea>
        </div>
      </div>
    </div>

    <div class="card-footer text-end bg-light rounded-bottom-4">
      <button class="btn btn-success me-2 shadow-sm" onclick="guardarProducto(); return false;">
        <i class="bi bi-save me-1"></i> Guardar
      </button>
      <button class="btn btn-danger shadow-sm" onclick="mostrarListarProductos(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
    </div>
  </div>
</div>
