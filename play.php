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
        echo('
            <script>
                localStorage.setItem("charName","'.$_SESSION['name'].'");
                localStorage.setItem("charExp",'.$_SESSION['experience'].');
                localStorage.setItem("charLevel",'.$_SESSION['level'].');
                localStorage.setItem("items",'.$_SESSION['items'].');
                localStorage.setItem("quantity",'.$_SESSION['quantity'].');
            </script>'
        );

        if(isset($_SESSION['email'])){
            echo("<div id='buttons'>");
                echo('<a href="./logout.php"><button id="out"><span>Log out</span></button></a>');
                echo('<a href="./control.php"><button id="control"><span>Panel de control</span></button></a>');
                echo('<form action="save.php" method="POST" target=SaveGame>
                        <input type="submit" id="save" value="Save Game">
                        <input type="hidden" id="exp" name="exp" value="">
                        <input type="hidden" id="level" name="level" value="1">
                        <input type="hidden" id="potions" name="potions" value="0">
                      </form>');
                echo('<iframe name="SaveGame"></iframe>');
            echo("</div id='buttons'>");
        }
    ?>
    <script>
        if (localStorage.getItem("charName") === null) {
            location.reload();
        }
    </script>
</body>
</html>