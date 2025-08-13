<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

if (isset($_POST['guardar'])) {
    $datos = array_map('trim', json_decode($_POST['guardar'], true));

    $query = $db->prepare("SELECT COUNT(*) FROM puntos WHERE LOWER(TRIM(nombre)) = LOWER(:nombre)");
    $query->execute(['nombre' => $datos['nombre']]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "INSERT INTO puntos (nombre, direccion, id_ciudad, estado) " .
        "VALUES (:nombre, :direccion, :id_ciudad, :estado)"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['actualizar'])) {
    $datos = array_map('trim', json_decode($_POST['actualizar'], true));

    $query = $db->prepare(
        "SELECT COUNT(*) FROM puntos WHERE LOWER(TRIM(nombre)) = LOWER(:nombre) AND id_punto <> :id_punto"
    );
    $query->execute([
        'nombre' => $datos['nombre'],
        'id_punto' => $datos['id_punto']
    ]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "UPDATE puntos SET nombre = :nombre, direccion = :direccion, id_ciudad = :id_ciudad, estado = :estado " .
        "WHERE id_punto = :id_punto"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['eliminar'])) {
    $query = $db->prepare("DELETE FROM puntos WHERE id_punto = :id_punto");
    $query->execute(['id_punto' => $_POST['eliminar']]);
}

if (isset($_POST['leer'])) {
    $query = $db->prepare(
        "SELECT p.id_punto, p.nombre, p.direccion, c.descripcion AS ciudad, p.estado " .
        "FROM puntos p JOIN ciudad c ON c.id_ciudad = p.id_ciudad"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $query = $db->prepare(
        "SELECT p.id_punto, p.nombre, p.direccion, c.descripcion AS ciudad, p.estado " .
        "FROM puntos p JOIN ciudad c ON c.id_ciudad = p.id_ciudad " .
        "WHERE CONCAT(p.id_punto, p.nombre, p.direccion, c.descripcion, p.estado) LIKE :filtro"
    );
    $query->execute(['filtro' => $filtro]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_id'])) {
    $query = $db->prepare(
        "SELECT p.id_punto, p.nombre, p.direccion, p.id_ciudad, c.descripcion AS ciudad, p.estado " .
        "FROM puntos p JOIN ciudad c ON c.id_ciudad = p.id_ciudad " .
        "WHERE p.id_punto = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}
