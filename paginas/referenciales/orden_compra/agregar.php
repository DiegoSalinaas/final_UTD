<div class="container mt-4">
  <input type="hidden" id="id_orden" value="0">
  <input type="hidden" id="id_proveedor">

  <!-- Encabezado -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0 text-success fw-bold d-flex align-items-center">
      <i class="bi bi-clipboard-plus me-2"></i> Agregar / Editar Orden de Compra
    </h3>
    <span class="badge text-bg-light border shadow-sm">Estado: <strong class="ms-1">Borrador</strong></span>
  </div>

  <!-- Card principal -->
  <div class="card shadow-lg rounded-4 border-0">
    <div class="card-body p-4">
      <!-- Fila 1 -->
      <div class="row g-4">
        <div class="col-md-6">
          <label for="id_presupuesto_lst" class="form-label fw-semibold">Presupuesto</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-receipt"></i></span>
            <select id="id_presupuesto_lst" class="form-select"></select>
          </div>
          <div class="form-text">Selecciona el presupuesto base de esta orden.</div>
        </div>

        <div class="col-md-6">
          <label for="proveedor_txt" class="form-label fw-semibold">Proveedor</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-building"></i></span>
            <input type="text" id="proveedor_txt" class="form-control bg-light" readonly>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-floating">
            <input type="date" id="fecha_txt" class="form-control" placeholder="Fecha">
            <label for="fecha_txt">Fecha</label>
          </div>
        </div>
      </div>

      <!-- Fila 2: Detalle producto -->
      <div class="row g-4 mt-1">
        <div class="col-md-4">
          <label for="id_producto_lst" class="form-label fw-semibold">Producto</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-box-seam"></i></span>
            <select id="id_producto_lst" class="form-select"></select>
          </div>
        </div>

        <div class="col-md-2">
          <div class="form-floating">
            <input type="number" id="cantidad_txt" class="form-control" min="0" inputmode="numeric" placeholder="Cantidad">
            <label for="cantidad_txt">Cantidad</label>
          </div>
        </div>

        <div class="col-md-2">
          <div class="form-floating">
            <input type="number" step="0.01" id="precio_unitario_txt" class="form-control" inputmode="decimal" placeholder="Precio Unitario">
            <label for="precio_unitario_txt">Precio Unitario</label>
          </div>
        </div>

        <div class="col-md-2">
          <div class="form-floating">
            <input type="text" id="subtotal_txt" class="form-control bg-light" placeholder="Subtotal" readonly>
            <label for="subtotal_txt">Subtotal</label>
          </div>
        </div>

        <div class="col-md-2 d-grid">
          <button class="btn btn-outline-primary btn-lg" onclick="agregarProductoExtra(); return false;">
            <i class="bi bi-plus-lg me-1"></i> Agregar producto
          </button>
        </div>
      </div>
    </div>

    <div class="card-footer bg-light rounded-bottom-4 d-flex justify-content-end gap-2 py-3">
      <button class="btn btn-danger shadow-sm" onclick="mostrarListarOrdenes(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
      <button class="btn btn-success shadow-sm" onclick="guardarOrden(); return false;">
        <i class="bi bi-save me-1"></i> Guardar
      </button>
    </div>
  </div>
</div>

<!-- Tabla detalle -->
<div class="container mt-4">
  <div class="card shadow-sm rounded-4 border-0">
    <div class="card-header bg-white border-0 rounded-top-4">
      <h5 class="mb-0 fw-bold text-secondary d-flex align-items-center">
        <i class="bi bi-list-check me-2"></i> Detalle de productos
      </h5>
    </div>
    <div class="card-body pt-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle text-center mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 35%">Producto</th>
              <th style="width: 15%">Cantidad</th>
              <th style="width: 20%">Precio Unitario</th>
              <th style="width: 20%">Subtotal</th>
              <th style="width: 10%">Acción</th>
            </tr>
          </thead>
          <tbody id="detalle_oc_tb">
            <!-- filas detalle -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Resumen / Total -->
<div class="container mt-3">
  <div class="row justify-content-end">
    <div class="col-md-4">
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body">
          <label for="total_oc_txt" class="form-label fw-semibold mb-1">Total de la orden</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-cash-coin"></i></span>
            <input type="text" id="total_oc_txt" class="form-control bg-light fw-bold text-end" placeholder="0" readonly>
          </div>
          <div class="form-text">Suma de subtotales del detalle.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Ajustes finos -->
<style>
  .card { overflow: hidden; }
  .form-floating > .form-control:focus ~ label,
  .form-floating > .form-control:not(:placeholder-shown) ~ label { opacity: .85; }
</style>
