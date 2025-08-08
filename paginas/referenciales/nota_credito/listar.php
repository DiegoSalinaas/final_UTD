<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Listado de Notas de Crédito</h4>
        <button class="btn btn-primary" onclick="mostrarAgregarNotaCredito(); return false;">
            <i class="bi bi-plus-circle"></i> Agregar
        </button>
    </div>
    <div class="card shadow-sm rounded-4">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <div class="col-md-8">
                    <label for="b_nota_credito" class="form-label">Buscador</label>
                    <input type="text" id="b_nota_credito" class="form-control" placeholder="Buscar por cliente o número...">
                </div>
                <div class="col-md-4">
                    <button class="btn btn-secondary w-100" onclick="buscarNotaCredito(); return false;">
                        <i class="bi bi-search"></i> Buscar
                    </button>
                </div>
            </div>
            <div class="table-responsive mt-4">
                <table class="table table-bordered table-hover align-middle text-center">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Número</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody id="nota_credito_datos_tb"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>
