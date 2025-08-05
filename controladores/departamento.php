<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

if(isset($_POST['guardar'])){
    $datos = array_map('trim', json_decode($_POST['guardar'], true));

    // Verificar duplicados ignorando mayúsculas y espacios
    $query = $db->prepare("SELECT COUNT(*) FROM departamentos WHERE LOWER(TRIM(descripcion)) = LOWER(:descripcion)");
    $query->execute(['descripcion' => $datos['descripcion']]);
    if($query->fetchColumn() > 0){
        echo 'duplicado';
        return;
    }

    $query = $db->prepare("INSERT INTO departamentos (descripcion, estado) VALUES (:descripcion, :estado)");
    $query->execute($datos);
    echo 'ok';
}
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
if(isset($_POST['actualizar'])){
    $datos = array_map('trim', json_decode($_POST['actualizar'], true));

    // Verificar duplicados para otro registro
    $query = $db->prepare("SELECT COUNT(*) FROM departamentos WHERE LOWER(TRIM(descripcion)) = LOWER(:descripcion) AND id_departamento <> :id_departamento");
    $query->execute([
        'descripcion' => $datos['descripcion'],
        'id_departamento' => $datos['id_departamento']
    ]);
    if($query->fetchColumn() > 0){
        echo 'duplicado';
        return;
    }

    $query = $db->prepare("UPDATE departamentos SET descripcion = :descripcion, estado = :estado where id_departamento = :id_departamento");
    $query->execute($datos);
    echo 'ok';
}
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
if(isset($_POST['eliminar'])){
    $query = $db->prepare("DELETE FROM departamentos WHERE id_departamento = :id_departamento");
    $query->execute([
        'id_departamento' => $_POST['eliminar']
    ]);

}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
if(isset($_POST['leer'])){
    $query = $db->prepare(
            "SELECT `id_departamento`, `descripcion`, `estado` FROM `departamentos` "
            . "ORDER BY id_departamento DESC");

    $query->execute();

    if($query->rowCount()){
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    }else{
        echo "0";
    }
}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
if(isset($_POST['leerActivo'])){
    $query = $db->prepare(
            "SELECT `id_departamento`, `descripcion`, `estado` FROM `departamentos` "
            . "WHERE estado = 'ACTIVO' "
            . "ORDER BY id_departamento DESC");

    $query->execute();

    if($query->rowCount()){
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    }else{
        echo "0";
    }
}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
if(isset($_POST['leer_descripcion'])){
    $query = $db->prepare(
            "SELECT `id_departamento`, `descripcion`, `estado` FROM `departamentos` "
            . "WHERE CONCAT(`id_departamento`, `descripcion`, `estado`) LIKE :filtro "
            . "ORDER BY id_departamento DESC");

    $query->execute([
        'filtro' => '%'.$_POST['leer_descripcion'].'%'
    ]);

    if($query->rowCount()){
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    }else{
        echo "0";
    }
}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
if(isset($_POST['leer_id'])){
    $query = $db->prepare(
            "SELECT `id_departamento`, `descripcion`, `estado` FROM `departamentos`
            WHERE id_departamento = :id");

    $query->execute([
        'id' => $_POST['leer_id']
    ]);

    if($query->rowCount()){
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    }else{
        echo "0";
    }
}