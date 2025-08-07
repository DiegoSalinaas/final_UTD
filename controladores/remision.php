<?php
require_once '../conexion/db.php';

// GUARDAR REMISION
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "INSERT INTO remision (id_cliente, fecha_remision, observacion, estado) VALUES (:id_cliente, :fecha_remision, :observacion, :estado)"
    );
    $query->execute($datos);
    echo $cn->lastInsertId();
}

// ACTUALIZAR REMISION
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "UPDATE remision SET id_cliente = :id_cliente, fecha_remision = :fecha_remision, observacion = :observacion, estado = :estado WHERE id_remision = :id_remision"
    );
    $query->execute($datos);
}

// ANULAR REMISION
if (isset($_POST['anular'])) {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("UPDATE remision SET estado = 'ANULADO' WHERE id_remision = :id");
    $query->execute(['id' => $_POST['anular']]);
}

// LEER TODAS LAS REMISIONES
if (isset($_POST['leer'])) {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "SELECT r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido AS cliente, r.observacion, r.estado, IFNULL(SUM(d.subtotal),0) AS total
         FROM remision r
         LEFT JOIN clientes c ON r.id_cliente = c.id_cliente
         LEFT JOIN detalle_remision d ON r.id_remision = d.id_remision
         GROUP BY r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido, r.observacion, r.estado
         ORDER BY r.id_remision DESC"
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
    $cn = $db->conectar();
    $query = $cn->prepare(
        "SELECT r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido AS cliente, r.observacion, r.estado, IFNULL(SUM(d.subtotal),0) AS total
         FROM remision r
         LEFT JOIN clientes c ON r.id_cliente = c.id_cliente
         LEFT JOIN detalle_remision d ON r.id_remision = d.id_remision
         WHERE r.id_remision = :id
         GROUP BY r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido, r.observacion, r.estado"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    if ($query->rowCount()) {
       

        echo json_encode($query->fetch(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}

// LEER POR CLIENTE
if (isset($_POST['leer_descripcion'])) {
    $f = '%' . $_POST['leer_descripcion'] . '%';
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "SELECT r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido AS cliente, r.observacion, r.estado, IFNULL(SUM(d.subtotal),0) AS total
         FROM remision r
         LEFT JOIN clientes c ON r.id_cliente = c.id_cliente
         LEFT JOIN detalle_remision d ON r.id_remision = d.id_remision
         WHERE c.nombre_apellido LIKE :filtro
         GROUP BY r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido, r.observacion, r.estado
         ORDER BY r.id_remision DESC"
    );
    $query->execute(['filtro' => $f]);
    if ($query->rowCount()) {
      

        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}
?>
