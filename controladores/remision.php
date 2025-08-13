<?php
require_once '../conexion/db.php';

// GUARDAR REMISION
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    // Siempre guardar la remisión con estado EMITIDO
    $datos['estado'] = 'EMITIDO';
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "INSERT INTO remision (id_cliente, fecha_remision, observacion, estado, id_conductor, movil, id_punto_salida, id_punto_llegada, tipo_transporte, factura_relacionada) VALUES (:id_cliente, :fecha_remision, :observacion, :estado, :id_conductor, :movil, :id_punto_salida, :id_punto_llegada, :tipo_transporte, :factura_relacionada)"
    );
    $query->execute([
        'id_cliente' => $datos['id_cliente'],
        'fecha_remision' => $datos['fecha_remision'],
        'observacion' => $datos['observacion'],
        'estado' => $datos['estado'],
        'id_conductor' => $datos['id_conductor'],
        'movil' => $datos['movil'],
        'id_punto_salida' => $datos['id_punto_salida'],
        'id_punto_llegada' => $datos['id_punto_llegada'],
        'tipo_transporte' => $datos['tipo_transporte'],
        'factura_relacionada' => $datos['factura_relacionada']
    ]);
    echo $cn->lastInsertId();
}

// ACTUALIZAR REMISION
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare(
        "UPDATE remision SET id_cliente = :id_cliente, fecha_remision = :fecha_remision, observacion = :observacion, estado = :estado, id_conductor = :id_conductor, movil = :movil, id_punto_salida = :id_punto_salida, id_punto_llegada = :id_punto_llegada, tipo_transporte = :tipo_transporte, factura_relacionada = :factura_relacionada WHERE id_remision = :id_remision"
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
        "SELECT r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido AS cliente, r.observacion, r.estado
         FROM remision r
         LEFT JOIN clientes c ON r.id_cliente = c.id_cliente
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
        "SELECT r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido AS cliente, r.observacion, r.estado,
                r.id_conductor, co.nombre AS conductor, r.movil,
                r.id_punto_salida, ps.nombre AS punto_salida,
                r.id_punto_llegada, pl.nombre AS punto_llegada,
                r.tipo_transporte, r.factura_relacionada
         FROM remision r
         LEFT JOIN clientes c ON r.id_cliente = c.id_cliente
         LEFT JOIN conductor co ON r.id_conductor = co.id_conductor
         LEFT JOIN puntos ps ON r.id_punto_salida = ps.id_punto
         LEFT JOIN puntos pl ON r.id_punto_llegada = pl.id_punto
         WHERE r.id_remision = :id"
    );
    $query->execute(['id' => $_POST['leer_id']]);
    if ($query->rowCount()) {
        echo json_encode($query->fetch(PDO::FETCH_OBJ));
    } else {
        echo '0';
    }
}

// LEER CON FILTROS
if (isset($_POST['leer_descripcion'])) {
    $f = '%' . $_POST['leer_descripcion'] . '%';
    $estado = $_POST['estado'] ?? '';
    $desde  = $_POST['desde'] ?? '';
    $hasta  = $_POST['hasta'] ?? '';

    $db = new DB();
    $cn = $db->conectar();

    $sql = "SELECT r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido AS cliente, r.observacion, r.estado
            FROM remision r
            LEFT JOIN clientes c ON r.id_cliente = c.id_cliente
            WHERE CONCAT(r.id_remision, c.nombre_apellido) LIKE :filtro";

    if ($estado !== '') {
        $sql .= " AND r.estado = :estado";
    }
    if ($desde !== '' && $hasta !== '') {
        $sql .= " AND r.fecha_remision BETWEEN :desde AND :hasta";
    } else {
        if ($desde !== '') {
            $sql .= " AND r.fecha_remision >= :desde";
        }
        if ($hasta !== '') {
            $sql .= " AND r.fecha_remision <= :hasta";
        }
    }

    $sql .= " ORDER BY r.id_remision DESC";

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
