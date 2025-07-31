<div class="row">
    <div class="col-md-4">
        <h2>Listado de Ciudades</h2>
    </div>
    <div class="col-md-4">
        <button class="btn btn-primary form-control" 
                onclick="imprimirCiudades(); return false;">🖨️ Imprimir</button>
    </div>
    <div class="col-md-4">
        <button class="btn btn-primary form-control" 
                onclick="mostrarAgregarCiudad(); return false;">+ Agregar</button>
    </div>
    
    <div class="col-12">
        <hr> 
    </div>
    <div class="col-8">
        <label>Buscador</label>
        <input type="text" id="b_ciudad" class="form-control" placeholder="Buscar Ciudades...">
            
    </div>
    <div class="col-4" style="margin-top: 25px;">
        <button class="btn btn-secondary
                form-control">Buscar</button>
    </div>
    <div class="col-12" style="margin-top: 50px;">
        <div class="row" id="datos_card">
            <div class="card col-md-5 m-2">
    <div class="card-header" style="color: #cecece; font-size: 13px;">
        Ciudad #<span class="id_ciudad_edicion">1</span>
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-12">
                <b style="font-size: 17px;">NOMBRE CIUDAD</b>
            </div>
            <div class="col-8">
                <i>Departamento: Nombre Departamento</i>
            </div>
            <div class="col-4">
                <i class="badge bg-secondary p-2">Activo</i>
            </div>
            <div class="col-12">
                <hr>
            </div>
            <div class="col-4">
                <button class="btn btn-danger form-control">
                    <i class="nav-icon bi bi-x-lg"></i> 
                </button>
            </div>
            <div class="col-4">
                <button class="btn btn-warning form-control">
                    <i class="nav-icon bi bi-pencil-square"></i>    
                </button>
            </div>
            <div class="col-4">
                <button class="btn btn-primary form-control imprimir-ciudad">
                    <i class="nav-icon bi bi-camera"></i>    
                </button>
            </div>
        </div>
    </div>
</div>

    </div>
</div>

    
