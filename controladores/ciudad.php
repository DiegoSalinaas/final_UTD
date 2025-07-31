<?php
require_once '../conexion/db.php';

if(isset($_POST['guardar'])){
    //se convierte en un arreglo
    $json_datos = json_decode($_POST['guardar'], true);
    //se crea un objeto de conexion
    $base_datos = new DB();
    //preparamos la insercion
    $query = $base_datos->conectar()->prepare("INSERT INTO ciudad"
            . "( descripcion, id_departamento, estado) VALUES (:descripcion, :id_departamento, :estado)");
    
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
    $query = $base_datos->conectar()->prepare("UPDATE ciudad SET "
            . " descripcion = :descripcion, id_departamento = :id_departamento, estado = :estado "
            . "where id_ciudad = :id_ciudad");
    
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
    $query = $base_datos->conectar()->prepare("DELETE FROM ciudad "
            . " WHERE id_ciudad = :id_ciudad");
    
    $query->execute([
        "id_ciudad" => $_POST['eliminar']
    ]);
    
}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
if(isset($_POST['leer'])){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
            "SELECT
c.id_ciudad,
c.descripcion,
d.descripcion as departamentos,
c.estado
FROM ciudad c 
JOIN departamentos d 
ON d.id_departamento = c.id_departamento;");
    
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
            "SELECT
c.id_ciudad,
c.descripcion,
d.descripcion as departamentos,
c.estado
FROM ciudad c
JOIN departamentos d
ON d.id_departamento = c.id_departamento
where concat(c.id_ciudad,
c.descripcion,
d.descripcion,
c.estado) Like '%".$_POST['leer_descripcion']."%' ");
    
    $query->execute();
    
    if($query->rowCount()){
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    }else{
        echo "0";
    }
}//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
if(isset($_POST['leer_id'])){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT 
            c.id_ciudad, 
            c.descripcion, 
            c.estado, 
            d.descripcion AS departamentos,
            c.id_departamento
         FROM ciudad c
         JOIN departamentos d ON c.id_departamento = d.id_departamento
         WHERE c.id_ciudad = :id");
    
    $query->execute([
        "id" => $_POST['leer_id']
    ]);
    
    if($query->rowCount()){
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    }else{
        echo "0";
    }
}
