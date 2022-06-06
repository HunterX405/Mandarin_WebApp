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

    //Storage for response
    $response = array();
    if(isset($_POST['data'])){
        $response['completed'] = array();
        $response['pending'] = array();
    }

    //Get Lessons
    foreach($xml->children() as $assessment){
        $compTitle = $assessment['title'];
        if(isset($_POST['title'])){
            $title = $_POST['title'];
            if($title == $compTitle){
                $response['title'] = $title;
                $response['items'] = (string) $assessment['items'];
                $response['questionsCount'] = (string) $assessment->count();
                $response['questions'] = array();
                foreach ($assessment->children() as $question) {
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
                $xml2 = simplexml_load_file("userScores.xml");
                // Check if user has already taken the assessment

                if(isset($_SESSION['admin'])){
                    $user = $_SESSION['admin'];
                }else{
                    $user = $_SESSION['user'];
                }
                $hasScore = false;
                foreach($xml2->children() as $userScore){
                    if((string) $userScore['user'] == $user && (string) $assessment['title'] == (string) $userScore['test']){
                        $hasScore = true;
                        $assessmentDone = array();
                        $assessmentDone['title'] = (string) $assessment['title'];
                        $assessmentDone['score'] = (string) $userScore;
                        $assessmentDone['items'] = (string) $assessment['items'];
                        array_push($response['completed'],$assessmentDone);
                    }
                }
                if(!$hasScore){
                    $assessmentRow = array();
                    $assessmentRow['title'] = (string) $assessment['title'];
                    $assessmentRow['items'] = (string) $assessment['items'];
                    array_push($response['pending'],$assessmentRow);
                }else{
                }
            }else{
                $assessmentRow = array();
                $assessmentRow['title'] = (string) $assessment['title'];
                $assessmentRow['items'] = (string) $assessment['items'];
                $assessmentRow['questionsCount'] = (string) $assessment->count();
                array_push($response,$assessmentRow);
            }
        }
    }
    echo json_encode($response);
    
?>