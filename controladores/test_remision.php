<?php
require_once '../conexion/db.php';

try {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("\n        SELECT r.id_remision, r.fecha_remision, r.id_cliente, c.nombre_apellido AS cliente,\n               r.observacion, r.estado\n        FROM remision r\n        LEFT JOIN clientes c ON r.id_cliente = c.id_cliente\n        ORDER BY r.id_remision DESC\n    ");
    $query->execute();
    header('Content-Type: application/json');
    echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
?>

