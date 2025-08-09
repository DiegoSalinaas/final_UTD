<div class="container mt-4">
 <input type="hidden" id="id_diagnostico" value="0">
 <div class="card shadow rounded-4">
  <div class="card-header bg-primary text-white rounded-top-4"><h4 class="mb-0">Agregar / Editar Diagnóstico</h4></div>
  <div class="card-body">
   <div class="row g-3">
    <div class="col-md-3"><label for="id_recepcion_lst" class="form-label">Recepción</label><select id="id_recepcion_lst" class="form-select"></select></div>
    <div class="col-md-3"><label for="id_detalle_lst" class="form-label">Equipo</label><select id="id_detalle_lst" class="form-select"></select></div>
    <div class="col-md-3"><label for="estado_lst" class="form-label">Estado</label><select id="estado_lst" class="form-select"><option value="PENDIENTE">Pendiente</option><option value="EN_PROCESO">En proceso</option><option value="APROBADO">Aprobado</option><option value="RECHAZADO">Rechazado</option><option value="CERRADO">Cerrado</option></select></div>
    <div class="col-md-3"><label for="tiempo_txt" class="form-label">Tiempo Est. (h)</label><input type="number" step="0.01" id="tiempo_txt" class="form-control" value="0"></div>
    <div class="col-md-3"><label for="costo_mano_txt" class="form-label">Costo Mano Obra</label><input type="number" step="0.01" id="costo_mano_txt" class="form-control" value="0"></div>
    <div class="col-md-3"><label for="costo_repuestos_txt" class="form-label">Costo Repuestos</label><input type="number" step="0.01" id="costo_repuestos_txt" class="form-control" value="0"></div>
    <div class="col-md-3"><label for="aplica_garantia_lst" class="form-label">Garantía</label><select id="aplica_garantia_lst" class="form-select"><option value="0">No</option><option value="1">Sí</option></select></div>
    <div class="col-md-6"><label for="descripcion_falla_txt" class="form-label">Descripción Falla</label><textarea id="descripcion_falla_txt" class="form-control"></textarea></div>
    <div class="col-md-6"><label for="observaciones_txt" class="form-label">Observaciones</label><textarea id="observaciones_txt" class="form-control"></textarea></div>
   </div>
   <hr class="my-4">
   <div class="row g-3">
    <div class="col-md-3"><label for="componente_txt" class="form-label">Componente</label><input type="text" id="componente_txt" class="form-control"></div>
    <div class="col-md-2"><label for="estado_comp_lst" class="form-label">Estado</label><select id="estado_comp_lst" class="form-select"><option>OK</option><option>FALLA</option><option>DETERIORADO</option><option>NO_APLICA</option></select></div>
    <div class="col-md-3"><label for="hallazgo_txt" class="form-label">Hallazgo</label><input type="text" id="hallazgo_txt" class="form-control"></div>
    <div class="col-md-3"><label for="accion_txt" class="form-label">Acción Recomendada</label><input type="text" id="accion_txt" class="form-control"></div>
    <div class="col-md-1 d-grid"><button class="btn btn-primary" onclick="agregarDetalleDiagnostico(); return false;"><i class="bi bi-plus-lg"></i></button></div>
   </div>
  </div>
  <div class="card-footer text-end">
   <button class="btn btn-success me-2" onclick="guardarDiagnostico(); return false;"><i class="bi bi-save"></i> Guardar</button>
   <button class="btn btn-danger" onclick="mostrarListarDiagnostico(); return false;"><i class="bi bi-x-circle"></i> Cancelar</button>
  </div>
 </div>
</div>
<div class="container mt-4">
 <div class="table-responsive">
  <table class="table table-bordered text-center align-middle">
   <thead class="table-light"><tr><th>Componente</th><th>Estado</th><th>Hallazgo</th><th>Acción</th><th></th></tr></thead>
   <tbody id="detalle_diagnostico_tb"></tbody>
  </table>
 </div>
</div>
