<?php
    //Redirect to Login Page when accessed via link.
    if (!isset($_GET['user'])) {
        header('location: index.php');
        exit;
    }

    $logUser = $_GET['user'];

    //Open XML Document
    $xml = simplexml_load_file("userAccounts.xml");

    //Find User Account
    foreach($xml->children() as $user){
        $compUname = $user['username'];
        $compEmail = $user['email'];

        if($compUname == $logUser || $compEmail == $logUser){

            $response = array();
 
            if(!isset($user->profileImage) || (string) $user->profileImage == ""){
                $response['image'] = 'css/images/profile_icon.avif';
            }else{
                $response['image'] = (string) $user->profileImage;
            }

            $response['firstName'] = (string) $user->name->firstName;
            $response['middleName'] = (string) $user->name->middleName;
            $response['lastName'] =(string) $user->name->lastName;
            $response['username'] = (string) $user['username'];
            $response['email'] = (string) $user['email'];
            $response['address'] = (string) $user->homeAddress;
            $response['school'] = (string) $user->school;
            $response['birthday'] = (string) $user->birthday;
            $response['gender'] = (string) $user->gender;

            echo json_encode($response);

        }
    }

?>