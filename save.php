<?php

require_once "connection.php";

session_start();

//Compruebo que haya una sesión creada
if(isset($_SESSION['id'])) {
    //Adquiero los datos del personaje que voy a guardar
    $id = $_SESSION['id'];
    $char = $_SESSION['charID'];
    $exp = $_POST['exp'];
    $level = $_POST['level'];
    $quantity = $_POST['potions'];

    //Actualizo primero el personaje
    $query = "UPDATE player_characters
              SET experience = $exp, level = $level
              WHERE id_user = $id;"; 

    $resultado = $conn->query($query);  
    
    //Actualizo sl inventario del personaje
    $query = "UPDATE inventories
              SET quantity = $quantity
              WHERE id_char = $char"; 

    $resultado = $conn->query($query);  
    if (!$resultado) {
        die('Query Failed.');
    }
    
}

?>