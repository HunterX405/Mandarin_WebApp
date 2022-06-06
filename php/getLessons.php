<?php
    session_start();
    // Redirect to Login Page if not user or admin.
    if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    //Load XML
    $xml = simplexml_load_file("lessons.xml");

    //Storage for response
    $response = array();
    $response['title'] = array();

    //Get Lessons
    foreach($xml->children() as $lesson){
        $lessonTitle = (string) $lesson['title'];
        if($_POST["data"] == "title"){
            array_push($response['title'],$lessonTitle);
        }else if($_POST["data"] == "hometitle"){
            if(!empty($lesson->topic)){
                array_push($response['title'],$lessonTitle);
            }
        }else if($_POST["data"] == "lesson"){
            if($_POST["lesson"] == $lessonTitle){
                $response['topicTitle'] = array();
                foreach($lesson->topic as $topic){
                    $topicTitle = (string) $topic['topicTitle'];
                    if(isset($_POST['topic'])){
                        if($_POST['topic'] == $topicTitle){
                            $response['content'] = (string) $topic->content;
                            break;
                        }
                    }
                    array_push($response['topicTitle'],$topicTitle);
                }
                if(!isset($_POST['topic'])){
                    if(!empty($lesson->topic[0]->content)){
                        $response['content'] = (string) $lesson->topic[0]->content;
                    }else{
                        $response['content'] = "";
                    }
                }
                break;
            }
        }
    }
    echo json_encode($response);
?>