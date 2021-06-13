<?php

require_once "connection.php";

session_start();

if(isset($_SESSION['id'])) {
    $id = $_POST['id'];
    $char = $_POST['charID'];

    $query = "DELETE FROM inventories WHERE id_char = $char;"; 
    $resultado = $conn->query($query);  
    
    $query = "DELETE FROM player_characters WHERE id = $char;";
    $resultado = $conn->query($query);  
    
    $query = "DELETE FROM users WHERE id = $id;"; 
    $resultado = $conn->query($query);  

    session_destroy();

    if (!$resultado) {
        die('Query Failed.');
    }
    
}

?>

<script>
    window.location.replace("./login.php");
</script>