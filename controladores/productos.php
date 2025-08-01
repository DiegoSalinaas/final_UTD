<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $query = $db->prepare(
        "INSERT INTO productos (nombre, descripcion, precio, tipo, estado) " .
        "VALUES (:nombre, :descripcion, :precio, :tipo, :estado)"
    );
    $query->execute($datos);
}

if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $query = $db->prepare(
        "UPDATE productos SET nombre = :nombre, descripcion = :descripcion, " .
        "precio = :precio, tipo = :tipo, estado = :estado " .
        "WHERE producto_id = :producto_id"
    );
    $query->execute($datos);
}

if (isset($_POST['eliminar'])) {
    $query = $db->prepare("DELETE FROM productos WHERE producto_id = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

if (isset($_POST['leer'])) {
    $query = $db->prepare(
        "SELECT producto_id, nombre, descripcion, precio, tipo, estado " .
        "FROM productos ORDER BY producto_id DESC"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leerActivo'])) {
    $query = $db->prepare(
        "SELECT producto_id, nombre, descripcion, precio, tipo, estado " .
        "FROM productos WHERE estado = 'ACTIVO' " .
        "ORDER BY producto_id DESC"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $query = $db->prepare(
        "SELECT producto_id, nombre, descripcion, precio, tipo, estado " .
        "FROM productos WHERE CONCAT(producto_id, nombre, descripcion, precio, tipo, estado) LIKE :filtro " .
        "ORDER BY producto_id DESC"
    );
    $query->execute(['filtro' => $filtro]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_id'])) {
    $query = $db->prepare(
        "SELECT producto_id, nombre, descripcion, precio, tipo, estado " .
        "FROM productos WHERE producto_id = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}
?>
