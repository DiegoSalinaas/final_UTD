<div class="container mt-4">
    <input type="hidden" id="id_remision" value="0">
    <input type="hidden" id="estado_txt" value="PENDIENTE">
    <div class="card shadow rounded-4">
        <div class="card-header bg-primary text-white rounded-top-4">
            <h4 class="mb-0">Agregar / Editar Remisión</h4>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="id_cliente_lst" class="form-label">Cliente</label>
                    <select id="id_cliente_lst" class="form-select"></select>
                </div>
                <div class="col-md-3">
                    <label for="fecha_txt" class="form-label">Fecha</label>
                    <input type="date" id="fecha_txt" class="form-control" value="<?php echo date('Y-m-d'); ?>">
                </div>
                <div class="col-md-3">
                    <label for="observacion_txt" class="form-label">Observación</label>
                    <input type="text" id="observacion_txt" class="form-control">
                </div>
            </div>
            <div class="row g-3 mt-3">
                <div class="col-md-4">
                    <label for="id_producto_lst" class="form-label">Producto</label>
                    <select id="id_producto_lst" class="form-select"></select>
                </div>
                <div class="col-md-2">
                    <label for="cantidad_txt" class="form-label">Cantidad</label>
                    <input type="number" id="cantidad_txt" class="form-control" min="0">
                </div>
                <div class="col-md-2">
                    <label for="precio_unitario_txt" class="form-label">Precio Unitario</label>
                    <input type="number" id="precio_unitario_txt" class="form-control" min="0.01" step="0.01">
                </div>
                <div class="col-md-2">
                    <label for="subtotal_txt" class="form-label">Subtotal</label>
                    <input type="number" id="subtotal_txt" class="form-control" readonly>
                </div>
                <div class="col-md-2 d-grid align-items-end">
                    <button class="btn btn-primary" onclick="agregarDetalleRemision(); return false;">
                        <i class="bi bi-plus-lg"></i> Agregar Producto
                    </button>
                </div>
            </div>
        </div>
        <div class="card-footer text-end">
            <button class="btn btn-success me-2" onclick="guardarRemision(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarRemision(); return false;">
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
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody id="detalle_remision_tb">
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="3" class="text-end">Total</th>
                    <th id="total_general_txt">0</th>
                    <th></th>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
