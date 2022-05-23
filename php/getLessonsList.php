<?php
    //Redirect to Login Page when accessed via link.
    // if (!isset($_GET['user'])) {
    //     header('location: index.php');
    //     exit;
    // }

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