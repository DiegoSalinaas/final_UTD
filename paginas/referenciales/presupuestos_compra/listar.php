<div class="container mt-4">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-primary mb-0">
            <i class="bi bi-file-earmark-text"></i> Presupuestos de Compra
        </h3>
        <button class="btn btn-success d-flex align-items-center shadow-sm" onclick="mostrarAgregarPresupuesto(); return false;">
            <i class="bi bi-plus-circle me-2"></i> Nuevo Presupuesto
        </button>
    </div>

    <!-- Card principal -->
    <div class="card shadow rounded-4 border-0">
        <div class="card-body">
            <!-- Buscador -->
            <div class="row g-3 align-items-end mb-3">
                <div class="col-md-8">
                    <label for="b_presupuesto" class="form-label fw-semibold">Buscar presupuesto</label>
                    <input type="text" id="b_presupuesto" class="form-control form-control-lg" placeholder="Escribe el nombre del proveedor...">
                </div>
                <div class="col-md-4 ms-auto">
                    <label for="estado_filtro" class="form-label fw-semibold">Estado</label>
                    <select id="estado_filtro" class="form-select form-select-lg">
                        <option value="">Todos</option>
                        <option value="PENDIENTE">Pendientes</option>
                        <option value="APROBADO">Aprobados</option>
                        <option value="ANULADO">Anulados</option>
                    </select>
                </div>
<!--                <div class="col-md-3">
                    <button class="btn btn-outline-primary btn-lg w-100 shadow-sm" onclick="buscarPresupuesto(); return false;">
                        <i class="bi bi-search me-2"></i> Buscar
                    </button>
                </div>-->
            </div>

            <!-- Tabla -->
            <div class="table-responsive">
                <table class="table table-striped table-hover align-middle text-center">
                    <thead class="table-primary text-nowrap">
                        <tr>
                            <th>#</th>
                            <th>Proveedor</th>
                            <th>Fecha</th>
                            <th>Total Estimado</th>
                            <th>Estado</th>
                            <th>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody id="datos_tb">
                        <!-- Filas dinámicas -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
