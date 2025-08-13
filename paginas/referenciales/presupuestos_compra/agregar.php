<div class="container my-4">
  <!-- Hidden -->
  <input type="hidden" id="id_presupuesto" value="0">
  <input type="hidden" id="id_detalle" value="0">

  <!-- Encabezado -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0 text-success fw-bold d-flex align-items-center">
      <i class="bi bi-pencil-square me-2"></i> Agregar / Editar Presupuesto
    </h3>
    <span class="badge text-bg-light border shadow-sm">
      Estado: <strong class="ms-1">Borrador</strong>
    </span>
  </div>

  <!-- Card 1: Datos del presupuesto -->
  <div class="card shadow rounded-4 border-0 mb-4">
    <div class="card-header bg-light rounded-top-4">
      <h6 class="mb-0 text-secondary d-flex align-items-center">
        <i class="bi bi-info-circle me-2"></i>Datos del presupuesto
      </h6>
    </div>
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
        <div class="col-md-3">
          <label class="form-label fw-semibold" for="fecha_txt">Fecha</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
            <input type="date" id="fecha_txt" class="form-control" placeholder="Fecha">
          </div>
        </div>

        <!-- Validez en días -->
        <div class="col-md-3">
          <label class="form-label fw-semibold" for="validez_txt">Validez (días)</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-hourglass-split"></i></span>
            <input type="number" id="validez_txt" class="form-control text-end" placeholder="0" min="0">
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Card 2: Detalle -->
  <div class="card shadow rounded-4 border-0">
    <div class="card-header bg-light rounded-top-4">
      <h6 class="mb-0 text-secondary d-flex align-items-center">
        <i class="bi bi-list-ul me-2"></i>Detalle de productos
      </h6>
    </div>

    <div class="card-body p-4">
      <!-- Fila de carga -->
      <div class="row g-4 align-items-end mb-1">
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
        <div class="col-md-2">
          <label class="form-label fw-semibold" for="cantidad_txt">Cantidad</label>
          <input
            type="text"
            id="cantidad_txt"
            class="form-control text-end"
            inputmode="numeric"
            placeholder="0"
            oninput="this.value = this.value.replace(/\D/g,'');"
          >
        </div>

        <!-- Costo Unitario -->
        <div class="col-md-2">
          <label class="form-label fw-semibold" for="precio_unitario_txt">Costo Unitario</label>
          <input
            type="text"
            id="precio_unitario_txt"
            class="form-control text-end"
            inputmode="decimal"
            placeholder="0"
            oninput="this.value = this.value.replace(/[^0-9.,]/g,'');"
          >
        </div>

        <!-- Subtotal -->
        <div class="col-md-2">
          <label class="form-label fw-semibold" for="subtotal_txt">Subtotal</label>
          <input type="text" id="subtotal_txt" class="form-control bg-light text-end" placeholder="0" readonly>
        </div>

        <!-- Botón agregar -->
        <div class="col-12 col-md-3 col-lg-2 d-grid mt-2">
          <button class="btn btn-outline-primary" onclick="agregarDetalle(); return false;">
            <i class="bi bi-plus-lg me-1"></i> Agregar
          </button>
        </div>
      </div>

      <!-- Tabla -->
      <div class="table-responsive mt-3">
        <table class="table table-striped table-hover align-middle text-center mb-0">
          <thead class="table-primary position-sticky top-0" style="z-index:1;">
            <tr>
              <th style="width: 35%">Producto</th>
              <th class="text-end" style="width: 15%">Cantidad</th>
              <th class="text-end" style="width: 20%">Precio Unitario</th>
              <th class="text-end" style="width: 20%">Subtotal</th>
              <th style="width: 10%">Acciones</th>
            </tr>
          </thead>
          <tbody id="detalle_tb">
            <!-- Filas dinámicas -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer: Total y Acciones -->
    <div class="card-footer bg-white rounded-bottom-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="text-start small text-muted">
            <i class="bi bi-info-circle me-1"></i>La suma del total se actualiza automáticamente según el detalle.
          </div>
        </div>
        <div class="col-md-3 ms-auto">
          <label for="total_txt" class="form-label fw-semibold mb-1">Total estimado</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-cash-coin"></i></span>
            <input type="text" id="total_txt" class="form-control bg-light fw-bold text-end" placeholder="0" readonly>
          </div>
        </div>
        <div class="col-12 col-md-3 d-flex justify-content-end gap-2">
          <button class="btn btn-danger" onclick="mostrarListarPresupuestos(); return false;">
            <i class="bi bi-x-circle me-1"></i> Cancelar
          </button>
          <button class="btn btn-success" onclick="guardarPresupuesto(); return false;">
            <i class="bi bi-save me-1"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Script: parseo y subtotal robusto -->
