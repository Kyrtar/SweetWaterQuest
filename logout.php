<?php
    //Destruyo la sesión y vuelvo al login
    session_start();
    session_destroy();
    header("Location: ./login.php");
?>