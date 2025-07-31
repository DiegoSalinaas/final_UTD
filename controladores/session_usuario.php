<?php

include_once 'conexion/db.php';

class SessionUsuario{
    
    public function __construct() {
        session_start();
    }
    
    public function validarUsuario($usuario, $pass){
        $passMD5 = md5($pass);
        $base_datos = new DB();
        $query = $base_datos->conectar()->prepare(""
                . "SELECT id_usuario, nombre_apellido,"
                . "rol  from usuarios "
                . "WHERE usuario = :usuario and "
                . "pass = :pass");
        $query->execute([
            "usuario" => $usuario,
            "pass" => $passMD5
        ]);
        
        if($query->rowCount()){
             foreach ($query as $user) {
                 $_SESSION['id_usuario'] = $user['id_usuario'];
                 $_SESSION['nombre_apellido'] = $user['nombre_apellido'];
                 $_SESSION['rol'] = $user['rol'];
                 return true;
             }
        }else{
            return false;
        }
    }
    
    function usuarioLogeado(){
        return isset($_SESSION['id_usuario']);
//        if(isset($_SESSION['id_usuario'])){
//            return true;
//        }else{
//            return false;
//        }
    }
}