<?php
    // Redirect to Login Page when accessed via link.
    if (!isset($_POST['loggedUser'])) {
        header('location: index.html');
        exit;
    }


    $response = array("message"=> "Transaction Failed!");

    //AJAX PHP JSON Response
    $response = array("message"=> "Transaction Failed!");

    //Get logged user
    $loggedUser = $_POST['loggedUser'];

    //For image url
    $targetFilePath = "";

    //For password validation
    $isAuthenticated = true;

    //Open XML Document
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
                }

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

                //Get password
                $editPass = $compUser->getElementsByTagName("password")[0]->nodeValue;

                //Set response values to update profile page values
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

            //Get current Image if there is no uploaded image or if in change password form.
            if($targetFilePath == ""){
                $targetFilePath = $compUser->getElementsByTagName("profileImage")[0]->nodeValue;
            }

            //Change password: if old password is correct.
            if($isAuthenticated){
                //Create new node to replace old node
                $user = $xml->createElement("user");
                $user->setAttribute("username", $editUname);
                $user->setAttribute("email", $editEmail);

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

                //Response for successful transaction.
                if( isset($_POST['newPass']) ){
                    //Change Password Response
                    $response["message"] = "Password Changed Successfully!";
                }else{
                    //Edit Profile Response
                    $response["message"] = "Account Updated!";
                }
            }else{
                $response["message"] = "Wrong Password";
            }
            break;
        }else{
            $response["message"] = "Account Not Found!";
        }
    }
    //Encode to json and send response to home.js
    echo json_encode($response);
?>