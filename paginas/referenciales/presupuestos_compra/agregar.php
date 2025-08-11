<div class="container mt-4">
  <input type="hidden" id="id_presupuesto" value="0">
  <input type="hidden" id="id_detalle" value="0">

  <!-- Encabezado -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0 text-success fw-bold d-flex align-items-center">
      <i class="bi bi-pencil-square me-2"></i> Agregar / Editar Presupuesto
    </h3>
    <span class="badge text-bg-light border shadow-sm">Estado: <strong class="ms-1">Borrador</strong></span>
  </div>

  <!-- Card principal -->
  <div class="card shadow-lg rounded-4 border-0">
    <div class="card-body p-4">
      <div class="row g-4">
        <!-- Proveedor -->
        <div class="col-md-6">
          <label class="form-label fw-semibold" for="id_proveedor_lst">Proveedor</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-building"></i></span>
            <select id="id_proveedor_lst" class="form-select"></select>
          </div>
          <div class="form-text">Selecciona el proveedor para este presupuesto.</div>
        </div>

        <!-- Fecha -->
        <div class="col-md-6">
          <div class="form-floating">
            <input type="date" id="fecha_txt" class="form-control" placeholder="Fecha">
            <label for="fecha_txt">Fecha</label>
          </div>
        </div>

        <!-- Producto -->
        <div class="col-md-6">
          <label class="form-label fw-semibold" for="id_producto_lst">Producto</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-box-seam"></i></span>
            <select id="id_producto_lst" class="form-select"></select>
          </div>
          <div class="form-text">Elige el producto a presupuestar.</div>
        </div>

        <!-- Cantidad -->
        <div class="col-md-3">
          <div class="form-floating">
            <input type="number" id="cantidad_txt" class="form-control" min="0" inputmode="numeric" placeholder="Cantidad">
            <label for="cantidad_txt">Cantidad</label>
          </div>
        </div>

        <!-- Costo Unitario -->
        <div class="col-md-3">
          <div class="form-floating">
            <input type="number" step="0.01" id="precio_unitario_txt" class="form-control" inputmode="decimal" placeholder="Costo Unitario">
            <label for="precio_unitario_txt">Costo Unitario</label>
          </div>
        </div>

        <!-- Subtotal -->
        <div class="col-md-3">
          <div class="form-floating">
            <input type="text" id="subtotal_txt" class="form-control bg-light" placeholder="Subtotal" readonly>
            <label for="subtotal_txt">Subtotal</label>
          </div>
        </div>

        <!-- Botón agregar -->
        <div class="col-md-3 d-grid">
          <button class="btn btn-outline-primary btn-lg" onclick="agregarDetalle(); return false;">
            <i class="bi bi-plus-lg me-1"></i> Agregar producto
          </button>
        </div>
      </div>
    </div>

    <div class="card-footer bg-light rounded-bottom-4 d-flex justify-content-end gap-2 py-3">
      <button class="btn btn-danger shadow-sm" onclick="mostrarListarPresupuestos(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
      <button class="btn btn-success shadow-sm" onclick="guardarPresupuesto(); return false;">
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
        <i class="bi bi-list-ul me-2"></i> Detalle de productos
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
              <th style="width: 10%">Acciones</th>
            </tr>
          </thead>
          <tbody id="detalle_tb">
            <!-- Filas dinámicas -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Total -->
<div class="container mt-3">
  <div class="row justify-content-end">
    <div class="col-md-4">
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body">
          <label for="total_txt" class="form-label fw-semibold mb-1">Total estimado</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-cash-coin"></i></span>
            <input type="text" id="total_txt" class="form-control bg-light fw-bold text-end" placeholder="0" readonly>
          </div>
          <div class="form-text">Suma de subtotales del detalle.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Helper: formato y cálculo -->
<script>
function formatearPY(n) {
  return new Intl.NumberFormat('es-PY', { minimumFractionDigits: 0 }).format(Math.round(n || 0));
}

function recalcularSubtotal(){
  const cant = parseFloat($('#cantidad_txt').val()) || 0;
  const precio = quitarDecimalesConvertir($('#precio_unitario_txt').val()) || 0;
  const subtotal = cant * precio;
  $('#subtotal_txt').val(subtotal ? formatearPY(subtotal) : '');
}

$(document).on('input', '#cantidad_txt', function(){
  recalcularSubtotal();
});

$(document).on('input', '#precio_unitario_txt', function(){
  const n = quitarDecimalesConvertir($(this).val());
  $(this).val(n ? formatearPY(n) : '');
  recalcularSubtotal();
});
</script>

<!-- Ajustes finos opcionales -->
<style>
  .card { overflow: hidden; }
  .form-floating > .form-control:focus ~ label,
  .form-floating > .form-control:not(:placeholder-shown) ~ label {
    opacity: .85;
  }
</style>
