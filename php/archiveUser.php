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
    if($_POST['action'] == 'archive'){
        $xml->load("userAccounts.xml");
    }else{
        $xml->load("archivedUsers.xml");
    }
    

    $accountToArchive = $_POST['user'];
    $users = $xml->getElementsByTagName("user");
    foreach($users as $user){
        $email = $user->getAttribute("username");

        if($email == $accountToArchive){

            $xml2 = new DOMDocument();
            $xml2->preserveWhiteSpace = false;
            $xml2->formatOutput = true;
            if($_POST['action'] == 'archive'){
                $xml2->load("archivedUsers.xml");
            }else{
                $xml2->load("userAccounts.xml");
            }
            

            $archiveUser = $xml2->createElement("user");
            $archiveUser->setAttribute("username",$user->getAttribute("username"));
            $archiveUser->setAttribute("email",$email);
            $archiveUser->setAttribute("access", "student");
            $archiveUser->setAttribute("regDate", $user->getAttribute("regDate"));

            //Check optional values if they are empty and return empty string if true
            if(empty($user->getElementsByTagName("middleName")[0]->nodeValue)) $mName = "";
            else $mName = $user->getElementsByTagName("middleName")[0]->nodeValue;
            if(empty($user->getElementsByTagName("homeAddress")[0]->nodeValue)) $hAddress = "";
            else $hAddress =  $user->getElementsByTagName("homeAddress")[0]->nodeValue; 
            if(empty($user->getElementsByTagName("school")[0]->nodeValue)) $schoolValue = "";
            else $schoolValue = $user->getElementsByTagName("school")[0]->nodeValue;
            if(empty($user->getElementsByTagName("profileImage")[0]->nodeValue)) $imgValue = "";
            else $imgValue = $user->getElementsByTagName("profileImage")[0]->nodeValue;

            $firstName = $xml2->createElement("firstName", $user->getElementsByTagName("firstName")[0]->nodeValue);
            $middleName = $xml2->createElement("middleName", $mName);
            $lastName = $xml2->createElement("lastName", $user->getElementsByTagName("lastName")[0]->nodeValue);

            $name = $xml2->createElement("name");
            $name->appendChild($firstName);
            $name->appendChild($middleName);
            $name->appendChild($lastName);

            $image = $xml2->createElement("profileImage", $imgValue);
            $password = $xml2->createElement("password", $user->getElementsByTagName("password")[0]->nodeValue);
            $homeAddress = $xml2->createElement("homeAddress", $hAddress);
            $school = $xml2->createElement("school", $schoolValue);
            $birthday = $xml2->createElement("birthday", $user->getElementsByTagName("birthday")[0]->nodeValue);
            $gender = $xml2->createElement("gender", $user->getElementsByTagName("gender")[0]->nodeValue);

            $archiveUser->appendChild($name);
            $archiveUser->appendChild($image);
            $archiveUser->appendChild($password);
            $archiveUser->appendChild($homeAddress);
            $archiveUser->appendChild($school);
            $archiveUser->appendChild($birthday);
            $archiveUser->appendChild($gender);

            //Add user to target xml
            $xml2->getElementsByTagName("users")->item(0)->appendChild($archiveUser);

            if($_POST['action'] == 'archive'){
                $xml2->save("archivedUsers.xml");
            }else{
                $xml2->save("userAccounts.xml");
            }

            //Delete user in User Accounts
            $xml->getElementsByTagName("users")[0]->removeChild($user);

            // Add to Activity Log
            $xmlLog = new DOMDocument();
            $xmlLog->preserveWhiteSpace = false;
            $xmlLog->formatOutput = true;
            $xmlLog->load("activity.xml"); 

            if($_POST['action'] == 'archive'){
                $xml->save("userAccounts.xml");
                $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." archived ".$accountToArchive." Account.");
                $log->setAttribute("type","ARCHIVE USER");
                echo "User Account Archived Successfully!";
            }else{
                $xml->save("archivedUsers.xml");
                $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." restored ".$accountToArchive." Account.");
                $log->setAttribute("type","RESTORE USER");
                echo "User Account Restored Successfully!";
            }

            $log->setAttribute("date",date("m/d/Y"));
            $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
            $xmlLog->save("activity.xml");
            break;
        }
    }

?>