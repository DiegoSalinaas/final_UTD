<div class="row">
    <input type="text" id="id_departamento" hidden value="0">
    <div class="col-md-8">
        <h2>Agregar de Departamento</h2>
    </div>
   
    <div class="col-12">
        <hr> 
    </div>
    <div class="col-6">
        <label>Descripcion</label>
        <input type="text" id="descripcion_txt" class="form-control">
    </div>
    <div class="col-6">
        <label>Estado</label>
        <select  id="estado_lst" class="form-control">
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
        </select>
    </div>
    <div class="col-12">
        <hr> 
    </div>
    <div class="col-6">
        <button class="btn btn-success form-control" onclick="guardarDepartamento(); return false;">Guardar</button>
    </div>
    <div class="col-6">
        <button class="btn btn-danger form-control" onclick="mostrarListarDepartamento(); return false;">Cancelar</button>
    </div>
    
</div>

