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

    // Add to Activity Log
    $xmlLog = new DOMDocument();
    $xmlLog->preserveWhiteSpace = false;
    $xmlLog->formatOutput = true;
    $xmlLog->load("activity.xml"); 

    if(isset($_SESSION['admin'])){
        $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." viewed the dictionary");
    }else{
        $log = $xmlLog->createElement("log","User ".$_SESSION['user']." viewed the dictionary");
    }

    $log->setAttribute("type","VIEW DICTIONARY");
    $log->setAttribute("date",date("m/d/Y"));
    
    $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
    $xmlLog->save("activity.xml");

    echo json_encode($response);
    
?>