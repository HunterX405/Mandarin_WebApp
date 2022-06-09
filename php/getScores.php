<?php
    session_start();
    // Redirect to Login Page if not user or admin.
    if (!isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    // Get User
    $title = $_POST['title'];
    $data = $_POST['table'];

    // PHP Response
    $response = array();

    if($data == "ASSESSMENT"){
        // Load Assessment Scores XML
        $xml = simplexml_load_file("userScores.xml");
        foreach ($xml->children() as $userScores) {
            $compTitle = $userScores['test'];
            if($compTitle == $title){
                $row = array();
                $row['date'] = (string) $userScores['date'];
                $row['user'] = (string) $userScores['user'];
                $row['score'] = (string) $userScores;
                array_push($response,$row);
            }
        }
    }else{
        // Load Mock Test Scores XML
        $xml = simplexml_load_file("mockTestScores.xml");
        foreach ($xml->children() as $userScores) {
            $compTitle = $userScores['test'];
            if($compTitle == $title){
                $row = array();
                $row['date'] = (string) $userScores['date'];
                $row['user'] = (string) $userScores['user'];
                $row['score'] = (string) $userScores;
                array_push($response,$row);
            }
        }
    }

    echo json_encode($response);
?>