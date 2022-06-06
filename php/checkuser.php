<?php
    session_start();
    
    if(isset($_POST['logout'])){
        unset($_SESSION['admin']);
        unset($_SESSION['user']);
        session_destroy();
        echo "Logged Out";
    }else if(isset($_SESSION['user'])){
        echo "Logged In";
    }else if(isset($_SESSION['admin'])){
        echo "Admin";
    }else{
        echo "Not Logged In";
    }
?>