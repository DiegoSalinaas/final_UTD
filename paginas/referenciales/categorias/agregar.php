<div class="container mt-4">
    <input type="hidden" id="categoria_id" value="0">

    <div class="card shadow rounded-4">
        <div class="card-header bg-warning text-dark rounded-top-4">
            <h4 class="mb-0">🏷️ Agregar / Editar Categoría</h4>
        </div>

        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="nombre_txt" class="form-label">Nombre</label>
                    <input type="text" id="nombre_txt" class="form-control" placeholder="Nombre de la categoría">
                </div>

                <div class="col-md-6">
                    <label for="orden_txt" class="form-label">Orden</label>
                    <input type="number" id="orden_txt" class="form-control" value="0" min="0">
                </div>

                <div class="col-12">
                    <label for="descripcion_txt" class="form-label">Descripción</label>
                    <textarea id="descripcion_txt" class="form-control" rows="3" placeholder="Descripción detallada..."></textarea>
                </div>

                <div class="col-md-6">
                    <label for="activa_lst" class="form-label">Estado</label>
                    <select id="activa_lst" class="form-select">
                        <option value="1">ACTIVA</option>
                        <option value="0">INACTIVA</option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label for="fecha_creacion_txt" class="form-label">Fecha de Creación</label>
                    <input type="date" id="fecha_creacion_txt" class="form-control">
                </div>
            </div>
        </div>

        <div class="card-footer text-end">
            <button class="btn btn-success me-2" onclick="guardarCategoria(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarCategorias(); return false;">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </div>
    </div>
</div>
