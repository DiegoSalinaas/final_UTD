<?php
require_once '../conexion/db.php';

// GUARDAR RECEPCION
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "INSERT INTO recepcion (fecha_recepcion, id_cliente, nombre_cliente, telefono, direccion, estado, observaciones)
        VALUES (:fecha_recepcion, :id_cliente, :nombre_cliente, :telefono, :direccion, :estado, :observaciones)"
    );
    $query->execute($datos);
    echo $cn->lastInsertId();
}

// ACTUALIZAR RECEPCION
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "UPDATE recepcion SET fecha_recepcion = :fecha_recepcion, id_cliente = :id_cliente, nombre_cliente = :nombre_cliente, telefono = :telefono, direccion = :direccion, estado = :estado, observaciones = :observaciones WHERE id_recepcion = :id_recepcion"
    );
    $query->execute($datos);
}

// CERRAR RECEPCION
if (isset($_POST['cerrar'])) {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("UPDATE recepcion SET estado = 'CERRADA' WHERE id_recepcion = :id");
    $query->execute(['id' => $_POST['cerrar']]);
}

// ELIMINAR RECEPCION
if (isset($_POST['eliminar'])) {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("DELETE FROM recepcion WHERE id_recepcion = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

// LISTAR RECEPCIONES
if (isset($_POST['leer'])) {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "SELECT r.id_recepcion, r.fecha_recepcion, r.nombre_cliente, r.telefono, r.direccion, r.estado, r.observaciones, IFNULL(COUNT(d.id_detalle),0) AS equipos
         FROM recepcion r
         LEFT JOIN recepcion_detalle d ON r.id_recepcion = d.id_recepcion
         GROUP BY r.id_recepcion, r.fecha_recepcion, r.nombre_cliente, r.telefono, r.direccion, r.estado, r.observaciones
         ORDER BY r.id_recepcion DESC"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}

// LEER POR ID
if (isset($_POST['leer_id'])) {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "SELECT id_recepcion, fecha_recepcion, id_cliente, nombre_cliente, telefono, direccion, estado, observaciones FROM recepcion WHERE id_recepcion = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

// BUSCAR POR DESCRIPCION (NOMBRE CLIENTE)
if (isset($_POST['leer_descripcion'])) {
    $f = '%' . $_POST['leer_descripcion'] . '%';
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "SELECT r.id_recepcion, r.fecha_recepcion, r.nombre_cliente, r.telefono, r.direccion, r.estado, r.observaciones, IFNULL(COUNT(d.id_detalle),0) AS equipos
         FROM recepcion r
         LEFT JOIN recepcion_detalle d ON r.id_recepcion = d.id_recepcion
         WHERE CONCAT(r.nombre_cliente, r.telefono, r.direccion, r.estado, r.observaciones) LIKE :filtro
         GROUP BY r.id_recepcion, r.fecha_recepcion, r.nombre_cliente, r.telefono, r.direccion, r.estado, r.observaciones
         ORDER BY r.id_recepcion DESC"
    );
    $query->execute(['filtro' => $f]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}
?>
