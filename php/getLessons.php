<?php
    session_start();

    //Load XML
    $xml = simplexml_load_file("lessons.xml");

    //Storage for response
    $response = array();

    //Get Lessons
    foreach($xml->children() as $lesson){
        $lessonInstance = array();
        $lessonInstance['title'] = (string) $lesson['title'];

        //Get Topics
        $topicInstance = array();
        $topicsInstance = array();
        foreach($lesson->topic as $oldTopic){
            $topicInstance['topicTitle'] = (string) $oldTopic['topicTitle'];
            $topicInstance['content'] = (string) $oldTopic->content;
            array_push($topicsInstance,$topicInstance);
        }
        $lessonInstance['topics'] = $topicsInstance;
        array_push($response,$lessonInstance);
    }

    echo json_encode($response);
?>