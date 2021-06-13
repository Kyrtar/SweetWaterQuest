<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./styles/index.css">

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet"> 

    <link rel="icon" type="image/png" href="./img/favicon.gif">

    <title>Sweet Water Quest</title>
</head>
<body>

    <div>
        <h1>SWEET WATER QUEST</h1>
        <?php
            //Compruebo si hay sesión creada
            session_start();
            if(isset($_SESSION['email'])){
                //Si la hay muestro el panel de control
                echo('<object id="content" type="text/html" data="./control.php" allow="autoplay">');
            } else{
                //Si no la hay, destruyo la sesión y muestro el login
                session_destroy();
                echo('<object id="content" type="text/html" data="./login.php">');
            }
        ?>
        </object>
        

    </div>

</body>
</html>