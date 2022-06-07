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
    $xml->load("lessons.xml");

    $lessonToDelete = $_POST['lessonDelete'];

    $lessons = $xml->getElementsByTagName("lesson");
    foreach($lessons as $lesson){
        $lessonTitle = $lesson->getAttribute("title");

        if($lessonTitle == $lessonToDelete){

            //Delete lesson
            $xml->getElementsByTagName("lessons")[0]->removeChild($lesson);

            //Save XML file
            $xml->save("lessons.xml");

            // Add to Activity Log
            $xmlLog = new DOMDocument();
            $xmlLog->preserveWhiteSpace = false;
            $xmlLog->formatOutput = true;
            $xmlLog->load("activity.xml"); 

            $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." deleted a lesson titled ".$lessonTitle);
            $log->setAttribute("type","DELETE LESSON");
            $log->setAttribute("date",date("m/d/Y"));
            
            $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
            $xmlLog->save("activity.xml");

            echo "Lesson Deleted Successfully!";
            break;
        }
    }

?>