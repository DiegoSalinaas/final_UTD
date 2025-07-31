<div class="container mt-4">
    <input type="hidden" id="ebook_id" value="0">

    <div class="card shadow rounded-4">
        <div class="card-header bg-dark text-white rounded-top-4">
            <h4 class="mb-0">📚 Agregar / Editar Ebook</h4>
        </div>

        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="titulo_txt" class="form-label">Título</label>
                    <input type="text" id="titulo_txt" class="form-control" placeholder="Ingrese el título del ebook">
                </div>

                <div class="col-md-6">
                    <label for="autor_txt" class="form-label">Autor</label>
                    <input type="text" id="autor_txt" class="form-control" placeholder="Nombre del autor">
                </div>

                <div class="col-md-6">
                    <label for="isbn_txt" class="form-label">ISBN</label>
                    <input type="text" id="isbn_txt" class="form-control" placeholder="ISBN del libro">
                </div>

                <div class="col-md-3">
                    <label for="formato_lst" class="form-label">Formato</label>
                    <select id="formato_lst" class="form-select">
                        <option value="PDF">PDF</option>
                        <option value="EPUB">EPUB</option>
                        <option value="MOBI">MOBI</option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label for="precio_txt" class="form-label">Precio</label>
                    <input type="number" step="0.01" id="precio_txt" class="form-control" placeholder="0.00">
                </div>
            </div>
        </div>

        <div class="card-footer text-end">
            <button class="btn btn-success me-2" onclick="guardarEbook(); return false;">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-danger" onclick="mostrarListarEbooks(); return false;">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </div>
    </div>
</div>
