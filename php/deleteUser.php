<?php
    session_start();
    // Redirect to Login Page if not admin.
    if (!isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("userAccounts.xml");

    $accountToDelete = $_POST['loggedUser'];

    $users = $xml->getElementsByTagName("user");
    foreach($users as $user){
        $username = $user->getAttribute("username");
        $email = $user->getAttribute("email");

        if($username == $accountToDelete || $email == $accountToDelete){

            //Delete user
            $xml->getElementsByTagName("users")[0]->removeChild($user);

            //Save XML file
            $xml->save("userAccounts.xml");

            echo "Success!";
            break;
        }
    }

?>