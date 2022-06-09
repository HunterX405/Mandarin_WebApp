<?php
    session_start();
    // Redirect to Login Page if not admin.
    if (!isset($_SESSION['admin']) && !isset($_SESSION['user'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    

    if(isset($_POST['user'])){
        $accountToDelete = $_POST['user'];
        if($_POST['table'] == "ACTIVE"){
            $xml->load("userAccounts.xml");
        }else{
            $xml->load("archivedUsers.xml");
        }
    }else{
        $accountToDelete = $_SESSION['user'];
        $xml->load("userAccounts.xml");
    }

    $users = $xml->getElementsByTagName("user");
    foreach($users as $user){
        $username = $user->getAttribute("username");
        $email = $user->getAttribute("email");

        if($username == $accountToDelete || $email == $accountToDelete){

            //Delete user
            $xml->getElementsByTagName("users")[0]->removeChild($user);


            //Save XML file
            
            if(isset($_POST['table'])){
                if($_POST['table'] == "ACTIVE"){
                    $xml->save("userAccounts.xml");
                }else{
                    $xml->save("archivedUsers.xml");
                }
            }else{
                $xml->save("userAccounts.xml");
            }
            

            $userD = "";

            if(isset($_SESSION['admin'])){
                $userD = $_SESSION['admin'];
            }else{
                $userD = $_SESSION['user'];
            }
            
            // Add to Activity Log
            $xmlLog = new DOMDocument();
            $xmlLog->preserveWhiteSpace = false;
            $xmlLog->formatOutput = true;
            $xmlLog->load("activity.xml"); 

            $log = $xmlLog->createElement("log","Admin ".$userD." deleted user ".$accountToDelete." Account");
            $log->setAttribute("type","DELETE USER");
            $log->setAttribute("date",date("m/d/Y"));
            
            $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
            $xmlLog->save("activity.xml");

            echo "Account Deleted Successfully!";
            if(!isset($_POST['user'])){
                unset($_SESSION['user']);
                session_destroy();
            }
            break;
        }
    }

?>