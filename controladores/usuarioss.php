<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

// ---------------- GUARDAR ----------------
if (isset($_POST['guardar'])) {
    $json_datos = json_decode($_POST['guardar'], true);
    $query = $db->prepare(
        "INSERT INTO usuarioss (nombre, email, fecha_registro, tipo_usuario, estado) 
         VALUES (:nombre, :email, :fecha_registro, :tipo_usuario, :estado)"
    );
    $query->execute($json_datos);
}

// ---------------- ACTUALIZAR ----------------
if (isset($_POST['actualizar'])) {
    $json_datos = json_decode($_POST['actualizar'], true);
    $query = $db->prepare(
        "UPDATE usuarioss SET 
            nombre = :nombre,
            email = :email,
            fecha_registro = :fecha_registro,
            tipo_usuario = :tipo_usuario,
            estado = :estado 
         WHERE usuario_id = :usuario_id"
    );
    $query->execute($json_datos);
}

// ---------------- ELIMINAR ----------------
if (isset($_POST['eliminar'])) {
    $query = $db->prepare("DELETE FROM usuarioss WHERE usuario_id = :usuario_id");
    $query->execute(["usuario_id" => $_POST['eliminar']]);
}

// ---------------- LISTAR TODOS ----------------
if (isset($_POST['leer'])) {
    $query = $db->prepare(
        "SELECT usuario_id, nombre, email, fecha_registro, tipo_usuario, estado 
         FROM usuarioss 
         ORDER BY usuario_id DESC"
    );
    $query->execute();
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : "0";
}

// ---------------- BUSCAR ----------------
if (isset($_POST['leer_descripcion'])) {
    $filtro = "%" . $_POST['leer_descripcion'] . "%";
    $query = $db->prepare(
        "SELECT usuario_id, nombre, email, fecha_registro, tipo_usuario, estado 
         FROM usuarioss 
         WHERE CONCAT(usuario_id, nombre, email, fecha_registro, tipo_usuario, estado) LIKE :filtro 
         ORDER BY usuario_id DESC"
    );
    $query->execute(["filtro" => $filtro]);
    echo $query->rowCount() ? json_encode($query->fetchAll(PDO::FETCH_OBJ)) : "0";
}

// ---------------- LEER POR ID ----------------
if (isset($_POST['leer_id'])) {
    $query = $db->prepare(
        "SELECT usuario_id, nombre, email, fecha_registro, tipo_usuario, estado 
         FROM usuarioss 
         WHERE usuario_id = :id"
    );
    $query->execute(["id" => $_POST['leer_id']]);
    echo $query->rowCount() ? json_encode($query->fetch(PDO::FETCH_OBJ)) : "0";
}
