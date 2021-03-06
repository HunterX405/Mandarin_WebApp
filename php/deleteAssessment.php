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

            // Add to Activity Log
            $xmlLog = new DOMDocument();
            $xmlLog->preserveWhiteSpace = false;
            $xmlLog->formatOutput = true;
            $xmlLog->load("activity.xml"); 

            $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." deleted an assessment titled ".$assessmentToDelete);
            $log->setAttribute("type","DELETE ASSESSMENT");
            $log->setAttribute("date",date("m/d/Y"));
            
            $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
            $xmlLog->save("activity.xml");

            echo "Assessment Deleted Successfully!";
            break;
        }
    }
    if(!$success){
        echo "Assessment Not Found!";
    }

?>