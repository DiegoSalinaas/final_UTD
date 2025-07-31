<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">📝 Listado de Reseñas</h4>
    <button class="btn btn-primary" onclick="mostrarAgregarResena(); return false;">
      <i class="bi bi-plus-circle"></i> Agregar
    </button>
  </div>

  <div class="card shadow-sm rounded-4">
    <div class="card-body">
      <div class="row g-3 align-items-end">
        <div class="col-md-8">
          <label for="b_resena" class="form-label">🔍 Buscador</label>
          <input
            type="text"
            id="b_resena"
            class="form-control"
            placeholder="Buscar por usuario, ebook o comentario..."
          />
        </div>
        <div class="col-md-4">
          <button class="btn btn-secondary w-100" onclick="buscarResenas(); return false;">
            <i class="bi bi-search"></i> Buscar
          </button>
        </div>
      </div>

      <div class="table-responsive mt-4">
        <table class="table table-bordered table-hover align-middle text-center">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Ebook</th>
              <th>Puntuación</th>
              <th>Comentario</th>
              <th>Fecha</th>
              <th>Operaciones</th>
            </tr>
          </thead>
          <tbody id="datos_tb">
            <!-- Se carga dinámicamente -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
