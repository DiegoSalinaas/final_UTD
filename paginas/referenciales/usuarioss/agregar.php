<div class="container mt-4">
    <input type="hidden" id="usuario_id" value="0">

    <div class="card shadow rounded-4">
        <div class="card-header bg-primary text-white rounded-top-4">
            <h4 class="mb-0">Agregar / Editar Usuario</h4>
        </div>

        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="nombre_txt" class="form-label">Nombre</label>
                    <input type="text" id="nombre_txt" class="form-control" placeholder="Ingrese el nombre">
                </div>

                <div class="col-md-6">
                    <label for="email_txt" class="form-label">Email</label>
                    <input type="email" id="email_txt" class="form-control" placeholder="ejemplo@correo.com">
                </div>

                <div class="col-md-6">
                    <label for="fecha_registro_txt" class="form-label">Fecha de Registro</label>
                    <input type="date" id="fecha_registro_txt" class="form-control">
                </div>

                <div class="col-md-6">
                    <label for="tipo_usuario_txt" class="form-label">Tipo de Usuario</label>
                    <select id="tipo_usuario_txt" class="form-select">
                        <option value="ADMIN">ADMIN</option>
                        <option value="EMPLEADO">EMPLEADO</option>
                        <option value="CLIENTE">CLIENTE</option>
                    </select>
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
            <button class="btn btn-success me-2" onclick="guardarUsuarioss(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarUsuarioss(); return false;">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </div>
    </div>
</div>
