<?php
    session_start();
    // Redirect to Login Page if not admin.
    if (!isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }

    //Get POST Variables
    $lessonTitle = $_POST['editLessonTitle'];
    $oldTopicTitle = $_POST['oldTopicTitle'];
    
    //Load Lessons XML
    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("lessons.xml");

    //Find Lesson
    $lessonFound = false;
    $lessons = $xml->getElementsByTagName("lesson");
    foreach ($lessons as $lesson) {
        $compLessonTitle = $lesson->getAttribute("title");

        if($lessonTitle == $compLessonTitle){
            $lessonFound = true;
            //Create New Lesson Element
            $newLesson = $xml->createElement("lesson");
            $newLesson->setAttribute("title", $lessonTitle);

            //Find Topic
            $topicFound = false;
            $topicDeleted = false;
            $topics = $lesson->getElementsByTagName("topic");
            foreach($topics as $topic){
                $compTopicTitle = $topic->getAttribute("topicTitle");
                if($oldTopicTitle == $compTopicTitle){
                    
                    $topicFound = true;
                    if(isset($_POST['editTopicContent']) && isset($_POST['oldTopicTitle'])){
                        //EDIT TOPIC
                        //Get POST variables for EDIT
                        $topicContent = $_POST['editTopicContent'];
                        $topicTitle = $_POST['editTopicTitle'];

                        //Create New Topic Element
                        $newTopic = $xml->createElement("topic");
                        $newTopic->setAttribute("topicTitle", $topicTitle);
                        $newContent = $xml->createElement("content");
                        $newContent->appendChild($xml->createCDATASection($topicContent));
                        $newTopic->appendChild($newContent);

                        //Append new topic to new lesson
                        $newLesson->appendChild($newTopic);
                    }else{
                        //DELETE TOPIC
                        $topicDeleted = true;
                    }
                }else{
                    $oldTopic = $xml->createElement("topic");
                    $oldTopic->setAttribute("topicTitle", $compTopicTitle);
                    $oldContent = $xml->createElement("content");
                    $oldContent->appendChild($xml->createCDATASection($topic->getElementsByTagName("content")[0]->nodeValue));
                    $oldTopic->appendChild($oldContent);

                    $newLesson->appendChild($oldTopic);
                }
            }
            //Replace old lesson node($lesson) to new lesson node($newLesson) in xml
            $xml->getElementsByTagName("lessons")->item(0)->replaceChild($newLesson,$lesson);
        }
    }

    if(!$topicFound){
        $response = "Topic Not Found.";
    }else if(!$lessonFound){
        $response = "Lesson Not Found.";
    }else{

        //Save XML file
        $xml->save("lessons.xml");

        //Success Response
        if($topicDeleted){
            $response = "Topic Deleted Successfully!";
        }else{
            $response = "Topic Edited Successfully!";
        }  
    }

    //PHP Response
    echo $response;
?>