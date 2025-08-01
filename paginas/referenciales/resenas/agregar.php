<div class="container mt-4">
  <input type="hidden" id="resena_id" value="0" />

  <div class="card shadow rounded-4">
    <div class="card-header bg-info text-white rounded-top-4">
      <h4 class="mb-0">📝 Agregar / Editar Reseña</h4>
    </div>

    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-6">
          <label for="usuario_id_lst" class="form-label">Usuario</label>
          <input type="text" id="filtro_usuario" class="form-control mb-2" placeholder="Buscar usuario...">
          <select id="usuario_id_lst" class="form-select">
            <!-- Se cargan dinámicamente -->
          </select>
        </div>

        <div class="col-md-6">
          <label for="ebook_id_lst" class="form-label">Ebook</label>
          <input type="text" id="filtro_ebook" class="form-control mb-2" placeholder="Buscar ebook...">
          <select id="ebook_id_lst" class="form-select">
            <!-- Se cargan dinámicamente -->
          </select>
        </div>

        <div class="col-md-6">
          <label for="puntuacion_lst" class="form-label">Puntuación</label>
          <select id="puntuacion_lst" class="form-select">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div class="col-md-6">
          <label for="fecha_txt" class="form-label">Fecha</label>
          <input type="date" id="fecha_txt" class="form-control" />
        </div>

        <div class="col-12">
          <label for="comentario_txt" class="form-label">Comentario</label>
          <textarea
            id="comentario_txt"
            class="form-control"
            rows="3"
            placeholder="Escribe tu comentario aquí..."
          ></textarea>
        </div>
      </div>
    </div>

    <div class="card-footer text-end">
      <button class="btn btn-success me-2" onclick="guardarResena(); return false;">
        <i class="bi bi-save"></i> Guardar
      </button>
      <button class="btn btn-danger" onclick="mostrarListarResenas(); return false;">
        <i class="bi bi-x-circle"></i> Cancelar
      </button>
    </div>
  </div>
</div>
