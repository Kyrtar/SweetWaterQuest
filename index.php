<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./styles/index.css">

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet"> 
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

    <link rel="icon" type="image/png" href="./img/favicon.gif">

    <title>Sweet Water Quest</title>
</head>
<body>

    <div>
        <h1>SWEET WATER QUEST</h1>
        <?php
            session_start();
            if(isset($_SESSION['email'])){
                echo('<object id="content" type="text/html" data="./play.php">');
            } else{
                session_destroy();
                echo('<object id="content" type="text/html" data="./login.php">');
            }
        ?>
        </object>
        

    </div>

</body>
</html>