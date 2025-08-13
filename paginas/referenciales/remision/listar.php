<div class="container my-4">
  <!-- Encabezado -->
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="mb-0 text-primary fw-bold d-flex align-items-center">
      <i class="bi bi-clipboard2-check me-2"></i> Listado de Remisiones
    </h3>
    <div class="d-flex align-items-center gap-2">
      <span class="badge text-bg-light border shadow-sm">
        Total: <strong id="remision_count" class="ms-1">0</strong>
      </span>
      <button class="btn btn-primary" onclick="mostrarAgregarRemision(); return false;">
        <i class="bi bi-plus-circle me-1"></i> Agregar
      </button>
    </div>
  </div>

  <!-- Card -->
  <div class="card shadow rounded-4 border-0">
    <div class="card-body">
      <!-- Filtros -->
      <div class="row g-3 align-items-end">
        <div class="col-md-6">
          <label for="b_remision" class="form-label fw-semibold">Buscar</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" id="b_remision" class="form-control" placeholder="Cliente, # remisión…">
            <button class="btn btn-outline-secondary" type="button" id="limpiar_busqueda_btn">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          
        </div>

        <div class="col-md-3">
          <label for="estado_filtro" class="form-label fw-semibold">Estado</label>
          <select id="estado_filtro" class="form-select">
            <option value="">Todos</option>
            <option value="EMITIDO">Emitido</option>
            <option value="ANULADO">Anulado</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label fw-semibold">Rango de fechas</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
            <input type="date" id="f_desde" class="form-control" placeholder="Desde">
            <input type="date" id="f_hasta" class="form-control" placeholder="Hasta">
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="table-responsive mt-4">
        <table class="table table-striped table-hover align-middle text-center mb-0">
          <thead class="table-primary position-sticky top-0" style="z-index:1;">
            <tr>
              <th style="width: 10%">#</th>
              <th style="width: 20%">Fecha</th>
              <th style="width: 40%">Cliente</th>
              <th style="width: 15%">Estado</th>
              <th style="width: 15%">Operaciones</th>
            </tr>
          </thead>
          <tbody id="remision_datos_tb">
            <!-- Contenido dinámico -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style>
  .table thead th { white-space: nowrap; }
  .text-end { text-align: end !important; }
</style>
