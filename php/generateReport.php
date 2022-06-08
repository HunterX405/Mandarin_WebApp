<?php
    session_start();
    // Redirect to Login Page if not user or admin.
    if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    // Get POST Variables
    $data = $_POST['info'];
    $startDate = $_POST['start'];
    $endDate = $_POST['end'];

    //Storage for response
    $response = "";

    $hasContent = false;

    if($data == "Activity Log"){
        // Table Headers
        $response .= "<tr><th>Date</th><th>Type</th><th>Message</th></tr>";
        //Load XML
        $xml = simplexml_load_file("activity.xml");
        foreach($xml->children() as $log){
            $compDate = $log['date'];
            if($startDate <= $compDate && $compDate <= $endDate){
                $hasContent = true;
                $response .= "<tr><td>".(string) $compDate."</td>";
                $response .= "<td>".(string) $log['type']."</td>";
                $response .= "<td style='width:50%'>".(string) $log."</td></tr>";
            }
        }
    }else if($data == "Users"){
        // Table Headers
        $response .= "<tr><th>Register Date</th><th>Name</th><th>Email</th></tr>";

        //Load XML
        $xml = simplexml_load_file("userAccounts.xml");
        foreach($xml->children() as $user){
            $compDate = $user['regDate'];
            if($startDate <= $compDate && $compDate <= $endDate){
                $hasContent = true;
                $fname = (string) $user->name->firstName;
                $mname = (string) $user->name->middleName;
                $lname = (string) $user->name->lastName;
                $name = $fname . " " . $mname . " " . $lname;
                $response .= "<tr><td>".(string) $compDate."</td>";
                $response .= "<td style='width:25%'>".$name."</td>";
                $response .= "<td style='width:25%'>".(string) $user['email']."</td></tr>";
            }
        }
    }else if($data == "Assessments"){
        // Table Headers
        $response .= "<tr><th>Date</th><th>Assessment</th><th>User</th><th>Score</th></tr>";
        //Load XML
        $xml = simplexml_load_file("userScores.xml");
        foreach($xml->children() as $assessment){
            $compDate = $assessment['date'];
            if($startDate <= $compDate && $compDate <= $endDate){
                $hasContent = true;
                $response .= "<tr><td>".(string) $compDate."</td>";
                $response .= "<td style='width:25%'>".$assessment['test']."</td>";
                $response .= "<td style='width:25%'>".$assessment['user']."</td>";
                $response .= "<td style='width:25%'>".(string) $assessment."</td></tr>";
            }
        }
    }else if($data == "Mock Test"){
        // Table Headers
        $response .= "<tr><th>Date</th><th>Mock Test</th><th>User</th><th>Score</th></tr>";
        //Load XML
        $xml = simplexml_load_file("mockTestScores.xml");
        foreach($xml->children() as $mocktest){
            $compDate = $mocktest['date'];
            if($startDate <= $compDate && $compDate <= $endDate){
                $hasContent = true;
                $response .= "<tr><td>".(string) $compDate."</td>";
                $response .= "<td style='width:25%'>".$mocktest['test']."</td>";
                $response .= "<td style='width:25%'>".$mocktest['user']."</td>";
                $response .= "<td style='width:25%'>".(string) $mocktest."</td></tr>";
            }
        }
    }

    if(!$hasContent){
        $response = "<h2>No Record Found</h2>";
    }

    echo $response;

?>