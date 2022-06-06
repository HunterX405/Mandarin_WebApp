<?php
    session_start();
    // Redirect to Login Page if not admin.
    if (!isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }
    

    $response = "Default";

    //Load XML
    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("assessments.xml");

    // Get POST variables
    $title = $_POST['assessmentTitle'];
    $items = $_POST['totalItems'];

    // Create new assessment element
    $assessment = $xml->createElement("assessment");
    $assessment->setAttribute("title",$title);
    $assessment->setAttribute("items",$items);

    // Check if assessment already exists
    $isUnique = true;
    $assessments = $xml->getElementsByTagName("assessment");
    foreach ($assessments as $compAssessment) {
        $compTitle = $compAssessment->getAttribute("title");
        if($title == $compTitle){
            $isUnique = false;
            $response = "Assessment Already Exists!";
            break;
        }
    }

    $totalQuestions = $_POST['totalQuestions'];
    if($isUnique){
        for($x = 1; $x<=$totalQuestions; $x++){

            while(!isset($_POST["type-".$x])){
                $x++;
            }
            // Get POST variables for each question
            $type = $_POST["type-".$x];
    
            // Create question element
            $question = $xml->createElement("question");
            $question->setAttribute("type",$type);
            $question->setAttribute("id",$x);
    
            $text = $xml->createElement("text",$_POST["question-".$x]);
            $question->appendChild($text);
    
            //Check for uploaded image
            $targetFilePath = "";
            if(!empty($_FILES["image-".$x]["name"])){
                $uploadDir = 'images/';
                $uploadStatus = 0;
                $fileName = basename($_FILES["image-".$x]["name"]);
                $targetFilePath = $uploadDir . $fileName;
                $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);
    
                $allowTypes = array('jpg','jpeg','png','avif');
                if(in_array($fileType,$allowTypes)){
                    if(move_uploaded_file($_FILES["image-".$x]["tmp_name"], $targetFilePath)){
                        $uploadStatus = 1;
                        $uploadedFile = $fileName;
                        // $response["image"] = (string) $targetFilePath;
                    }else{
                        $uploadStatus = 0;
                        $response = "Sorry, there was an error uploading your file.";
                    }
                }else{
                    $uploadStatus = 0;
                    $response = "Sorry, only certain file types are allowed.";
                }
                if($uploadStatus == 1){
                    $response = "Success.";
                }
            }
    
            $image = $xml->createElement("image",$targetFilePath);
            $question->appendChild($image);
    
            if($type == "multiple"){
                $choice1 = $xml->createElement("choice",$_POST["choice-1-".$x]);
                $choice2 = $xml->createElement("choice",$_POST["choice-2-".$x]);
                $choice3 = $xml->createElement("choice",$_POST["choice-3-".$x]);
                $choice4 = $xml->createElement("choice",$_POST["choice-4-".$x]);
    
                $ans = $_POST["answer-".$x];
                $answer = $xml->createElement("answer",$_POST["choice-".$ans."-".$x]);
    
                $question->appendChild($choice1);
                $question->appendChild($choice2);
                $question->appendChild($choice3);
                $question->appendChild($choice4);
                $question->appendChild($answer);
            }elseif ($type=="truefalse"){
                $answer = $xml->createElement("answer",$_POST["answer-".$x]);
                $question->appendChild($answer);
            }elseif ($type=="identify") {
                $answers = explode(",",$_POST["answer-".$x]);
                foreach ($answers as $answer) {
                    $answer = $xml->createElement("answer",$answer);
                    $question->appendChild($answer);
                }
            }
            $assessment->appendChild($question);
        }
    
        $xml->getElementsByTagName("assessments")->item(0)->appendChild($assessment);
    
        //Save XML file
        $xml->save("assessments.xml");

        $response = "Assessment Successfully Added!";
    }

    //JSON Response
    echo $response;
?>    