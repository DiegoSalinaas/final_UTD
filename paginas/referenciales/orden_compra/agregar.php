<div class="container mt-4">
    <input type="hidden" id="id_orden" value="0">
    <input type="hidden" id="id_proveedor">
    <div class="card shadow rounded-4">
        <div class="card-header bg-success text-white rounded-top-4">
            <h4 class="mb-0">Agregar / Editar Orden de Compra</h4>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="id_presupuesto_lst" class="form-label">Presupuesto</label>
                    <select id="id_presupuesto_lst" class="form-select"></select>
                </div>
                <div class="col-md-6">
                    <label for="proveedor_txt" class="form-label">Proveedor</label>
                    <input type="text" id="proveedor_txt" class="form-control" readonly>
                </div>
                <div class="col-md-6">
                    <label for="fecha_txt" class="form-label">Fecha</label>
                    <input type="date" id="fecha_txt" class="form-control">
                </div>
            </div>
        </div>
        <div class="card-footer text-end">
            <button class="btn btn-success me-2" onclick="guardarOrden(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarOrdenes(); return false;">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </div>
    </div>
</div>
<div class="container mt-4">
    <div class="table-responsive">
        <table class="table table-bordered text-center align-middle">
            <thead class="table-light">
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody id="detalle_oc_tb">
                <!-- filas detalle -->
            </tbody>
        </table>
    </div>
</div>
