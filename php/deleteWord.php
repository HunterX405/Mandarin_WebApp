<?php
    session_start();
    // Redirect to Login Page if not admin.
    if (!isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("dictionary.xml");

    $wordToDelete = $_POST['wordDelete'];

    $success = false;

    $words = $xml->getElementsByTagName("word");
    foreach($words as $word){
        $pinyin = $word->getAttribute("pinyin");

        if($pinyin == $wordToDelete){

            //Delete Word
            $xml->getElementsByTagName("words")[0]->removeChild($word);

            //Save XML file
            $xml->save("dictionary.xml");

            $success = true;
            echo "Word Deleted Successfully!";
            break;
        }
    }
    if(!$success){
        echo "Word Not Found!";
    }

?>