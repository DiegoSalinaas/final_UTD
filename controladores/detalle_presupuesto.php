<?php
require_once '../conexion/db.php';

$db = new DB();
$cn = $db->conectar();

// GUARDAR DETALLE
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $query = $cn->prepare(
        "INSERT INTO detalle_presupuesto (id_presupuesto, id_producto, cantidad, precio_unitario, subtotal) " .
        "VALUES (:id_presupuesto, :id_producto, :cantidad, :precio_unitario, :subtotal)"
    );
    $query->execute($datos);
}

// ACTUALIZAR DETALLE
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $query = $cn->prepare(
        "UPDATE detalle_presupuesto SET id_presupuesto = :id_presupuesto, id_producto = :id_producto, " .
        "cantidad = :cantidad, precio_unitario = :precio_unitario, subtotal = :subtotal " .
        "WHERE id_detalle = :id_detalle"
    );
    $query->execute($datos);
}

// ELIMINAR DETALLE
if (isset($_POST['eliminar'])) {
    $query = $cn->prepare("DELETE FROM detalle_presupuesto WHERE id_detalle = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

// LISTAR DETALLES
if (isset($_POST['leer'])) {
    $sql =
        "SELECT d.id_detalle, d.id_presupuesto, d.id_producto, p.nombre AS producto, " .
        "d.cantidad, d.precio_unitario, d.subtotal " .
        "FROM detalle_presupuesto d " .
        "LEFT JOIN productos p ON d.id_producto = p.producto_id";
    $params = [];
    if (!empty($_POST['id_presupuesto'])) {
        $sql .= " WHERE d.id_presupuesto = :id_presupuesto";
        $params['id_presupuesto'] = $_POST['id_presupuesto'];
    }
    $sql .= " ORDER BY d.id_detalle DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

// LEER POR ID
if (isset($_POST['leer_id'])) {
    $query = $cn->prepare(
        "SELECT id_detalle, id_presupuesto, id_producto, cantidad, precio_unitario, subtotal " .
        "FROM detalle_presupuesto WHERE id_detalle = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

// BUSCAR
if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $sql =
        "SELECT d.id_detalle, d.id_presupuesto, d.id_producto, p.nombre AS producto, " .
        "d.cantidad, d.precio_unitario, d.subtotal " .
        "FROM detalle_presupuesto d " .
        "LEFT JOIN productos p ON d.id_producto = p.producto_id " .
        "WHERE CONCAT(d.id_detalle, p.nombre, d.id_presupuesto) LIKE :filtro";
    $params = ['filtro' => $filtro];
    if (!empty($_POST['id_presupuesto'])) {
        $sql .= " AND d.id_presupuesto = :id_presupuesto";
        $params['id_presupuesto'] = $_POST['id_presupuesto'];
    }
    $sql .= " ORDER BY d.id_detalle DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}
?>
