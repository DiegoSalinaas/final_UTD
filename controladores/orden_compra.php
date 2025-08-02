<?php
require_once '../conexion/db.php';

// GUARDAR ORDEN
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "INSERT INTO orden_compra (fecha_emision, estado, id_presupuesto, id_proveedor) VALUES (:fecha_emision, 'EMITIDO', :id_presupuesto, :id_proveedor)"
    );
    $query->execute($datos);
    echo $cn->lastInsertId();
}

// ACTUALIZAR ORDEN
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $db = new DB();
    $query = $db->conectar()->prepare(
        "UPDATE orden_compra SET fecha_emision = :fecha_emision, id_presupuesto = :id_presupuesto, id_proveedor = :id_proveedor WHERE id_orden = :id_orden"
    );
    $query->execute($datos);
}

// ELIMINAR ORDEN
if (isset($_POST['eliminar'])) {
    $db = new DB();
    $query = $db->conectar()->prepare("DELETE FROM orden_compra WHERE id_orden = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

// LEER TODAS LAS ORDENES
if (isset($_POST['leer'])) {
    $db = new DB();
    $query = $db->conectar()->prepare(
        "SELECT o.id_orden, o.fecha_emision, o.id_presupuesto, o.id_proveedor, pr.razon_social AS proveedor, o.estado FROM orden_compra o LEFT JOIN proveedor pr ON o.id_proveedor = pr.id_proveedor ORDER BY o.id_orden DESC"
    );
    $query->execute();
    if ($query->rowCount()) {
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}

// LEER POR ID
if (isset($_POST['leer_id'])) {
    $db = new DB();
    $query = $db->conectar()->prepare(
        "SELECT o.id_orden, o.fecha_emision, o.id_presupuesto, o.id_proveedor, pr.razon_social AS proveedor, o.estado FROM orden_compra o LEFT JOIN proveedor pr ON o.id_proveedor = pr.id_proveedor WHERE o.id_orden = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    if ($query->rowCount()) {
        echo json_encode($query->fetch(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}

// LEER POR DESCRIPCION
if (isset($_POST['leer_descripcion'])) {
    $f = '%' . $_POST['leer_descripcion'] . '%';
    $db = new DB();
    $query = $db->conectar()->prepare(
        "SELECT o.id_orden, o.fecha_emision, o.id_presupuesto, o.id_proveedor, pr.razon_social AS proveedor, o.estado FROM orden_compra o LEFT JOIN proveedor pr ON o.id_proveedor = pr.id_proveedor WHERE CONCAT(o.id_orden, pr.razon_social) LIKE :filtro ORDER BY o.id_orden DESC"
    );
    $query->execute(['filtro' => $f]);
    if ($query->rowCount()) {
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}
?>
