<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

if (isset($_POST['guardar'])) {
 
 $datos = array_map('trim', json_decode($_POST['guardar'], true));
    // Verificar si el RUC ya existe
    $query = $db->prepare("SELECT COUNT(*) FROM proveedor WHERE ruc = :ruc");
    $query->execute(['ruc' => $datos['ruc']]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "INSERT INTO proveedor (razon_social, ruc, direccion, id_ciudad, telefono, estado) " .
        "VALUES (:razon_social, :ruc, :direccion, :id_ciudad, :telefono, :estado)"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);

    // Verificar si el RUC ya existe para otro proveedor
    $query = $db->prepare("SELECT COUNT(*) FROM proveedor WHERE ruc = :ruc AND id_proveedor <> :id_proveedor");
    $query->execute([
        'ruc' => $datos['ruc'],
        'id_proveedor' => $datos['id_proveedor']
    ]);
    if ($query->fetchColumn() > 0) {
        echo 'duplicado';
        return;
    }

    $query = $db->prepare(
        "UPDATE proveedor SET razon_social = :razon_social, ruc = :ruc, " .
        "direccion = :direccion, id_ciudad = :id_ciudad, telefono = :telefono, estado = :estado " .
        "WHERE id_proveedor = :id_proveedor"
    );
    $query->execute($datos);
    echo 'ok';
}

if (isset($_POST['eliminar'])) {
    $query = $db->prepare("DELETE FROM proveedor WHERE id_proveedor = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

if (isset($_POST['leer'])) {
    $query = $db->prepare(
        "SELECT p.id_proveedor, p.razon_social, p.ruc, p.direccion, p.telefono, p.estado, " .
        "c.descripcion AS ciudad " .
        "FROM proveedor p LEFT JOIN ciudad c ON p.id_ciudad = c.id_ciudad " .
        "ORDER BY p.id_proveedor DESC"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leerActivo'])) {
    $query = $db->prepare(
        "SELECT p.id_proveedor, p.razon_social, p.ruc, p.direccion, p.telefono, p.estado, " .
        "c.descripcion AS ciudad " .
        "FROM proveedor p LEFT JOIN ciudad c ON p.id_ciudad = c.id_ciudad " .
        "WHERE p.estado = 'ACTIVO' " .
        "ORDER BY p.id_proveedor DESC"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $query = $db->prepare(
        "SELECT p.id_proveedor, p.razon_social, p.ruc, p.direccion, p.telefono, p.estado, " .
        "c.descripcion AS ciudad " .
        "FROM proveedor p LEFT JOIN ciudad c ON p.id_ciudad = c.id_ciudad " .
        "WHERE CONCAT(p.id_proveedor, p.razon_social, p.ruc, p.direccion, p.telefono, c.descripcion, p.estado) LIKE :filtro " .
        "ORDER BY p.id_proveedor DESC"
    );
    $query->execute(['filtro' => $filtro]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['leer_id'])) {
    $query = $db->prepare(
        "SELECT id_proveedor, razon_social, ruc, direccion, id_ciudad, telefono, estado " .
        "FROM proveedor WHERE id_proveedor = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

if (isset($_POST['actualizar_estado'])) {
    $id = $_POST['actualizar_estado'];
    $db = new DB();
    $query = $db->conectar()->prepare("UPDATE proveedor SET estado = 'INACTIVO' WHERE id_proveedor = :id");
    $query->execute(['id' => $id]);
}




