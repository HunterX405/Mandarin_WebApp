<?php
    session_start();
    // Redirect to Login Page if not user or admin.
    if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }
    
    //Load XML
    $xml = simplexml_load_file("mockTest.xml");

    //Storage for response
    $response = array();
    if(isset($_POST['data'])){
        $response['completed'] = array();
        $response['pending'] = array();
    }

    //Get Lessons
    foreach($xml->children() as $mocktest){
        $compTitle = $mocktest['title'];
        if(isset($_POST['title'])){
            $title = $_POST['title'];
            if($title == $compTitle){
                $response['title'] = $title;
                $response['items'] = (string) $mocktest['items'];
                $response['questionsCount'] = (string) $mocktest->count();
                $response['questions'] = array();
                foreach ($mocktest->children() as $question) {
                    $questionRow = array();
                    $questionRow['type'] = (string) $question['type'];
                    $questionRow['id'] = (string) $question['id'];
                    $questionRow['text'] = (string) $question->text;
                    $questionRow['image'] = (string) $question->image;

                    if($question['type'] == "multiple"){
                        $choices = array();
                        foreach ($question->choice as $choiceRow){
                            array_push($choices,(string) $choiceRow);
                        }
                        $questionRow['choices'] = $choices;
                        $questionRow['answer'] = (string) $question->answer;
                    }elseif ($question['type'] == "identify") {
                        $answers = "";
                        foreach ($question->answer as $answerRow){
                            $answers .= $answerRow.",";
                        }
                        $answers = substr($answers, 0, -1);
                        $questionRow['answer'] = $answers;
                    }else{
                        $questionRow['answer'] = (string) $question->answer;
                    }

                    array_push($response['questions'],$questionRow);
                }
            }
        }else{
            if(isset($_POST['data'])){
                $xml2 = simplexml_load_file("mockTestScores.xml");
                // Check if user has already taken the mock test

                if(isset($_SESSION['admin'])){
                    $user = $_SESSION['admin'];
                }else{
                    $user = $_SESSION['user'];
                }
                $hasScore = false;
                foreach($xml2->children() as $mockTestScore){
                    if((string) $mockTestScore['user'] == $user && (string) $mocktest['title'] == (string) $mockTestScore['test']){
                        $hasScore = true;
                        $mocktestDone = array();
                        $mocktestDone['title'] = (string) $mocktest['title'];
                        $mocktestDone['score'] = (string) $mockTestScore;
                        $mocktestDone['items'] = (string) $mocktest['items'];
                        array_push($response['completed'],$mocktestDone);
                    }
                }
                if(!$hasScore){
                    $mocktestRow = array();
                    $mocktestRow['title'] = (string) $mocktest['title'];
                    $mocktestRow['items'] = (string) $mocktest['items'];
                    array_push($response['pending'],$mocktestRow);
                }else{
                }
            }else{
                $mocktestRow = array();
                $mocktestRow['title'] = (string) $mocktest['title'];
                $mocktestRow['items'] = (string) $mocktest['items'];
                $mocktestRow['questionsCount'] = (string) $mocktest->count();
                array_push($response,$mocktestRow);
            }
        }
    }
    echo json_encode($response);
?>