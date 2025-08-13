<?php
require_once '../conexion/db.php';

// GUARDAR PRESUPUESTO
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "INSERT INTO presupuestos_compra (fecha, id_proveedor, total_estimado, validez, estado) VALUES (:fecha, :id_proveedor, :total_estimado, :validez, 'PENDIENTE')"
    );
    $query->execute($datos);
    echo $cn->lastInsertId();
}

// ACTUALIZAR PRESUPUESTO
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $db = new DB();
    $query = $db->conectar()->prepare(
        "UPDATE presupuestos_compra SET fecha = :fecha, id_proveedor = :id_proveedor, total_estimado = :total_estimado, validez = :validez WHERE id_presupuesto = :id_presupuesto"
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
        "SELECT p.id_presupuesto, p.fecha, p.id_proveedor, pr.razon_social AS proveedor, p.total_estimado, p.validez, p.estado FROM presupuestos_compra p LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor ORDER BY p.id_presupuesto DESC"
    );
    $query->execute();
    if ($query->rowCount()) {
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}

// LEER PRESUPUESTOS PENDIENTES
if (isset($_POST['leerPendiente'])) {
    $db = new DB();
    $query = $db->conectar()->prepare(
        "SELECT p.id_presupuesto, p.fecha, p.id_proveedor, pr.razon_social AS proveedor, p.total_estimado, p.validez, p.estado FROM presupuestos_compra p LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor WHERE p.estado = 'PENDIENTE' ORDER BY p.id_presupuesto DESC"
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
        "SELECT p.id_presupuesto, p.fecha, p.id_proveedor, pr.razon_social AS proveedor, p.total_estimado, p.validez, p.estado " .
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
    $estado = $_POST['estado'] ?? '';
    $f_desde = $_POST['f_desde'] ?? '';
    $f_hasta = $_POST['f_hasta'] ?? '';
    $db = new DB();
    $sql = "SELECT p.id_presupuesto, p.fecha, p.id_proveedor, pr.razon_social AS proveedor, p.total_estimado, p.validez, p.estado FROM presupuestos_compra p LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor WHERE CONCAT(p.id_presupuesto, pr.razon_social) LIKE :filtro";
    if ($estado !== '') {
        $sql .= " AND p.estado = :estado";
    }
    if ($f_desde !== '' && $f_hasta !== '') {
        $sql .= " AND p.fecha BETWEEN :desde AND :hasta";
    } elseif ($f_desde !== '') {
        $sql .= " AND p.fecha >= :desde";
    } elseif ($f_hasta !== '') {
        $sql .= " AND p.fecha <= :hasta";
    }
    $sql .= " ORDER BY p.id_presupuesto DESC";
    $query = $db->conectar()->prepare($sql);
    $params = ['filtro' => $f];
    if ($estado !== '') {
        $params['estado'] = $estado;
    }
    if ($f_desde !== '') {
        $params['desde'] = $f_desde;
    }
    if ($f_hasta !== '') {
        $params['hasta'] = $f_hasta;
    }
    $query->execute($params);
    if ($query->rowCount()) {
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}
?>
