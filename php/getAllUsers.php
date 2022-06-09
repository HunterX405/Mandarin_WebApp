<?php
    session_start();
    // Redirect to Login Page if not user or admin.
    if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    //Get Active Users
    if($_POST['data'] == "ACTIVE"){
        $xml = simplexml_load_file("userAccounts.xml");
    }else{
    // Get Archived Users
        $xml = simplexml_load_file("archivedUsers.xml");
    }
    
    

    // PHP Response
    $response = array();

    //Find User Account
    foreach($xml->children() as $user){
        // Filter out current admin account
        if($user['username'] != $_SESSION['admin'] && $user['email'] != $_SESSION['admin']){
            $userRow = array();

            $fname = (string) $user->name->firstName;
            $mname = (string) $user->name->middleName;
            $lname = (string) $user->name->lastName;

            $userRow['name'] = $fname." ".$mname." ".$lname;
            $userRow['username'] = (string) $user['username'];
            $userRow['email'] = (string) $user['email'];
            $userRow['address'] = (string) $user->homeAddress;
            $userRow['school'] = (string) $user->school;
            $userRow['birthday'] = (string) $user->birthday;
            $userRow['gender'] = (string) $user->gender;

            array_push($response,$userRow);
        }
    }

    echo json_encode($response);
?>