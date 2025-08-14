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
        ]
    ]);
}
?>
