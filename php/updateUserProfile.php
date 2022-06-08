<?php
    session_start();
    // Redirect to Login Page if not user or admin.
    if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    $response = array("message"=> "Transaction Failed!");

    //AJAX PHP JSON Response
    $response = array("message"=> "Transaction Failed!");

    //Get logged user/admin
    if(isset($_SESSION['admin'])){
        $loggedUser = $_SESSION['admin'];
    }else{
        $loggedUser = $_SESSION['user'];
    }

    //For image url
    $targetFilePath = "";

    //For password and user validation
    $isAuthenticated = true;
    $isValid = true;

    //Open User Accounts XML Document
    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("userAccounts.xml");

    $users = $xml->getElementsByTagName("user");
    foreach($users as $compUser){
        $compUname = $compUser->getAttribute("username");
        $compEmail = $compUser->getAttribute("email");

        //Find Account
        if($compUname == $loggedUser || $compEmail == $loggedUser){

            //Fetch user password for validation
            $userPass = $compUser->getElementsByTagName("password")[0]->nodeValue;

            //Change Password Update
            if(  isset($_POST['oldPass']) && isset($_POST['newPass']) ){
                if(password_verify($_POST['oldPass'],$userPass)){
                    //Get and hash new password
                    $editPass = password_hash($_POST['newPass'], PASSWORD_BCRYPT);

                    //Get current user values from xml
                    $editFname = $compUser->getElementsByTagName("firstName")[0]->nodeValue;
                    $editLname = $compUser->getElementsByTagName("lastName")[0]->nodeValue;
                    $editUname = $compUname;
                    $editEmail = $compEmail;
                    $editBday = $compUser->getElementsByTagName("birthday")[0]->nodeValue;
                    $editGender = $compUser->getElementsByTagName("gender")[0]->nodeValue;

                    //Check optional values if they are empty and return empty string if true
                    if(empty($compUser->getElementsByTagName("middleName")[0]->nodeValue)) $editMname = "";
                    else $editMname = $compUser->getElementsByTagName("middleName")[0]->nodeValue;
                    if(empty($compUser->getElementsByTagName("homeAddress")[0]->nodeValue)) $editHome = "";
                    else $editHome =  $compUser->getElementsByTagName("homeAddress")[0]->nodeValue; 
                    if(empty($compUser->getElementsByTagName("school")[0]->nodeValue)) $editSchool = "";
                    else $editSchool = $compUser->getElementsByTagName("school")[0]->nodeValue;
                }else{
                    $isAuthenticated = false;
                }
            }else{
            //Edit Profile Update

                //Get data from AJAX POST
                $editFname = $_POST['fname'];
                $editMname = $_POST['mname'];
                $editLname = $_POST['lname'];
                $editUname = $_POST['uname'];
                $editEmail = $_POST['email'];
                $editHome = $_POST['home'];
                $editSchool = $_POST['school'];
                $editBday = $_POST['bday'];
                $editGender = $_POST['gender'];

            //Open Archived Users XML Document for checking if new username or email exists
            $xml2 = new DOMDocument();
            $xml2->preserveWhiteSpace = false;
            $xml2->formatOutput = true;
            $xml2->load("archivedUsers.xml");

            if($editUname != $compUname || $editEmail != $compEmail){
                // Checking userAccounts.xml
                $checkUsers = $xml->getElementsByTagName("user");
                foreach ($checkUsers as $checkUser) {
                    $checkUname = $checkUser->getAttribute("username");
                    $checkEmail = $checkUser->getAttribute("email");
                    if($checkUname == $editUname && $editUname != $compUname){
                        $isValid = false;
                        $response["message"] = "Username Already Exists!";
                    }else if($checkEmail == $editEmail && $editEmail != $compEmail){
                        $isValid = false;
                        $response["message"] = "Email Already Exists!";
                    }
                }

                // Checking archived users
                $archivedUsers = $xml2->getElementsByTagName("user");
                foreach ($archivedUsers as $checkArchived) {
                    $archivedUname = $checkArchived->getAttribute("username");
                    $archivedEmail = $checkArchived->getAttribute("email");
                    if($archivedUname == $editUname && $editUname != $compUname){
                        $isValid = false;
                        $response["message"] = "Username Already Exists!";
                    }else if($archivedEmail == $editEmail && $editEmail != $compEmail){
                        $isValid = false;
                        $response["message"] = "Email Already Exists!";
                    }
                }
            }
            // else if($editEmail != $compEmail){

            // }
                
                //Check for uploaded image
                if(!empty($_FILES["file"]["name"])){
                    $uploadDir = 'images/';
                    $uploadStatus = 0;
                    $fileName = basename($_FILES["file"]["name"]);
                    $targetFilePath = $uploadDir . $fileName;
                    $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

                    $allowTypes = array('jpg','jpeg','png','avif');
                    if(in_array($fileType,$allowTypes)){
                        if(move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)){
                            $uploadStatus = 1;
                            $uploadedFile = $fileName;
                            $response["image"] = (string) $targetFilePath;
                        }else{
                            $uploadStatus = 0;
                            $response["message"] = "Sorry, there was an error uploading your file.";
                        }
                    }else{
                        $uploadStatus = 0;
                        $response["message"] = "Sorry, only certain file types are allowed.";
                    }
                    if($uploadStatus == 1){
                        $response["message"] = "Success.";
                    }
                }else{
                    //Get current Image if there is no uploaded image or if in change password form.
                    $targetFilePath = $compUser->getElementsByTagName("profileImage")[0]->nodeValue;
                }

                //Get password
                $editPass = $compUser->getElementsByTagName("password")[0]->nodeValue;

                //Set response values to update profile page values
                $response["image"] = $targetFilePath;
                $response["fname"] = $editFname;
                $response["mname"] = $editMname;
                $response["lname"] = $editLname;
                $response["uname"] = $editUname;
                $response["email"] = $editEmail;
                $response["home"] = $editHome;
                $response["school"] = $editSchool;
                $response["bday"] = $editBday;
                $response["gender"] = $editGender;
            }

            //Change password: if old password is correct.
            if($isAuthenticated && $isValid){
                //Create new node to replace old node
                $user = $xml->createElement("user");
                $user->setAttribute("username", $editUname);
                $user->setAttribute("email", $editEmail);
                
                if(isset($_SESSION['admin'])){
                    $user->setAttribute("access","admin");
                    $_SESSION['admin'] = $editUname;
                }else{
                    $user->setAttribute("access","student");
                    $_SESSION['user'] = $editUname;
                }
                $user->setAttribute("regDate", $compUser->getAttribute("regDate"));

                $firstName = $xml->createElement("firstName", $editFname);
                $middleName = $xml->createElement("middleName", $editMname);
                $lastName = $xml->createElement("lastName", $editLname);

                $name = $xml->createElement("name");
                $name->appendChild($firstName);
                $name->appendChild($middleName);
                $name->appendChild($lastName);

                $image = $xml->createElement("profileImage", $targetFilePath);
                $password = $xml->createElement("password", $editPass);
                $homeAddress = $xml->createElement("homeAddress", $editHome);
                $school = $xml->createElement("school", $editSchool);
                $birthday = $xml->createElement("birthday", $editBday);
                $gender = $xml->createElement("gender", $editGender);

                $user->appendChild($name);
                $user->append($image);
                $user->appendChild($password);
                $user->appendChild($homeAddress);
                $user->appendChild($school);
                $user->appendChild($birthday);
                $user->appendChild($gender);

                //Replace old user node($compUser) to new user node($user) in xml
                $xml->getElementsByTagName("users")->item(0)->replaceChild($user,$compUser);
                //Save XML file
                $xml->save("userAccounts.xml");

                // Add to Activity Log
                $xmlLog = new DOMDocument();
                $xmlLog->preserveWhiteSpace = false;
                $xmlLog->formatOutput = true;
                $xmlLog->load("activity.xml"); 

                //Response for successful transaction.
                if( isset($_POST['newPass']) ){
                    //Change Password Response
                    $response["message"] = "Password Changed Successfully!";

                    if(isset($_SESSION['admin'])){
                        $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." changed his/her password");
                    }else{
                        $log = $xmlLog->createElement("log","User ".$_SESSION['user']." changed his/her password");
                    }
                    $log->setAttribute("type","CHANGE PASSWORD");
                }else{
                    //Edit Profile Response
                    $response["message"] = "Account Updated!";

                    if(isset($_SESSION['admin'])){
                        $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." updated his/her account");
                    }else{
                        $log = $xmlLog->createElement("log","User ".$_SESSION['user']." updated his/her account");
                    }
                    $log->setAttribute("type","UPDATE PROFILE");
                }

                $log->setAttribute("date",date("m/d/Y"));
                $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
                $xmlLog->save("activity.xml");
            }else{
                if(!$isAuthenticated){
                    $response["message"] = "Wrong Password";
                }
            }
            break;
        }else{
            $response["message"] = "Account Not Found!";
        }
    }
    //Encode to json and send response to home.js
    echo json_encode($response);
?>