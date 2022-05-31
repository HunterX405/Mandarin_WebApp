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

    //Setup Loading Modal
    $body = $("body");
    $(document).on({
        ajaxStart: function() { $body.addClass("loading");   console.log("loading"); },
        ajaxStop: function() { $body.removeClass("loading"); console.log("done"); }    
    });
    
    //Set active window variable
    var activeWindow = "#lessonsPage";

    //Transform buttons to jQuery UI button.
    $("button").button();

//LESSONS PAGE
    //VIEW LESSONS
    var sidebarState = false;
    $("#lessonBtn").click(function () { 
        if($("#sidebar").html() == ""){
            $.ajax({
                type: "POST",
                url: "./php/getLessons.php",
                data: "data=title",
                success: function (response) {
                    responseObj = JSON.parse(response);
                    $("#sidebar").append("<h1>LESSONS</h1>");
                    //Get and Display all lesson titles in sidebar.
                    responseObj.title.forEach(function (item) {
                        $("#sidebar").append("<p class='lessonView'>"+item+"</p>");
                    });
                }
            });
        }
        if(activeWindow != "#lessonsPage"){
            $(activeWindow).fadeOut(500, function(){
                activeWindow = "#lessonsPage";
                $("#lessonsPage").show(100);
                $("#sidebar").css("margin-left", "100px");
                $("#tabs").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true; 
            });
        }
        if($("#tabs").html()=="<ul></ul>"){
            $("#sidebar").css("margin-left", "100px");
            $("#tabs").css("margin-left", "calc(170px + 3vw)");
            sidebarState = true; 
        }else{
            if(!sidebarState){
                $("#sidebar").css("margin-left", "100px");
                $("#tabs").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true;     
            }else{
                $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                $("#tabs").css("margin-left", "0");
                sidebarState = false;
            }
        }
    });

    function toId(id){
        id = id.split(" ");
        id = id.join("-");

        return id;
    }

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
                            if($( "#tabs" ).data('destroyed')){
                                $( "#tabs" ).html("<ul></ul>");
                            }else{
                                $( "#tabs" ).tabs('destroy').data('destroyed',true).html("<ul></ul>");
                            }
                        });
                    }
                },
                success: function (response) {
                    responseObj = JSON.parse(response);
                    if(responseObj.topicTitle != ""){
                        responseObj.topicTitle.forEach(function (item) {
                            var topic = toId(item);
                            $("#tabs ul").append("<li><a href=\"#"+topic+"\">"+item+"</a></li>");
                            $("#tabs").append("<div id='"+topic+"'></div>");
                        });
                        $("#"+toId(responseObj.topicTitle[0])).html(responseObj.content);
                    }
                },
                complete: function() {
                    activeLesson = lessonTitle;
                    $( "#tabs" ).tabs({ active: 0,
                        activate: function(e, ui) {
                            var active = $("#tabs").tabs('option','active');
                            var topicTitle = $("#tabs ul>li a").eq(active).text();
                            $.ajax({
                                type: "post",
                                url: "./php/getLessons.php",
                                data: {
                                    data: "lesson",
                                    lesson: lessonTitle,
                                    topic: topicTitle
                                },
                                success: function (response) {
                                    topicResponseObj = JSON.parse(response);
                                    $("#"+toId(topicTitle)).html(topicResponseObj.content);
                                }
                            });                  
                        }
                    }).data('destroyed',false);
                    $("#tabs").fadeIn(100);
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

