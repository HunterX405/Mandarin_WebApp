$(document).ready(function(){


    //Redirect user to login page if not yet logged in
    $.ajax({
        type:'GET',
        url: "./php/checkuser.php",
        data: "",
        success: function (checkResponse) {
            if(checkResponse == "Already Logged In"){
                //getLessons();
                $("html").css("visibility", "visible");
            }else{
                window.location.href="./";
                console.log(checkResponse);
            }
        }
    });

    function getLessons(){
        $.ajax({
            url: "./php/getLessons.php",
            success: function (lessonsResponse) {
                lessonsResponseObj = JSON.parse(lessonsResponse);                
                lessonsResponseObj.forEach(function (item) {
                    $("#lessons").append("<div><h1>"+item.title+"</h1>");
                    item.topics.forEach(function(topic){
                        $("#lessons").append("<h2 class='topicTitle'>Topic: "+topic.topicTitle+"</h2><div class='topic'>"+topic.content+"</div></div>");                     
                    })
                });
                $("#lessons").html(lessonsHtml);
            }
        });
    }
    
    //Set active window variable
    var activeWindow = "#lessonsPage";

    
    //Transform buttons to jQuery UI button.
    $("button").button();

//LESSONS PAGE
    //VIEW LESSONS
    var sidebarState = false;
    $("#lessonBtn").click(function () { 
        if(!sidebarState){
            if($("#sidebar").html() == ""){
                $.ajax({
                    type: "POST",
                    url: "./php/getLessons.php",
                    data: "data=title",
                    success: function (response) {
                        responseObj = JSON.parse(response);
                        console.log(responseObj);
                        $("#sidebar").append("<h1>LESSONS</h1>");
                        responseObj.forEach(function (item) {
                            $("#sidebar").append("<p class='lessonView'>"+item.title+"</p>");
                        });
                    },
                    complete: function() {
                        $("#sidebar").width("calc(170px + 3vw)");
                        $("#tabs").css("margin-left", "calc(170px + 3vw)");
                        sidebarState = true;  
                    }
                });
            }      
        }else{
            $("#sidebar").width("0");
            $("#tabs").css("margin-left", "0");
            sidebarState = false;
        }
        if(activeWindow != "#lessonsPage"){
            getLessons();
            $(activeWindow).fadeOut(500, function(){
                activeWindow = "#lessonsPage";
                $("#lessonsPage").show(0,function(){
                });
            });
        }
    });

    var activeLesson = "";
    $("#sidebar").on("click","p.lessonView",function () {
        var lessonTitle = $(this).text();
        if(activeLesson != lessonTitle){
            $.ajax({
                type: "POST",
                url: "./php/getLessons.php",
                data: {
                    data: "lesson",
                    lesson: lessonTitle
                },
                beforeSend: function() {
                    if($( "#tabs" ).html()!="<ul></ul>"){
                        $( "#tabs" ).fadeOut(0, function(){
                            $( "#tabs" ).tabs('destroy').html("<ul></ul>");
                        });
                    }else{
                        $( "#tabs" ).fadeOut().html("<ul></ul>");
                    }
                },
                success: function (response) {
                    responseObj = JSON.parse(response);
                    responseObj[0].forEach(function (item) {
                        var topic = item.topicTitle.split(" ");
                        topic = topic.join("-");
                        $("#tabs ul").append("<li><a href=\"#"+topic+"\">"+item.topicTitle+"</a></li>");
                        $("#tabs").append("<div id='"+topic+"'>"+item.content+"</div>");
                    });
                },
                complete: function() {
                    activeLesson = lessonTitle;
                    $( "#tabs" ).tabs({ active: 0 });
                    $("#tabs").fadeIn(500);
                }
            });
        }
    });

    //ADD LESSON
    $("#toAddLessonBtn").click(function () { 
        
        $.ajax({
            type: "POST",
            url: "./php/getLessons.php",
            data: "data=title",
            success: function (lessonsListResponse) {
                lessonsListResponseObj = JSON.parse(lessonsListResponse);
                console.log(lessonsListResponseObj);
                $("#lessonList").append("<option value='New Lesson' selected>New Lesson</option>");
                lessonsListResponseObj.forEach(function (item) {
                    $("#lessonList").append("<option value='"+item.title+"'>"+item.title+"</option>");
                });
                $("#lessonList").selectmenu();
            }
        });

        $("#textEditor").trumbowyg({
            btnsDef: {
                upload: {
                    ico: 'insertImage'
                }
            },
            // Redefine the button pane
            btns: [
                ['historyUndo','historyRedo'],
                ['fontfamily'],
                ['fontsize'],
                ['formatting'],
                ['strong', 'em', 'del'],
                ['superscript', 'subscript'],
                ['foreColor', 'backColor'],
                ['link'],
                ['upload'],
                ['table'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                ['indent', 'outdent'],
                ['unorderedList', 'orderedList'],
                ['horizontalRule'],
                ['removeformat'],
                ['fullscreen']
            ],
            plugins: {
                upload: {
                    serverPath: './php/upload.php',
                    fileFieldName: 'image',
                },
                resizimg: {
                    minSize: 64,
                    step: 16,
                }
            }
        });

        $("#viewLessons").fadeOut(500, function(){
            $("#lessonForm").fadeIn(500);
        });
    });

    $("#lessonForm").submit(function (e) { 
        e.preventDefault();

        //Get Form details
        var lessonformData = new FormData(this);

        //Send ajax request to addLesson.php
        $.ajax({
            type: "post",
            url: "./php/addLesson.php",
            data: lessonformData,
            processData: false,
            contentType: false, 
            success: function (addResponse) {
                
                //Parse JSON response from PHP AJAX
                const addObj = JSON.parse(addResponse);

                //Update Lessons Page
                getLessons();

                $("#lessonForm").fadeOut(500, function(){
                    $("#viewLessons").fadeIn(500, function(){
                        //Reset form values
                        $("#lessonsPage form")[0].reset();
                        $("#lessonList").selectmenu("destroy");
                        $("#textEditor").val("");
                        $(".trumbowyg-editor").html("");
                    });
                });


                //Display update success message
                $("#successMsg").html(addObj.message);
                $("#successMsg").show(100).delay(5000).slideUp(200);


            }
        });
    });

    //CANCEL ADD LESSON
    $("#cancelAddLessonBtn").click(function (e) { 
        e.preventDefault();
        $("#lessonForm").fadeOut(500, function(){
            $("#viewLessons").fadeIn(500, function(){
                //Reset form values
                $("#lessonsPage form")[0].reset();
                $("#lessonList").selectmenu("destroy");
                $("#textEditor").val("");
                $(".trumbowyg-editor").html("");
            });
        });        
    });

//LOGOUT
    $( "#logout-dialog-confirm" ).dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 450,
        modal: true,
        buttons: {
            Confirm: function(){
                $.ajax({
                    type: "POST",
                    url: "./php/checkuser.php",
                    data: "logout=true",
                    success: function (checkResponse) {
                        if(checkResponse == "Logged Out"){
                            $("html").css("visibility", "hidden");
                            window.location.href="./";
                        }else{
                            console.log(checkResponse);
                        }
                    }
                });
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        }
    });

    $("#logoutBtn").click(function () { 
        $( "#logout-dialog-confirm" ).dialog("open");
    });

    //TEMPORARY!! TO HOME PAGE
    $("#settingsBtn").click(function () { 
        window.location.href="home_page.html";
    });

});

