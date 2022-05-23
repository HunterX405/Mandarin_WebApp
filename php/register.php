<?php
    //Redirect to Login Page when accessed via link.
    if (!isset($_POST['fname']) && !isset($_POST['lname']) && !isset($_POST['uname']) 
            && !isset($_POST['email']) && !isset($_POST['pass']) && !isset($_POST['bday']) && !isset($_POST['gender'])) {
        header('location: index.php');
        exit;
    }

    //Get POST variables
    $regPass = password_hash($_POST['pass'], PASSWORD_BCRYPT);
    unset($_POST['pass']);
    $regFname = $_POST['fname'];
    $regMname = $_POST['mname'];
    $regLname = $_POST['lname'];
    $regUname = $_POST['uname'];
    $regEmail = $_POST['email'];
    $regHome = $_POST['home'];
    $regSchool = $_POST['school'];
    $regBday = $_POST['bday'];
    $regGender = $_POST['gender'];

    //Open XML Document
    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("userAccounts.xml");

    //Check if username or email is already registered.
    $isRegistered = false;
    $users = $xml->getElementsByTagName("user");
    foreach($users as $compUser){
        $compUname = $compUser->getAttribute("username");
        $compEmail = $compUser->getAttribute("email");
        if($compUname == $regUname){
            $isRegistered = true;
            echo "Username already exists.";
            break;
        }else if($compEmail == $regEmail){
            echo "Email already exists.";
            $isRegistered = true;
            break;
        }else{
            $isRegistered = false;
        }
    }

    if(!$isRegistered){
        //Create user element
        $user = $xml->createElement("user");
        $user->setAttribute("username", $regUname);
        $user->setAttribute("email", $regEmail);

        $firstName = $xml->createElement("firstName", $regFname);
        $middleName = $xml->createElement("middleName", $regMname);
        $lastName = $xml->createElement("lastName", $regLname);

        $name = $xml->createElement("name");
        $name->appendChild($firstName);
        $name->appendChild($middleName);
        $name->appendChild($lastName);

        $image = $xml->createElement("profileImage", '/images/profile_icon.avif');
        $password = $xml->createElement("password", $regPass);
        $homeAddress = $xml->createElement("homeAddress", $regHome);
        $school = $xml->createElement("school", $regSchool);
        $birthday = $xml->createElement("birthday", $regBday);
        $gender = $xml->createElement("gender", $regGender);

        $user->appendChild($name);
        $user->appendChild($image);
        $user->appendChild($password);
        $user->appendChild($homeAddress);
        $user->appendChild($school);
        $user->appendChild($birthday);
        $user->appendChild($gender);

        //Add user to xml
        $xml->getElementsByTagName("users")->item(0)->appendChild($user);
        //Save XML file
        $xml->save("userAccounts.xml");

        echo "Registration Successfull!";
    }
?>