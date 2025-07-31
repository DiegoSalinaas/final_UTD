<?php
require_once '../conexion/db.php';


if (isset($_POST['guardar'])) {
    $json_datos = json_decode($_POST['guardar'], true);
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("INSERT INTO categorias 
        (nombre, descripcion, activa, fecha_creacion, orden) 
        VALUES (:nombre, :descripcion, :activa, :fecha_creacion, :orden)");
    $query->execute($json_datos);
}


if (isset($_POST['actualizar'])) {
    $json_datos = json_decode($_POST['actualizar'], true);
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("UPDATE categorias SET 
        nombre = :nombre, 
        descripcion = :descripcion, 
        activa = :activa, 
        fecha_creacion = :fecha_creacion, 
        orden = :orden 
        WHERE categoria_id = :categoria_id");
    $query->execute($json_datos);
}


if (isset($_POST['eliminar'])) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("DELETE FROM categorias 
        WHERE categoria_id = :categoria_id");
    $query->execute([
        "categoria_id" => $_POST['eliminar']
    ]);
}


if (isset($_POST['leer'])) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("SELECT * FROM categorias ORDER BY orden DESC");
    $query->execute();
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo "0";
    }
}

if (isset($_POST['leer_descripcion'])) {
    $texto = "%".$_POST['leer_descripcion']."%";
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("SELECT * FROM categorias 
        WHERE CONCAT(categoria_id, nombre, descripcion, orden) LIKE :texto 
        ORDER BY orden DESC");
    $query->execute(['texto' => $texto]);
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo "0";
    }
}


if (isset($_POST['leer_id'])) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("SELECT * FROM categorias 
        WHERE categoria_id = :id");
    $query->execute(["id" => $_POST['leer_id']]);
    if ($query->rowCount()) {
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    } else {
        echo "0";
    }
}
