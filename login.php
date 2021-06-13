<?php
    require_once('connection.php');

    //Con este pequeño script aquí elimino todo el localstorage
    echo('
            <script>
                localStorage.removeItem("charName");
                localStorage.removeItem("charExp");
                localStorage.removeItem("charLevel");
                localStorage.removeItem("items");
                localStorage.removeItem("quantity");
            </script>'
        );

    $error="";
    //Compruebo que lleguen todos los datos correctos
    if (isset($_POST['enviar'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];
       
        //Si algo sale mal muestro un error
        if (empty($email) || empty($password)) 
            $error = "Debes introducir un nombre de email y una contraseña";
        else {
             // Ejecutamos la consulta para comprobar las credenciales
            $sql = "SELECT id FROM users " .
            "WHERE email='$email' " .
            "AND pwd='" . $password . "'";
            
            if($resultado = $conn->query($sql)) {
                $fila = $resultado->fetchObject();
                if ($fila != null) {

                    //Si todo va bien inicio una sesión y empiezo a recoger datos
                    session_start(); 
                    $_SESSION['id'] = $fila->id;

                    $sql = "SELECT player_characters.id, player_characters.name, player_characters.experience, player_characters.level 
                            FROM player_characters INNER JOIN users 
                            ON player_characters.id_user = users.id WHERE users.id = ".$_SESSION['id'];
                    if($resultado = $conn->query($sql)) {
                        $fila = $resultado->fetchObject();
                        if ($fila != null) {
                            //Saco los datos del personaje de la base de datos
                            $_SESSION['charID'] = $fila->id;
                            $_SESSION['email']=$email;
                            $_SESSION['name']=$fila->name;
                            $_SESSION['experience']=$fila->experience;
                            $_SESSION['level']=$fila->level;
                            
                            $sql = "SELECT item, quantity 
                            FROM inventories INNER JOIN player_characters 
                            ON inventories.id_char = player_characters.id WHERE player_characters.id = ".$_SESSION['charID'];
                            if($resultado = $conn->query($sql)) {
                                $fila = $resultado->fetchObject();
                                if ($fila != null) {
                                    //Saco los datos del inventario del personaje de la base de datos
                                    $_SESSION['items']=$fila->item;
                                    $_SESSION['quantity']=$fila->quantity;
                                    header("Location: ./control.php");
                                }
                            }
                        }
                    }
                }
                else {
                    // Si las credenciales no son válidas, se vuelven a pedir
                    $error = "Email o contraseña no válidos";
                }
                unset($resultado);
            }
            unset($conn);            
        }
   }
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <title>Acceso</title>  
  <link rel="stylesheet" href="./styles/login.css">
</head>

<body>

    <script>
        if (localStorage.getItem("charName") !== null) {
            console.log("Recarga")
            location.reload();
        }
    </script>
    <div id='login'>
    <form action='login.php' method='post'>
    <fieldset >
        <legend>Acceso</legend>
        <div><span class='error'><?php echo $error; ?></span></div>
        <div class='campo'>
            <label for='email' >Email:</label><br/>
            <input type='text' name='email' id='email' maxlength="50"  autocomplete="Email"/><br/>
        </div>
        <div class='campo'>
            <label for='password' >Contraseña:</label><br/>
            <input type='password' name='password' id='password' maxlength="50" autocomplete="current-password"/><br/>
        </div>

        <div class='campo'>
            <input type='submit' name='enviar' value='Enviar' />
        </div>
    </fieldset>
    </form>
    <?php
        echo('<div id="buttons">
            <a href="./register.php">
                <button id="reg">
                    <span>Ir a registro</span>
                </button>
            </a>
        </div>');
    ?>
    </div>
</body>
</html>