<?php
require_once '../conexion/db.php';

if(isset($_POST['guardar'])){
    //se convierte en un arreglo
    $json_datos = json_decode($_POST['guardar'], true);
    //se crea un objeto de conexion
    $base_datos = new DB();
    //preparamos la insercion
    $query = $base_datos->conectar()->prepare("INSERT INTO departamentos"
            . "( descripcion, estado) VALUES (:descripcion, :estado)");
    
    $query->execute($json_datos);
    
}
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
if(isset($_POST['actualizar'])){
    //se convierte en un arreglo
    $json_datos = json_decode($_POST['actualizar'], true);
    //se crea un objeto de conexion
    $base_datos = new DB();
    //preparamos la insercion
    $query = $base_datos->conectar()->prepare("UPDATE departamentos SET "
            . " descripcion = :descripcion, estado = :estado "
            . "where id_departamento = :id_departamento");
    
    $query->execute($json_datos);
    
}
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
if(isset($_POST['eliminar'])){
    //se convierte en un arreglo
    //se crea un objeto de conexion
    $base_datos = new DB();
    //preparamos la insercion
    $query = $base_datos->conectar()->prepare("DELETE FROM departamentos "
            . " WHERE id_departamento = :id_departamento");
    
    $query->execute([
        "id_departamento" => $_POST['eliminar']
    ]);
    
}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
if(isset($_POST['leer'])){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
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
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
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
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
            "SELECT `id_departamento`, `descripcion`, `estado` FROM `departamentos` "
            . "WHERE CONCAT(`id_departamento`, `descripcion`, `estado`) LIKE '%".$_POST['leer_descripcion']."%' "
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
if(isset($_POST['leer_id'])){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
            "SELECT `id_departamento`, `descripcion`, `estado` FROM `departamentos` 
            WHERE id_departamento = :id");
    
    $query->execute([
        "id" => $_POST['leer_id']
    ]);
    
    if($query->rowCount()){
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    }else{
        echo "0";
    }
}