<?php
    session_start();
    // Redirect to Login Page if not admin.
    if (!isset($_SESSION['admin'])) {
        echo "Unauthorized!";
        header('location: ../');
        exit;
    }
    
    //Load XML
    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("lessons.xml");

    // Add to Activity Log
    $xmlLog = new DOMDocument();
    $xmlLog->preserveWhiteSpace = false;
    $xmlLog->formatOutput = true;
    $xmlLog->load("activity.xml");

    //Create New Lesson Element
    $lesson = $xml->createElement("lesson");

    $lessons = $xml->getElementsByTagName("lesson");

    if(isset($_POST['newLesson'])){
        //Get POST variable
        $newLessonTitle = $_POST['newLesson'];

        $uniqueTitle = true;
        foreach($lessons as $inCompLesson){
            $inCompTitle = $inCompLesson->getAttribute("title");
            if($newLessonTitle == $inCompTitle){
                $uniqueTitle = false;
            }
        }
        if($uniqueTitle){
            //Set new lesson title attribute
            $lesson->setAttribute("title", $newLessonTitle);

            //Add lesson to xml
            $xml->getElementsByTagName("lessons")->item(0)->appendChild($lesson);

            $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." added a new lesson titled ".$newLessonTitle);
            $log->setAttribute("type","ADD LESSON");
            $log->setAttribute("date",date("m/d/Y"));
            $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
            $xmlLog->save("activity.xml");
            $response = "Lesson Added Successfully!";
        }else{
            $response = "Lesson Already Exists!";
        }

    }else{
        $lessonTitle = $_POST['addLessonTitle'];
        //Find lesson in xml if not new lesson
        foreach($lessons as $compLesson){
            $compTitle = $compLesson->getAttribute("title");
            if($lessonTitle == $compTitle){
                //Get POST variable
                $topicTitle = $_POST['topic'];
                $topicContent = $_POST['content'];

                //Create new topic element
                $newTopic = $xml->createElement("topic");
                $newTopic->setAttribute("topicTitle",$topicTitle);
                $content = $xml->createElement("content");
                $content->appendChild($xml->createCDATASection($topicContent));
                $newTopic->appendChild($content);

                //Create new lesson to replace old one with same title attribute
                $lesson->setAttribute("title", $compTitle);

                //Check if new topic title exists already
                $isUniqueTopic = true;

                //Get and append all topics from old lesson node to new lesson node
                $topics = $compLesson->getElementsByTagName("topic");
                foreach($topics as $topic){
                    $oldTopicTitle = $topic->getAttribute("topicTitle");
                    if($oldTopicTitle == $topicTitle){
                        $isUniqueTopic = false;
                        break;
                    }else{
                        $oldTopic = $xml->createElement("topic");
                        $oldTopic->setAttribute("topicTitle", $oldTopicTitle);

                        $oldContent = $xml->createElement("content");
                        $oldContent->appendChild($xml->createCDATASection($topic->getElementsByTagName("content")[0]->textContent));
                        
                        $oldTopic->appendChild($oldContent);
                        
                        $lesson->appendChild($oldTopic);
                    }
                }

                if($isUniqueTopic){
                    //Append new topic to lesson
                    $lesson->appendChild($newTopic);

                    //Replace old lesson node($compLesson) to new lesson node($lesson)
                    $xml->getElementsByTagName("lessons")->item(0)->replaceChild($lesson,$compLesson);
                    $log = $xmlLog->createElement("log","Admin ".$_SESSION['admin']." added a topic titled ".$topicTitle." in ".$lessonTitle);
                    $log->setAttribute("type","ADD TOPIC");
                    $log->setAttribute("date",date("m/d/Y"));
                    $xmlLog->getElementsByTagName("logs")->item(0)->appendChild($log);
                    $xmlLog->save("activity.xml");
                    $response = "Topic Added Successfully!";
                }else{
                    $response = "Topic Title Already Exists!";
                }
            }
        }
    }

    //Save XML file
    $xml->save("lessons.xml");

    //JSON Response
    echo $response;
?>