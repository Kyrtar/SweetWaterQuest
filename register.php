<?php

    require_once('connection.php');
    
    $error="";
    if (isset($_POST['enviar'])) {
        if(isset($_POST['password']) && !empty($_POST['password']) && isset($_POST['email']) && !empty($_POST['email'])){
            $password = htmlspecialchars($_POST['password']);
            $email = htmlspecialchars($_POST['email']);
        }
        
        if($_POST['email'] != $_POST['email2']){
            $error = "El email y la comprobación no coinciden";
        } else {
            if (empty($email) || empty($password)){
                $error = "Debes introducir un email y una contraseña";
            } else {
                // Comprobamos las credenciales con la base de datos
                 // Ejecutamos la consulta para comprobar las credenciales
                $sql = "INSERT into users (id, email, pwd, user_type)" .
                "VALUES('default', '$email', '$password', 1)";
                if ($conn->query($sql)) {
                    $msg = "Usuario registrado, puedes acceder";

                    $sql =  "SELECT id FROM users " .
                        "WHERE email='$email' " .
                        "AND pwd='" . $password . "'";
                
                    if($resultado = $conn->query($sql)) {
                        $fila = $resultado->fetchColumn('0');
                        if ($fila != null) {
                            session_start();
                            $_SESSION['id']=$fila;

                            header("Location: ./play.php");
                            
                        } else {
                            // Si las credenciales no son válidas, se vuelven a pedir
                            $error = "email o contraseña no válidos";
                        }
                        unset($resultado);
                    }
                    unset($conn); 
                } else {
                    echo "<p id='error'>Error: " . $sql . "<br>" . $error."<p>";
                }           
            }
        }
   }
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <title>Registro</title>  
  <link rel="stylesheet" href="./styles/login.css">
</head>

<body>
    <div id='login'>
    <form action='#' method='POST'>
    <fieldset >
        <legend>Registro</legend>
        <div><span class='error'><?php echo $error; ?></span></div>
        <div class='campo'>
            <label for='email' >Email:</label><br/>
            <input type='text' name='email' id='email' maxlength="50" /><br/>
        </div>
        <div class='campo'>
            <label for='email2' >Repita email:</label><br/>
            <input type='text' name='email2' id='email2' maxlength="50" /><br/>
        </div>
        <div class='campo'>
            <label for='password' >Contraseña:</label><br/>
            <input type='password' name='password' id='password' maxlength="50" /><br/>
        </div>

        <?php
            if(isset($msg)){
                echo($msg);
            }
        ?>

        <div class='campo'>
            <input type='submit' name='enviar' value='Enviar' />
        </div>
    </fieldset>
    </form>
    <?php
        echo('<div id="buttons">
            <a href="./login.php">
                <button id="reg">
                    <span>Ir a ingreso</span>
                </button>
            </a>
        </div>');
    ?>
    </div>
</body>
</html>