<div class="container mt-4">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-primary mb-0">
            <i class="bi bi-bag-check-fill me-2"></i> Órdenes de Compra
        </h3>
        <button class="btn btn-success d-flex align-items-center shadow-sm" onclick="mostrarAgregarOrden(); return false;">
            <i class="bi bi-plus-circle me-2"></i> Nueva Orden
        </button>
    </div>

    <!-- Card principal -->
    <div class="card shadow rounded-4 border-0">
        <div class="card-body">
            <!-- Buscador -->
            <div class="row g-3 align-items-end mb-3">
                <div class="col-md-8">
                    <label for="b_orden" class="form-label fw-semibold">Buscar orden</label>
                    <input type="text" id="b_orden" class="form-control form-control-lg" placeholder="Buscar por proveedor...">
                </div>
                
            </div>

            <!-- Tabla -->
            <div class="table-responsive">
                <table class="table table-striped table-hover align-middle text-center">
                    <thead class="table-primary text-nowrap">
                        <tr>
                            <th>#</th>
                            <th>Fecha</th>
                            <th>Proveedor</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody id="orden_datos_tb">
                        <!-- Contenido dinámico -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
