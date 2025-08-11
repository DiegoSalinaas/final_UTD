<div class="container my-4">
  <!-- Hidden -->
  <input type="hidden" id="id_orden" value="0">
  <input type="hidden" id="id_proveedor">

  <!-- Encabezado -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0 text-success fw-bold d-flex align-items-center">
      <i class="bi bi-clipboard-plus me-2"></i> Agregar / Editar Orden de Compra
    </h3>
    <span class="badge text-bg-light border shadow-sm">
      Estado: <strong class="ms-1">Borrador</strong>
    </span>
  </div>

  <!-- Card Único: Datos + Detalle + Total + Acciones -->
  <div class="card shadow rounded-4 border-0">
    <!-- Sección: Datos de la orden -->
    <div class="card-header bg-light rounded-top-4">
      <h6 class="mb-0 text-secondary d-flex align-items-center">
        <i class="bi bi-info-circle me-2"></i>Datos de la orden
      </h6>
    </div>
    <div class="card-body p-4">
      <div class="row g-4">
        <!-- Presupuesto -->
        <div class="col-md-6">
          <label for="id_presupuesto_lst" class="form-label fw-semibold">Presupuesto</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-receipt"></i></span>
            <select id="id_presupuesto_lst" class="form-select"></select>
          </div>
          <div class="form-text">Selecciona el presupuesto base de esta orden.</div>
        </div>

        <!-- Proveedor (readonly) -->
        <div class="col-md-6">
          <label for="proveedor_txt" class="form-label fw-semibold">Proveedor</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-building"></i></span>
            <input type="text" id="proveedor_txt" class="form-control bg-light" readonly>
          </div>
        </div>

        <!-- Fecha -->
        <div class="col-md-4">
          <label for="fecha_txt" class="form-label fw-semibold">Fecha</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
            <input type="date" id="fecha_txt" class="form-control" placeholder="Fecha">
          </div>
        </div>
      </div>
    </div>

    <!-- Sección: Agregar producto -->
    <div class="px-4">
      <hr class="my-0">
    </div>
    <div class="card-body p-4 pb-3">
      <h6 class="mb-3 text-secondary d-flex align-items-center">
        <i class="bi bi-box-seam me-2"></i>Agregar producto a la orden
      </h6>
      <div class="row g-4 align-items-end">
        <!-- Producto -->
        <div class="col-md-6">
          <label for="id_producto_lst" class="form-label fw-semibold">Producto</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-box"></i></span>
            <select id="id_producto_lst" class="form-select"></select>
          </div>
        </div>

        <!-- Cantidad -->
        <div class="col-md-2">
          <label for="cantidad_txt" class="form-label fw-semibold">Cantidad</label>
          <input type="number" id="cantidad_txt" class="form-control text-end" min="0" inputmode="numeric" placeholder="0">
        </div>

        <!-- Precio Unitario (con Gs.) -->
        <div class="col-md-2">
          <label for="precio_unitario_txt" class="form-label fw-semibold">Precio Unitario</label>
          <div class="input-group">
            <span class="input-group-text">Gs.</span>
            <input type="text" id="precio_unitario_txt" class="form-control text-end" inputmode="numeric" placeholder="0">
          </div>
        </div>

        <!-- Subtotal (readonly con Gs.) -->
        <div class="col-md-2">
          <label for="subtotal_txt" class="form-label fw-semibold">Subtotal</label>
          <div class="input-group">
            <span class="input-group-text">Gs.</span>
            <input type="text" id="subtotal_txt" class="form-control bg-light text-end" placeholder="0" readonly>
          </div>
        </div>

        <!-- Botón agregar -->
        <div class="col-12 col-md-3 col-lg-2 d-grid">
          <button class="btn btn-outline-primary" onclick="agregarProductoExtra(); return false;">
            <i class="bi bi-plus-lg me-1"></i> Agregar
          </button>
        </div>
      </div>
    </div>

    <!-- Sección: Tabla detalle -->
    <div class="card-body pt-0 px-4">
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle text-center mb-0">
          <thead class="table-primary position-sticky top-0" style="z-index:1;">
            <tr>
              <th style="width: 40%">Producto</th>
              <th class="text-end" style="width: 12%">Cantidad</th>
              <th class="text-end" style="width: 20%">Precio Unitario</th>
              <th class="text-end" style="width: 20%">Subtotal</th>
              <th style="width: 8%">Acción</th>
            </tr>
          </thead>
          <tbody id="detalle_oc_tb">
            <!-- filas detalle -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer: Total + Acciones -->
    <div class="card-footer bg-white rounded-bottom-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="small text-muted">
            <i class="bi bi-info-circle me-1"></i>La suma del total se actualiza automáticamente según el detalle.
          </div>
        </div>
        <div class="col-md-3 ms-auto">
          <label for="total_oc_txt" class="form-label fw-semibold mb-1">Total de la orden</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-cash-coin"></i></span>
            <input type="text" id="total_oc_txt" class="form-control bg-light fw-bold text-end" placeholder="0" readonly>
          </div>
        </div>
        <div class="col-12 col-md-3 d-flex justify-content-end gap-2">
          <button class="btn btn-danger" onclick="mostrarListarOrdenes(); return false;">
            <i class="bi bi-x-circle me-1"></i> Cancelar
          </button>
          <button class="btn btn-success" onclick="guardarOrden(); return false;">
            <i class="bi bi-save me-1"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Ajustes finos -->
<style>
  .card { overflow: hidden; }
  .form-label { margin-bottom: .35rem; }
  .table thead th { white-space: nowrap; }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
  .text-end { text-align: end !important; }
</style>
