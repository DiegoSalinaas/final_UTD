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
    $idOrden = $cn->lastInsertId();

    // Cambiar estado del presupuesto asociado a APROBADO
    $update = $cn->prepare("UPDATE presupuestos_compra SET estado = 'APROBADO' WHERE id_presupuesto = :id_presupuesto");
    $update->execute(['id_presupuesto' => $datos['id_presupuesto']]);

    echo $idOrden;
}

// ACTUALIZAR ORDEN
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $db = new DB();
    $query = $db->conectar()->prepare(
        "UPDATE orden_compra SET fecha_emision = :fecha_emision, id_presupuesto = :id_presupuesto, id_proveedor = :id_proveedor WHERE id_orden = :id_orden"
    );
    $query->execute($datos);

    // Asegurar que el presupuesto quede aprobado
    $up = $db->conectar()->prepare("UPDATE presupuestos_compra SET estado = 'APROBADO' WHERE id_presupuesto = :id_presupuesto");
    $up->execute(['id_presupuesto' => $datos['id_presupuesto']]);
}

// ELIMINAR ORDEN
if (isset($_POST['eliminar'])) {
    $db = new DB();
    $query = $db->conectar()->prepare("DELETE FROM orden_compra WHERE id_orden = :id");
    $query->execute(['id' => $_POST['eliminar']]);
}

// ANULAR ORDEN
if (isset($_POST['anular'])) {
    $db = new DB();
    $query = $db->conectar()->prepare("UPDATE orden_compra SET estado = 'ANULADO' WHERE id_orden = :id");
    $query->execute(['id' => $_POST['anular']]);
}

// LEER TODAS LAS ORDENES
if (isset($_POST['leer'])) {
    $db = new DB();
    $query = $db->conectar()->prepare(
    "SELECT o.id_orden, o.fecha_emision, o.id_presupuesto, o.id_proveedor,
            pr.razon_social AS proveedor, o.estado, IFNULL(SUM(d.subtotal),0) AS total
     FROM orden_compra o
     LEFT JOIN proveedor pr ON o.id_proveedor = pr.id_proveedor
     LEFT JOIN detalle_orden_compra d ON o.id_orden = d.id_orden
     GROUP BY o.id_orden, o.fecha_emision, o.id_presupuesto,
              o.id_proveedor, pr.razon_social, o.estado
     ORDER BY o.id_orden DESC"
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
    "SELECT o.id_orden, o.fecha_emision, o.id_presupuesto, o.id_proveedor,
            pr.razon_social AS proveedor, o.estado, IFNULL(SUM(d.subtotal),0) AS total
     FROM orden_compra o
     LEFT JOIN proveedor pr ON o.id_proveedor = pr.id_proveedor
     LEFT JOIN detalle_orden_compra d ON o.id_orden = d.id_orden
     WHERE o.id_orden = :id
     GROUP BY o.id_orden, o.fecha_emision, o.id_presupuesto,
              o.id_proveedor, pr.razon_social, o.estado
     ORDER BY o.id_orden DESC"
    );

    $query->execute(['id' => $_POST['leer_id']]);
    if ($query->rowCount()) {
        echo json_encode($query->fetch(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}

// LEER POR DESCRIPCION CON FILTROS
if (isset($_POST['leer_descripcion'])) {
    $f = '%' . $_POST['leer_descripcion'] . '%';
    $estado = $_POST['estado'] ?? '';
    $desde  = $_POST['desde'] ?? '';
    $hasta  = $_POST['hasta'] ?? '';

    $db = new DB();
    $cn = $db->conectar();

    $sql = "SELECT o.id_orden, o.fecha_emision, o.id_presupuesto, o.id_proveedor,
            pr.razon_social AS proveedor, o.estado, IFNULL(SUM(d.subtotal),0) AS total
     FROM orden_compra o
     LEFT JOIN proveedor pr ON o.id_proveedor = pr.id_proveedor
     LEFT JOIN detalle_orden_compra d ON o.id_orden = d.id_orden
     WHERE pr.razon_social LIKE :filtro";

    if ($estado !== '') {
        $sql .= " AND o.estado = :estado";
    }
    if ($desde !== '' && $hasta !== '') {
        $sql .= " AND o.fecha_emision BETWEEN :desde AND :hasta";
    } else {
        if ($desde !== '') {
            $sql .= " AND o.fecha_emision >= :desde";
        }
        if ($hasta !== '') {
            $sql .= " AND o.fecha_emision <= :hasta";
        }
    }

    $sql .= " GROUP BY o.id_orden, o.fecha_emision, o.id_presupuesto,
              o.id_proveedor, pr.razon_social, o.estado
     ORDER BY o.id_orden DESC";

    $query = $cn->prepare($sql);
    $params = ['filtro' => $f];
    if ($estado !== '') { $params['estado'] = $estado; }
    if ($desde  !== '') { $params['desde']  = $desde; }
    if ($hasta  !== '') { $params['hasta']  = $hasta; }

    $query->execute($params);
    if ($query->rowCount()) {
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}

?>

