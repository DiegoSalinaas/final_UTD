<div class="container my-4">
  <!-- Hidden -->
  <input type="hidden" id="id_recepcion" value="0">
  <input type="hidden" id="estado_lst" value="PENDIENTE">

  <!-- Encabezado de página -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0 text-success fw-bold d-flex align-items-center">
      <i class="bi bi-clipboard-check me-2"></i> Agregar / Editar Recepción
    </h3>
    <span class="badge text-bg-light border shadow-sm">
      Estado: <strong class="ms-1">Pendiente</strong>
    </span>
  </div>

  <!-- Card 1: CABECERA (Datos de la recepción/cliente) -->
  <div class="card shadow rounded-4 border-0 mb-4">
    <div class="card-header bg-light rounded-top-4">
      <h6 class="mb-0 text-secondary d-flex align-items-center">
        <i class="bi bi-info-circle me-2"></i>Datos de la recepción
      </h6>
    </div>
    <div class="card-body p-4">
      <div class="row g-4">
        <!-- Fecha -->
        <div class="col-md-3">
          <label for="fecha_txt" class="form-label fw-semibold">Fecha</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
            <input type="date" id="fecha_txt" class="form-control" value="<?php echo date('Y-m-d'); ?>">
          </div>
        </div>

        <!-- Cliente -->
        <div class="col-md-4">
          <label for="id_cliente_lst" class="form-label fw-semibold">Cliente</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-person-badge"></i></span>
            <select id="id_cliente_lst" class="form-select"></select>
            <button id="nuevo_cliente_btn" class="btn btn-outline-primary" type="button" title="Agregar cliente">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>

        <!-- Teléfono -->
        <div class="col-md-2">
          <label for="telefono_txt" class="form-label fw-semibold">Teléfono</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-telephone"></i></span>
            <input type="text" id="telefono_txt" class="form-control bg-light" readonly>
          </div>
        </div>

        <!-- Dirección -->
        <div class="col-md-3">
          <label for="direccion_txt" class="form-label fw-semibold">Dirección</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
            <input type="text" id="direccion_txt" class="form-control bg-light" readonly>
          </div>
        </div>

        <!-- Observaciones generales -->
        <div class="col-12">
          <label for="observaciones_txt" class="form-label fw-semibold">Observaciones</label>
          <input type="text" id="observaciones_txt" class="form-control" placeholder="Observaciones generales de la recepción">
        </div>
      </div>
    </div>
  </div>

  <!-- Card 2: DETALLE (Carga de equipo + Tabla + Acciones) -->
  <div class="card shadow rounded-4 border-0">
    <div class="card-header bg-light rounded-top-4">
      <h6 class="mb-0 text-secondary d-flex align-items-center">
        <i class="bi bi-list-ul me-2"></i>Detalle de equipos
      </h6>
    </div>

    <!-- Fila de carga -->
    <div class="card-body p-4 pb-3">
      <div class="row g-4">
        <div class="col-md-3">
          <label for="nombre_equipo_txt" class="form-label fw-semibold">Equipo</label>
          <input type="text" id="nombre_equipo_txt" class="form-control" placeholder="Ej.: Notebook, Impresora">
        </div>
        <div class="col-md-2">
          <label for="marca_txt" class="form-label fw-semibold">Marca</label>
          <input type="text" id="marca_txt" class="form-control" placeholder="Ej.: HP, Lenovo">
        </div>
        <div class="col-md-2">
          <label for="modelo_txt" class="form-label fw-semibold">Modelo</label>
          <input type="text" id="modelo_txt" class="form-control" placeholder="Ej.: 15-da0xxx">
        </div>
        <div class="col-md-2">
          <label for="numero_serie_txt" class="form-label fw-semibold">N° Serie</label>
          <input type="text" id="numero_serie_txt" class="form-control" placeholder="Serie / IMEI / S/N">
        </div>
        <div class="col-md-3">
          <label for="falla_txt" class="form-label fw-semibold">Falla Reportada</label>
          <input type="text" id="falla_txt" class="form-control" placeholder="Descripción breve de la falla">
        </div>

        <!-- Accesorios -->
        <div class="col-md-6">
          <label class="form-label fw-semibold">Accesorios entregados</label>
          <div class="d-flex gap-2">
            <input id="accesorio_input" type="text" class="form-control" placeholder="Ej.: Cargador, Cable USB, Funda…">
            <button id="add_accesorio_btn" type="button" class="btn btn-outline-primary">
              <i class="bi bi-plus"></i> Agregar
            </button>
          </div>
          <div class="form-text">Escribí un accesorio y presioná Enter o “Agregar”.</div>
          <div id="accesorios_chips" class="mt-2"></div>
        </div>

        <div class="col-md-3">
          <label for="diagnostico_txt" class="form-label fw-semibold">Diagnóstico Preliminar</label>
          <input type="text" id="diagnostico_txt" class="form-control" placeholder="Observación técnica inicial">
        </div>
        <div class="col-md-3">
          <label for="observaciones_detalle_txt" class="form-label fw-semibold">Observaciones</label>
          <input type="text" id="observaciones_detalle_txt" class="form-control" placeholder="Notas adicionales del equipo">
        </div>

        <div class="col-md-3 d-grid">
          <button class="btn btn-outline-primary" onclick="agregarDetalleRecepcion(); return false;">
            <i class="bi bi-plus-lg me-1"></i> Agregar Equipo
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla detalle -->
    <div class="card-body pt-0 px-4">
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle text-center mb-0">
          <thead class="table-primary position-sticky top-0" style="z-index:1;">
            <tr>
              <th>Equipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>N° Serie</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="detalle_recepcion_tb"></tbody>
        </table>
      </div>
    </div>

    <!-- Footer: Acciones -->
    <div class="card-footer bg-white rounded-bottom-4">
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-danger" onclick="mostrarListarRecepcion(); return false;">
          <i class="bi bi-x-circle me-1"></i> Cancelar
        </button>
        <button class="btn btn-success" onclick="guardarRecepcion(); return false;">
          <i class="bi bi-save me-1"></i> Guardar
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modal: Agregar Cliente -->
<div class="modal fade" id="modal_nuevo_cliente" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Cliente</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body p-0"></div>
    </div>
  </div>
</div>

<!-- Ajustes finos (coherentes con el diseño base) -->
<style>
  .card { overflow: hidden; }
  .form-label { margin-bottom: .35rem; }
  .table thead th { white-space: nowrap; }
  .text-end { text-align: end !important; }

  /* Chips de accesorios */
  #accesorios_chips {
    display: flex; flex-wrap: wrap; gap: .5rem;
  }
  #accesorios_chips .chip {
    display: inline-flex; align-items: center; gap: .35rem;
    background: #f1f3f5; border: 1px solid #dee2e6; color:#333;
    padding: .25rem .6rem; border-radius: 999px; font-size: .85rem;
  }
  #accesorios_chips .chip .rm {
    border: 0; background: transparent; cursor: pointer; line-height: 1;
  }
</style>
