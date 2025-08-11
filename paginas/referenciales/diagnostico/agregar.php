<div class="container my-4">
  <!-- Hidden -->
  <input type="hidden" id="id_diagnostico" value="0">

  <!-- Card 1: Datos del diagnóstico -->
  <div class="card shadow rounded-4 border-0 mb-4">
    <div class="card-header bg-primary text-white rounded-top-4 d-flex align-items-center">
      <h4 class="mb-0"><i class="bi bi-clipboard-pulse me-2"></i> Agregar / Editar Diagnóstico</h4>
    </div>

    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="id_recepcion_lst" class="form-label fw-semibold">Recepción</label>
          <select id="id_recepcion_lst" class="form-select" aria-label="Recepción"></select>
        </div>

        <div class="col-md-4">
          <label for="id_detalle_lst" class="form-label fw-semibold">Equipo</label>
          <select id="id_detalle_lst" class="form-select" aria-label="Equipo"></select>
        </div>

        <div class="col-md-4">
          <label for="estado_lst" class="form-label fw-semibold">Estado</label>
          <select id="estado_lst" class="form-select">
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROCESO">En proceso</option>
            <option value="APROBADO">Aprobado</option>
            <option value="RECHAZADO">Rechazado</option>
            <option value="CERRADO">Cerrado</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="tiempo_txt" class="form-label fw-semibold">Tiempo Est. (h)</label>
          <div class="input-group">
            <input type="number" step="0.01" id="tiempo_txt" class="form-control text-end" value="0" placeholder="0.00" inputmode="decimal">
            <span class="input-group-text">h</span>
          </div>
        </div>

        <div class="col-md-3">
          <label for="costo_mano_txt" class="form-label fw-semibold">Costo Mano Obra</label>
          <div class="input-group">
            <span class="input-group-text">Gs.</span>
            <input type="number" step="0.01" id="costo_mano_txt" class="form-control text-end" value="0" placeholder="0" inputmode="decimal">
          </div>
        </div>

        <div class="col-md-3">
          <label for="costo_repuestos_txt" class="form-label fw-semibold">Costo Repuestos</label>
          <div class="input-group">
            <span class="input-group-text">Gs.</span>
            <input type="number" step="0.01" id="costo_repuestos_txt" class="form-control text-end" value="0" placeholder="0" inputmode="decimal">
          </div>
        </div>

        <div class="col-md-3">
          <label for="aplica_garantia_lst" class="form-label fw-semibold">Garantía</label>
          <select id="aplica_garantia_lst" class="form-select">
            <option value="0">No</option>
            <option value="1">Sí</option>
          </select>
        </div>

        <div class="col-md-6">
          <label for="descripcion_falla_txt" class="form-label fw-semibold">Descripción de la falla</label>
          <textarea id="descripcion_falla_txt" class="form-control" rows="3" placeholder="Describe el problema reportado..."></textarea>
        </div>

        <div class="col-md-6">
          <label for="observaciones_txt" class="form-label fw-semibold">Observaciones</label>
          <textarea id="observaciones_txt" class="form-control" rows="3" placeholder="Notas adicionales..."></textarea>
        </div>
      </div>
    </div>
  </div>

  <!-- Card 2: Detalle de componentes -->
  <div class="card shadow rounded-4 border-0">
    <div class="card-header bg-light rounded-top-4">
      <div class="d-flex align-items-center justify-content-between">
        <span class="fw-semibold"><i class="bi bi-cpu me-2"></i>Detalle de componentes</span>
        <span class="badge text-bg-primary" id="badge_items_diag" title="Cantidad de ítems">0 ítems</span>
      </div>
    </div>

    <div class="card-body">
      <!-- Fila de carga de detalle -->
      <div class="row g-3 align-items-end mb-2">
        <div class="col-md-4">
          <label for="componente_txt" class="form-label fw-semibold">Componente</label>
          <input type="text" id="componente_txt" class="form-control" placeholder="Ej.: Placa madre, batería...">
        </div>

        <div class="col-md-2">
          <label for="estado_comp_lst" class="form-label fw-semibold">Estado</label>
          <select id="estado_comp_lst" class="form-select">
            <option>OK</option>
            <option>FALLA</option>
            <option>DETERIORADO</option>
            <option>NO_APLICA</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="hallazgo_txt" class="form-label fw-semibold">Hallazgo</label>
          <input type="text" id="hallazgo_txt" class="form-control" placeholder="Qué se encontró...">
        </div>

        <div class="col-md-2">
          <label for="accion_txt" class="form-label fw-semibold">Acción Recomendada</label>
          <input type="text" id="accion_txt" class="form-control" placeholder="Reparar, reemplazar...">
        </div>

        <div class="col-md-1 d-grid">
          <button class="btn btn-primary" onclick="agregarDetalleDiagnostico(); return false;" title="Agregar componente">
            <i class="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      <!-- Tabla -->
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle text-center mb-0">
          <thead class="table-primary position-sticky top-0" style="z-index:1;">
            <tr>
              <th>Componente</th>
              <th>Estado</th>
              <th>Hallazgo</th>
              <th>Acción</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="detalle_diagnostico_tb">
            <!-- filas dinámicas -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Botones abajo -->
    <div class="card-footer bg-light rounded-bottom-4 d-flex justify-content-end gap-2">
      <button class="btn btn-success" onclick="guardarDiagnostico(); return false;">
        <i class="bi bi-save me-1"></i> Guardar
      </button>
      <button class="btn btn-outline-danger" onclick="mostrarListarDiagnostico(); return false;">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
    </div>
  </div>
</div>

<!-- Toques de estilo opcionales -->
<style>
  .card .form-label { margin-bottom: .35rem; }
  .table thead th { white-space: nowrap; }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
</style>
