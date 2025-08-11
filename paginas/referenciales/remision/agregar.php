<div class="container my-4">
  <!-- Hidden -->
  <input type="hidden" id="id_remision" value="0">
  <input type="hidden" id="estado_txt" value="EMITIDO">

  <!-- Card: Cabecera de remisión -->
  <div class="card shadow rounded-4 border-0 mb-4">
    <div class="card-header bg-primary text-white rounded-top-4 d-flex align-items-center">
      <h4 class="mb-0"><i class="bi bi-truck me-2"></i> Agregar / Editar Remisión</h4>
    </div>

    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-6">
          <label for="id_cliente_lst" class="form-label fw-semibold">Cliente</label>
          <select id="id_cliente_lst" class="form-select" aria-label="Cliente"></select>
        </div>
        <div class="col-md-3">
          <label for="fecha_txt" class="form-label fw-semibold">Fecha</label>
          <input type="date" id="fecha_txt" class="form-control" value="<?php echo date('Y-m-d'); ?>">
        </div>
        <div class="col-md-3">
          <label for="observacion_txt" class="form-label fw-semibold">Observación</label>
          <input type="text" id="observacion_txt" class="form-control" placeholder="Opcional">
        </div>
      </div>
    </div>

    <div class="card-footer bg-light rounded-bottom-4 d-flex justify-content-end gap-2">
      <button class="btn btn-success" onclick="guardarRemision(); return false;">
        <i class="bi bi-save me-1"></i> Guardar
      </button>
      <button class="btn btn-outline-danger" onclick="mostrarListarRemision(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
    </div>
  </div>

  <!-- Card: Detalle de productos -->
  <div class="card shadow rounded-4 border-0">
    <div class="card-header bg-light rounded-top-4">
      <div class="d-flex align-items-center justify-content-between">
        <span class="fw-semibold"><i class="bi bi-box-seam me-2"></i>Detalle de productos</span>
        <span class="badge text-bg-primary" id="badge_items" title="Cantidad de ítems">0 ítems</span>
      </div>
    </div>

    <div class="card-body">
      <div class="row g-3 align-items-end mb-2">
        <div class="col-md-5">
          <label for="id_producto_lst" class="form-label fw-semibold">Producto</label>
          <select id="id_producto_lst" class="form-select" aria-label="Producto"></select>
        </div>

        <div class="col-md-2">
          <label for="cantidad_txt" class="form-label fw-semibold">Cantidad</label>
          <input type="number" id="cantidad_txt" class="form-control" min="1" placeholder="0">
        </div>

        <div class="col-md-2">
          <label for="precio_unitario_txt" class="form-label fw-semibold">Precio Unitario</label>
          <div class="input-group">
            <span class="input-group-text">Gs.</span>
            <input type="text" id="precio_unitario_txt" class="form-control" inputmode="numeric" placeholder="0">
          </div>
        </div>

        <div class="col-md-2">
          <label for="subtotal_txt" class="form-label fw-semibold">Subtotal</label>
          <div class="input-group">
            <span class="input-group-text">Gs.</span>
            <input type="text" id="subtotal_txt" class="form-control" readonly>
          </div>
        </div>

        <div class="col-md-1 d-grid">
          <button class="btn btn-primary" onclick="agregarDetalleRemision(); return false;">
            <i class="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle text-center mb-0">
          <thead class="table-primary position-sticky top-0" style="z-index: 1;">
            <tr>
              <th>Producto</th>
              <th class="text-end">Cantidad</th>
              <th class="text-end">Precio Unitario</th>
              <th class="text-end">Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="detalle_remision_tb">
            <!-- filas dinámicas -->
          </tbody>
          <tfoot class="table-light">
            <tr>
              <th colspan="3" class="text-end fw-bold">Total</th>
              <th id="total_general_txt" class="text-end fs-5">0</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Opcional: pequeños toques de estilo -->
<style>
  .card .form-label { margin-bottom: .35rem; }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
</style>
