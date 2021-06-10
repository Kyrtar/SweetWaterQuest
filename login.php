<?php
    require_once('connection.php');

    // Comprobamos si ya se ha enviado el formulario
                     //añadida
                    $error="";
    if (isset($_POST['enviar'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];
       
        if (empty($email) || empty($password)) 
            $error = "Debes introducir un nombre de email y una contraseña";
        else {
            // Comprobamos las credenciales con la base de datos

             // Ejecutamos la consulta para comprobar las credenciales
            $sql = "SELECT id FROM users " .
            "WHERE email='$email' " .
            "AND pwd='" . $password . "'";
            
            if($resultado = $conn->query($sql)) {
                $fila = $resultado->fetch();
                if ($fila != null) {
                     
                    session_start(); 
                    $_SESSION['email']=$email;
                    header("Location: ./play.php");
                    
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