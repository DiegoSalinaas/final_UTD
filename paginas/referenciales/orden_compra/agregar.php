<div class="container mt-4">
    <input type="hidden" id="id_orden" value="0">
    <input type="hidden" id="id_proveedor">

    <div class="card shadow-lg rounded-4 border-0">
        <div class="card-header bg-success text-white rounded-top-4">
            <h4 class="mb-0">
                <i class="bi bi-clipboard-plus me-2"></i> Agregar / Editar Orden de Compra
            </h4>
        </div>

        <div class="card-body">
            <!-- Fila 1: Presupuesto, Proveedor, Fecha -->
            <div class="row g-4">
                <div class="col-md-6">
                    <label for="id_presupuesto_lst" class="form-label fw-semibold">Presupuesto</label>
                    <select id="id_presupuesto_lst" class="form-select"></select>
                </div>
                <div class="col-md-6">
                    <label for="proveedor_txt" class="form-label fw-semibold">Proveedor</label>
                    <input type="text" id="proveedor_txt" class="form-control bg-light" readonly>
                </div>
                <div class="col-md-6">
                    <label for="fecha_txt" class="form-label fw-semibold">Fecha</label>
                    <input type="date" id="fecha_txt" class="form-control">
                </div>
            </div>

            <!-- Fila 2: Detalle producto -->
            <div class="row g-4 mt-3">
                <div class="col-md-4">
                    <label for="id_producto_lst" class="form-label fw-semibold">Producto</label>
                    <select id="id_producto_lst" class="form-select"></select>
                </div>
                <div class="col-md-2">
                    <label for="cantidad_txt" class="form-label fw-semibold">Cantidad</label>
                    <input type="number" id="cantidad_txt" class="form-control" min="0">
                </div>
                <div class="col-md-2">
                    <label for="precio_unitario_txt" class="form-label fw-semibold">Precio Unitario</label>
                    <input type="number" step="0.01" id="precio_unitario_txt" class="form-control">
                </div>
                <div class="col-md-2">
                    <label for="subtotal_txt" class="form-label fw-semibold">Subtotal</label>
                    <input type="text" id="subtotal_txt" class="form-control bg-light" readonly>
                </div>
                <div class="col-md-2 d-grid align-items-end">
                    <button class="btn btn-outline-primary" onclick="agregarProductoExtra(); return false;">
                        <i class="bi bi-plus-lg me-1"></i> Agregar Producto
                    </button>
                </div>
            </div>
        </div>

        <div class="card-footer text-end bg-light rounded-bottom-4">
            <button class="btn btn-success me-2 shadow-sm" onclick="guardarOrden(); return false;">
                <i class="bi bi-save me-1"></i> Guardar
            </button>
            <button class="btn btn-danger shadow-sm" onclick="mostrarListarOrdenes(); return false;">
                <i class="bi bi-x-circle me-1"></i> Cancelar
            </button>
        </div>
    </div>
</div>

<!-- Tabla detalle -->
<div class="container mt-4">
    <div class="card shadow-sm rounded-4 border-0">
        <div class="card-body">
            <h5 class="mb-3 fw-bold text-secondary">
                <i class="bi bi-list-check me-2"></i> Detalle de Productos
            </h5>
            <div class="table-responsive">
                <table class="table table-striped table-hover align-middle text-center">
                    <thead class="table-light">
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody id="detalle_oc_tb">
                        <!-- filas detalle -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
