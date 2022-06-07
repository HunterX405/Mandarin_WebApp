<?php
    session_start();
    
    if(isset($_POST['logout'])){

        // Add to Activity Log
        $xmlLog = new DOMDocument();
        $xmlLog->preserveWhiteSpace = false;
        $xmlLog->formatOutput = true;
        $xmlLog->load("activity.xml"); 

        if(isset($_SESSION['admin'])){
            $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." Logged Out");
        }else{
            $log = $xmlLog->createElement("log","User ".$_SESSION['user']." Logged Out");
        }
        $log->setAttribute("type","LOGOUT");
        $log->setAttribute("date",date("m/d/Y"));
        $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
        $xmlLog->save("activity.xml");

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