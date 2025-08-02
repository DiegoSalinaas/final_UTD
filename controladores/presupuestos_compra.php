<?php
require_once '../conexion/db.php';

// GUARDAR PRESUPUESTO
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "INSERT INTO presupuestos_compra (fecha, id_proveedor, total_estimado, estado) VALUES (:fecha, :id_proveedor, :total_estimado, 'PENDIENTE')"
    );
    $query->execute($datos);
    echo $cn->lastInsertId();
}

// ACTUALIZAR PRESUPUESTO
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $db = new DB();
    $query = $db->conectar()->prepare(
        "UPDATE presupuestos_compra SET fecha = :fecha, id_proveedor = :id_proveedor, total_estimado = :total_estimado WHERE id_presupuesto = :id_presupuesto"
    );
    $query->execute($datos);
}

// ELIMINAR PRESUPUESTO
if (isset($_POST['eliminar'])) {
    $db = new DB();
    $query = $db->conectar()->prepare("DELETE FROM presupuestos_compra WHERE id_presupuesto = :id");
    $query->execute(["id" => $_POST['eliminar']]);
}

// ANULAR PRESUPUESTO
if (isset($_POST['anular'])) {
    $db = new DB();
    $query = $db->conectar()->prepare("UPDATE presupuestos_compra SET estado = 'ANULADO' WHERE id_presupuesto = :id");
    $query->execute(['id' => $_POST['anular']]);
}

// LEER TODAS LOS PRESUPUESTOS
if (isset($_POST['leer'])) {
    $db = new DB();
    $query = $db->conectar()->prepare(
        "SELECT p.id_presupuesto, p.fecha, p.id_proveedor, pr.razon_social AS proveedor, p.total_estimado, p.estado FROM presupuestos_compra p LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor ORDER BY p.id_presupuesto DESC"
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
        "SELECT p.id_presupuesto, p.fecha, p.id_proveedor, pr.razon_social AS proveedor, p.total_estimado, p.estado " .
        "FROM presupuestos_compra p LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor " .
        "WHERE p.id_presupuesto = :id"
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
        "SELECT p.id_presupuesto, p.fecha, p.id_proveedor, pr.razon_social AS proveedor, p.total_estimado, p.estado FROM presupuestos_compra p LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor WHERE CONCAT(p.id_presupuesto, pr.razon_social) LIKE :filtro ORDER BY p.id_presupuesto DESC"
    );
    $query->execute(['filtro' => $f]);
    if ($query->rowCount()) {
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}
?>
