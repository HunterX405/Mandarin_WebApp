$(document).ready(function(){

    //Redirect user to login page when home is accessed via link
    if(!sessionStorage.getItem("user")){
        window.location.href="index.php";
    }else{
        //Only show home page when user is logged in.
        $("html").css("visibility", "visible");
    }

    $.ajax({
        url: "./php/getLessons.php",
        success: function (lessonsResponse) {
            lessonsResponseObj = JSON.parse(lessonsResponse);
            var lessonsHtml = "";
            lessonsResponseObj.forEach(function (item) {
                lessonsHtml += "<div><h1>"+item.title+"</h1>";
                item.topics.forEach(function(topic){
                    lessonsHtml += "<h2 class='topicTitle'>Topic: "+topic.topicTitle+"</h2><div class='topic'>"+topic.content+"</div></div>";                        
                })
            });
            $("#lessons").html(lessonsHtml);
        }
    });
    
    //Set active window variable
    var activeWindow = "#lessonsPage";

    
    //Transform buttons to jQuery UI button.
    $("button").button();

//LESSONS PAGE
    //VIEW LESSONS
    $("#lessonBtn").click(function (e) { 
        e.preventDefault();
        if(activeWindow != "#lessonsPage"){
            $.ajax({
                url: "./php/getLessons.php",
                success: function (lessonsResponse) {
                    lessonsResponseObj = JSON.parse(lessonsResponse);
                    var lessonsHtml = "";
                    lessonsResponseObj.forEach(function (item) {
                        lessonsHtml += "<div><h1>"+item.title+"</h1>";
                        item.topics.forEach(function(topic){
                            lessonsHtml += "<h2 class='topicTitle'>Topic: "+topic.topicTitle+"</h2><div class='topic'>"+topic.content+"</div></div>";                        
                        })
                    });
                    $("#lessons").html(lessonsHtml);
                }
            });
            $(activeWindow).fadeOut(500, function(){
                activeWindow = "#lessonsPage";
                $("#lessonsPage").fadeIn(500);
            });
        }
    });

    //ADD LESSON
    $("#toAddLessonBtn").click(function () { 
        
        $("#lessonList").selectmenu();
        $.ajax({
            url: "./php/getLessons.php",
            success: function (lessonsListResponse) {
                console.log("ajax");
                lessonsListResponseObj = JSON.parse(lessonsListResponse);
                var dropdownHtml = "<option value='New Lesson' selected>New Lesson</option>";
                lessonsListResponseObj.forEach(function (item) {
                    dropdownHtml += "<option value='"+item.title+"' selected>"+item.title+"</option>"
                });
                $("#lessonList").html(dropdownHtml);
                $("#lessonList").val("New Lesson").change();
                $("#lessonList").selectmenu('refresh');
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

                $("#lessonForm").fadeOut(500, function(){
                    $.ajax({
                        url: "./php/getLessons.php",
                        success: function (lessonsResponse) {
                            lessonsResponseObj = JSON.parse(lessonsResponse);
                            lessonsResponseObj.forEach(function (item) {
                                lessonsHtml += "<div><h1>"+item.title+"</h1>";
                                item.topics.forEach(function(topic){
                                    lessonsHtml += "<h2 class='topicTitle'>Topic: "+topic.topicTitle+"</h2><div class='topic'>"+topic.content+"</div></div>";                        })
                            });
                            $("#lessons").html(lessonsHtml);
                        }
                    });
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
                $( this ).dialog( "close" );
                //Hide home page html to avoid loading home page via link access when already logged out
                $("html").css("visibility", "hidden");
                sessionStorage.removeItem("user");
                window.location.href="index.php";
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

