<?php

//Creo una función para hacer log a la consola del navegador
//Al declararla en este fichero, que se incluye en todos los demás, la hago "global"
function console_log($output, $with_script_tags = true) {
    $js_code = 'console.log('.json_encode($output, JSON_HEX_TAG).');';
    if ($with_script_tags) {
        $js_code = '<script>'.$js_code.'</script>';
    }
    echo $js_code;
}

    // Conectamos a la base de datos
    try {
        
        
        $server = "eu-cdbr-west-01.cleardb.com";
        $username = "b133e20a069394";
        $password = "56861c55";
        $db = "heroku_cca69ad0b240fee";
        $opc = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");

        $dsn = "mysql:host=eu-cdbr-west-01.cleardb.com;dbname=heroku_cca69ad0b240fee";

        $conn = new PDO($dsn, "b133e20a069394", "56861c55", $opc);
        console_log($conn);
        
        
        //Conexión local
        /*
        $opc = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
        $dsn = "mysql:host=localhost;dbname=proyecto_juego";
        $conn = new PDO($dsn, "root", "", $opc);
        */
        

        
    }
    catch (PDOException $e) {
        console_log("Error: " . $e->getMessage());
    }