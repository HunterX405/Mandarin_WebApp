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
    $pinyin = $_POST['editPinyin'];
    $hanzi = $_POST['editHanzi'];
    $definition = $_POST['editDefinition'];
    $speech = $_POST['editSpeech'];
    $sentence = $_POST['editSentence'];

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

    $isUnique = true;

    //Replace word node with new one
    $words = $xml->getElementsByTagName("word");
    foreach($words as $compWord){
        $compPinyin = $compWord->getAttribute("pinyin");
        if($compPinyin == $pinyin){
            $isUnique = false;
        }else if($compPinyin == $_POST['oldPinyin']){
            $xml->getElementsByTagName("words")->item(0)->replaceChild($word,$compWord);
            break;
        }
    }

    if($isUnique){
        //Save XML file
        $xml->save("dictionary.xml");

        // Add to Activity Log
        $xmlLog = new DOMDocument();
        $xmlLog->preserveWhiteSpace = false;
        $xmlLog->formatOutput = true;
        $xmlLog->load("activity.xml"); 

        $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." edited the word ".$pinyin." in the dictionary");
        $log->setAttribute("type","EDIT WORD");
        $log->setAttribute("date",date("m/d/Y"));
        
        $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
        $xmlLog->save("activity.xml");

        echo "Word Edited Successfully!";
    }else{
        echo "Word(Pinyin) Already Exists!";
    }
?>