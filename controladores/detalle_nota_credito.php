<?php
require_once '../conexion/db.php';

$db = new DB();
$cn = $db->conectar();

// GUARDAR DETALLE
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);

    if (floatval($datos['cantidad']) <= 0) {
        echo 'CANTIDAD_INVALIDA';
        return;
    }

    if (floatval($datos['precio_unitario']) <= 0) {
        echo 'PRECIO_INVALIDO';
        return;
    }

    $query = $cn->prepare("INSERT INTO detalle_nota_credito (id_nota_credito, id_producto, descripcion, cantidad, precio_unitario, subtotal, total_linea) VALUES (:id_nota_credito, :id_producto, :descripcion, :cantidad, :precio_unitario, :subtotal, :total_linea)");
    $query->execute([
        'id_nota_credito' => $datos['id_nota_credito'],
        'id_producto' => $datos['id_producto'],
        'descripcion' => $datos['descripcion'],
        'cantidad' => $datos['cantidad'],
        'precio_unitario' => $datos['precio_unitario'],
        'subtotal' => $datos['subtotal'],
        'total_linea' => $datos['total_linea']
    ]);
    $idDetalle = $cn->lastInsertId();
    $cn->prepare("INSERT INTO motivo_item_nota_credito (id_detalle, motivo, observacion) VALUES (:id_detalle, :motivo, :observacion)")->execute([
        'id_detalle' => $idDetalle,
        'motivo' => $datos['motivo'],
        'observacion' => $datos['observacion']
    ]);
    echo "OK";
}

// ACTUALIZAR DETALLE
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $query = $cn->prepare("UPDATE detalle_nota_credito SET id_nota_credito = :id_nota_credito, id_producto = :id_producto, descripcion = :descripcion, cantidad = :cantidad, precio_unitario = :precio_unitario, subtotal = :subtotal, total_linea = :total_linea WHERE id_detalle = :id_detalle");
    $query->execute($datos);
    $cn->prepare("UPDATE motivo_item_nota_credito SET motivo = :motivo, observacion = :observacion WHERE id_detalle = :id_detalle")->execute([
        'motivo' => $datos['motivo'],
        'observacion' => $datos['observacion'],
        'id_detalle' => $datos['id_detalle']
    ]);
}

// ELIMINAR DETALLE
if (isset($_POST['eliminar'])) {
    $cn->prepare("DELETE FROM motivo_item_nota_credito WHERE id_detalle = :id")->execute(['id' => $_POST['eliminar']]);
    $cn->prepare("DELETE FROM detalle_nota_credito WHERE id_detalle = :id")->execute(['id' => $_POST['eliminar']]);
}

// ELIMINAR DETALLES POR NOTA
if (isset($_POST['eliminar_por_nota'])) {
    $detalles = $cn->prepare("SELECT id_detalle FROM detalle_nota_credito WHERE id_nota_credito = :id");
    $detalles->execute(['id' => $_POST['eliminar_por_nota']]);
    foreach ($detalles->fetchAll(PDO::FETCH_COLUMN) as $id) {
        $cn->prepare("DELETE FROM motivo_item_nota_credito WHERE id_detalle = :id")->execute(['id' => $id]);
    }
    $cn->prepare("DELETE FROM detalle_nota_credito WHERE id_nota_credito = :id")->execute(['id' => $_POST['eliminar_por_nota']]);
}

// LISTAR DETALLES
if (isset($_POST['leer'])) {
    $sql = "SELECT d.id_detalle, d.id_nota_credito, d.id_producto, p.nombre AS producto, d.descripcion, d.cantidad, d.precio_unitario, d.subtotal, d.total_linea, m.motivo, m.observacion FROM detalle_nota_credito d LEFT JOIN productos p ON d.id_producto = p.producto_id LEFT JOIN motivo_item_nota_credito m ON d.id_detalle = m.id_detalle";
    $params = [];
    if (!empty($_POST['id_nota_credito'])) {
        $sql .= " WHERE d.id_nota_credito = :id_nota_credito";
        $params['id_nota_credito'] = $_POST['id_nota_credito'];
    }
    $sql .= " ORDER BY d.id_detalle DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

// LEER POR ID
if (isset($_POST['leer_id'])) {
    $query = $cn->prepare("SELECT d.id_detalle, d.id_nota_credito, d.id_producto, d.descripcion, d.cantidad, d.precio_unitario, d.subtotal, d.total_linea, m.motivo, m.observacion FROM detalle_nota_credito d LEFT JOIN motivo_item_nota_credito m ON d.id_detalle = m.id_detalle WHERE d.id_detalle = :id");
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

// BUSCAR
if (isset($_POST['leer_descripcion'])) {
    $filtro = '%' . $_POST['leer_descripcion'] . '%';
    $sql = "SELECT d.id_detalle, d.id_nota_credito, d.id_producto, p.nombre AS producto, d.descripcion, d.cantidad, d.precio_unitario, d.subtotal, d.total_linea, m.motivo, m.observacion FROM detalle_nota_credito d LEFT JOIN productos p ON d.id_producto = p.producto_id LEFT JOIN motivo_item_nota_credito m ON d.id_detalle = m.id_detalle WHERE CONCAT(d.id_detalle, p.nombre, d.descripcion) LIKE :filtro";
    $params = ['filtro' => $filtro];
    if (!empty($_POST['id_nota_credito'])) {
        $sql .= " AND d.id_nota_credito = :id_nota_credito";
        $params['id_nota_credito'] = $_POST['id_nota_credito'];
    }
    $sql .= " ORDER BY d.id_detalle DESC";
    $query = $cn->prepare($sql);
    $query->execute($params);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}
?>
