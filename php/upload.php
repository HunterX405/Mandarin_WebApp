<?php 

    $file_global = $_FILES['image'];
                            
    $file_tmp_name = $file_global['tmp_name'];
    $file_new_name = $file_global['name'];

    $run_upload = move_uploaded_file( $file_tmp_name, "images/lessons/".$file_new_name );


    if( $run_upload ){
        $file = dirname($_SERVER['PHP_SELF']) . "/images/lessons/" . $file_new_name;
        $data = array(
            'success' => true,
            'message' => 'uploadSuccess',
            'file'    => $file,
        );
        echo json_encode($data);
    } else {
        echo 'fail';
    }
?>