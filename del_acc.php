<?php

require_once "connection.php";

//Inicio la sesión
session_start();

//Compruebo que haya datos en la sesión
if(isset($_SESSION['id'])) {
    //Si los hay, empiezo a recoger datos de la cuenta
    $id = $_POST['id'];
    $char = $_POST['charID'];

    //Cuando tengo lo que necesito, elimino primero el inventario del personaje
    $query = "DELETE FROM inventories WHERE id_char = $char;"; 
    $resultado = $conn->query($query);  
    
    //Después elimino el personaje
    $query = "DELETE FROM player_characters WHERE id = $char;";
    $resultado = $conn->query($query);  
    
    //Por último elimino la cuenta
    $query = "DELETE FROM users WHERE id = $id;"; 
    $resultado = $conn->query($query);  

    //Y destruyo la sesión
    session_destroy();

    if (!$resultado) {
        die('Query Failed.');
    }
    
}

?>

<script>
    //Hago que vuelva al login
    window.location.replace("./login.php");
</script>