<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

if (isset($_POST['guardar'])) {
    // Limpiar espacios en blanco
    $datos = array_map('trim', json_decode($_POST['guardar'], true));

    // Verificar si el RUC ya existe
    $query = $db->prepare("SELECT COUNT(*) FROM clientes WHERE ruc = :ruc");
    $query->execute(['ruc' => $datos['ruc']]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "INSERT INTO clientes (nombre_apellido, ruc, direccion, id_ciudad, telefono, estado) " .
        "VALUES (:nombre_apellido, :ruc, :direccion, :id_ciudad, :telefono, :estado)"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['actualizar'])) {
    // Limpiar espacios en blanco
    $datos = array_map('trim', json_decode($_POST['actualizar'], true));

    // Verificar si el RUC ya existe para otro cliente
    $query = $db->prepare("SELECT COUNT(*) FROM clientes WHERE ruc = :ruc AND id_cliente <> :id_cliente");
    $query->execute([
        'ruc' => $datos['ruc'],
        'id_cliente' => $datos['id_cliente']
    ]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "UPDATE clientes SET nombre_apellido = :nombre_apellido, ruc = :ruc, " .
        "direccion = :direccion, id_ciudad = :id_ciudad, telefono = :telefono, estado = :estado " .
        "WHERE id_cliente = :id_cliente"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['eliminar'])) {
    $query = $db->prepare("DELETE FROM clientes WHERE id_cliente = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

if (isset($_POST['leer'])) {
    $query = $db->prepare(
        "SELECT p.id_cliente, p.nombre_apellido, p.ruc, p.direccion, p.telefono, p.estado, " .
        "c.descripcion AS ciudad " .
        "FROM clientes p LEFT JOIN ciudad c ON p.id_ciudad = c.id_ciudad " .
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
        "FROM clientes p LEFT JOIN ciudad c ON p.id_ciudad = c.id_ciudad " .
        "WHERE CONCAT(p.id_cliente, p.nombre_apellido, p.ruc, p.direccion, p.telefono, c.descripcion, p.estado) LIKE :filtro " .
        "ORDER BY p.id_cliente DESC"
    );
    $query->execute(['filtro' => $filtro]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_id'])) {
    $query = $db->prepare(
        "SELECT id_cliente, nombre_apellido, ruc, direccion, id_ciudad, telefono, estado " .
        "FROM clientes WHERE id_cliente = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['actualizar_estado'])) {
    $id = $_POST['actualizar_estado'];
    $db = new DB();
    $query = $db->conectar()->prepare("UPDATE clientes SET estado = 'INACTIVO' WHERE id_cliente = :id");
    $query->execute(['id' => $id]);
}
if (isset($_POST['validar_ruc'])) {
    $ruc = $_POST['validar_ruc'];
    $query = $db->prepare("SELECT COUNT(*) FROM clientes WHERE ruc = :ruc");
    $query->execute(['ruc' => $ruc]);
    echo $query->fetchColumn(); // devuelve 0 o 1+
}
