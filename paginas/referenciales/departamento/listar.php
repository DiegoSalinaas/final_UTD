<div class="row">
    <div class="col-md-8">
        <h2>Listado de Departamentos</h2>
    </div>
    <div class="col-md-4">
        <button class="btn btn-primary form-control" 
                onclick="mostrarAgregarDepartamento(); return false;">+ Agregar</button>
    </div>
    
    <div class="col-12">
        <hr> 
    </div>
    <div class="col-8">
        <label>Buscador</label>
        <input type="text" id="b_departamento" class="form-control" placeholder="Buscar por Descripcion o Estado...">
            
    </div>
    <div class="col-4" style="margin-top: 25px;">
        <button class="btn btn-secondary
                form-control">Buscar</button>
    </div>
    <div class="col-12" style="margin-top: 50px;">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Descripcion</th>
                    <th>Estado</th>
                    <th>Operaciones</th>
                </tr>
            </thead>
            <tbody id="datos_tb"> </tbody>
        </table>
    </div>
    
</div>
