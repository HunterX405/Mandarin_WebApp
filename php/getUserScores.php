<?php
    session_start();
    // Redirect to Login Page if not user or admin.
    if (!isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    // Get User
    $user = $_POST['user'];

    // PHP Response
    $response = array();
    $response['assessment'] = array();
    $response['mocktest'] = array();

    // Load Assessment Scores XML
    $xml = simplexml_load_file("userScores.xml");
    foreach ($xml->children() as $userScores) {
        $compUser = $userScores['user'];
        if($compUser == $user){
            $row = array();
            $row['date'] = (string) $userScores['date'];
            $row['title'] = (string) $userScores['test'];
            $row['score'] = (string) $userScores;
            array_push($response['assessment'],$row);
        }
    }

    // Load Mock Test Scores XML
    $xml = simplexml_load_file("mockTestScores.xml");
    foreach ($xml->children() as $userScores) {
        $compUser = $userScores['user'];
        if($compUser == $user){
            $row = array();
            $row['date'] = (string) $userScores['date'];
            $row['title'] = (string) $userScores['test'];
            $row['score'] = (string) $userScores;
            array_push($response['mocktest'],$row);
        }
    }

    echo json_encode($response);
?>