<div class="container mt-4">
  <input type="hidden" id="id_nota_credito" value="0">
  <input type="hidden" id="estado_txt" value="ACTIVO">

  <div class="card shadow rounded-4 border-0">
    <div class="card-header bg-primary text-white rounded-top-4 d-flex justify-content-between align-items-center">
      <h4 class="mb-0"><i class="bi bi-receipt me-2"></i> Agregar / Editar Nota de Crédito</h4>
    </div>

    <div class="card-body">
      <!-- Bloque 1: Datos del cliente -->
      <div class="mb-2 border-bottom pb-2">
        <h6 class="text-secondary fw-bold mb-3"><i class="bi bi-person-lines-fill me-2"></i>Datos del cliente</h6>
        <div class="row g-3">
          <div class="col-12 col-md-5">
            <label for="id_cliente_lst" class="form-label">Cliente</label>
            <select id="id_cliente_lst" class="form-select"></select>
          </div>
          <div class="col-6 col-md-3">
            <label for="ruc_cliente_txt" class="form-label">RUC</label>
            <input type="text" id="ruc_cliente_txt" class="form-control" readonly>
          </div>
          <div class="col-6 col-md-2">
            <label for="fecha_txt" class="form-label">Fecha</label>
            <input type="date" id="fecha_txt" class="form-control" value="<?php echo date('Y-m-d'); ?>">
          </div>
          <div class="col-12 col-md-2">
            <label for="total_general_txt" class="form-label">Total</label>
            <div class="input-group">
              <span class="input-group-text">Gs.</span>
              <input type="text" id="total_general_txt" class="form-control text-end" readonly value="0">
            </div>
          </div>
        </div>
      </div>

      <!-- Bloque 2: Datos de la nota -->
      <div class="mb-2 border-bottom pb-2">
        <h6 class="text-secondary fw-bold mb-3"><i class="bi bi-info-circle me-2"></i>Datos de la nota</h6>
        <div class="row g-3">
          <div class="col-12">
            <label for="motivo_general_txt" class="form-label">Motivo General</label>
            <input type="text" id="motivo_general_txt" class="form-control" placeholder="Ej.: Devolución parcial por producto defectuoso">
          </div>
        </div>
      </div>

      <!-- Bloque 3: Agregar ítem -->
      <div>
        <h6 class="text-secondary fw-bold mb-3"><i class="bi bi-plus-square me-2"></i>Agregar ítem</h6>
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label for="id_producto_lst" class="form-label">Producto</label>
            <select id="id_producto_lst" class="form-select"></select>
          </div>
          <div class="col-12 col-md-4">
            <label for="descripcion_txt" class="form-label">Descripción</label>
            <input type="text" id="descripcion_txt" class="form-control" readonly>
          </div>
          <div class="col-6 col-md-2">
            <label for="cantidad_txt" class="form-label">Cantidad</label>
            <input type="number" id="cantidad_txt" class="form-control text-end" min="1" placeholder="0">
          </div>
          <div class="col-6 col-md-2">
            <label for="precio_unitario_txt" class="form-label">Precio Unitario</label>
            <div class="input-group">
              <span class="input-group-text">Gs.</span>
              <input type="number" id="precio_unitario_txt" class="form-control text-end" min="0.01" step="0.01" placeholder="0">
            </div>
          </div>
        </div>

        <div class="row g-3 mt-1">
          <div class="col-6 col-md-2">
            <label for="subtotal_txt" class="form-label">Subtotal</label>
            <div class="input-group">
              <span class="input-group-text">Gs.</span>
              <input type="number" id="subtotal_txt" class="form-control text-end" readonly>
            </div>
          </div>
          <div class="col-12 col-md-5">
            <label for="motivo_item_txt" class="form-label">Motivo</label>
            <input type="text" id="motivo_item_txt" class="form-control" placeholder="Motivo específico del ítem">
          </div>
          <div class="col-12 col-md-4">
            <label for="observacion_txt" class="form-label">Observación</label>
            <input type="text" id="observacion_txt" class="form-control" placeholder="Observaciones adicionales">
          </div>
          <div class="col-12 col-md-1 d-grid align-items-end">
            <button class="btn btn-primary mt-4" onclick="agregarDetalleNotaCredito(); return false;">
              <i class="bi bi-plus-lg"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer pegajoso con acciones -->
    <div class="card-footer bg-light rounded-bottom-4 position-sticky bottom-0">
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-success" onclick="guardarNotaCredito(); return false;">
          <i class="bi bi-save me-1"></i> Guardar
        </button>
        <button class="btn btn-danger" onclick="mostrarListarNotaCredito(); return false;">
          <i class="bi bi-x-circle me-1"></i> Cancelar
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Tabla de detalles -->
<div class="container mt-4">
  <div class="card shadow-sm rounded-4 border-0">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-sm table-striped table-hover align-middle text-center mb-0">
          <thead class="table-light">
            <tr>
              <th>Producto</th>
              <th>Descripción</th>
              <th class="text-end">Cantidad</th>
              <th class="text-end">Precio Unit.</th>
              <th class="text-end">Subtotal</th>
              <th>Motivo</th>
              <th>Observación</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="detalle_nota_tb"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>
