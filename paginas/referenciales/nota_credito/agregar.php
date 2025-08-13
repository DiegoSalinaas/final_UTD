<div class="container my-4">
  <!-- Hidden -->
  <input type="hidden" id="id_nota_credito" value="0">
  <input type="hidden" id="estado_txt" value="ACTIVO">

  <!-- Encabezado de página -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0 text-success fw-bold d-flex align-items-center">
      <i class="bi bi-receipt me-2"></i> Agregar / Editar Nota de Crédito
    </h3>
    <span class="badge text-bg-light border shadow-sm">
      Estado: <strong class="ms-1">Borrador</strong>
    </span>
  </div>

  <!-- Card 1: CABECERA (Datos cliente + Datos nota) -->
  <div class="card shadow rounded-4 border-0 mb-4">
    <div class="card-header bg-light rounded-top-4">
      <h6 class="mb-0 text-secondary d-flex align-items-center">
        <i class="bi bi-info-circle me-2"></i>Datos de la nota
      </h6>
    </div>
    <div class="card-body p-4">
      <!-- Bloque: Datos del cliente -->
      <div class="mb-3">
        <h6 class="text-secondary fw-bold mb-3 d-flex align-items-center">
          <i class="bi bi-person-lines-fill me-2"></i>Datos del cliente
        </h6>
        <div class="row g-4">
          <div class="col-12 col-md-5">
            <label for="id_cliente_lst" class="form-label fw-semibold">Cliente</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-people"></i></span>
              <select id="id_cliente_lst" class="form-select"></select>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <label for="ruc_cliente_txt" class="form-label fw-semibold">RUC</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-file-earmark-text"></i></span>
              <input type="text" id="ruc_cliente_txt" class="form-control bg-light" readonly>
            </div>
          </div>
          <div class="col-6 col-md-2">
            <label for="fecha_txt" class="form-label fw-semibold">Fecha</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
              <input type="date" id="fecha_txt" class="form-control">
            </div>
          </div>
          <div class="col-12 col-md-2">
            <label for="total_general_txt" class="form-label fw-semibold">Total</label>
            <div class="input-group">
              <span class="input-group-text">Gs.</span>
              <input type="text" id="total_general_txt" class="form-control bg-light text-end fw-bold" value="0" readonly>
            </div>
          </div>
        </div>
      </div>

      <!-- Bloque: Datos de la nota -->
      <div>
        <h6 class="text-secondary fw-bold mb-3 d-flex align-items-center">
          <i class="bi bi-card-text me-2"></i>Datos de la nota
        </h6>
        <div class="row g-4">
          <div class="col-12">
            <label for="motivo_general_txt" class="form-label fw-semibold">Motivo General</label>
            <input type="text" id="motivo_general_txt" class="form-control" placeholder="Ej.: Devolución parcial por producto defectuoso">
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Card 2: DETALLE (Agregar ítem + Tabla + Footer con acciones/total) -->
  <div class="card shadow rounded-4 border-0">
    <div class="card-header bg-light rounded-top-4">
      <h6 class="mb-0 text-secondary d-flex align-items-center">
        <i class="bi bi-list-ul me-2"></i>Detalle de ítems
      </h6>
    </div>

    <!-- Fila de carga -->
    <div class="card-body p-4 pb-3">
      <h6 class="mb-3 text-secondary d-flex align-items-center">
        <i class="bi bi-plus-square me-2"></i>Agregar ítem
      </h6>
      <div class="row g-4 align-items-end">
        <div class="col-12 col-md-4">
          <label for="id_producto_lst" class="form-label fw-semibold">Producto</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-box-seam"></i></span>
            <select id="id_producto_lst" class="form-select"></select>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <label for="descripcion_txt" class="form-label fw-semibold">Descripción</label>
          <input type="text" id="descripcion_txt" class="form-control bg-light" readonly>
        </div>
        <div class="col-6 col-md-2">
          <label for="cantidad_txt" class="form-label fw-semibold">Cantidad</label>
          <input type="number" id="cantidad_txt" class="form-control text-end" min="1" placeholder="0" inputmode="numeric">
        </div>
        <div class="col-6 col-md-2">
          <label for="precio_unitario_txt" class="form-label fw-semibold">Precio Unitario</label>
          <div class="input-group">
            <span class="input-group-text">Gs.</span>
            <input type="text" id="precio_unitario_txt" class="form-control text-end" placeholder="0" inputmode="decimal">
          </div>
        </div>
      </div>

      <div class="row g-4 mt-1 align-items-end">
        <div class="col-6 col-md-2">
          <label for="subtotal_txt" class="form-label fw-semibold">Subtotal</label>
          <div class="input-group">
            <span class="input-group-text">Gs.</span>
            <input type="text" id="subtotal_txt" class="form-control bg-light text-end" readonly>
          </div>
        </div>
        <div class="col-12 col-md-5">
          <label for="motivo_item_txt" class="form-label fw-semibold">Motivo</label>
          <input type="text" id="motivo_item_txt" class="form-control" placeholder="Motivo específico del ítem">
        </div>
        <div class="col-12 col-md-4">
          <label for="observacion_txt" class="form-label fw-semibold">Observación</label>
          <input type="text" id="observacion_txt" class="form-control" placeholder="Observaciones adicionales">
        </div>
        <div class="col-12 col-md-1 d-grid">
          <button class="btn btn-outline-primary" onclick="agregarDetalleNotaCredito(); return false;">
            <i class="bi bi-plus-lg me-1"></i> Agregar
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card-body pt-0 px-4">
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle text-center mb-0">
          <thead class="table-primary position-sticky top-0" style="z-index:1;">
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

    <!-- Footer: Total + Acciones -->
    <div class="card-footer bg-white rounded-bottom-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="text-start small text-muted">
            <i class="bi bi-info-circle me-1"></i>La suma del total se actualiza automáticamente según el detalle.
          </div>
        </div>
        <div class="col-md-3 ms-auto">
          <label for="total_general_txt" class="form-label fw-semibold mb-1">Total de la nota</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-cash-coin"></i></span>
            <input type="text" id="total_general_txt" class="form-control bg-light fw-bold text-end" readonly value="0">
          </div>
        </div>
        <div class="col-12 col-md-3 d-flex justify-content-end gap-2">
          <button class="btn btn-danger" onclick="mostrarListarNotaCredito(); return false;">
            <i class="bi bi-x-circle me-1"></i> Cancelar
          </button>
          <button class="btn btn-success" onclick="guardarNotaCredito(); return false;">
            <i class="bi bi-save me-1"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Ajustes finos coherentes con el diseño base -->
<style>
  .card { overflow: hidden; }
  .form-label { margin-bottom: .35rem; }
  .table thead th { white-space: nowrap; }
  .text-end { text-align: end !important; }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
</style>
