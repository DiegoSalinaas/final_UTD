<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Listado Detalle Presupuesto</h4>
        <div>
            <button class="btn btn-secondary me-2" onclick="mostrarListarPresupuestos(); return false;">
                <i class="bi bi-arrow-left-circle"></i> Regresar
            </button>
            <button class="btn btn-primary" onclick="mostrarAgregarDetallePresupuesto(); return false;">
                <i class="bi bi-plus-circle"></i> Agregar
            </button>
        </div>
    </div>
    <div class="card shadow-sm rounded-4">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <div class="col-md-8">
                    <label for="b_detalle_presupuesto" class="form-label">Buscador</label>
                    <input type="text" id="b_detalle_presupuesto" class="form-control" placeholder="Buscar...">
                </div>
                <div class="col-md-4">
                    <button class="btn btn-secondary w-100" onclick="buscarDetallePresupuesto(); return false;">
                        <i class="bi bi-search"></i> Buscar
                    </button>
                </div>
            </div>
            <div class="table-responsive mt-4">
                <table class="table table-bordered table-hover align-middle text-center">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Presupuesto</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                            <th>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody id="datos_tb">
                        <!-- datos -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
