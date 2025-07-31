<?php
require_once '../conexion/db.php';

// GUARDAR COMPRA
if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $db = new DB();
    $query = $db->conectar()->prepare(
        "INSERT INTO Compras (usuario_id, fecha, total, metodo_pago, estado, referencia) 
         VALUES (:usuario_id, :fecha, :total, :metodo_pago, :estado, :referencia)"
    );
    $query->execute($datos);
}

// ACTUALIZAR COMPRA
if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $db = new DB();
    $query = $db->conectar()->prepare(
        "UPDATE Compras SET 
            usuario_id = :usuario_id,
            fecha = :fecha,
            total = :total,
            metodo_pago = :metodo_pago,
            estado = :estado,
            referencia = :referencia
         WHERE compra_id = :compra_id"
    );
    $query->execute($datos);
}

// ELIMINAR COMPRA
if (isset($_POST['eliminar'])) {
    $db = new DB();
    $query = $db->conectar()->prepare("DELETE FROM Compras WHERE compra_id = :compra_id");
    $query->execute(["compra_id" => $_POST['eliminar']]);
}

// LEER TODAS LAS COMPRAS
if (isset($_POST['leer'])) {
    $db = new DB();
    $query = $db->conectar()->prepare(
        "SELECT c.compra_id, c.usuario_id, u.nombre, c.fecha, c.total, c.metodo_pago, c.estado, c.referencia
         FROM Compras c
         LEFT JOIN Usuarioss u ON c.usuario_id = u.usuario_id
         ORDER BY c.compra_id DESC"
    );
    $query->execute();

    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo "0";
    }
}

// LEER POR DESCRIPCIÓN (BUSQUEDA GENERAL)
if (isset($_POST['leer_descripcion'])) {
    $db = new DB();
    $filtro = "%" . $_POST['leer_descripcion'] . "%";
    $query = $db->conectar()->prepare(
        "SELECT c.compra_id, c.usuario_id, u.nombre, c.fecha, c.total, c.metodo_pago, c.estado, c.referencia
         FROM Compras c
         LEFT JOIN Usuarioss u ON c.usuario_id = u.usuario_id
         WHERE CONCAT(c.compra_id, u.nombre, c.metodo_pago, c.estado, c.referencia) LIKE :filtro
         ORDER BY c.compra_id DESC"
    );
    $query->execute(["filtro" => $filtro]);

    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo "0";
    }
}

// LEER UNA COMPRA POR ID
if (isset($_POST['leer_id'])) {
    $db = new DB();
    $query = $db->conectar()->prepare(
        "SELECT compra_id, usuario_id, fecha, total, metodo_pago, estado, referencia
         FROM Compras WHERE compra_id = :id"
    );
    $query->execute(["id" => $_POST['leer_id']]);

    if ($query->rowCount()) {
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    } else {
        echo "0";
    }
}
