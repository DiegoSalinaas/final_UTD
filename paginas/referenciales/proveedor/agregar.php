<div class="container mt-4">
    <input type="hidden" id="id_proveedor" value="0">
    <div class="card shadow rounded-4">
        <div class="card-header bg-success text-white rounded-top-4">
            <h4 class="mb-0">Agregar / Editar Proveedor</h4>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="razon_txt" class="form-label">Razón Social</label>
                    <input type="text" id="razon_txt" class="form-control" placeholder="Nombre o empresa">
                </div>
                <div class="col-md-6">
                    <label for="ruc_txt" class="form-label">RUC</label>
                    <input type="text" id="ruc_txt" class="form-control" placeholder="RUC">
                </div>
                <div class="col-md-6">
                    <label for="direccion_txt" class="form-label">Dirección</label>
                    <input type="text" id="direccion_txt" class="form-control" placeholder="Dirección">
                </div>
                <div class="col-md-6">
                    <label for="ciudad_lst" class="form-label">Ciudad</label>
                    <select id="ciudad_lst" class="form-select"></select>
                </div>
                <div class="col-md-6">
                    <label for="estado_lst" class="form-label">Estado</label>
                    <select id="estado_lst" class="form-select">
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="INACTIVO">INACTIVO</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="card-footer text-end">
            <button class="btn btn-success me-2" onclick="guardarProveedor(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarProveedor(); return false;">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </div>
    </div>
</div>
