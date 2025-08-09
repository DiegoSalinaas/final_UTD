<?php
require_once '../conexion/db.php';

if (isset($_POST['movimientos'])) {
    $db = new DB();
    $cn = $db->conectar();

    $sql = "
    SELECT modulo, id, fecha, persona, total, estado FROM (
        SELECT 'Presupuesto' AS modulo, p.id_presupuesto AS id, p.fecha AS fecha,
               pr.razon_social AS persona, p.total_estimado AS total, p.estado
        FROM presupuestos_compra p
        LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor

        UNION ALL

        SELECT 'Orden de Compra' AS modulo, o.id_orden AS id, o.fecha_emision AS fecha,
               pr.razon_social AS persona, IFNULL(SUM(d.subtotal),0) AS total, o.estado
        FROM orden_compra o
        LEFT JOIN proveedor pr ON o.id_proveedor = pr.id_proveedor
        LEFT JOIN detalle_orden_compra d ON o.id_orden = d.id_orden
        GROUP BY o.id_orden, o.fecha_emision, pr.razon_social, o.estado

        UNION ALL

        SELECT 'Remisión' AS modulo, r.id_remision AS id, r.fecha_remision AS fecha,
               c.nombre_apellido AS persona, IFNULL(SUM(d.subtotal),0) AS total, r.estado
        FROM remision r
        LEFT JOIN clientes c ON r.id_cliente = c.id_cliente
        LEFT JOIN detalle_remision d ON r.id_remision = d.id_remision
        GROUP BY r.id_remision, r.fecha_remision, c.nombre_apellido, r.estado

        UNION ALL

        SELECT 'Nota de Crédito' AS modulo, n.id_nota_credito AS id, n.fecha_emision AS fecha,
               c.nombre_apellido AS persona, IFNULL(SUM(d.total_linea),0) AS total, n.estado
        FROM nota_credito n
        LEFT JOIN clientes c ON n.id_cliente = c.id_cliente
        LEFT JOIN detalle_nota_credito d ON n.id_nota_credito = d.id_nota_credito
        GROUP BY n.id_nota_credito, n.fecha_emision, c.nombre_apellido, n.estado

        UNION ALL

        SELECT 'Recepción' AS modulo, r.id_recepcion AS id, r.fecha_recepcion AS fecha,
               r.nombre_cliente AS persona, 0 AS total, r.estado
        FROM recepcion r

        UNION ALL

        SELECT 'Diagnóstico' AS modulo, d.id_diagnostico AS id, d.fecha_inicio AS fecha,
               r.nombre_cliente AS persona, d.costo_total_estimado AS total, d.estado
        FROM diagnostico d
        LEFT JOIN recepcion r ON d.id_recepcion = r.id_recepcion
    ) AS movimientos
    ORDER BY fecha DESC, id DESC";

    $query = $cn->prepare($sql);
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}
?>
