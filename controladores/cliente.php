<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $query = $db->prepare(
        "INSERT INTO cliente (nombre_apellido, ruc, direccion, id_ciudad, telefono, estado) " .
        "VALUES (:nombre_apellido, :ruc, :direccion, :id_ciudad, :telefono, :estado)"
    );
    $query->execute($datos);
}

if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $query = $db->prepare(
        "UPDATE cliente SET nombre_apellido = :nombre_apellido, ruc = :ruc, " .
        "direccion = :direccion, id_ciudad = :id_ciudad, telefono = :telefono, estado = :estado " .
        "WHERE id_cliente = :id_cliente"
    );
    $query->execute($datos);
}

if (isset($_POST['eliminar'])) {
    $query = $db->prepare("DELETE FROM cliente WHERE id_cliente = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

if (isset($_POST['leer'])) {
    $query = $db->prepare(
        "SELECT p.id_cliente, p.nombre_apellido, p.ruc, p.direccion, p.telefono, p.estado, " .
        "c.descripcion AS ciudad " .
        "FROM cliente p LEFT JOIN ciudad c ON p.id_ciudad = c.id_ciudad " .
        "ORDER BY p.id_cliente DESC"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $query = $db->prepare(
        "SELECT p.id_cliente, p.nombre_apellido, p.ruc, p.direccion, p.telefono, p.estado, " .
        "c.descripcion AS ciudad " .
        "FROM cliente p LEFT JOIN ciudad c ON p.id_ciudad = c.id_ciudad " .
        "WHERE CONCAT(p.id_cliente, p.nombre_apellido, p.ruc, p.direccion, p.telefono, c.descripcion, p.estado) LIKE :filtro " .
        "ORDER BY p.id_cliente DESC"
    );
    $query->execute(['filtro' => $filtro]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_id'])) {
    $query = $db->prepare(
        "SELECT id_cliente, nombre_apellido, ruc, direccion, id_ciudad, telefono, estado " .
        "FROM cliente WHERE id_cliente = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

