<?php
ini_set('display_errors', 0); // evita que HTML de warnings rompa el JSON
header('Content-Type: application/json; charset=utf-8');
require_once '../conexion/db.php';

// GUARDAR NOTA DE CREDITO
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $db = new DB();
    $cn = $db->conectar();

    $query = $cn->prepare("INSERT INTO nota_credito (fecha_emision, motivo_general, id_cliente, ruc_cliente, estado, total, numero_nota) VALUES (:fecha_emision, :motivo_general, :id_cliente, :ruc_cliente, :estado, :total, '')");
    $query->execute([
        'fecha_emision' => $datos['fecha_emision'],
        'motivo_general' => $datos['motivo_general'],
        'id_cliente' => $datos['id_cliente'],
        'ruc_cliente' => $datos['ruc_cliente'],
        'estado' => $datos['estado'],
        'total' => $datos['total']
    ]);
    $id = $cn->lastInsertId();
    $numero = 'NC-' . str_pad($id, 4, '0', STR_PAD_LEFT);
    $cn->prepare("UPDATE nota_credito SET numero_nota = :numero WHERE id_nota_credito = :id")->execute(['numero' => $numero, 'id' => $id]);
    echo $id;
}

// ACTUALIZAR NOTA DE CREDITO
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("UPDATE nota_credito SET fecha_emision = :fecha_emision, motivo_general = :motivo_general, id_cliente = :id_cliente, ruc_cliente = :ruc_cliente, estado = :estado, total = :total WHERE id_nota_credito = :id_nota_credito");
    $query->execute($datos);
}

// ANULAR NOTA DE CREDITO
if (isset($_POST['anular'])) {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("UPDATE nota_credito SET estado = 'ANULADO' WHERE id_nota_credito = :id");
    $query->execute(['id' => $_POST['anular']]);
}

// LEER TODAS CON FILTROS OPCIONALES
if (isset($_POST['leer'])) {
    $db = new DB();
    $cn = $db->conectar();

    $sql = "SELECT n.id_nota_credito, n.fecha_emision, n.numero_nota, n.id_cliente, c.nombre_apellido AS cliente, n.motivo_general, n.estado, IFNULL(SUM(d.total_linea),0) AS total FROM nota_credito n LEFT JOIN clientes c ON n.id_cliente = c.id_cliente LEFT JOIN detalle_nota_credito d ON n.id_nota_credito = d.id_nota_credito";
    $where = [];
    $params = [];

    if (!empty($_POST['buscar'])) {
        $where[] = "(c.nombre_apellido LIKE :buscar OR n.numero_nota LIKE :buscar)";
        $params['buscar'] = '%' . $_POST['buscar'] . '%';
    }

    if (!empty($_POST['estado'])) {
        $where[] = "n.estado = :estado";
        $params['estado'] = $_POST['estado'];
    }

    if (!empty($_POST['f_desde'])) {
        $where[] = "n.fecha_emision >= :f_desde";
        $params['f_desde'] = $_POST['f_desde'];
    }

    if (!empty($_POST['f_hasta'])) {
        $where[] = "n.fecha_emision <= :f_hasta";
        $params['f_hasta'] = $_POST['f_hasta'];
    }

    if ($where) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    $sql .= " GROUP BY n.id_nota_credito, n.fecha_emision, n.numero_nota, n.id_cliente, c.nombre_apellido, n.motivo_general, n.estado ORDER BY n.id_nota_credito DESC";

    $query = $cn->prepare($sql);
    $query->execute($params);
   $rows = $query->fetchAll(PDO::FETCH_OBJ);
echo json_encode($rows ?: []);

}

// LEER POR ID
if (isset($_POST['leer_id'])) {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("SELECT n.id_nota_credito, n.fecha_emision, n.numero_nota, n.id_cliente, c.nombre_apellido AS cliente, n.motivo_general, n.ruc_cliente, n.estado, n.total FROM nota_credito n LEFT JOIN clientes c ON n.id_cliente = c.id_cliente WHERE n.id_nota_credito = :id");
    $query->execute(['id' => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : '0';
}

// BUSCAR
if (isset($_POST['leer_descripcion'])) {
    $filtro = '%'.($_POST['leer_descripcion'] ?? '').'%';
    $estado = $_POST['estado'] ?? '';
    $desde  = $_POST['desde']  ?? '';
    $hasta  = $_POST['hasta']  ?? '';

    $db = new DB();
    $cn = $db->conectar();

    $sql = "SELECT n.id_nota_credito, n.numero_nota, n.fecha_emision, n.total, n.estado,
                   c.nombre_apellido AS cliente
            FROM nota_credito n
            LEFT JOIN clientes c ON n.id_cliente = c.id_cliente
            WHERE CONCAT(n.id_nota_credito, c.nombre_apellido) LIKE :filtro";

    $params = ['filtro' => $filtro];

    if ($estado !== '') {
        // limitar a valores válidos
        if (!in_array($estado, ['ACTIVO','ANULADO'], true)) { echo json_encode([]); exit; }
        $sql .= " AND n.estado = :estado";
        $params['estado'] = $estado;
    }

    if ($desde !== '' && $hasta !== '') {
        $sql .= " AND n.fecha_emision BETWEEN :desde AND :hasta";
        $params['desde'] = $desde;
        $params['hasta'] = $hasta;
    } else {
        if ($desde !== '') { $sql .= " AND n.fecha_emision >= :desde"; $params['desde'] = $desde; }
        if ($hasta !== '') { $sql .= " AND n.fecha_emision <= :hasta"; $params['hasta'] = $hasta; }
    }

    $sql .= " ORDER BY n.id_nota_credito DESC";

    try {
        $q = $cn->prepare($sql);
        $q->execute($params);
        $rows = $q->fetchAll(PDO::FETCH_OBJ);
       echo json_encode($rows ?: []);

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error'=>true,'message'=>'DB error en leer_descripcion']);
    }
    exit;
}
$desde  = $_POST['desde'] ?? '';
$hasta  = $_POST['hasta'] ?? '';

$fmt = 'Y-m-d';
$valida = fn($s) => $s !== '' && DateTime::createFromFormat($fmt, $s)?->format($fmt) === $s;

if ($valida($desde) && $valida($hasta) && $desde > $hasta) {
    // si invierten los campos, los intercambio para que no falle
    [$desde, $hasta] = [$hasta, $desde];
}
?>
