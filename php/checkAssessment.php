<?php
    session_start();
    // Redirect to Login Page if not user or admin.
    if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    //Load XML
    $xml = simplexml_load_file("assessments.xml");

    $response = "";

    $title = $_POST['title'];

//Find Assessment
    foreach($xml->children() as $assessment){
        $compTitle = $assessment['title'];
        if($title == $compTitle){
            // Assessment Found
            $totalItems = (int) $assessment['items'];
            $totalQuestions = (string) $assessment->count();

            // Check Assessment
            $i = 1; $score = 0; $valid = array();
            while (count($valid) != $totalItems) {
                if(isset($_POST["qid-".$i])){
                    // Find Question
                    foreach($assessment->children() as $question){
                        $questionID = $question['id'];
                        if($questionID == $i){
                            // Question Found
                            array_push($valid,$i);
                            
                            // Get all possible answers
                            foreach($question->answer as $qanswer){
                                // Check Answer
                                if((string) $qanswer == $_POST["answer-".$i]){
                                    $score++;
                                    break;
                                }
                            }
                        }
                    }
                }
                $i++;
            }
            break;
        }
    }

// Add user score to userdata.xml

    //Load userData XML
    $xml2 = new DOMDocument();
    $xml2->preserveWhiteSpace = false;
    $xml2->formatOutput = true;
    $xml2->load("userScores.xml");

    $scoreElement = $xml2->createElement("score",$score);
    $scoreElement->setAttribute("test",$title);
    if(isset($_SESSION['admin'])){
        $scoreElement->setAttribute("user",$_SESSION['admin']);
    }else{
        $scoreElement->setAttribute("user",$_SESSION['user']);
    }
    $scoreElement->setAttribute("date",date("m/d/Y"));

    $xml2->getElementsByTagName("scores")->item(0)->appendChild($scoreElement);

    //Save XML file
    $xml2->save("userScores.xml");

    $response = "Assessment Complete!<p>Score: ".$score."/".$totalItems."</p>";

    if(isset($_SESSION['admin'])){
        $user = $_SESSION['admin'];
    }else{
        $user = $_SESSION['user'];
    }

    // Add to Activity Log
    $xmlLog = new DOMDocument();
    $xmlLog->preserveWhiteSpace = false;
    $xmlLog->formatOutput = true;
    $xmlLog->load("activity.xml"); 

    $log = $xmlLog->createElement("log","User ".$user." completed an assessment titled ".$title." and got a score of ".$score."/".$totalItems);
    $log->setAttribute("type","ASSESSMENT COMPLETE");
    $log->setAttribute("date",date("m/d/Y"));
    
    $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
    $xmlLog->save("activity.xml");

    echo $response;
    
?>