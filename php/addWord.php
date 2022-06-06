<?php
    session_start();
    // Redirect to Login Page if not admin.
    if (!isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }
    
    //Load XML
    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("dictionary.xml");

    //Get POST Variables
    $pinyin = $_POST['pinyin'];
    $hanzi = $_POST['hanzi'];
    $definition = $_POST['definition'];
    $speech = $_POST['speech'];
    $sentence = $_POST['sentence'];

    //Check if word already exists in dictionary.
    $inDictionary = false;
    $words = $xml->getElementsByTagName("word");
    foreach($words as $compWord){
        $compPinyin = $compWord->getAttribute("pinyin");
        if($compPinyin == $pinyin){
            $inDictionary = true;
            echo "Word Already Exists!";
            break;
        }
    }

    if(!$inDictionary){
        //Create word element
        $word = $xml->createElement("word");
        $word->setAttribute("pinyin", $pinyin);

        //Set Element Values
        $newHanzi = $xml->createElement("hanzi", $hanzi);
        $newDefinition = $xml->createElement("definition", $definition);
        $newSpeech = $xml->createElement("speech", $speech);
        $newSentence = $xml->createElement("sentence", $sentence);

        //Append elemets to word element
        $word->appendChild($newHanzi);
        $word->appendChild($newDefinition);
        $word->appendChild($newSpeech);
        $word->appendChild($newSentence);

        //Add user to xml
        $xml->getElementsByTagName("words")->item(0)->appendChild($word);
        //Save XML file
        $xml->save("dictionary.xml");

        echo "Word Added Successfully!";
    }
?>