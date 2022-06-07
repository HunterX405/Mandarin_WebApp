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
    $xml->load("mockTest.xml");

    $mockTestToDelete = $_POST['mockTestDelete'];

    $success = false;

    $mocktests = $xml->getElementsByTagName("mocktest");
    foreach($mocktests as $mocktest){
        $title = $mocktest->getAttribute("title");

        if($title == $mockTestToDelete){

            //Delete Assessment
            $xml->getElementsByTagName("mocktests")[0]->removeChild($mocktest);

            //Save XML file
            $xml->save("mockTest.xml");
            $success = true;

            // Add to Activity Log
            $xmlLog = new DOMDocument();
            $xmlLog->preserveWhiteSpace = false;
            $xmlLog->formatOutput = true;
            $xmlLog->load("activity.xml"); 

            $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." deleted a mock test titled ".$mockTestToDelete);
            $log->setAttribute("type","DELETE MOCK TEST");
            $log->setAttribute("date",date("m/d/Y"));
            
            $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
            $xmlLog->save("activity.xml");

            echo "Mock Test Deleted Successfully!";
            break;
        }
    }
    if(!$success){
        echo "Assessment Not Found!";
    }

?>