<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

if (isset($_POST['guardar'])) {
    $datos = array_map('trim', json_decode($_POST['guardar'], true));

    // Verificar si la ciudad ya existe (ignorando mayúsculas/minúsculas)
    $query = $db->prepare("SELECT COUNT(*) FROM ciudad WHERE LOWER(TRIM(descripcion)) = LOWER(:descripcion)");
    $query->execute(['descripcion' => $datos['descripcion']]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "INSERT INTO ciudad (descripcion, id_departamento, estado) " .
        "VALUES (:descripcion, :id_departamento, :estado)"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['actualizar'])) {
    $datos = array_map('trim', json_decode($_POST['actualizar'], true));

    // Verificar si la ciudad ya existe para otro registro
    $query = $db->prepare(
        "SELECT COUNT(*) FROM ciudad WHERE LOWER(TRIM(descripcion)) = LOWER(:descripcion) AND id_ciudad <> :id_ciudad"
    );
    $query->execute([
        'descripcion' => $datos['descripcion'],
        'id_ciudad' => $datos['id_ciudad']
    ]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "UPDATE ciudad SET descripcion = :descripcion, id_departamento = :id_departamento, estado = :estado " .
        "WHERE id_ciudad = :id_ciudad"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['eliminar'])) {
    $query = $db->prepare("DELETE FROM ciudad WHERE id_ciudad = :id_ciudad");
    $query->execute(['id_ciudad' => $_POST['eliminar']]);
}

if (isset($_POST['leer'])) {
    $query = $db->prepare(
        "SELECT c.id_ciudad, c.descripcion, d.descripcion AS departamentos, c.estado " .
        "FROM ciudad c JOIN departamentos d ON d.id_departamento = c.id_departamento"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $query = $db->prepare(
        "SELECT c.id_ciudad, c.descripcion, d.descripcion AS departamentos, c.estado " .
        "FROM ciudad c JOIN departamentos d ON d.id_departamento = c.id_departamento " .
        "WHERE CONCAT(c.id_ciudad, c.descripcion, d.descripcion, c.estado) LIKE :filtro"
    );
    $query->execute(['filtro' => $filtro]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_id'])) {
    $query = $db->prepare(
        "SELECT c.id_ciudad, c.descripcion, c.estado, d.descripcion AS departamentos, c.id_departamento " .
        "FROM ciudad c JOIN departamentos d ON c.id_departamento = d.id_departamento " .
        "WHERE c.id_ciudad = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

