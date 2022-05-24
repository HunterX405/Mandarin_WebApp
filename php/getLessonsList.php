<?php

    //Load XML
    $xml = simplexml_load_file("lessons.xml");

    //Storage for response
    $response = array();

    //Get Lessons
    foreach($xml->children() as $lesson){
        $title = $lesson['title'];
        array_push($response,$title);
    }
    echo json_encode($response);
?>