<?php
require_once '../conexion/db.php';

$db = new DB();
$cn = $db->conectar();

// GUARDAR DETALLE
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $query = $cn->prepare(
        "INSERT INTO recepcion_detalle (id_recepcion, nombre_equipo, marca, modelo, numero_serie, falla_reportada, accesorios_entregados, diagnostico_preliminar, observaciones_detalle) VALUES (:id_recepcion, :nombre_equipo, :marca, :modelo, :numero_serie, :falla_reportada, :accesorios_entregados, :diagnostico_preliminar, :observaciones_detalle)"
    );
    $query->execute($datos);
    echo 'OK';
}

// ACTUALIZAR DETALLE
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $query = $cn->prepare(
        "UPDATE recepcion_detalle SET id_recepcion = :id_recepcion, nombre_equipo = :nombre_equipo, marca = :marca, modelo = :modelo, numero_serie = :numero_serie, falla_reportada = :falla_reportada, accesorios_entregados = :accesorios_entregados, diagnostico_preliminar = :diagnostico_preliminar, observaciones_detalle = :observaciones_detalle WHERE id_detalle = :id_detalle"
    );
    $query->execute($datos);
}

// ELIMINAR DETALLE
if (isset($_POST['eliminar'])) {
    $query = $cn->prepare("DELETE FROM recepcion_detalle WHERE id_detalle = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

// ELIMINAR DETALLES POR RECEPCION
if (isset($_POST['eliminar_por_recepcion'])) {
    $query = $cn->prepare("DELETE FROM recepcion_detalle WHERE id_recepcion = :id");
    $query->execute(['id' => $_POST['eliminar_por_recepcion']]);
}

// LISTAR DETALLES
if (isset($_POST['leer'])) {
    $sql = "SELECT id_detalle, id_recepcion, nombre_equipo, marca, modelo, numero_serie, falla_reportada, accesorios_entregados, diagnostico_preliminar, observaciones_detalle FROM recepcion_detalle";
    $params = [];
    if (!empty($_POST['id_recepcion'])) {
        $sql .= " WHERE id_recepcion = :id_recepcion";
        $params['id_recepcion'] = $_POST['id_recepcion'];

        if (!empty($_POST['sin_diagnostico'])) {
            $sql .= " AND id_detalle NOT IN (SELECT id_detalle_recepcion FROM diagnostico WHERE id_recepcion = :id_recepcion)";
        }
    } elseif (!empty($_POST['sin_diagnostico'])) {
        // Filtrar sin diagnóstico para todas las recepciones
        $sql .= " WHERE id_detalle NOT IN (SELECT id_detalle_recepcion FROM diagnostico)";
    }
    $sql .= " ORDER BY id_detalle DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

// LEER POR ID
if (isset($_POST['leer_id'])) {
    $query = $cn->prepare(
        "SELECT id_detalle, id_recepcion, nombre_equipo, marca, modelo, numero_serie, falla_reportada, accesorios_entregados, diagnostico_preliminar, observaciones_detalle FROM recepcion_detalle WHERE id_detalle = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

// BUSCAR
if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $sql = "SELECT id_detalle, id_recepcion, nombre_equipo, marca, modelo, numero_serie, falla_reportada, accesorios_entregados, diagnostico_preliminar, observaciones_detalle FROM recepcion_detalle WHERE CONCAT(nombre_equipo, marca, modelo, numero_serie) LIKE :filtro";
    $params = ['filtro' => $filtro];
    if (!empty($_POST['id_recepcion'])) {
        $sql .= " AND id_recepcion = :id_recepcion";
        $params['id_recepcion'] = $_POST['id_recepcion'];
    }
    $sql .= " ORDER BY id_detalle DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}
?>

