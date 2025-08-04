<?php
require_once '../conexion/db.php';

$db = new DB();
$cn = $db->conectar();

// GUARDAR DETALLE
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $query = $cn->prepare(
        "INSERT INTO detalle_remision (id_remision, id_producto, cantidad, precio_unitario, subtotal) VALUES (:id_remision, :id_producto, :cantidad, :precio_unitario, :subtotal)"
    );
    $query->execute($datos);
}

// ACTUALIZAR DETALLE
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $query = $cn->prepare(
        "UPDATE detalle_remision SET id_remision = :id_remision, id_producto = :id_producto, cantidad = :cantidad, precio_unitario = :precio_unitario, subtotal = :subtotal WHERE id_detalle_remision = :id_detalle_remision"
    );
    $query->execute($datos);
}

// ELIMINAR DETALLE
if (isset($_POST['eliminar'])) {
    $query = $cn->prepare("DELETE FROM detalle_remision WHERE id_detalle_remision = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

// ELIMINAR DETALLES POR REMISION
if (isset($_POST['eliminar_por_remision'])) {
    $query = $cn->prepare("DELETE FROM detalle_remision WHERE id_remision = :id");
    $query->execute(['id' => $_POST['eliminar_por_remision']]);
}

// LISTAR DETALLES
if (isset($_POST['leer'])) {
    $sql =
        "SELECT d.id_detalle_remision, d.id_remision, d.id_producto, p.nombre AS producto, d.cantidad, d.precio_unitario, d.subtotal FROM detalle_remision d LEFT JOIN productos p ON d.id_producto = p.producto_id";
    $params = [];
    if (!empty($_POST['id_remision'])) {
        $sql .= " WHERE d.id_remision = :id_remision";
        $params['id_remision'] = $_POST['id_remision'];
    }
    $sql .= " ORDER BY d.id_detalle_remision DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

// LEER POR ID
if (isset($_POST['leer_id'])) {
    $query = $cn->prepare(
        "SELECT id_detalle_remision, id_remision, id_producto, cantidad, precio_unitario, subtotal FROM detalle_remision WHERE id_detalle_remision = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

// BUSCAR
if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $sql =
        "SELECT d.id_detalle_remision, d.id_remision, d.id_producto, p.nombre AS producto, d.cantidad, d.precio_unitario, d.subtotal FROM detalle_remision d LEFT JOIN productos p ON d.id_producto = p.producto_id WHERE CONCAT(d.id_detalle_remision, p.nombre, d.id_remision) LIKE :filtro";
    $params = ['filtro' => $filtro];
    if (!empty($_POST['id_remision'])) {
        $sql .= " AND d.id_remision = :id_remision";
        $params['id_remision'] = $_POST['id_remision'];
    }
    $sql .= " ORDER BY d.id_detalle_remision DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}
?>
