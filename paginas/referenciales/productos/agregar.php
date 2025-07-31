<div class="container mt-4">
    <input type="hidden" id="producto_id" value="0">
    <div class="card shadow rounded-4">
        <div class="card-header bg-success text-white rounded-top-4">
            <h4 class="mb-0">Agregar / Editar Producto</h4>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="nombre_txt" class="form-label">Nombre</label>
                    <input type="text" id="nombre_txt" class="form-control" placeholder="Nombre del producto">
                </div>
                <div class="col-md-6">
                    <label for="precio_txt" class="form-label">Precio</label>
                    <input type="number" id="precio_txt" class="form-control" min="0" step="0.01">
                </div>
                <div class="col-md-6">
                    <label for="iva_txt" class="form-label">IVA</label>
                    <input type="number" id="iva_txt" class="form-control" min="0" step="0.01">
                </div>
                <div class="col-12">
                    <label for="descripcion_txt" class="form-label">Descripción</label>
                    <textarea id="descripcion_txt" class="form-control" rows="3" placeholder="Descripción..."></textarea>
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
            <button class="btn btn-success me-2" onclick="guardarProducto(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarProductos(); return false;">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </div>
    </div>
</div>
