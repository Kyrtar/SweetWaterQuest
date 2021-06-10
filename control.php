<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sweet Water Control Panel</title>
    <link rel="stylesheet" href="./styles/control.css">
</head>

<body>

    <h1>Panel de control</h1>

    <?php
    include_once("connection.php");
    session_start();

    $error = "";

    $sql = "SELECT user_type, id FROM users WHERE email='" . $_SESSION['email'] . "'";

    if ($resultado = $conn->query($sql)) {
        $fila = $resultado->fetchObject();
        if ($fila != null) {

            $user_id = $fila->id;

            if ($fila->user_type != 1) {
                $sql = "SELECT * FROM player_characters WHERE id_user='" . $user_id . "'";

                echo ("<h2>Personaje asociado a la cuenta: <strong>" . $_SESSION["email"] . "</strong></h2>");
                echo ("<table border='1'>");
                echo ("<tr>
                        <th>Nombre</th>
                        <th>Nivel</th>
                        <th>Experiencia</th>
                        <th>Eliminar cuenta</th>
                        <th>Reiniciar personaje</th>
                      </tr>");

                if ($resultado = $conn->query($sql)) {
                    while ($fila = $resultado->fetchObject()) {
                        echo ("<tr>");
                        echo ("<td>" . $fila->name . "</td>");
                        echo ("<td>" . $fila->level . "</td>");
                        echo ("<td>" . $fila->experience . "</td>");
                        echo ("<td>" .
                            '<form method="POST" action="./index.php">
                                <input type="submit" name="delete" value="Eliminar cuenta">
                            </form>' .
                            "</td>");
                        echo ("<td>" .
                            '<form method="POST" action="./control.php">
                                <input type="submit" name="restart" value="Reiniciar personaje">
                            </form>' .
                            "</td>");
                        echo ("</tr>");
                    }
                    unset($resultado);
                }
                echo ("</table>");
            } else {
                $sql = "SELECT * FROM player_characters INNER JOIN users ON player_characters.id_user= users.id";

                echo ("<h2>Listado de personajes guardados</h2>");
                echo ("<table border='1'>");
                echo ("<tr>
                        <th>Email</th>
                        <th>Nombre</th>
                        <th>Nivel</th>
                        <th>Experiencia</th>
                        <th>Eliminar cuenta</th>
                        <th>Reiniciar personaje</th>
                      </tr>");

                if ($resultado = $conn->query($sql)) {
                    while ($fila = $resultado->fetchObject()) {
                        echo ("<tr>");
                        echo ("<td>" . $fila->email . "</td>");
                        echo ("<td>" . $fila->name . "</td>");
                        echo ("<td>" . $fila->level . "</td>");
                        echo ("<td>" . $fila->experience . "</td>");
                        echo ("<td>" .
                            '<form method="POST" action="./index.php">
                                <input type="submit" name="delete" value="Eliminar cuenta">
                            </form>' .
                            "</td>");
                        echo ("<td>" .
                            '<form method="POST" action="./control.php">
                                <input type="submit" name="restart" value="Reiniciar personaje">
                            </form>' .
                            "</td>");
                        echo ("</tr>");
                    }
                    unset($resultado);
                }
                echo ("</table>");
            }
        } else {
            // Si las credenciales no son válidas, se vuelven a pedir
            $error = "Error!";
        }
        unset($resultado);
    }
    unset($conn);
    echo ($error);
    ?>

</body>

</html>