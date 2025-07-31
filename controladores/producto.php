<?php
require_once '../conexion/db.php';

if(isset($_POST['guardar'])){

    $json_datos = json_decode($_POST['guardar'], true);
  
    $base_datos = new DB();

    $query = $base_datos->conectar()->prepare("INSERT INTO producto"
            . "( nombre, cedula, fecha, ciudad, color, foto, contrasena, estado)"
            . " VALUES (:nombre, :cedula, :fecha, :ciudad, :color, :foto,"
            . " :pass, :estado)");
    
    $query->execute($json_datos);
    
}
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
if(isset($_POST['actualizar'])){

    $json_datos = json_decode($_POST['actualizar'], true);

    $base_datos = new DB();

    $query = $base_datos->conectar()->prepare("UPDATE producto SET "
            . "nombre = :nombre, descripcio = :descripcion, precio = :precio, "
            . "stock = :stock, categoria = :categoria, marca = :marca,"
            . " codigo_barra = :codigo_barra, fecha_alta = :fecha_alta, estado = :estado"
            . " WHERE id_producto = :id_producto");
    
    $query->execute($json_datos);
    
}
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
if(isset($_POST['eliminar'])){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("DELETE FROM producto "
            . " WHERE id_producto = :id_producto");
    
    $query->execute([
        "id_producto" => $_POST['eliminar']
    ]);
    
}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
if(isset($_POST['leer'])){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
            "SELECT `id_producto`, `nombre`, `descripcion`, `precio`,
                `stock`, `categoria`, `marca`, `codigo_barra`, `fecha_alta`, `estado` FROM `persona` 
            ORDER BY id_producto desc");
    
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
            "SELECT `id_producto`, `nombre`, `descripcion`, `precio`, `stock`,
                `categoria`, `marca`, `codigo_barra`, `fecha_alta`, `estado` FROM `producto`
            WHERE concat(``id_producto`, `nombre`, `descripcion`, `precio`, `stock`,
            `categoria`, `marca`, `codigo_barra`, `fecha_alta`, `estado`) like '%".$_POST['leer_descripcion']."%'
            ORDER BY id_producto desc");
    
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
            "SELECT `id_producto`, `nombre`, `descripcion`, `precio`,
             `stock`, `categoria`, `marca`, `codigo_barra`, `fecha_alta`, `estado` FROM `producto` 
            WHERE id_producto = :id");
    
    $query->execute([
        "id" => $_POST['leer_id']
    ]);
    
    if($query->rowCount()){
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    }else{
        echo "0";
    }
}