<script>
  // --- Helpers de número/formato (PY) ---
  function toNumberPY(v) {
    if (v == null) return 0;
    v = String(v).trim();
    if (v === "") return 0;
    const lastC = v.lastIndexOf(",");
    const lastD = v.lastIndexOf(".");
    const decIdx = Math.max(lastC, lastD);
    if (decIdx > -1) {
      const intPart  = v.slice(0, decIdx).replace(/[.,\\s]/g, "");
      const fracPart = v.slice(decIdx + 1).replace(/[^\\d]/g, "");
      return Number(intPart + "." + fracPart) || 0;
    }
    return Number(v.replace(/[.,\\s]/g, "")) || 0;
  }

  function fmt0(n) {
    return new Intl.NumberFormat('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      .format(Math.round(n || 0));
  }

  function fmt2(n) {
    return new Intl.NumberFormat('es-PY', { mini<div class="container my-4">
  <!-- Hidden -->
  <input type="hidden" id="id_presupuesto" value="0">
  <input type="hidden" id="id_detalle" value="0">

  <!-- Encabezado -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0 text-success fw-bold d-flex align-items-center">
      <i class="bi bi-pencil-square me-2"></i> Agregar / Editar Presupuesto
    </h3>
    <span class="badge text-bg-light border shadow-sm">
      Estado: <strong class="ms-1">Borrador</strong>
    </span>
  </div>

  <!-- Card 1: Datos del presupuesto -->
  <div class="card shadow rounded-4 border-0 mb-4">
    <div class="card-header bg-light rounded-top-4">
      <h6 class="mb-0 text-secondary d-flex align-items-center">
        <i class="bi bi-info-circle me-2"></i>Datos del presupuesto
      </h6>
    </div>
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
        <div class="col-md-3">
          <label class="form-label fw-semibold" for="fecha_txt">Fecha</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
            <input type="date" id="fecha_txt" class="form-control" placeholder="Fecha">
          </div>
        </div>

        <!-- Validez en días -->
        <div class="col-md-3">
          <label class="form-label fw-semibold" for="validez_txt">Validez (días)</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-hourglass-split"></i></span>
            <input type="number" id="validez_txt" class="form-control text-end" placeholder="0" min="0">
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Card 2: Detalle -->
  <div class="card shadow rounded-4 border-0">
    <div class="card-header bg-light rounded-top-4">
      <h6 class="mb-0 text-secondary d-flex align-items-center">
        <i class="bi bi-list-ul me-2"></i>Detalle de productos
      </h6>
    </div>

    <div class="card-body p-4">
      <!-- Fila de carga -->
      <div class="row g-4 align-items-end mb-1">
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
        <div class="col-md-2">
          <label class="form-label fw-semibold" for="cantidad_txt">Cantidad</label>
          <input
            type="text"
            id="cantidad_txt"
            class="form-control text-end"
            inputmode="numeric"
            placeholder="0"
            oninput="this.value = this.value.replace(/\D/g,'');"
          >
        </div>

        <!-- Costo Unitario -->
        <div class="col-md-2">
          <label class="form-label fw-semibold" for="precio_unitario_txt">Costo Unitario</label>
          <input
            type="text"
            id="precio_unitario_txt"
            class="form-control text-end"
            inputmode="decimal"
            placeholder="0"
            oninput="this.value = this.value.replace(/[^0-9.,]/g,'');"
          >
        </div>

        <!-- Subtotal -->
        <div class="col-md-2">
          <label class="form-label fw-semibold" for="subtotal_txt">Subtotal</label>
          <input type="text" id="subtotal_txt" class="form-control bg-light text-end" placeholder="0" readonly>
        </div>

        <!-- Botón agregar -->
        <div class="col-12 col-md-3 col-lg-2 d-grid mt-2">
          <button class="btn btn-outline-primary" onclick="agregarDetalle(); return false;">
            <i class="bi bi-plus-lg me-1"></i> Agregar
          </button>
        </div>
      </div>

      <!-- Tabla -->
      <div class="table-responsive mt-3">
        <table class="table table-striped table-hover align-middle text-center mb-0">
          <thead class="table-primary position-sticky top-0" style="z-index:1;">
            <tr>
              <th style="width: 35%">Producto</th>
              <th class="text-end" style="width: 15%">Cantidad</th>
              <th class="text-end" style="width: 20%">Precio Unitario</th>
              <th class="text-end" style="width: 20%">Subtotal</th>
              <th style="width: 10%">Acciones</th>
            </tr>
          </thead>
          <tbody id="detalle_tb">
            <!-- Filas dinámicas -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer: Total y Acciones -->
    <div class="card-footer bg-white rounded-bottom-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="text-start small text-muted">
            <i class="bi bi-info-circle me-1"></i>La suma del total se actualiza automáticamente según el detalle.
          </div>
        </div>
        <div class="col-md-3 ms-auto">
          <label for="total_txt" class="form-label fw-semibold mb-1">Total estimado</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-cash-coin"></i></span>
            <input type="text" id="total_txt" class="form-control bg-light fw-bold text-end" placeholder="0" readonly>
          </div>
        </div>
        <div class="col-12 col-md-3 d-flex justify-content-end gap-2">
          <button class="btn btn-danger" onclick="mostrarListarPresupuestos(); return false;">
            <i class="bi bi-x-circle me-1"></i> Cancelar
          </button>
          <button class="btn btn-success" onclick="guardarPresupuesto(); return false;">
            <i class="bi bi-save me-1"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .card { overflow: hidden; }
  .form-label { margin-bottom: .35rem; }
  .table thead th { white-space: nowrap; }
  .input-group > .form-control.text-end { text-align: end; }
</style>
mumFractionDigits: 0, maximumFractionDigits: 2 })
      .format(Number(n || 0));
  }

  // --- Subtotal en vivo robusto ---
  function recalcularSubtotal() {
    const cant   = toNumberPY(document.getElementById('cantidad_txt').value);
    const precio = toNumberPY(document.getElementById('precio_unitario_txt').value);
    const subtotal = cant * precio;
    document.getElementById('subtotal_txt').value = fmt0(subtotal);
  }

  // Recalcular en cada input
  document.addEventListener('input', function(e){
    if (e.target && (e.target.id === 'cantidad_txt' || e.target.id === 'precio_unitario_txt')) {
      recalcularSubtotal();
    }
  });

  // Al salir del campo costo, formatear bonito (no mover caret mientras escribe)
  document.addEventListener('blur', function(e){
    if (e.target && e.target.id === 'precio_unitario_txt') {
      e.target.value = fmt2(toNumberPY(e.target.value));
    }
  }, true);
</script>

<style>
  .card { overflow: hidden; }
  .form-label { margin-bottom: .35rem; }
  .table thead th { white-space: nowrap; }
  .input-group > .form-control.text-end { text-align: end; }
</style>
