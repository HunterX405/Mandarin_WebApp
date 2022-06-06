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
    $xml->load("assessments.xml");

    $assessmentToDelete = $_POST['assessmentDelete'];

    $success = false;

    $assessments = $xml->getElementsByTagName("assessment");
    foreach($assessments as $assessment){
        $title = $assessment->getAttribute("title");

        if($title == $assessmentToDelete){

            //Delete Assessment
            $xml->getElementsByTagName("assessments")[0]->removeChild($assessment);

            //Save XML file
            $xml->save("assessments.xml");

            $success = true;
            echo "Assessment Deleted Successfully!";
            break;
        }
    }
    if(!$success){
        echo "Assessment Not Found!";
    }

?>