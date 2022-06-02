<?php
    session_start();
    // Redirect to Login Page when accessed via link.
    if (!isset($_SESSION['user']) && !isset($_POST['topicDelete']) && !isset($_POST['lesson'])) {
        header('location: ../admin.html');
        exit;
    }

    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("lessons.xml");

    //Get POST Variables
    $topicFromLesson = $_POST['lesson'];
    $topicToDelete = $_POST['topicDelete'];

    $lessons = $xml->getElementsByTagName("lesson");
    foreach($lessons as $lesson){
        $lessonTitle = $lesson->getAttribute("title");

        if($lessonTitle == $lessonToDelete){
            
            //Delete lesson
            $xml->getElementsByTagName("lessons")[0]->removeChild($lesson);

            //Save XML file
            $xml->save("lessons.xml");

            echo "Lesson Deleted Successfully!";
            break;
        }
    }

?>