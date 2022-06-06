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

    //Get Lessons
    foreach($xml->children() as $lesson){
        $title = $lesson['title'];
        array_push($response,$title);
    }
    echo json_encode($response);
?>