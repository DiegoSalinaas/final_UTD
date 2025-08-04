<?php
require_once '../conexion/db.php';

try {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("
        SELECT r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido AS cliente,
               r.observacion, r.estado, IFNULL(SUM(d.subtotal),0) AS total
        FROM remision r
        LEFT JOIN cliente c ON r.id_cliente = c.id_cliente
        LEFT JOIN detalle_remision d ON r.id_remision = d.id_remision
        GROUP BY r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido, r.observacion, r.estado
        ORDER BY r.id_remision DESC
    ");
    $query->execute();
    header('Content-Type: application/json');
    echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();  // Temporal para ver errores reales
}
