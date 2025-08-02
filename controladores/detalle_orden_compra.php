<?php
require_once '../conexion/db.php';

$db = new DB();
$cn = $db->conectar();

// GUARDAR DETALLE
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $query = $cn->prepare(
        "INSERT INTO detalle_orden_compra (id_orden, id_producto, cantidad, precio_unitario, subtotal) VALUES (:id_orden, :id_producto, :cantidad, :precio_unitario, :subtotal)"
    );
    $query->execute($datos);
}

// ACTUALIZAR DETALLE
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $query = $cn->prepare(
        "UPDATE detalle_orden_compra SET id_orden = :id_orden, id_producto = :id_producto, cantidad = :cantidad, precio_unitario = :precio_unitario, subtotal = :subtotal WHERE id_orden_detalle = :id_orden_detalle"
    );
    $query->execute($datos);
}

// ELIMINAR DETALLE
if (isset($_POST['eliminar'])) {
    $query = $cn->prepare("DELETE FROM detalle_orden_compra WHERE id_orden_detalle = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

// ELIMINAR DETALLES POR ORDEN
if (isset($_POST['eliminar_por_orden'])) {
    $query = $cn->prepare("DELETE FROM detalle_orden_compra WHERE id_orden = :id");
    $query->execute(['id' => $_POST['eliminar_por_orden']]);
}

// LISTAR DETALLES
if (isset($_POST['leer'])) {
    $sql =
        "SELECT d.id_orden_detalle, d.id_orden, d.id_producto, p.nombre AS producto, d.cantidad, d.precio_unitario, d.subtotal FROM detalle_orden_compra d LEFT JOIN productos p ON d.id_producto = p.producto_id";
    $params = [];
    if (!empty($_POST['id_orden'])) {
        $sql .= " WHERE d.id_orden = :id_orden";
        $params['id_orden'] = $_POST['id_orden'];
    }
    $sql .= " ORDER BY d.id_orden_detalle DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

// LEER POR ID
if (isset($_POST['leer_id'])) {
    $query = $cn->prepare(
        "SELECT id_orden_detalle, id_orden, id_producto, cantidad, precio_unitario, subtotal FROM detalle_orden_compra WHERE id_orden_detalle = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

// BUSCAR
if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $sql =
        "SELECT d.id_orden_detalle, d.id_orden, d.id_producto, p.nombre AS producto, d.cantidad, d.precio_unitario, d.subtotal FROM detalle_orden_compra d LEFT JOIN productos p ON d.id_producto = p.producto_id WHERE CONCAT(d.id_orden_detalle, p.nombre, d.id_orden) LIKE :filtro";
    $params = ['filtro' => $filtro];
    if (!empty($_POST['id_orden'])) {
        $sql .= " AND d.id_orden = :id_orden";
        $params['id_orden'] = $_POST['id_orden'];
    }
    $sql .= " ORDER BY d.id_orden_detalle DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}
?>
