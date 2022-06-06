<?php
    session_start();
    // Redirect to Login Page when accessed via link.
    if (!isset($_POST['username']) && !isset($_POST['password'])) {
        header('location: ../');
        exit;
    }else{
        
    }

    $loginUserEmail = $_POST['username'];
    $loginPassword = $_POST['password'];

    //Open XML Document
    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("userAccounts.xml");

    //Check if login credentials are valid.
    $isUser = false;
    $users = $xml->getElementsByTagName("user");
    foreach($users as $user){
        $compUname = $user->getAttribute("username");
        $compEmail = $user->getAttribute("email");
        $compPassword = $user->getElementsByTagName("password")->item(0)->nodeValue;

        if($compUname == $loginUserEmail || $compEmail == $loginUserEmail){

            //Username or email is registered.
            $isUser = true;

            if(password_verify($loginPassword,$compPassword)){
                if($user->getAttribute("access") == "admin"){
                    $_SESSION['admin'] = $compUname;
                    echo "Admin";
                }else{
                    $_SESSION['user'] = $compUname;
                    echo "Login Success!";
                }
                break;
            }else{
                //Username or email is found but password does not match.
                echo "Incorrect Password.";
            }
        }
    }

    //Username or email is not registered.
    if($isUser == false){
        echo "Account not found.";
    }
?>