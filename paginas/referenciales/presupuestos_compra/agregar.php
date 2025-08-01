<div class="container mt-4">
    <input type="hidden" id="id_presupuesto" value="0">
    <input type="hidden" id="id_detalle" value="0">
    <div class="card shadow rounded-4">
        <div class="card-header bg-success text-white rounded-top-4">
            <h4 class="mb-0">Agregar / Editar Presupuesto</h4>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="id_proveedor_lst" class="form-label">Proveedor</label>
                    <select id="id_proveedor_lst" class="form-select"></select>
                </div>
                <div class="col-md-6">
                    <label for="fecha_txt" class="form-label">Fecha</label>
                    <input type="date" id="fecha_txt" class="form-control">
                </div>
               
                <div class="col-md-6">
                    <label for="id_producto_lst" class="form-label">Producto</label>
                    <select id="id_producto_lst" class="form-select"></select>
                </div>
                 <div class="col-md-6">
                    <label for="total_txt" class="form-label">Total Estimado</label>
                    <input type="number" step="0.01" id="total_txt" class="form-control" placeholder="0.00">
                </div>
                <div class="col-md-3">
                    <label for="cantidad_txt" class="form-label">Cantidad</label>
                    <input type="number" id="cantidad_txt" class="form-control" min="0">
                </div>
                <div class="col-md-3">
                    <label for="precio_unitario_txt" class="form-label">Precio Unitario</label>
                    <input type="number" step="0.01" id="precio_unitario_txt" class="form-control">
                </div>
                <div class="col-md-3">
                    <label for="subtotal_txt" class="form-label">Subtotal</label>
                    <input type="number" step="0.01" id="subtotal_txt" class="form-control" readonly>
                </div>
                <div class="col-md-3 d-grid align-items-end">
                    <button class="btn btn-primary" onclick="agregarDetalle(); return false;">
                        <i class="bi bi-plus-lg"></i> Agregar Producto
                    </button>
                </div>
            </div>
        </div>
        <div class="card-footer text-end">
            <button class="btn btn-success me-2" onclick="guardarPresupuesto(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarPresupuestos(); return false;">
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
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="detalle_tb">
                <!-- filas detalle -->
            </tbody>
        </table>
    </div>
</div>
<script>
$(document).on('input','#cantidad_txt,#precio_unitario_txt',function(){
    const cant = parseFloat($('#cantidad_txt').val()) || 0;
    const precio = parseFloat($('#precio_unitario_txt').val()) || 0;
    $('#subtotal_txt').val((cant * precio).toFixed(2));
});
</script>
