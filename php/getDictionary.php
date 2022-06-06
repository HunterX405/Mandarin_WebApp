<?php
    session_start();
    // Redirect to Login Page if not user or admin.
    if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }
    
    //Load XML
    $xml = simplexml_load_file("dictionary.xml");

    //Storage for response
    $response = array();

    //Get Lessons
    foreach($xml->children() as $word){
        $wordRow = array();
        $wordRow['pinyin'] = (string) $word['pinyin'];
        $wordRow['hanzi'] = (string) $word->hanzi;
        $wordRow['definition'] = (string) $word->definition;
        $wordRow['speech'] = (string) $word->speech;
        $wordRow['sentence'] = (string) $word->sentence;
        array_push($response,$wordRow);
    }
    echo json_encode($response);
    
?>