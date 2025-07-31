<?php
require_once '../conexion/db.php';


if (isset($_POST['guardar'])) {
    $json_datos = json_decode($_POST['guardar'], true);
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "INSERT INTO ebooks (titulo, autor, isbn, formato, precio)
         VALUES (:titulo, :autor, :isbn, :formato, :precio)"
    );
    $query->execute($json_datos);
}


if (isset($_POST['actualizar'])) {
    $json_datos = json_decode($_POST['actualizar'], true);
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "UPDATE ebooks SET 
            titulo = :titulo,
            autor = :autor,
            isbn = :isbn,
            formato = :formato,
            precio = :precio
         WHERE ebook_id = :ebook_id"
    );
    $query->execute($json_datos);
}

if (isset($_POST['eliminar'])) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "DELETE FROM ebooks WHERE ebook_id = :ebook_id"
    );
    $query->execute(["ebook_id" => $_POST['eliminar']]);
}


if (isset($_POST['leer'])) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT ebook_id, titulo, autor, isbn, formato, precio 
         FROM ebooks ORDER BY ebook_id DESC"
    );
    $query->execute();

    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo "0";
    }
}


if (isset($_POST['leer_descripcion'])) {
    $base_datos = new DB();
    $filtro = "%" . $_POST['leer_descripcion'] . "%";
    $query = $base_datos->conectar()->prepare(
        "SELECT ebook_id, titulo, autor, isbn, formato, precio 
         FROM ebooks 
         WHERE CONCAT(ebook_id, titulo, autor, isbn, formato, precio) LIKE :filtro
         ORDER BY ebook_id DESC"
    );
    $query->execute(["filtro" => $filtro]);

    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo "0";
    }
}

if (isset($_POST['leer_id'])) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT ebook_id, titulo, autor, isbn, formato, precio 
         FROM ebooks 
         WHERE ebook_id = :id"
    );
    $query->execute(["id" => $_POST['leer_id']]);

    if ($query->rowCount()) {
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    } else {
        echo "0";
    }
}
