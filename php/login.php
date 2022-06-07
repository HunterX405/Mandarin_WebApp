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
                // Add to Activity Log
                $xmlLog = new DOMDocument();
                $xmlLog->preserveWhiteSpace = false;
                $xmlLog->formatOutput = true;
                $xmlLog->load("activity.xml"); 

                if($user->getAttribute("access") == "admin"){
                    $_SESSION['admin'] = $compUname;
                    $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." Logged In");
                    echo "Admin";
                }else{
                    $_SESSION['user'] = $compUname;
                    $log = $xmlLog->createElement("log","User ".$_SESSION['user']." Logged In");
                    echo "Login Success!";
                }
                
                $log->setAttribute("type","LOGIN");
                $log->setAttribute("date",date("m/d/Y"));
                $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
                $xmlLog->save("activity.xml");
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

