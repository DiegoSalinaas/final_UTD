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
            <!-- Buscador y filtros -->
            <div class="row g-3 align-items-end mb-3">
                <div class="col-md-6">
                    <label for="b_orden" class="form-label fw-semibold">Buscar orden</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" id="b_orden" class="form-control form-control-lg" placeholder="Buscar por proveedor...">
                        <button class="btn btn-outline-secondary" type="button" id="limpiar_busqueda_btn"><i class="bi bi-x-lg"></i></button>
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="estado_filtro" class="form-label fw-semibold">Estado</label>
                    <select id="estado_filtro" class="form-select">
                        <option value="">Todos</option>
                        <option value="EMITIDO">Emitido</option>
                        <option value="APROBADO">Aprobado</option>
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
