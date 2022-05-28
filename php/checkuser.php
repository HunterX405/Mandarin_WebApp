<?php
    session_start();
    
    if(isset($_POST['logout'])){
        unset($_SESSION['user']);
        session_destroy();
        echo "Logged Out";
    }else if(isset($_SESSION['user'])){
        echo "Already Logged In";
    }else{
        echo "Not Logged In";
    }
?>