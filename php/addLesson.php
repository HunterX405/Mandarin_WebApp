<?php
    // Redirect to Login Page when accessed via link.
    if (!isset($_POST['lesson']) && !isset($_POST['topic']) && !isset($_POST['content'])) {
        header('location: index.html');
        exit;
    }

    //Get POST variable
    $lessonTitle = $_POST['lessonList'];
    $topicTitle = $_POST['topic'];
    $topicContent = $_POST['content'];

    //Load XML
    $xml = new DOMDocument();
    $xml->preserveWhiteSpace = false;
    $xml->formatOutput = true;
    $xml->load("lessons.xml");

    //Create topic element
    $newTopic = $xml->createElement("topic");
    $newTopic->setAttribute("topicTitle",$topicTitle);
    $content = $xml->createElement("content");
    $content->appendChild($xml->createCDATASection($topicContent));
    $newTopic->appendChild($content);

    //PHP Response variable
    $response = array("message" => "default");

    //Create New Lesson Element
    $lesson = $xml->createElement("lesson");

    $lessons = $xml->getElementsByTagName("lesson");

    if($lessonTitle == "New Lesson"){
        //Get last lesson number and add 1 for next lesson.
        $lastTitle = $lessons[count($lessons)-1]->getAttribute("title");
        $lessonTitle = "LESSON " . strval(explode(" ",$lastTitle)[1]+1);

        //Set new lesson title attribute
        $lesson->setAttribute("title", $lessonTitle);

        //Append topic to new lesson
        $lesson->appendChild($newTopic);

        //Add lesson to xml
        $xml->getElementsByTagName("lessons")->item(0)->appendChild($lesson);

        $response["message"] = "New Lesson Added Successfully!";
    }else{
        //Find lesson in xml if not new lesson
        foreach($lessons as $compLesson){
            $compTitle = $compLesson->getAttribute("title");
            if($lessonTitle == $compTitle){
                //Create new lesson to replace old one with same title attribute
                $lesson->setAttribute("title", $compTitle);

                //Get and append all topics from old lesson node to new lesson node
                foreach($compLesson->getElementsByTagName("topic") as $topic){
                    $oldTopic = $xml->createElement("topic");
                    $oldTopic->setAttribute("topicTitle", $topic->getAttribute("topicTitle"));

                    $oldContent = $xml->createElement("content");
                    $oldContent->appendChild($xml->createCDATASection($topic->getElementsByTagName("content")[0]->textContent));
                    
                    $oldTopic->appendChild($oldContent);
                    
                    $lesson->appendChild($oldTopic);
                }

                //Append new topic to lesson
                $lesson->appendChild($newTopic);

                //Replace old lesson node($compLesson) to new lesson node($lesson)
                $xml->getElementsByTagName("lessons")->item(0)->replaceChild($lesson,$compLesson);
                $response["message"] = "Lesson Updated Successfully!";
            }
        }
    }

    //Save XML file
    $xml->save("lessons.xml");


    // $xml = simplexml_load_file("lessons.xml");


    // foreach($xml->children() as $lesson){
    //     if($lessonTitle == $lesson['title']){
    //         $newLesson = new SimpleXMLElement("lesson");
    //         $newLesson->addAttribute('title',$lessonTitle);

    //         foreach($lesson->topic as $oldTopic){
    //             $newTopic = new SimpleXMLElement("topic");
    //             $newTopic->addAttribute('topicTitle',$oldTopic['topicTitle']);
    //             $newTopic->addChild('content',$oldTopic->content);
    //             $newLesson->addChild($newTopic);
    //         }



    //     }
    // }

    //JSON Response
    echo json_encode($response);
?>