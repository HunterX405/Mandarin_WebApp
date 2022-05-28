<?php

    //Load XML
    $xml = simplexml_load_file("lessons.xml");

    //Storage for response
    $response = array();

    //Get Lessons
    foreach($xml->children() as $lesson){

        if(!isset($_POST["data"])){
            //Get Topics
            $topicInstance = array();
            $lessonTopics = array();
            foreach($lesson->topic as $oldTopic){
                $topicInstance['topicTitle'] = (string) $oldTopic['topicTitle'];
                $topicInstance['content'] = (string) $oldTopic->content;
                array_push($lessonTopics,$topicInstance);
            }
            $lessonInstance['topics'] = $lessonTopics;
            array_push($response,$lessonInstance);
        }else{
            $lessonTitle = (string) $lesson['title'];
            if($_POST["data"] == "title"){
                $lessonInstance = array();
                $lessonInstance['title'] = $lessonTitle;
                array_push($response,$lessonInstance);
            }else if($_POST["data"] == "lesson"){
                if($_POST["lesson"] == $lessonTitle){
                    $topicInstance = array();
                    $lessonTopics = array();
                    foreach($lesson->topic as $oldTopic){
                        $topicInstance['topicTitle'] = (string) $oldTopic['topicTitle'];
                        $topicInstance['content'] = (string) $oldTopic->content;
                        array_push($lessonTopics,$topicInstance);
                    }
                    array_push($response,$lessonTopics);
                    break;
                }
            }
        }
    }
    echo json_encode($response);
?>