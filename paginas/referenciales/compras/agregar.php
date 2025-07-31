<div class="container mt-4">
    <input type="hidden" id="compra_id" value="0">

    <div class="card shadow rounded-4">
        <div class="card-header bg-success text-white rounded-top-4">
            <h4 class="mb-0">🛒 Agregar / Editar Compra</h4>
        </div>

        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="usuario_id_lst" class="form-label">Usuario</label>
                    <select id="usuario_id_lst" class="form-select">
                        <!-- Usuarios cargados dinámicamente -->
                    </select>
                </div>

                <div class="col-md-6">
                    <label for="fecha_txt" class="form-label">Fecha</label>
                    <input type="datetime-local" id="fecha_txt" class="form-control">
                </div>

                <div class="col-md-6">
                    <label for="total_txt" class="form-label">Total</label>
                    <input type="number" step="0.01" id="total_txt" class="form-control" placeholder="0.00">
                </div>

                <div class="col-md-6">
                    <label for="metodo_pago_lst" class="form-label">Método de Pago</label>
                    <select id="metodo_pago_lst" class="form-select">
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Transferencia">Transferencia</option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label for="estado_lst" class="form-label">Estado</label>
                    <select id="estado_lst" class="form-select">
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label for="referencia_txt" class="form-label">Referencia</label>
                    <input type="text" id="referencia_txt" class="form-control" placeholder="Opcional">
                </div>
            </div>
        </div>

        <div class="card-footer text-end">
            <button class="btn btn-success me-2" onclick="guardarCompra(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarCompras(); return false;">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </div>
    </div>
</div>
