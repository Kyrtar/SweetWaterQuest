<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="./img/favicon.gif">
    <title>Sweet Water Control Panel</title>
    <link rel="stylesheet" href="./styles/control.css">
</head>

<body>

    <h1>Panel de control</h1>

    <a href="./play.php"><button class="back">Start the game</button></a>

    <?php
    //Creo la conexión a la base de datos e inicio la sesión
    include_once("connection.php");
    session_start();

    $error = "";

    //Comprueblo si ya hay una sesión creada
    if(isset($_SESSION['email'])){
        //Si la hay, miro de qué rango de usuario es
        $sql = "SELECT user_type, id FROM users WHERE email='" . $_SESSION['email'] . "'";

        if ($resultado = $conn->query($sql)) {
            $fila = $resultado->fetchObject();
            if ($fila != null) {

                $user_id = $fila->id;

                //Si es de rango 1 (Usuario), le muestro sus personajes
                if ($fila->user_type == 1) {
                    $sql = "SELECT * FROM player_characters WHERE id_user='" . $user_id . "'";

                    echo ("<h2>Personaje asociado a la cuenta: <strong>" . $_SESSION["email"] . "</strong></h2>");
                    echo ("<div><table border='1'>");
                    echo ("<tr>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Exp</th>
                            <th>Delete account</th>
                            <th>Reset character</th>
                        </tr>");

                    if ($resultado = $conn->query($sql)) {
                        while ($fila = $resultado->fetchObject()) {
                            echo ("<tr>");
                            echo ("<td>" . $fila->name . "</td>");
                            echo ("<td>" . $fila->level . "</td>");
                            echo ("<td>" . $fila->experience . "</td>");
                            echo ("<td>" .
                                '<form method="POST" action="./del_acc.php">
                                    <input type="submit" name="delete" value="Eliminar cuenta">
                                    <input type="hidden" name="id" value="'.$fila->id_user.'">
                                    <input type="hidden" name="charID" value="'.$fila->id.'">
                                </form>' .
                                "</td>");
                            echo ("<td>" .
                                '<form method="POST" action="./control.php">
                                    <input type="submit" name="restart" value="Reiniciar personaje">
                                    <input type="hidden" name="id" value="'.$fila->id_user.'">
                                    <input type="hidden" name="charID" value="'.$fila->id.'">
                                </form>' .
                                "</td>");
                            echo ("</tr>");
                        }
                        unset($resultado);
                    }
                    echo ("</table></div>");
                //Si tiene más rango le muestro todos los personajes y cuentas de la base de datos
                } else {
                    $sql = "SELECT * FROM player_characters INNER JOIN users ON player_characters.id_user= users.id";

                    echo ("<h2>Listado de personajes guardados</h2>");
                    echo ("<div><table border='1'>");
                    echo ("<tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Exp</th>
                            <th>Delete account</th>
                            <th>Reset character</th>
                        </tr>");

                    if ($resultado = $conn->query($sql)) {
                        while ($fila = $resultado->fetchObject()) {
                            echo ("<tr>");
                            echo ("<td>" . $fila->email . "</td>");
                            echo ("<td>" . $fila->name . "</td>");
                            echo ("<td>" . $fila->level . "</td>");
                            echo ("<td>" . $fila->experience . "</td>");
                            echo ("<td>" .
                                '<form method="POST" action="./del_acc.php">
                                    <input type="submit" name="delete" value="Eliminar cuenta">
                                    <input type="hidden" name="id" value="'.$fila->id_user.'">
                                    <input type="hidden" name="charID" value="'.$fila->id.'">
                                </form>' .
                                "</td>");
                            echo ("<td>" .
                                '<form method="POST" action="./control.php">
                                    <input type="submit" name="restart" value="Reiniciar personaje">
                                    <input type="hidden" name="id" value="'.$fila->id_user.'">
                                    <input type="hidden" name="charID" value="'.$fila->id.'">
                                </form>' .
                                "</td>");
                            echo ("</tr>");
                        }
                        unset($resultado);
                    }
                    echo ("</table></div>");
                }
            } else {
                // Si las credenciales no son válidas, se vuelven a pedir
                $error = "Error!";
            }
            unset($resultado);
        }
        unset($conn);
        echo ("<p class='error'>$error</p>");
    } else {
        //Si alguien llega sin sesión, solo muestro un mensaje de error
        echo("<p class='error'>Please log in</p>");
    }
    ?>

</body>

</html>