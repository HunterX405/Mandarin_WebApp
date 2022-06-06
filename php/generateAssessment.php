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

    
    $title = $_POST['title'];

    //Get Lessons
    foreach($xml->children() as $assessment){
        $compTitle = $assessment['title'];
        if($title == $compTitle){
            $response['title'] = $title;
            $response['items'] = (string) $assessment['items'];
            $response['questionsCount'] = (string) $assessment->count();
            $response['questions'] = array();
            $added = array();
            while (count($added) != (int) $assessment['items']) {
                $randomIndex = rand(0,$assessment->count()-1);
                if(!in_array($randomIndex,$added)){
                    array_push($added,$randomIndex);
                    $question = $assessment->question[$randomIndex];

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
            break;
        }
    }
    echo json_encode($response);
    
?>