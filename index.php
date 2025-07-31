<?php

include_once './controladores/session_usuario.php';

$usuario = new SessionUsuario();

if ($usuario->usuarioLogeado()) {
    include_once './menu.php';
} else {
    if (isset($_POST['usuario']) &&
            isset($_POST['pass'])) {
        if ($usuario->validarUsuario($_POST['usuario'],
                        $_POST['pass'])) {
            include_once './menu.php';
        } else {
            include_once './login.php';
        }
    }else{
        
            include_once './login.php';
    }
}

