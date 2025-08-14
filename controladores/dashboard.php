<?php
require_once '../conexion/db.php';

if(isset($_POST['dashboard'])){
    $db = new DB();
    $cn = $db->conectar();

    $totales = [
        'proveedores' => (int)$cn->query("SELECT COUNT(*) FROM proveedor")->fetchColumn(),
        'clientes' => (int)$cn->query("SELECT COUNT(*) FROM clientes")->fetchColumn(),
        'presupuestos' => (int)$cn->query("SELECT COUNT(*) FROM presupuestos_compra")->fetchColumn(),
        'ordenes' => (int)$cn->query("SELECT COUNT(*) FROM orden_compra")->fetchColumn(),
        'remisiones' => (int)$cn->query("SELECT COUNT(*) FROM remision")->fetchColumn(),
        'notas' => (int)$cn->query("SELECT COUNT(*) FROM nota_credito")->fetchColumn()
    ];

    // Compras y ventas por mes
    $mesesNombres = [1=>'Ene',2=>'Feb',3=>'Mar',4=>'Abr',5=>'May',6=>'Jun',7=>'Jul',8=>'Ago',9=>'Sep',10=>'Oct',11=>'Nov',12=>'Dic'];
    $comprasData = [];
    $ventasData = [];
    $meses = [];

    $stmt = $cn->query("SELECT MONTH(fecha_emision) AS mes, COUNT(*) AS total FROM orden_compra GROUP BY mes");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        $mes = (int)$row['mes'];
        $meses[$mes] = true;
        $comprasData[$mes] = (int)$row['total'];
    }

    $stmt = $cn->query("SELECT MONTH(fecha_recepcion) AS mes, COUNT(*) AS total FROM recepcion GROUP BY mes");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        $mes = (int)$row['mes'];
        $meses[$mes] = true;
        $ventasData[$mes] = (int)$row['total'];
    }

    $meses = array_keys($meses);
    sort($meses);
    $mesesLabels = array_map(function($m) use ($mesesNombres){ return $mesesNombres[$m]; }, $meses);

    $seriesCompras = [];
    $seriesVentas = [];
    foreach($meses as $m){
        $seriesCompras[] = $comprasData[$m] ?? 0;
        $seriesVentas[] = $ventasData[$m] ?? 0;
    }

    // Órdenes de compra por estado
    $labels = [];
    $series = [];
    $stmt = $cn->query("SELECT estado, COUNT(*) AS total FROM orden_compra GROUP BY estado");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        $labels[] = $row['estado'];
        $series[] = (int)$row['total'];
    }

    // Últimos registros
    $ultimosPresupuestos = $cn->query(
        "SELECT p.fecha, pr.razon_social AS proveedor, p.total_estimado AS monto, p.estado
         FROM presupuestos_compra p
         LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
         ORDER BY p.id_presupuesto DESC LIMIT 5"
    )->fetchAll(PDO::FETCH_ASSOC);

    $ultimasOrdenes = $cn->query(
        "SELECT o.fecha_emision AS fecha, o.id_orden, pr.razon_social AS proveedor, o.estado
         FROM orden_compra o
         LEFT JOIN proveedor pr ON o.id_proveedor = pr.id_proveedor
         ORDER BY o.id_orden DESC LIMIT 5"
    )->fetchAll(PDO::FETCH_ASSOC);

    $ultimasRecepciones = $cn->query(
        "SELECT r.fecha_recepcion AS fecha, r.nombre_cliente AS cliente, IFNULL(COUNT(d.id_detalle),0) AS equipos, r.estado
         FROM recepcion r
         LEFT JOIN recepcion_detalle d ON r.id_recepcion = d.id_recepcion
         GROUP BY r.id_recepcion, r.fecha_recepcion, r.nombre_cliente, r.estado
         ORDER BY r.id_recepcion DESC LIMIT 5"
    )->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'totales' => $totales,
        'compras_ventas' => [
            'meses' => $mesesLabels,
            'compras' => $seriesCompras,
            'ventas' => $seriesVentas
        ],
        'ordenes_estado' => [
            'labels' => $labels,
            'series' => $series
        ],
        'ultimos_presupuestos' => $ultimosPresupuestos,
        'ultimas_ordenes' => $ultimasOrdenes,
        'ultimas_recepciones' => $ultimasRecepciones
    ]);
}
?>
