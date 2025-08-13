<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

if (isset($_POST['guardar'])) {
    $datos = array_map('trim', json_decode($_POST['guardar'], true));

    // Verificar si la cédula ya existe
    $query = $db->prepare("SELECT COUNT(*) FROM conductor WHERE cedula = :cedula");
    $query->execute(['cedula' => $datos['cedula']]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "INSERT INTO conductor (nombre, cedula, telefono, licencia_conduccion, estado) " .
        "VALUES (:nombre, :cedula, :telefono, :licencia_conduccion, :estado)"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['actualizar'])) {
    $datos = array_map('trim', json_decode($_POST['actualizar'], true));

    // Verificar si la cédula ya existe para otro conductor
    $query = $db->prepare(
        "SELECT COUNT(*) FROM conductor WHERE cedula = :cedula AND id_conductor <> :id_conductor"
    );
    $query->execute([
        'cedula' => $datos['cedula'],
        'id_conductor' => $datos['id_conductor']
    ]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "UPDATE conductor SET nombre = :nombre, cedula = :cedula, telefono = :telefono, " .
        "licencia_conduccion = :licencia_conduccion, estado = :estado WHERE id_conductor = :id_conductor"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['eliminar'])) {
    $query = $db->prepare("DELETE FROM conductor WHERE id_conductor = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

if (isset($_POST['leer'])) {
    $query = $db->prepare(
        "SELECT id_conductor, nombre, cedula, telefono, licencia_conduccion, estado FROM conductor ORDER BY id_conductor DESC"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $query = $db->prepare(
        "SELECT id_conductor, nombre, cedula, telefono, licencia_conduccion, estado " .
        "FROM conductor WHERE CONCAT(id_conductor, nombre, cedula, telefono, licencia_conduccion, estado) LIKE :filtro"
    );
    $query->execute(['filtro' => $filtro]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_id'])) {
    $query = $db->prepare(
        "SELECT id_conductor, nombre, cedula, telefono, licencia_conduccion, estado FROM conductor WHERE id_conductor = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}
