$(document).ready(function(){


//CHECK IF ADMIN IS LOGGED IN
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


//LOADING MODAL
    $body = $("body");
    $(document).on({
        ajaxStart: function() { $body.addClass("loading");},
        ajaxStop: function() { $body.removeClass("loading");}    
    });
    

//SET ACTIVE WINDOW
    var activeWindow = "#lessonsPage";


//USE JQUERY UI BUTTONS
    $("button").button();


//DIALOG MESSAGES
    $("#successDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            "Close": function(){
                $( this ).dialog( "close" );
                $("#successDialog p").html("<span class=\"ui-icon ui-icon-circle-check\" style=\"float:left; margin:0 7px 0 0;\"></span>");
            }
        }
    });


//LESSONS PAGE
    var activeLesson = "";

    function refreshSidebar(){
        $("#sidebar").html("");
        $.ajax({
            type: "POST",
            url: "./php/getLessons.php",
            data: "data=title",
            success: function (response) {
                const responseObj = JSON.parse(response);
                $("#sidebar").append("<h1>LESSONS</h1>");
                //Get and Display all lesson titles in sidebar.
                responseObj.title.forEach(function (item) {
                    $("#sidebar").append("<div class='sidebarLesson'><p class='lessonView'>"+item+"</p><button class='lessonDeleteBtn' value='"+item+"'/></div>");
                });
                //ADD LESSON BUTTON
                $("#sidebar").append("<button id='lessonAddBtn'>ADD LESSON</button>");
                $("#lessonAddBtn").button();
            }
        });
    };

    function toId(id){
        id = id.split(" ");
        id = id.join("-");

        return id;
    };

    var sidebarState = false;
    $("#lessonBtn").click(function () { 
        if($("#sidebar").html() == ""){
            refreshSidebar();
        }
        if(activeWindow != "#lessonsPage"){
            $(activeWindow).fadeOut(500, function(){
                activeWindow = "#lessonsPage";
                $("#lessonsPage").show(100);
                $("#sidebar").css("margin-left", "100px");
                $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true; 
            });
        }
        if($("#tabs").html()=="<ul></ul>" || $("#tabs").html()==""){
            $("#sidebar").css("margin-left", "100px");
            $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
            sidebarState = true; 
        }else{
            if(!sidebarState){
                $("#sidebar").css("margin-left", "100px");
                $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true;     
            }else{
                $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                $("#viewLessons").css("margin-left", "0");
                sidebarState = false;
            }
        }
    });


    //VIEW LESSON
    $("#sidebar").on("click","p.lessonView",function () {
        $("#viewLessons").fadeIn(100);
        var lessonTitle = $(this).text();
        $("p.lessonView").removeClass("active");
        $(this).addClass("active");

        if(activeLesson != lessonTitle){
            $.ajax({
                type: "POST",
                url: "./php/getLessons.php",
                data: {
                    data: "lesson",
                    lesson: lessonTitle
                },
                beforeSend: function() {
                    if($( "#tabs" ).html()!="<ul></ul>" || $("#tabs").html()==""){
                        $( "#tabs" ).fadeOut(0, function(){
                            if($( "#tabs" ).data('destroyed')){
                                $( "#tabs" ).html("<ul></ul>");
                            }else{
                                $( "#tabs" ).tabs('destroy').data('destroyed',true).html("<ul></ul>");
                            }
                        });
                    }else{
                        $( "#tabs" ).html("<ul></ul>");
                    }
                },
                success: function (response) {
                    const responseObj = JSON.parse(response);
                    if(responseObj.topicTitle != ""){
                        $("#viewLessons").html("<button type=\"button\" class='button' id=\"toAddTopicBtn\">ADD TOPIC</button><button type=\"button\" class='button' id=\"toDeleteTopicBtn\">DELETE TOPIC</button><button type=\"button\" class='button' id=\"toEditTopicBtn\">EDIT TOPIC</button><div id=\"tabs\"><ul></ul></div>");
                        responseObj.topicTitle.forEach(function (item) {
                            var topic = toId(item);
                            $("#tabs ul").append("<li><a href=\"#"+topic+"\">"+item+"</a></li>");
                            $("#tabs").append("<div id='"+topic+"'></div>");
                        });
                        $("#"+toId(responseObj.topicTitle[0])).html(responseObj.content);
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
                                        const topicResponseObj = JSON.parse(response);
                                        $("#"+toId(topicTitle)).html(topicResponseObj.content);
                                    }
                                });                  
                            }
                        }).data('destroyed',false);
                    }else{
                        $("#tabs").html("");
                        $("#viewLessons").html("<button type=\"button\" class='button' id=\"toAddTopicBtn\">ADD TOPIC</button><div id=\"tabs\"><ul></ul></div>");
                    }
                },
                complete: function() {
                    activeLesson = lessonTitle;
                    $(".button").button();
                    $("#tabs").fadeIn(500);
                }
            });
        }
    });


    //ADD LESSON
    var errorMessage = $("#lessonErrorMsg");
    function errorResponse( message ) {
        errorMessage.text( message ).addClass( "ui-state-highlight" );
        errorMessage.slideDown(100).delay(1500).removeClass("ui-state-highlight", 1500);
    }

    function addLesson(){
        if(!$("#lessonTitle").val().trim()){
            errorResponse("Lesson Title is Required!");
        }else{
            //Send ajax request to addLesson.php
            $.ajax({
                type: "post",
                url: "./php/addLesson.php",
                data: {
                    lessonList: "New Lesson",
                    newLesson: $("#lessonTitle").val()
                },
                beforeSend: function(){
                    //Hide Sidebar
                    $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                    $("#viewLessons").css("margin-left", "0");
                    sidebarState = false;
                },
                success: function (response) {

                    if(response == "Lesson Already Exists!"){
                        errorResponse(response);
                    }else{
                        //Update Lessons List in Sidebar
                        refreshSidebar();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");

                        $("#lessonForm").fadeOut(500, function(){
                            //Reset Dialog
                            errorMessage.text("");
                            errorMessage.hide();
                            $("#addLessonDialog").dialog("close");
                            //Display Sidebar
                            $("#sidebar").css("margin-left", "100px");
                            $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                            sidebarState = true; 
                        });
                    }
                }
            });
        }
    }

    $("#addLessonDialog").dialog({
        autoOpen: false,
        height: "auto",
        width: "auto",
        modal: true,
        closeOnEscape: true,
        buttons: {
        "Add Lesson": addLesson,
        Cancel: function() {
            //Reset Dialog
            errorMessage.text("");
            errorMessage.hide();
            //Display Sidebar
            $("#sidebar").css("margin-left", "100px");
            $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
            sidebarState = true; 
            $(this).dialog( "close" );
        }
        },
        close: function() {
            $("#addLessonDialog form")[0].reset();
            $(this).dialog( "close" );
            $("#lessonTitle").removeClass( "ui-state-error" );
        }
    });

    $("#sidebar").on("click","#lessonAddBtn",function () {
        $("#addLessonDialog").dialog("open");        
    });

    $("#addLessonDialog form").on("submit", function(e){
        e.preventDefault();
        addLesson();
    });


    //TO ADD TOPIC
    $("#viewLessons").on("click","#toAddTopicBtn", function(){
        //SET LESSON
        $("#addTopicHeader").prepend(activeLesson+" - ");
        $("#addLessonTitle").val(activeLesson);

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
            //Reset Tabs
            $( "#tabs" ).fadeOut(100);
            activeLesson = "";
            //Hide Sidebar
            $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
            $("#viewLessons").css("margin-left", "0");
            sidebarState = false;
            $("#lessonForm").fadeIn(100);
        });
    })


    //ADD TOPIC
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
            success: function (response) {
                
                //Update Lessons List in Sidebar
                refreshSidebar();
                $("#successDialog p").append(response);
                $("#successDialog").dialog("open");

                $("#lessonForm").fadeOut(500, function(){
                    //Display Sidebar
                    $("#sidebar").css("margin-left", "100px");
                    $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                    sidebarState = true; 
                    //Reset form values
                    $("#lessonsPage form")[0].reset();
                    $("#lessonList").selectmenu("destroy");
                    $("#lessonList").html("");
                    $("#textEditor").val("");
                    $(".trumbowyg-editor").html("");
                });
            }
        });
    });

    //CANCEL ADD TOPIC
    $("#cancelAddLessonBtn").click(function (e) { 
        e.preventDefault();
        $("#lessonForm").fadeOut(500, function(){
                //Display Sidebar
                $("p.lessonView").removeClass("active");
                $("#sidebar").css("margin-left", "100px");
                $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true; 
                //Reset form values
                $("#lessonsPage form")[0].reset();
                $("#lessonList").selectmenu("destroy");
                $("#lessonList").html("");
                $("#textEditor").val("");
                $(".trumbowyg-editor").html("");
        });        
    });


    //EDIT TOPIC
    


    //DELETE LESSON
    var lessonToDelete = "";
    $("#sidebar").on("click","button.lessonDeleteBtn",function () {
        lessonToDelete = $(this).val();
        $("#deleteLessonDialog").html("<p><span class=\"ui-icon ui-icon-alert\" style=\"margin:12px 12px 15px 0\"></span> Are you sure you want to delete "+lessonToDelete+"?</p>");
        $("#deleteLessonDialog").dialog("open");
    });

    //DELETE LESSON MODAL
    $("#deleteLessonDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Confirm: function(){
                $.ajax({
                    type: "POST",
                    url: "./php/deleteLesson.php",
                    data: "lessonDelete="+lessonToDelete+"",
                    beforeSend: function (){
                        //Reset Tabs
                        $( "#tabs" ).fadeOut(100);
                        $( "#viewLessons" ).fadeOut(100);
                        activeLesson = "";
                        //Reset and Hide Sidebar
                        $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                        $("#viewLessons").css("margin-left", "0");
                        sidebarState = false;
                        $("p.lessonView").removeClass("active");
                    },
                    success: function (response) {
                        refreshSidebar();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");
                    },
                    complete: function (){
                        //Reset Variable
                        lessonToDelete = "";
                        //Display Sidebar
                        $("#sidebar").css("margin-left", "100px");
                        $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                        sidebarState = true; 
                    }
                });
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                lessonToDelete = "";
                $( this ).dialog( "close" );
            }
        }
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

