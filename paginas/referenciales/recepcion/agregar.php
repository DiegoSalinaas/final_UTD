<div class="container mt-4">
    <input type="hidden" id="id_recepcion" value="0">
    <div class="card shadow rounded-4">
        <div class="card-header bg-primary text-white rounded-top-4">
            <h4 class="mb-0">Agregar / Editar Recepción</h4>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-3">
                    <label for="fecha_txt" class="form-label">Fecha</label>
                    <input type="date" id="fecha_txt" class="form-control" value="<?php echo date('Y-m-d'); ?>">
                </div>
                <div class="col-md-4">
                    <label for="id_cliente_lst" class="form-label">Cliente</label>
                    <select id="id_cliente_lst" class="form-select"></select>
                </div>
                <div class="col-md-2">
                    <label for="telefono_txt" class="form-label">Teléfono</label>
                    <input type="text" id="telefono_txt" class="form-control" readonly>
                </div>
                <div class="col-md-3">
                    <label for="direccion_txt" class="form-label">Dirección</label>
                    <input type="text" id="direccion_txt" class="form-control" readonly>
                </div>
                <div class="col-md-3">
                    <label for="estado_lst" class="form-label">Estado</label>
                    <select id="estado_lst" class="form-select">
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="CERRADA">Cerrada</option>
                    </select>
                </div>
                <div class="col-md-9">
                    <label for="observaciones_txt" class="form-label">Observaciones</label>
                    <input type="text" id="observaciones_txt" class="form-control">
                </div>
            </div>
            <hr class="my-4">
            <div class="row g-3">
                <div class="col-md-2">
                    <label for="marca_txt" class="form-label">Marca</label>
                    <input type="text" id="marca_txt" class="form-control">
                </div>
                <div class="col-md-2">
                    <label for="modelo_txt" class="form-label">Modelo</label>
                    <input type="text" id="modelo_txt" class="form-control">
                </div>
                <div class="col-md-2">
                    <label for="numero_serie_txt" class="form-label">N° Serie</label>
                    <input type="text" id="numero_serie_txt" class="form-control">
                </div>
                <div class="col-md-3">
                    <label for="falla_txt" class="form-label">Falla Reportada</label>
                    <input type="text" id="falla_txt" class="form-control">
                </div>
                <div class="col-md-3">
                    <label for="accesorios_txt" class="form-label">Accesorios Entregados</label>
                    <input type="text" id="accesorios_txt" class="form-control">
                </div>
                <div class="col-md-3">
                    <label for="diagnostico_txt" class="form-label">Diagnóstico Preliminar</label>
                    <input type="text" id="diagnostico_txt" class="form-control">
                </div>
                <div class="col-md-3">
                    <label for="observaciones_detalle_txt" class="form-label">Observaciones</label>
                    <input type="text" id="observaciones_detalle_txt" class="form-control">
                </div>
                <div class="col-md-3 d-grid align-items-end">
                    <button class="btn btn-primary" onclick="agregarDetalleRecepcion(); return false;">
                        <i class="bi bi-plus-lg"></i> Agregar Equipo
                    </button>
                </div>
            </div>
        </div>
        <div class="card-footer text-end">
            <button class="btn btn-success me-2" onclick="guardarRecepcion(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarRecepcion(); return false;">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </div>
    </div>
</div>

<div class="container mt-4">
    <div class="table-responsive">
        <table class="table table-bordered text-center align-middle">
            <thead class="table-light">
                <tr>
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
