<div class="container mt-4">
    <input type="hidden" id="id_presupuesto" value="0">
    <input type="hidden" id="id_detalle" value="0">
    
    <div class="card shadow-lg rounded-4 border-0">
        <div class="card-header bg-success text-white rounded-top-4">
            <h4 class="mb-0">
                <i class="bi bi-pencil-square me-2"></i> Agregar / Editar Presupuesto
            </h4>
        </div>

        <div class="card-body">
            <div class="row g-4">
                <!-- Proveedor -->
                <div class="col-md-6">
                    <label for="id_proveedor_lst" class="form-label fw-semibold">Proveedor</label>
                    <input type="text" id="filtro_proveedor" class="form-control mb-2" placeholder="Buscar proveedor...">
                    <select id="id_proveedor_lst" class="form-select"></select>
                </div>

                <!-- Fecha -->
                <div class="col-md-6">
                    <label for="fecha_txt" class="form-label fw-semibold">Fecha</label>
                    <input type="date" id="fecha_txt" class="form-control">
                </div>

                <!-- Producto -->
                <div class="col-md-6">
                    <label for="id_producto_lst" class="form-label fw-semibold">Producto</label>
                    <input type="text" id="filtro_producto" class="form-control mb-2" placeholder="Buscar producto...">
                    <select id="id_producto_lst" class="form-select"></select>
                </div>

                <!-- Total estimado -->
                <div class="col-md-6">
                    <label for="total_txt" class="form-label fw-semibold">Total Estimado</label>
                    <input type="number" step="0.01" id="total_txt" class="form-control" placeholder="0.00">
                </div>

                <!-- Cantidad -->
                <div class="col-md-3">
                    <label for="cantidad_txt" class="form-label fw-semibold">Cantidad</label>
                    <input type="number" id="cantidad_txt" class="form-control" min="0">
                </div>

                <!-- Precio unitario -->
                <div class="col-md-3">
                    <label for="precio_unitario_txt" class="form-label fw-semibold">Costo Unitario</label>
                    <input type="number" step="0.01" id="precio_unitario_txt" class="form-control">
                </div>

                <!-- Subtotal -->
                <div class="col-md-3">
                    <label for="subtotal_txt" class="form-label fw-semibold">Subtotal</label>
                    <input type="text" id="subtotal_txt" class="form-control bg-light" readonly>
                </div>

                <!-- Botón agregar producto -->
                <div class="col-md-3 d-grid align-items-end">
                    <button class="btn btn-outline-primary" onclick="agregarDetalle(); return false;">
                        <i class="bi bi-plus-lg me-1"></i> Agregar Producto
                    </button>
                </div>
            </div>
        </div>

        <div class="card-footer text-end bg-light rounded-bottom-4">
            <button class="btn btn-success me-2 shadow-sm" onclick="guardarPresupuesto(); return false;">
                <i class="bi bi-save me-1"></i> Guardar
            </button>
            <button class="btn btn-danger shadow-sm" onclick="mostrarListarPresupuestos(); return false;">
                <i class="bi bi-x-circle me-1"></i> Cancelar
            </button>
        </div>
    </div>
</div>

<!-- Tabla detalle de productos -->
<div class="container mt-4">
    <div class="card shadow-sm rounded-4 border-0">
        <div class="card-body">
            <h5 class="mb-3 fw-bold text-secondary">
                <i class="bi bi-list-ul me-2"></i> Detalle de Productos
            </h5>
            <div class="table-responsive">
                <table class="table table-striped table-hover align-middle text-center">
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
                        <!-- Filas dinámicas -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Script para cálculo de subtotal -->
<script>
function formatearPY(numero) {
    return new Intl.NumberFormat('es-PY', { minimumFractionDigits: 0 }).format(Math.round(numero));
}

$(document).on('input', '#cantidad_txt, #precio_unitario_txt', function () {
    const cant = parseFloat($('#cantidad_txt').val()) || 0;
    const precio = parseFloat($('#precio_unitario_txt').val()) || 0;
    const subtotal = cant * precio;
    $('#subtotal_txt').val(formatearPY(subtotal));
});
</script>
