<?php

require_once "connection.php";

session_start();

//Si hay una sesión creada, cojo el ID del usuario
if(isset($_SESSION['id'])) {
    //Con el ID del usuario y del personaje pongo todos los datos del personaje con su valor de creación
    $id = $_POST['id'];
    $char = $_POST['charID'];
    $exp = 0;
    $level = 1;
    $quantity = 1;

    $query = "UPDATE player_characters
              SET experience = $exp, level = $level
              WHERE id_user = $id;"; 

    $resultado = $conn->query($query);  
    
    $query = "UPDATE inventories
              SET quantity = $quantity
              WHERE id_char = $char"; 

    $resultado = $conn->query($query);  
    if (!$resultado) {
        die('Query Failed.');
    }
    
}

?>