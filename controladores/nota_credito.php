<?php
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

// LEER TODAS
if (isset($_POST['leer'])) {
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("SELECT n.id_nota_credito, n.fecha_emision, n.numero_nota, n.id_cliente, c.nombre_apellido AS cliente, n.motivo_general, n.estado, IFNULL(SUM(d.total_linea),0) AS total FROM nota_credito n LEFT JOIN clientes c ON n.id_cliente = c.id_cliente LEFT JOIN detalle_nota_credito d ON n.id_nota_credito = d.id_nota_credito GROUP BY n.id_nota_credito, n.fecha_emision, n.numero_nota, n.id_cliente, c.nombre_apellido, n.motivo_general, n.estado ORDER BY n.id_nota_credito DESC");
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
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
    $f = '%' . $_POST['leer_descripcion'] . '%';
    $db = new DB();
    $cn = $db->conectar();
    $query = $cn->prepare("SELECT n.id_nota_credito, n.fecha_emision, n.numero_nota, n.id_cliente, c.nombre_apellido AS cliente, n.motivo_general, n.estado, IFNULL(SUM(d.total_linea),0) AS total FROM nota_credito n LEFT JOIN clientes c ON n.id_cliente = c.id_cliente LEFT JOIN detalle_nota_credito d ON n.id_nota_credito = d.id_nota_credito WHERE c.nombre_apellido LIKE :filtro OR n.numero_nota LIKE :filtro GROUP BY n.id_nota_credito, n.fecha_emision, n.numero_nota, n.id_cliente, c.nombre_apellido, n.motivo_general, n.estado ORDER BY n.id_nota_credito DESC");
    $query->execute(['filtro' => $f]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : '0';
}
?>
