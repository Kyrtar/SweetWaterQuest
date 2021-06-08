<?php
    $error="";
    if (isset($_POST['enviar'])) {
        if(isset($_POST['name']) && !empty($_POST['name']) AND isset($_POST['email']) && !empty($_POST['email'])){
            $name = htmlspecialchars($_POST['name']);
            $email = htmlspecialchars($_POST['email']);
        }
        
        if($email != $_POST['email2']){
            $error = "El email y la comprobación no coinciden";
        } else {
            if (empty($email) || empty($password)){
                $error = "Debes introducir un email y una contraseña";
            } else {
                // Comprobamos las credenciales con la base de datos
                // Conectamos a la base de datos
                try {
                    $opc = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
                    $dsn = "mysql:host=localhost;dbname=proyecto_juego";
                    $conn = new PDO($dsn, "root", "", $opc);
                }
                catch (PDOException $e) {
                    die("Error: " . $e->getMessage());
                }
    
                 // Ejecutamos la consulta para comprobar las credenciales
                $sql = "INSERT into users (id, email, pwd, user_type)" .
                "VALUES('default', '$email', '$password', 1)";
                if ($conn->query($sql)) {
                    echo "Usuario registrado, puedes acceder";

                    $sql =  "SELECT id FROM users " .
                        "WHERE email='$email' " .
                        "AND pwd='" . $password . "'";
                
                    if($resultado = $conn->query($sql)) {
                        $fila = $resultado->fetchColumn('0');
                        if ($fila != null) {
                            session_start();
                            $_SESSION['id']=$fila;
                            
                        } else {
                            // Si las credenciales no son válidas, se vuelven a pedir
                            $error = "email o contraseña no válidos 1";
                        }
                        unset($resultado);
                    } else {
                        // Si las credenciales no son válidas, se vuelven a pedir
                        $error = "email o contraseña no válidos 2";
                    }
                    unset($conn); 
                } else {
                    echo "Error: " . $sql . "<br>" . $error;
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
</head>

<body>
    <div id='login'>
    <form action='#' method='post'>
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

        <div class='campo'>
            <input type='submit' name='enviar' value='Enviar' />
        </div>
    </fieldset>
    </form>
    <a href="./login.php"><p>Ir a acceso de usuario existente</p></a>
    </div>
</body>
</html>