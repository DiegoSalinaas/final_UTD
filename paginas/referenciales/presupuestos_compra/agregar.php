<div class="container mt-4">
    <input type="hidden" id="id_presupuesto" value="0">
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
                    <label for="total_txt" class="form-label">Total Estimado</label>
                    <input type="number" step="0.01" id="total_txt" class="form-control" placeholder="0.00">
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
