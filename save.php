<?php

require_once "connection.php";

session_start();

if(isset($_SESSION['id'])) {
    $id = $_SESSION['id'];
    $char = $_SESSION['charID'];
    $exp = $_POST['exp'];
    $level = $_POST['level'];
    $quantity = $_POST['potions'];

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