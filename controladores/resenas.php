<?php
require_once '../conexion/db.php';

$db = new DB();

if (isset($_POST['guardar'])) {
    $datos = json_decode($_POST['guardar'], true);
    $query = $db->conectar()->prepare(
        "INSERT INTO Resenas (usuario_id, ebook_id, puntuacion, comentario, fecha) 
         VALUES (:usuario_id, :ebook_id, :puntuacion, :comentario, :fecha)"
    );
    $query->execute($datos);
}

if (isset($_POST['actualizar'])) {
    $datos = json_decode($_POST['actualizar'], true);
    $query = $db->conectar()->prepare(
        "UPDATE Resenas SET 
            usuario_id = :usuario_id,
            ebook_id = :ebook_id,
            puntuacion = :puntuacion,
            comentario = :comentario,
            fecha = :fecha
         WHERE resena_id = :resena_id"
    );
    $query->execute($datos);
}


if (isset($_POST['eliminar'])) {
    $query = $db->conectar()->prepare("DELETE FROM Resenas WHERE resena_id = :resena_id");
    $query->execute(["resena_id" => $_POST['eliminar']]);
}


if (isset($_POST['leer'])) {
    $query = $db->conectar()->prepare(
        "SELECT r.resena_id, r.usuario_id, u.nombre as nombre_usuario,
                r.ebook_id, e.titulo as titulo_ebook,
                r.puntuacion, r.comentario, r.fecha
         FROM Resenas r
         LEFT JOIN Usuarioss u ON r.usuario_id = u.usuario_id
         LEFT JOIN Ebooks e ON r.ebook_id = e.ebook_id
         ORDER BY r.resena_id DESC"
    );
    $query->execute();
    if ($query->rowCount()) {
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } else {
        echo "0";
    }
}


if (isset($_POST['leer_descripcion'])) {
    $filtro = "%" . $_POST['leer_descripcion'] . "%";
    $query = $db->conectar()->prepare(
        "SELECT r.resena_id, r.usuario_id, u.nombre as nombre_usuario,
                r.ebook_id, e.titulo as titulo_ebook,
                r.puntuacion, r.comentario, r.fecha
         FROM Resenas r
         LEFT JOIN Usuarioss u ON r.usuario_id = u.usuario_id
         LEFT JOIN Ebooks e ON r.ebook_id = e.ebook_id
         WHERE u.nombre LIKE :filtro1
            OR e.titulo LIKE :filtro2
            OR r.comentario LIKE :filtro3
         ORDER BY r.resena_id DESC"
    );
    $query->execute([
    "filtro1" => $filtro,
    "filtro2" => $filtro,
    "filtro3" => $filtro
]);
    if ($query->rowCount()) {
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } else {
        echo "0";
    }
}


if (isset($_POST['leer_id'])) {
    $query = $db->conectar()->prepare(
        "SELECT resena_id, usuario_id, ebook_id, puntuacion, comentario, fecha
         FROM Resenas WHERE resena_id = :id"
    );
    $query->execute(["id" => $_POST['leer_id']]);
    if ($query->rowCount()) {
        echo json_encode($query->fetch(PDO::FETCH_OBJ));
    } else {
        echo "0";
    }
}
?>
