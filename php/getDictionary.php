<?php

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