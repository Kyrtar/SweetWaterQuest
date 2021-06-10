<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./styles/play.css">
    <title>Game</title>
</head>
<body>
    <audio src="./audio/step.wav" id="step" ></audio>
    <canvas id="game" tabindex="1"></canvas>
    <script src="./src/main.js" type="module"></script>
    <?php
        session_start();
        if(isset($_SESSION['email'])){
            echo("<div id='buttons'>");
                echo('<a href="./logout.php"><button id="out"><span>Log out</span></button></a>');
                echo('<a href="./control.php" target="_blank"><button id="control"><span>Panel de control</span></button></a>');
                echo('<a href="./save.php" target="_blank"><button id="save"><span>Salvar progreso</span></button></a>');
            echo("</div id='buttons'>");
        }
    ?>
</body>
</html>