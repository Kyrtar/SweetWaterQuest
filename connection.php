<?php
    // Conectamos a la base de datos
    try {
        $opc = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
        $dsn = "mysql:host=localhost;dbname=proyecto_juego";
        $conn = new PDO($dsn, "root", "", $opc);
    }
    catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }