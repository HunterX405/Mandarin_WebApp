$(document).ready(function(){


//CHECK IF ADMIN IS LOGGED IN
    $.ajax({
        type:'GET',
        url: "./php/checkuser.php",
        data: "",
        success: function (checkResponse) {
            if(checkResponse == "Admin"){
                $("html").css("visibility", "visible").fadeIn(300);
            }else{
                alert("Unauthorized!");
                $("html").fadeOut(200, function(){
                    $("html").css("visibility", "hidden");
                    window.location.href="./";
                });
            }
        }
    });


// LOADING MODAL
    $body = $("body");
    $(document).on({
        ajaxStart: function() { $body.addClass("loading");},
        ajaxStop: function() { $body.removeClass("loading");}    
    });
    

    // SET ACTIVE WINDOW
    var activeWindow = "";


    // USE JQUERY UI BUTTONS
    $(".button").button();


// DIALOG MESSAGES
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

    $("#errorDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            "Close": function(){
                $( this ).dialog( "close" );
                $("#errorDialog p").html("<span class=\"ui-icon ui-icon-alert\" style=\"margin:12px 12px 15px 0\"></span>");
            }
        }
    });

// USERS PAGE 
    function refreshUsers(data){
        var tableHtml = "<tr><th>Name</th><th>Email</th><th>Address</th><th>School</th><th>Birthday</th><th>Gender</th><th>Action</th></tr>";
        $.ajax({
            type: "post",
            url: "./php/getAllUsers.php",
            data: "data="+data,
            success: function (response) {
                const responseObj = JSON.parse(response);
                responseObj.forEach(user => {
                    tableHtml += "<tr class='trHover'><td>"+user.name+"</td>";
                    tableHtml += "<td>"+user.email+"</td>";
                    tableHtml += "<td>"+user.address+"</td>";
                    tableHtml += "<td>"+user.school+"</td>";
                    tableHtml += "<td>"+user.birthday+"</td>";
                    tableHtml += "<td>"+user.gender+"</td>";
                    if(data=="ACTIVE"){
                        tableHtml += "<td><button type=\"button\" class='archiveUserBtn' title=\"Archive\">ARCHIVE</button><button type=\"button\" class='deleteUserBtn' title=\"delete\">DELETE</button></td></tr>";
                    }else{
                        tableHtml += "<td><button type=\"button\" class='restoreUserBtn' title=\"Restore\">RESTORE</button><button type=\"button\" class='deleteUserBtn' title=\"delete\">DELETE</button></td></tr>";
                    }
                });
                $("#usersTable").html(tableHtml);
            }
        });
    };

    // VIEW USERS
    $("#usersBtn").click(function () { 
        if(activeWindow != "#usersPage"){
            refreshUsers("ACTIVE");
            $( ".checkRadio" ).checkboxradio({
                icon: false
            });
            if(activeWindow == ""){
                $("#usersPage").fadeIn(100);
            }else{
                $(activeWindow).fadeOut(100, function(){
                    $("#usersPage").fadeIn(100);
                });
            }
            activeWindow = "#usersPage";
        }
    });

    // UPDATE USERS TABLE
    $('input[type=radio][name=userData]').change(function() {
        refreshUsers(this.value);
    });

    // ARCHIVE USER
    var userToArchive = "";
    $("#usersPage").on("click",".archiveUserBtn", function(){
        //Get row details
        row = $(this).closest("tr");
        userToArchive = row.find("td:nth-child(2)").text();
        $("#archiveUserDialog").html("<p><span class=\"ui-icon ui-icon-alert\" style=\"margin:12px 12px 15px 0\"></span> Are you sure you want to archive "+userToArchive+" Account?</p>");
        $("#archiveUserDialog").dialog("open");
    });

    //ARCHIVE USER MODAL
    $("#archiveUserDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Confirm: function(){
                $.ajax({
                    type: "POST",
                    url: "./php/archiveUser.php",
                    data: {
                        action: "archive",
                        user: userToArchive,
                    },
                    beforeSend: function (){
                        //Get row details
                        userToArchive = row.find("td:nth-child(2)").text();
                        //Hide Dictionary Table
                        $("#usersTable").fadeOut(100);
                    },
                    success: function (response) {
                        if(response != "User Account Archived Successfully!"){
                            $("#usersTable").fadeIn(100);
                            $("#errorDialog p").append(response);
                            $("#errorDialog").dialog("open");
                        }else{
                            //Update Dictionary Table
                            refreshUsers("ACTIVE");
                            $("#successDialog p").append(response);
                            $("#successDialog").dialog("open");
                            $("#usersTable").fadeIn(100);
                        }
                        userToArchive = "";
                    }
                });
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                userToArchive = "";
                $( this ).dialog( "close" );
            }
        }
    });

    // RESTORE USER
    var userToRestore = "";
    $("#usersPage").on("click",".restoreUserBtn", function(){
        //Get row details
        row = $(this).closest("tr");
        userToRestore = row.find("td:nth-child(2)").text();
        $("#restoreUserDialog").html("<p><span class=\"ui-icon ui-icon-alert\" style=\"margin:12px 12px 15px 0\"></span> Are you sure you want to restore "+userToRestore+" Account?</p>");
        $("#restoreUserDialog").dialog("open");
    });

    //RESTORE USER MODAL
    $("#restoreUserDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Confirm: function(){
                $.ajax({
                    type: "POST",
                    url: "./php/archiveUser.php",
                    data: {
                        action: "restore",
                        user: userToRestore,
                    },
                    beforeSend: function (){
                        //Get row details
                        userToRestore = row.find("td:nth-child(2)").text();
                        //Hide Dictionary Table
                        $("#usersTable").fadeOut(100);
                    },
                    success: function (response) {
                        if(response != "User Account Restored Successfully!"){
                            $("#usersTable").fadeIn(100);
                            $("#errorDialog p").append(response);
                            $("#errorDialog").dialog("open");
                        }else{
                            //Update Dictionary Table
                            refreshUsers("ARCHIVED");
                            $("#successDialog p").append(response);
                            $("#successDialog").dialog("open");
                            $("#usersTable").fadeIn(100);
                        }
                        userToRestore = "";
                    }
                });
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                userToRestore = "";
                $( this ).dialog( "close" );
            }
        }
    });

    // DELETE USER
    var userToDelete = "";
    $("#usersPage").on("click",".deleteUserBtn", function(){
        //Get row details
        row = $(this).closest("tr");
        userToDelete = row.find("td:nth-child(2)").text();
        $("#deleteUserDialog").html("<p><span class=\"ui-icon ui-icon-alert\" style=\"margin:12px 12px 15px 0\"></span> Are you sure you want to delete "+userToRestore+" Account?</p>");
        $("#deleteUserDialog").dialog("open");
    });

    // DELETE USER MODAL
    $("#deleteUserDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Confirm: function(){
                $.ajax({
                    type: "POST",
                    url: "./php/deleteUser.php",
                    data: {
                        user: userToDelete,
                        table: $('input[name=userData]:checked').val(),
                    },
                    beforeSend: function (){
                        //Get row details
                        userToDelete = row.find("td:nth-child(2)").text();
                        //Hide Dictionary Table
                        $("#usersTable").fadeOut(100);
                    },
                    success: function (response) {
                        if(response != "Account Deleted Successfully!"){
                            $("#usersTable").fadeIn(100);
                            $("#errorDialog p").append(response);
                            $("#errorDialog").dialog("open");
                        }else{
                            //Update Dictionary Table
                            refreshUsers($('input[name=userData]:checked').val());
                            $("#successDialog p").append(response);
                            $("#successDialog").dialog("open");
                            $("#usersTable").fadeIn(100);
                        }
                        userToRestore = "";
                    }
                });
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                userToRestore = "";
                $( this ).dialog( "close" );
            }
        }
    });

// LESSONS PAGE
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
    var sidebarEnabled = true;
    $("#lessonBtn").click(function () {
        if($("#sidebar").html() == ""){
            refreshSidebar();
        }
        if(activeWindow != "#lessonsPage"){
            if(activeWindow == ""){
                $("#lessonsPage").show(100);
            }else{
                $(activeWindow).fadeOut(100, function(){
                    if(!sidebarEnabled){
                        $("#addTopicForm, #editTopicForm").hide();
                        $("#viewLessons").show();
                        sidebarEnabled = true;
                    }
                    $("#lessonsPage").show(100); 
                });
            }
            $("#sidebar").css("margin-left", "100px");
            $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
            sidebarState = true;
            activeWindow = "#lessonsPage";
        }else{
            if(!sidebarState && sidebarEnabled){
                $("#sidebar").css("margin-left", "100px");
                $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true;     
            }else{
                $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                $(".lessonPane").css("margin-left", "0");
                sidebarState = false;
            }
        }
    });


    // VIEW LESSON
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
                        $("#toAddTopicBtn").css("width","auto");
                    }else{
                        $("#tabs").html("");
                        $("#viewLessons").html("<button type=\"button\" class='button' id=\"toAddTopicBtn\">ADD TOPIC</button><div id=\"tabs\"><ul></ul></div>");
                        $("#toAddTopicBtn").css("width","-webkit-fill-available");
                    }
                },
                complete: function() {
                    activeLesson = lessonTitle;
                    $(".button").button();
                    $("#tabs").fadeIn(100);
                    $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                    $(".lessonPane").css("margin-left", "0");
                    sidebarState = false;
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
            $("#lessonErrorMsg").show();
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
                    $(".lessonPane").css("margin-left", "0");
                    sidebarState = false;
                },
                success: function (response) {

                    if(response == "Lesson Already Exists!"){
                        $("#lessonErrorMsg").show();
                        errorResponse(response);
                    }else{
                        //Update Lessons List in Sidebar
                        refreshSidebar();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");

                        $("#addTopicForm").fadeOut(100, function(){
                            //Reset Dialog
                            errorMessage.text("");
                            errorMessage.hide();
                            $("#addLessonDialog").dialog("close");
                            //Display Sidebar
                            $("#sidebar").css("margin-left", "100px");
                            $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
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
            $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
            sidebarState = true; 
            $(this).dialog( "close" );
        }
        },
        close: function() {
            $("#addLessonDialog form")[0].reset();
            errorMessage.text("");
            errorMessage.hide();
            //Display Sidebar
            $("#sidebar").css("margin-left", "100px");
            $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
            sidebarState = true; 
            $(this).dialog( "close" );
            $("#lessonTitle").removeClass( "ui-state-error" );
        }
    });

    $("#sidebar").on("click","#lessonAddBtn",function () {
        errorMessage = $("#lessonErrorMsg");
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

        $("#viewLessons").fadeOut(100, function(){
            //Reset Tabs
            $( "#tabs" ).fadeOut(100);
            activeLesson = "";
            //Hide Sidebar
            $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
            $(".lessonPane").css("margin-left", "0");
            sidebarState = false;
            // Disable Sidebar
            sidebarEnabled = false;
            $("#addTopicForm").fadeIn(100);
        });
    })


//ADD TOPIC
    $("#addTopicForm").submit(function (e) { 
        e.preventDefault();
        var topicTitle = $("#topicTitle").val().trim();
        if(topicTitle == ""){
            $("#errorDialog p").append("Topic Title is Required!");
            $("#errorDialog").dialog("open");
        }else if(/^[a-zA-Z0-9- ]*$/.test(topicTitle) == false){
            $("#errorDialog p").append("Special Characters are not Allowed!");
            $("#errorDialog").dialog("open");
        }else{
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

                    if(response == "Topic Title Already Exists!"){
                        $("#errorDialog p").append(response);
                        $("#errorDialog").dialog("open");
                    }else{
                        //Update Lessons List in Sidebar
                        refreshSidebar();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");

                        $("#addTopicForm").fadeOut(100, function(){
                            // Enable Sidebar
                            sidebarEnabled = true;
                            //Display Sidebar
                            $("#sidebar").css("margin-left", "100px");
                            $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
                            sidebarState = true; 
                            //Reset form values
                            $("#addTopicHeader").html("ADD TOPIC");
                            $("#lessonsPage form")[0].reset();
                            $("#lessonList").selectmenu("destroy");
                            $("#lessonList").html("");
                            $("#textEditor").val("");
                            $(".trumbowyg-editor").html("");
                        });
                    }
                }
            });
        }
    });

    //CANCEL ADD TOPIC
    $("#cancelAddTopicBtn").click(function (e) { 
        e.preventDefault();
        $("#addTopicForm").fadeOut(100, function(){
                // Enable Sidebar
                sidebarEnabled = true;
                //Display Sidebar
                $("p.lessonView").removeClass("active");
                $("#sidebar").css("margin-left", "100px");
                $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true; 
                //Reset form values
                $("#addTopicHeader").html("ADD TOPIC");
                $("#lessonsPage form")[0].reset();
                $("#textEditor").val("");
                $(".trumbowyg-editor").html("");
        });        
    });


//EDIT TOPIC PAGE
    //TO EDIT TOPIC
    $("#viewLessons").on("click","#toEditTopicBtn", function(){

        //GET ACTIVE TOPIC TITLE AND CONTENT IN TAB
        var active = $("#tabs").tabs('option','active');
        var topicTitle = $("#tabs ul>li a").eq(active).text();
        var topicContent = $("#"+toId(topicTitle)).html();

        //SET LESSON AND TOPIC
        $("#editTopicHeader").append(" "+activeLesson+" - "+topicTitle);
        $("#editLessonTitle").val(activeLesson);
        $("#editTopicTitle").val(topicTitle);

        $("#editTopicContent").trumbowyg({
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

        //Set Text Editor Content
        $(".trumbowyg-editor").html(topicContent);
        console.log($("#editTopicContent").val());

        $("#viewLessons").fadeOut(100, function(){
            //Reset Tabs
            $( "#tabs" ).fadeOut(100);
            activeLesson = "";
            // Disable Sidebar
            sidebarEnabled = false;
            //Hide Sidebar
            $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
            $(".lessonPane").css("margin-left", "0");
            sidebarState = false;
            $("#editTopicForm").fadeIn(100);
        });
    })


    // EDIT TOPIC
    $("#editTopicForm").submit(function (e) { 
        e.preventDefault();

        //GET OLD TOPIC TITLE
        var active = $("#tabs").tabs('option','active');
        var oldTopicTitle = $("#tabs ul>li a").eq(active).text();

        //Get Form details
        var editTopicFormData = new FormData(this);
        editTopicFormData.append("oldTopicTitle",oldTopicTitle);

        //Send ajax request
        $.ajax({
            type: "post",
            url: "./php/editTopic.php",
            data: editTopicFormData,
            processData: false,
            contentType: false, 
            success: function (response) {

                if(response != "Topic Edited Successfully!"){
                    $("#errorDialog p").append(response);
                    $("#errorDialog").dialog("open");
                }else{
                    //Update Lessons List in Sidebar
                    refreshSidebar();
                    $("#successDialog p").append(response);
                    $("#successDialog").dialog("open");

                    $("#editTopicForm").fadeOut(100, function(){
                        // Enable Sidebar
                        sidebarEnabled = true;
                        //Display Sidebar
                        $("#sidebar").css("margin-left", "100px");
                        $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
                        sidebarState = true; 
                        //Reset form values
                        $("#editTopicHeader").html("EDIT");
                        $("#lessonsPage form")[0].reset();
                        $("#editTopicContent").val("");
                        $(".trumbowyg-editor").html("");
                    });
                }
            }
        });
    });

    //CANCEL EDIT TOPIC
    $("#cancelEditTopicBtn").click(function (e) { 
        e.preventDefault();
        $("#editTopicForm").fadeOut(100, function(){
                // Enable Sidebar
                sidebarEnabled = true;
                //Display Sidebar
                $("p.lessonView").removeClass("active");
                $("#sidebar").css("margin-left", "100px");
                $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true; 
                //Reset form values
                $("#editTopicHeader").html("EDIT");
                $("#lessonsPage form")[0].reset();
                $("#editTopicContent").val("");
                $(".trumbowyg-editor").html("");
        });        
    });

    //DELETE TOPIC
    var topicToDelete = "";
    $("#viewLessons").on("click","#toDeleteTopicBtn",function () {
        //GET OLD TOPIC TITLE
        var active = $("#tabs").tabs('option','active');
        topicToDelete = $("#tabs ul>li a").eq(active).text();
        $("#deleteTopicDialog").html("<p><span class=\"ui-icon ui-icon-alert\" style=\"margin:12px 12px 15px 0\"></span> Are you sure you want to delete "+topicToDelete+" in "+activeLesson+"?</p>");
        $("#deleteTopicDialog").dialog("open");
    });

    //DELETE TOPIC DIALOG
    $("#deleteTopicDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Cancel: function() {
                topicToDelete = "";
                $( this ).dialog( "close" );
            },
            Confirm: function(){
                $.ajax({
                    type: "POST",
                    url: "./php/editTopic.php",
                    data: {
                        oldTopicTitle: topicToDelete,
                        editLessonTitle: activeLesson
                    },
                    beforeSend: function (){
                        //Reset Tabs
                        $( "#tabs" ).fadeOut(100);
                        $( "#viewLessons" ).fadeOut(100);
                        activeLesson = "";
                        //Reset and Hide Sidebar
                        $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                        $(".lessonPane").css("margin-left", "0");
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
                        $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
                        sidebarState = true; 
                    }
                });
                $( this ).dialog( "close" );
            }
        }
    });

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
                    data: "lessonDelete="+lessonToDelete,
                    beforeSend: function (){
                        //Reset Tabs
                        $( "#tabs" ).fadeOut(100);
                        $( "#viewLessons" ).fadeOut(100);
                        activeLesson = "";
                        //Reset and Hide Sidebar
                        $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                        $(".lessonPane").css("margin-left", "0");
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
                        $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
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

//DICTIONARY PAGE
    function refreshDictionary(){
        $("#dictionaryTable").html("<tr><th>Pinyin</th><th>Hanzi</th><th>Definition</th><th>Part of Speech</th><th>Sentence</th><th>Action</th></tr>");
        $.ajax({
            type: "post",
            url: "./php/getDictionary.php",
            success: function (response) {
                const responseObj = JSON.parse(response);
                responseObj.forEach(element => {
                    var rowHtml = "<tr>";
                    rowHtml += "<td>"+element.pinyin+"</td>";
                    rowHtml += "<td>"+element.hanzi+"</td>";
                    rowHtml += "<td>"+element.definition+"</td>";
                    rowHtml += "<td>"+element.speech+"</td>";
                    rowHtml += "<td>"+element.sentence+"</td>";
                    rowHtml += "<td><button type=\"button\" class='editWordBtn tableEditButton' title=\"edit\"></button><button type=\"button\" class='deleteWordBtn tableDeleteButton' title=\"delete\"></button></td>";  
                    rowHtml += "</tr>";
                    $("#dictionaryTable").append(rowHtml);
                });
            }
        });
    }

    $("#dictionaryBtn").click(function () { 
    // VIEW WORDS
        if(activeWindow != "#dictionaryPage"){
            refreshDictionary();
            if(activeWindow == ""){
                activeWindow = "#dictionaryPage";
                $("#dictionaryPage").show(100);
                $("#sidebar").css("margin-left", "100px");
                $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true; 
            }else{
                $(activeWindow).fadeOut(100, function(){
                    activeWindow = "#dictionaryPage";
                    $("#dictionaryPage").show(100);
                    $("#sidebar").css("margin-left", "100px");
                    $(".lessonPane").css("margin-left", "calc(170px + 3vw)");
                    sidebarState = true; 
                });
            }
        }
    });

    // ADD WORD
    function addWord(){
        errorMessage = $("#wordErrorMsg");
        if(!$("#pinyin").val().trim()){
            errorResponse("Pinyin is Required!");
        }else if(!$("#hanzi").val().trim()){
            errorResponse("Hanzi is Required!");
        }else if(!$("#definition").val().trim()){
            errorResponse("Definition is Required!");
        }else if(!$("#sentence").val().trim()){
            errorResponse("Sentence is Required!");
        }else{

            var formData = new FormData($("#addWordDialog form")[0]);

            //Send ajax request to addLesson.php
            $.ajax({
                type: "post",
                url: "./php/addWord.php",
                data: formData,
                processData: false,
                contentType: false, 
                beforeSend: function(){
                    //Hide Dictionary Table
                    $("#dictionaryTable").fadeOut(100);
                },
                success: function (response) {

                    if(response == "Word Already Exists!"){
                        $("#dictionaryTable").fadeIn(100);
                        errorResponse(response);
                    }else{
                        //Update Dictionary Table
                        refreshDictionary();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");

                        //Reset Dialog
                        errorMessage.text("");
                        errorMessage.hide();
                        $("#addWordDialog form")[0].reset();
                        $("#addWordDialog").dialog("close");

                        $("#dictionaryTable").fadeIn(100);
                    }
                }
            });
        }
    }

    $("#addWordDialog").dialog({
        autoOpen: false,
        height: "auto",
        width: "auto",
        modal: true,
        closeOnEscape: true,
        buttons: {
        "Add Word": addWord,
        Cancel: function() {
            $("#dictionaryTable").fadeIn(100);
            //Reset Dialog
            errorMessage.text("");
            errorMessage.hide();
            $(this).dialog( "close" );
        }
        },
        close: function() {
            $("#dictionaryTable").fadeIn(100);
            $("#addWordDialog form")[0].reset();
            errorMessage.text("");
            errorMessage.hide();
            $(this).dialog( "close" );
            $("#wordErrorMsg").removeClass( "ui-state-error" );
        }
    });

    $("#toAddWordBtn").click(function () { 
        $( "#speech" ).selectmenu();
        $("#addWordDialog").dialog("open"); 
    });

    $("#addWordDialog form").on("submit", function(e){
        e.preventDefault();
        addWord();
    });

    // EDIT WORD
    function editWord(){
        errorMessage = $("#editWordErrorMsg");
        if(!$("#editPinyin").val().trim()){
            errorResponse("Pinyin is Required!");
        }else if(!$("#editHanzi").val().trim()){
            errorResponse("Hanzi is Required!");
        }else if(!$("#editDefinition").val().trim()){
            errorResponse("Definition is Required!");
        }else if(!$("#editSentence").val().trim()){
            errorResponse("Sentence is Required!");
        }else{

            var formData = new FormData($("#editWordDialog form")[0]);
            formData.append("oldPinyin", wordDetails[0]);
            console.log(wordDetails[0]);

            //Send ajax request to addLesson.php
            $.ajax({
                type: "post",
                url: "./php/editWord.php",
                data: formData,
                processData: false,
                contentType: false, 
                beforeSend: function(){
                    //Hide Dictionary Table
                    $("#dictionaryTable").fadeOut(100);
                },
                success: function (response) {

                    if(response != "Word Edited Successfully!"){
                        $("#dictionaryTable").fadeIn(100);
                        errorResponse(response);
                    }else{
                        //Update Dictionary Table
                        refreshDictionary();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");

                        //Reset Dialog
                        errorMessage.text("");
                        errorMessage.hide();
                        $("#editWordDialog form")[0].reset();
                        $("#editWordDialog").dialog("close");

                        $("#dictionaryTable").fadeIn(100);
                    }
                }
            });
        }
    }

    $("#editWordDialog").dialog({
        autoOpen: false,
        height: "auto",
        width: "auto",
        modal: true,
        closeOnEscape: true,
        buttons: {
        "Edit Word": editWord,
        Cancel: function() {
            $("#dictionaryTable").fadeIn(100);
            //Reset Dialog
            errorMessage.text("");
            errorMessage.hide();
            $(this).dialog( "close" );
        }
        },
        close: function() {
            $("#dictionaryTable").fadeIn(100);
            $("#editWordDialog form")[0].reset();
            errorMessage.text("");
            errorMessage.hide();
            $(this).dialog( "close" );
            $("#editWordErrorMsg").removeClass( "ui-state-error" );
        }
    });

    var wordDetails = [];
    $("#dictionaryTable").on("click",".editWordBtn",function () {
        $("#editSpeech").selectmenu();
        $("#editWordDialog").dialog("open"); 

        //Get row details
        var row = $(this).closest("tr"),
        rowDetails = row.find("td");
        var indx = 0;
        $.each(rowDetails, function () {
            wordDetails[indx] = $(this).text();
            indx++;
        });
        
        //Set details to edit dialog form
        $("#editPinyin").val(wordDetails[0]);
        $("#editHanzi").val(wordDetails[1]);
        $("#editDefinition").val(wordDetails[2]);
        $("#editSpeech").val(wordDetails[3]);
        $("#editSpeech").selectmenu("refresh");
        $("#editSentence").val(wordDetails[4]);
    });

    $("#editWordDialog form").on("submit", function(e){
        e.preventDefault();
        editWord();
    });

    // DELETE WORD
    var wordToDelete = "";
    var row = "";
    $("#dictionaryTable").on("click",".deleteWordBtn",function () {
        //Get row details
        row = $(this).closest("tr");
        wordToDelete = row.find("td:first-child").text();
        var hanziToDelete = row.find("td:nth-child(2)").text();
        $("#deleteWordDialog").html("<p><span class=\"ui-icon ui-icon-alert\" style=\"margin:12px 12px 15px 0\"></span> Are you sure you want to delete "+wordToDelete+"("+hanziToDelete+") in dictionary?</p>");
        $("#deleteWordDialog").dialog("open");
    });

    //DELETE WORD MODAL
    $("#deleteWordDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Confirm: function(){
                //Get row details
                wordToDelete = row.find("td:first-child").text();

                $.ajax({
                    type: "POST",
                    url: "./php/deleteWord.php",
                    data: "wordDelete="+wordToDelete,
                    beforeSend: function (){
                        //Hide Dictionary Table
                        $("#dictionaryTable").fadeOut(100);
                    },
                    success: function (response) {
                        if(response != "Word Deleted Successfully!"){
                            $("#dictionaryTable").fadeIn(100);
                            $("#errorDialog p").append(response);
                            $("#errorDialog").dialog("open");
                        }else{
                            //Update Dictionary Table
                            refreshDictionary();
                            $("#successDialog p").append(response);
                            $("#successDialog").dialog("open");
                            $("#dictionaryTable").fadeIn(100);
                        }
                    },
                    complete: function (){
                        //Reset Variable
                        wordToDelete = "";
                    }
                });
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                wordToDelete = "";
                $( this ).dialog( "close" );
            }
        }
    });

// ASSESSMENT PAGE ====================================================================================================================================================================

    function refreshAssessments(){
        $("#assessmentTable").html("<tr><th>Assessment Title</th><th>No. of Items</th><th>No. of Questions</th><th>Action</th></tr>");
        $.ajax({
            type: "post",
            url: "./php/getAssessments.php",
            success: function (response) {
                const responseObj = JSON.parse(response);
                responseObj.forEach(element => {
                    var rowHtml = "<tr class='trHover'>";
                    rowHtml += "<td>"+element.title+"</td>";
                    rowHtml += "<td>"+element.items+"</td>";
                    rowHtml += "<td>"+element.questionsCount+"</td>";
                    rowHtml += "<td><button type=\"button\" class='editAssessmentBtn tableEditButton' title=\"edit\"></button><button type=\"button\" class='deleteAssessmentBtn tableDeleteButton' title=\"delete\"></button></td>";  
                    rowHtml += "</tr>";
                    $("#assessmentTable").append(rowHtml);
                });
            }
        });
    }

    $("#assessmentBtn").click(function () { 
    // VIEW ASSESSMENTS
            if(activeWindow != "#assessmentPage"){
                refreshAssessments();
                if(activeWindow == ""){
                    activeWindow = "#assessmentPage";
                    $("#assessmentPage").show(100);
                }else{
                    $(activeWindow).fadeOut(100, function(){
                        $("#addAssessmentForm, #editAssessmentForm").hide();
                        $("#viewAssessments").show();
                        activeWindow = "#assessmentPage";
                        $("#assessmentPage").show(100);
                    });
                }
            }
    });

    // TO ADD ASSESSMENT FORM
    $("#toAddAssessmentBtn").click(function () { 
        $("#viewAssessments").fadeOut(100, function(){
            $("select").selectmenu();
            $("#totalItems").spinner({
                min: 1
            });
            $("#addAssessmentForm").fadeIn(100);
        });
        
    });

        // ADD QUESTION IN ADD ASSESSMENT FORM
        var questionNumber = 0;
        var totalQuestions = 0;
        var deleteIndexBuffer = [];
        var getDelIndex = false;
        $("#addNewQuestionBtn").click(function () {
            if(deleteIndexBuffer.length > 0){
                questionNumber = deleteIndexBuffer.shift();
                getDelIndex = true;
            }else{
                questionNumber++;
            }
            var questionHtml = "<div class=\"question\" id='"+questionNumber+"'><button type=\"button\" class='deleteQuestionBtn button' title=\"delete\">DELETE</button>";
            if($("#questionType").val() == "Multiple Choice"){
                questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"multiple\">";
                questionHtml += "<h3>Multiple Choice</h3>";

                questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
                
                questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                
                questionHtml += "<label for=\"choice-1-"+questionNumber+"\">Choice 1: </label>";
                questionHtml += "<input type=\"text\" id=\"choice-1-"+questionNumber+"\" name=\"choice-1-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
                
                questionHtml += "<label for=\"choice-2-"+questionNumber+"\">Choice 2: </label>";
                questionHtml += "<input type=\"text\" id=\"choice-2-"+questionNumber+"\" name=\"choice-2-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
                
                questionHtml += "<label for=\"choice-3-"+questionNumber+"\">Choice 3: </label>";
                questionHtml += "<input type=\"text\" id=\"choice-3-"+questionNumber+"\" name=\"choice-3-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
                
                questionHtml += "<label for=\"choice-4-"+questionNumber+"\">Choice 4: </label>";
                questionHtml += "<input type=\"text\" id=\"choice-4-"+questionNumber+"\" name=\"choice-4-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
                
                questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
                questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
                questionHtml += "<option selected=\"selected\" value=\"1\">Choice 1</option>";
                questionHtml += "<option value=\"2\">Choice 2</option>";
                questionHtml += "<option value=\"3\">Choice 3</option>";
                questionHtml += "<option value=\"4\">Choice 4</option>";
                questionHtml += "</select>";
            }else if($("#questionType").val() == "True/False"){
                questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"truefalse\">";
                questionHtml += "<h3>True/False</h3>";
                
                questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
                
                questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                
                questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
                questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
                questionHtml += "<option selected=\"selected\">True</option>";
                questionHtml += "<option>False</option>";
                questionHtml += "</select>";
            }else if($("#questionType").val() == "Identification"){
                questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"identify\">";
                questionHtml += "<h3>Identification</h3>";
                
                questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
                
                questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                
                questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer/s: (Separate all possible answers with a comma ex. Answer1,Answer2,Answer3. Capitalization is automatically ignored.)</label>";
                questionHtml += "<input type=\"text\" id=\"answer-"+questionNumber+"\" name=\"answer-"+questionNumber+"\" placeholder=\"ANSWER\" required>";
            }else{
                questionHtml = "Invalid question type.";
            }
            questionHtml += "</div>";
            $("#addAssessmentForm fieldset").append(questionHtml);
            $(".button").button();
            $("select").selectmenu();
            totalQuestions++;
            if(getDelIndex){
                questionNumber = totalQuestions;
            }
            $("#questionDatabank").text("Question Databank: "+totalQuestions+" Questions");
        });

        // DELETE QUESTION
        $("#addAssessmentForm, #editAssessmentForm").on("click",".deleteQuestionBtn", function(){
            deleteIndexBuffer.push($(this).closest(".question").attr("id"));
            $(this).closest(".question").remove();
            totalQuestions--;
            $("#questionDatabank").text("Question Databank: "+totalQuestions+" Questions");
        });

    // ADD ASSESSMENT
    $("#addAssessmentForm").on("submit", function(e){
        e.preventDefault();
        var isValid = true;

        var hasQuestion = true;
        for(var x=1;x<=totalQuestions;x++){
            while($.inArray(x.toString(),deleteIndexBuffer) !== -1){
                x++;
                totalQuestions++;
            }
            if(!$("#question-"+x+"").val().trim() && !$("#image-"+x+"").val()){
                hasQuestion = false;
            }
        }

        if(!$.isNumeric($("#totalItems").val().trim()) || $("#totalItems").val().trim() < 1){
            isValid = false;
            $("#errorDialog p").append("Total Items must be a positive number.");
        }else if($("#totalItems").val()>totalQuestions){
            isValid = false;
            $("#errorDialog p").append("Not enough questions for total items.");
        }else if(!hasQuestion){
            isValid = false;
            $("#errorDialog p").append("Question or Image is required.");
        }

        if(isValid){
            var formData = new FormData($("#addAssessmentForm")[0]);
            formData.append("totalQuestions",totalQuestions);
            $.ajax({
                type: "post",
                url: "./php/addAssessment.php",
                data: formData,
                processData: false,
                contentType: false, 
                success: function (response) {
                    if(response.trim() == "Assessment Already Exists!"){
                        $("#errorDialog p").append(response);
                        $("#errorDialog").dialog("open");
                    }else{
                        questionNumber = 0;
                        totalQuestions = 0;
                        deleteIndexBuffer = [];
                        getDelIndex = false;
                        $("#questionDatabank").text("Question Databank: "+totalQuestions+" Questions");
                        $("#addAssessmentForm")[0].reset();
                        $(".question").remove();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");
                        $("#addAssessmentForm").fadeOut(100, function(){
                            refreshAssessments();
                            $("#viewAssessments").fadeIn(100);
                        });
                    }
                }
            });
        }else{
            $("#errorDialog").dialog("open");
        }
    });

    // BACK TO VIEW ASSESSMENTS
    $("#cancelAddAssessmentBtn").click(function () { 
        questionNumber = 0;
        totalQuestions = 0;
        deleteIndexBuffer = [];
        getDelIndex = false;
        $("#questionDatabank").text("Question Databank: "+totalQuestions+" Questions");
        $("#addAssessmentForm")[0].reset();
        $(".question").remove();
        $("#addAssessmentForm").fadeOut(100, function(){
            $("#viewAssessments").fadeIn(100);
        });
    });
    
    // DELETE ASSESSMENT
    var assessmentToDelete = "";
    $("#assessmentTable").on("click",".deleteAssessmentBtn",function () {
        //Get row details
        row = $(this).closest("tr");
        assessmentToDelete = row.find("td:first-child").text();
        $("#deleteAssessmentDialog").html("<p><span class=\"ui-icon ui-icon-alert\" style=\"margin:12px 12px 15px 0\"></span> Are you sure you want to delete "+assessmentToDelete+" Assessment?</p>");
        $("#deleteAssessmentDialog").dialog("open");
    });

    //DELETE ASSESSMENT MODAL
    $("#deleteAssessmentDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Confirm: function(){
                //Get row details
                assessmentToDelete = row.find("td:first-child").text();

                $.ajax({
                    type: "POST",
                    url: "./php/deleteAssessment.php",
                    data: "assessmentDelete="+assessmentToDelete,
                    beforeSend: function (){
                        //Hide Assessment Table
                        $("#assessmentTable").fadeOut(100);
                    },
                    success: function (response) {
                        if(response != "Assessment Deleted Successfully!"){
                            $("#assessmentTable").fadeIn(100);
                            $("#errorDialog p").append(response);
                            $("#errorDialog").dialog("open");
                        }else{
                            //Update Assessment Table
                            refreshAssessments();
                            $("#successDialog p").append(response);
                            $("#successDialog").dialog("open");
                            $("#assessmentTable").fadeIn(100);
                        }
                    },
                    complete: function (){
                        //Reset Variable
                        assessmentToDelete = "";
                    }
                });
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                assessmentToDelete = "";
                $( this ).dialog( "close" );
            }
        }
    });

    // EDIT ASSESSMENT
    var assessmentToEdit = "";
    $("#assessmentTable").on("click",".editAssessmentBtn",function () {
        $(".button").button();
        $("select").selectmenu();
        //Get row details
        row = $(this).closest("tr"),
        assessmentToEdit = row.find("td:first-child").text();
        $.ajax({
            type: "post",
            url: "./php/getAssessments.php",
            data: "title="+assessmentToEdit,
            success: function (response) {
                const responseObj = JSON.parse(response);
                console.log(responseObj.questions[0].answer);
                $("#editAssessmentTitle").val(responseObj.title);
                $("#editTotalItems").val(responseObj.items);
                $("#editQuestionDatabank").text("Question Databank: "+responseObj.questionsCount+" Questions");
                totalQuestions = responseObj.questionsCount;
                questionNumber = responseObj.questionsCount;
                responseObj.questions.forEach(question => {
                    questionNumber = question.id;
                    var questionHtml = "<div class=\"question\" id='"+questionNumber+"'><button type=\"button\" class='deleteQuestionBtn button' title=\"delete\">DELETE</button>";
                    if(question.type == "multiple"){
                        questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"multiple\">";
                        questionHtml += "<h3>Multiple Choice</h3>";

                        questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                        questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\" value='"+question.text+"'>";
                        
                        questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                        questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                        
                        questionHtml += "<label for=\"choice-1-"+questionNumber+"\">Choice 1: </label>";
                        questionHtml += "<input type=\"text\" id=\"choice-1-"+questionNumber+"\" name=\"choice-1-"+questionNumber+"\" placeholder=\"CHOICE\" value='"+question.choices[0]+"' required>";
                        
                        questionHtml += "<label for=\"choice-2-"+questionNumber+"\">Choice 2: </label>";
                        questionHtml += "<input type=\"text\" id=\"choice-2-"+questionNumber+"\" name=\"choice-2-"+questionNumber+"\" placeholder=\"CHOICE\" value='"+question.choices[1]+"' required>";
                        
                        questionHtml += "<label for=\"choice-3-"+questionNumber+"\">Choice 3: </label>";
                        questionHtml += "<input type=\"text\" id=\"choice-3-"+questionNumber+"\" name=\"choice-3-"+questionNumber+"\" placeholder=\"CHOICE\" value='"+question.choices[2]+"' required>";
                        
                        questionHtml += "<label for=\"choice-4-"+questionNumber+"\">Choice 4: </label>";
                        questionHtml += "<input type=\"text\" id=\"choice-4-"+questionNumber+"\" name=\"choice-4-"+questionNumber+"\" placeholder=\"CHOICE\" value='"+question.choices[3]+"' required>";
                        
                        questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
                        questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";

                        if(question.answer == question.choices[0]){
                            questionHtml += "<option selected=\"selected\" value=\"1\">Choice 1</option>";
                            questionHtml += "<option value=\"2\">Choice 2</option>";
                            questionHtml += "<option value=\"3\">Choice 3</option>";
                            questionHtml += "<option value=\"4\">Choice 4</option>";
                        }else if(question.answer == question.choices[1]){
                            questionHtml += "<option value=\"1\">Choice 1</option>";
                            questionHtml += "<option selected=\"selected\" value=\"2\">Choice 2</option>";
                            questionHtml += "<option value=\"3\">Choice 3</option>";
                            questionHtml += "<option value=\"4\">Choice 4</option>";
                        }else if(question.answer == question.choices[2]){
                            questionHtml += "<option value=\"1\">Choice 1</option>";
                            questionHtml += "<option value=\"2\">Choice 2</option>";
                            questionHtml += "<option selected=\"selected\" value=\"3\">Choice 3</option>";
                            questionHtml += "<option value=\"4\">Choice 4</option>";
                        }else{
                            questionHtml += "<option value=\"1\">Choice 1</option>";
                            questionHtml += "<option value=\"2\">Choice 2</option>";
                            questionHtml += "<option value=\"3\">Choice 3</option>";
                            questionHtml += "<option selected=\"selected\" value=\"4\">Choice 4</option>";
                        }
                        questionHtml += "</select>";
                    }else if(question.type == "truefalse"){
                        questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"truefalse\">";
                        questionHtml += "<h3>True/False</h3>";
                        
                        questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                        questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\" value='"+question.text+"'>";
                        
                        questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                        questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                        
                        questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
                        questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
                        if(question.answer == "True"){
                            questionHtml += "<option selected=\"selected\">True</option>";
                            questionHtml += "<option>False</option>";
                        }else{
                            questionHtml += "<option>True</option>";
                            questionHtml += "<option selected=\"selected\">False</option>";
                        }
                        questionHtml += "</select>";
                    }else if(question.type == "identify"){
                        questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"identify\">";
                        questionHtml += "<h3>Identification</h3>";
                        
                        questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                        questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\" value='"+question.text+"'>";
                        
                        questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                        questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                        
                        questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer/s: (Separate all possible answers with a comma ex. Answer1,Answer2,Answer3. Capitalization is automatically ignored.)</label>";
                        questionHtml += "<input type=\"text\" id=\"answer-"+questionNumber+"\" name=\"answer-"+questionNumber+"\" placeholder=\"ANSWER\" value='"+question.answer+"' required>";
                    }else{
                        questionHtml = "Invalid question type.";
                    }
                    questionHtml += "</div>";
                    $("#editAssessmentForm fieldset").append(questionHtml);
                });

                $(".button").button();
                $("select").selectmenu();
                $("#viewAssessments").fadeOut(100, function(){
                    $("select").selectmenu();
                    $("#editTotalItems").spinner({
                        min: 1
                    });
                    $("#editAssessmentForm").fadeIn(100);
                });
            }
        });
    });

        // ADD QUESTION IN EDIT ASSESSMENT FORM
        var deleteIndexBuffer = [];
        var getDelIndex = false;
        $("#addNewEditQuestionBtn").click(function () {
            if(deleteIndexBuffer.length > 0){
                questionNumber = deleteIndexBuffer.shift();
                getDelIndex = true;
            }else{
                questionNumber++;
            }
            var questionHtml = "<div class=\"question\" id='"+questionNumber+"'><button type=\"button\" class='deleteQuestionBtn button' title=\"delete\">DELETE</button>";
            if($("#editQuestionType").val() == "Multiple Choice"){
                questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"multiple\">";
                questionHtml += "<h3>Multiple Choice</h3>";

                questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
                
                questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                
                questionHtml += "<label for=\"choice-1-"+questionNumber+"\">Choice 1: </label>";
                questionHtml += "<input type=\"text\" id=\"choice-1-"+questionNumber+"\" name=\"choice-1-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
                
                questionHtml += "<label for=\"choice-2-"+questionNumber+"\">Choice 2: </label>";
                questionHtml += "<input type=\"text\" id=\"choice-2-"+questionNumber+"\" name=\"choice-2-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
                
                questionHtml += "<label for=\"choice-3-"+questionNumber+"\">Choice 3: </label>";
                questionHtml += "<input type=\"text\" id=\"choice-3-"+questionNumber+"\" name=\"choice-3-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
                
                questionHtml += "<label for=\"choice-4-"+questionNumber+"\">Choice 4: </label>";
                questionHtml += "<input type=\"text\" id=\"choice-4-"+questionNumber+"\" name=\"choice-4-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
                
                questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
                questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
                questionHtml += "<option selected=\"selected\" value=\"1\">Choice 1</option>";
                questionHtml += "<option value=\"2\">Choice 2</option>";
                questionHtml += "<option value=\"3\">Choice 3</option>";
                questionHtml += "<option value=\"4\">Choice 4</option>";
                questionHtml += "</select>";
            }else if($("#editQuestionType").val() == "True/False"){
                questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"truefalse\">";
                questionHtml += "<h3>True/False</h3>";
                
                questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
                
                questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                
                questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
                questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
                questionHtml += "<option selected=\"selected\">True</option>";
                questionHtml += "<option>False</option>";
                questionHtml += "</select>";
            }else if($("#editQuestionType").val() == "Identification"){
                questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"identify\">";
                questionHtml += "<h3>Identification</h3>";
                
                questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
                
                questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                
                questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer/s: (Separate all possible answers with a comma ex. Answer1,Answer2,Answer3. Capitalization is automatically ignored.)</label>";
                questionHtml += "<input type=\"text\" id=\"answer-"+questionNumber+"\" name=\"answer-"+questionNumber+"\" placeholder=\"ANSWER\" required>";
            }else{
                questionHtml = "Invalid question type.";
            }
            questionHtml += "</div>";
            $("#editAssessmentForm fieldset").append(questionHtml);
            $(".button").button();
            $("select").selectmenu();
            totalQuestions++;
            if(getDelIndex){
                questionNumber = totalQuestions;
            }
            $("#editQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
        });

    // EDIT ASSESSMENT
    $("#editAssessmentForm").on("submit", function(e){
        e.preventDefault();
        var isValid = true;

        var hasQuestion = true;
        for(var x=1;x<=totalQuestions;x++){
            while($.inArray(x.toString(),deleteIndexBuffer) !== -1){
                x++;
                totalQuestions++;
            }
            if(!$("#question-"+x+"").val().trim() && !$("#image-"+x+"").val()){
                hasQuestion = false;
            }
        }

        if(!$.isNumeric($("#editTotalItems").val().trim()) || $("#editTotalItems").val().trim() < 1){
            isValid = false;
            $("#errorDialog p").append("Total Items must be a positive number.");
        }else if($("#editTotalItems").val()>totalQuestions){
            isValid = false;
            $("#errorDialog p").append("Not enough questions for total items.");
        }else if(!hasQuestion){
            isValid = false;
            $("#errorDialog p").append("Question or Image is required.");
        }
        
        if(isValid){
            var formData = new FormData($("#editAssessmentForm")[0]);
            formData.append("totalQuestions",totalQuestions);
            formData.append("oldTitle",assessmentToEdit);
            $.ajax({
                type: "post",
                url: "./php/editAssessment.php",
                data: formData,
                processData: false,
                contentType: false, 
                success: function (response) {
                    if(response.trim() == "Assessment Already Exists!"){
                        $("#errorDialog p").append(response);
                        $("#errorDialog").dialog("open");
                    }else{
                        questionNumber = 0;
                        totalQuestions = 0;
                        deleteIndexBuffer = [];
                        getDelIndex = false;
                        $("#editQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
                        $("#editAssessmentForm")[0].reset();
                        $(".question").remove();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");
                        $("#editAssessmentForm").fadeOut(100, function(){
                            refreshAssessments();
                            $("#viewAssessments").fadeIn(100);
                        });
                    }
                }
            });
        }else{
            $("#errorDialog").dialog("open");
        }
    });

    // CANCEL EDIT ASSESSMENT
    $("#cancelEditAssessmentBtn").click(function () { 
        questionNumber = 0;
        totalQuestions = 0;
        deleteIndexBuffer = [];
        getDelIndex = false;
        $("#editQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
        $("#editAssessmentForm")[0].reset();
        $(".question").remove();
        $("#editAssessmentForm").fadeOut(100, function(){
            $("#viewAssessments").fadeIn(100);
        });
    });

// MOCK TEST PAGE ======================================================================================================================================================================

    function refreshMockTest(){
        $("#mockTestTable").html("<tr><th>HSK Level</th><th>No. of Items</th><th>No. of Questions</th><th>Action</th></tr>");
        $.ajax({
            type: "post",
            url: "./php/getMockTest.php",
            success: function (response) {
                const responseObj = JSON.parse(response);
                responseObj.forEach(element => {
                    var rowHtml = "<tr class='trHover'>";
                    rowHtml += "<td>"+element.title+"</td>";
                    rowHtml += "<td>"+element.items+"</td>";
                    rowHtml += "<td>"+element.questionsCount+"</td>";
                    rowHtml += "<td><button type=\"button\" class='editMockTestBtn tableEditButton' title=\"edit\"></button><button type=\"button\" class='deleteMockTestBtn tableDeleteButton' title=\"delete\"></button></td>";  
                    rowHtml += "</tr>";
                    $("#mockTestTable").append(rowHtml);
                });
            }
        });
    }

    $("#mockTestBtn").click(function () { 
    // VIEW MOCK TEST
            if(activeWindow != "#mockTestPage"){
                refreshMockTest();
                if(activeWindow == ""){
                    activeWindow = "#mockTestPage";
                    $("#mockTestPage").show(100);
                }else{
                    $(activeWindow).fadeOut(100, function(){
                        $("#addMockTestForm, #editMockTestForm").hide();
                        $("#viewMockTest").show();
                        activeWindow = "#mockTestPage";
                        $("#mockTestPage").show(100);
                    });
                }
            }
    });

    // TO ADD MOCK TEST FORM
    $("#toAddMockTestBtn").click(function () { 
        $("#viewMockTest").fadeOut(100, function(){
            $("select").selectmenu();
            $("#testTotalItems").spinner({
                min: 1
            });
            $("#addMockTestForm").fadeIn(100);
        });
        
    });

    // ADD QUESTION IN ADD MOCK TEST FORM
    var questionNumber = 0;
    var totalQuestions = 0;
    var deleteIndexBuffer = [];
    var getDelIndex = false;
    $("#addNewTestQuestionBtn").click(function () {
        if(deleteIndexBuffer.length > 0){
            questionNumber = deleteIndexBuffer.shift();
            getDelIndex = true;
        }else{
            questionNumber++;
        }
        var questionHtml = "<div class=\"question\" id='"+questionNumber+"'><button type=\"button\" class='deleteQuestionBtn button' title=\"delete\">DELETE</button>";
        if($("#testQuestionType").val() == "Multiple Choice"){
            questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"multiple\">";
            questionHtml += "<h3>Multiple Choice</h3>";

            questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
            questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
            
            questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
            questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
            
            questionHtml += "<label for=\"choice-1-"+questionNumber+"\">Choice 1: </label>";
            questionHtml += "<input type=\"text\" id=\"choice-1-"+questionNumber+"\" name=\"choice-1-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
            
            questionHtml += "<label for=\"choice-2-"+questionNumber+"\">Choice 2: </label>";
            questionHtml += "<input type=\"text\" id=\"choice-2-"+questionNumber+"\" name=\"choice-2-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
            
            questionHtml += "<label for=\"choice-3-"+questionNumber+"\">Choice 3: </label>";
            questionHtml += "<input type=\"text\" id=\"choice-3-"+questionNumber+"\" name=\"choice-3-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
            
            questionHtml += "<label for=\"choice-4-"+questionNumber+"\">Choice 4: </label>";
            questionHtml += "<input type=\"text\" id=\"choice-4-"+questionNumber+"\" name=\"choice-4-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
            
            questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
            questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
            questionHtml += "<option selected=\"selected\" value=\"1\">Choice 1</option>";
            questionHtml += "<option value=\"2\">Choice 2</option>";
            questionHtml += "<option value=\"3\">Choice 3</option>";
            questionHtml += "<option value=\"4\">Choice 4</option>";
            questionHtml += "</select>";
        }else if($("#testQuestionType").val() == "True/False"){
            questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"truefalse\">";
            questionHtml += "<h3>True/False</h3>";
            
            questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
            questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
            
            questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
            questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
            
            questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
            questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
            questionHtml += "<option selected=\"selected\">True</option>";
            questionHtml += "<option>False</option>";
            questionHtml += "</select>";
        }else if($("#testQuestionTypee").val() == "Identification"){
            questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"identify\">";
            questionHtml += "<h3>Identification</h3>";
            
            questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
            questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
            
            questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
            questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
            
            questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer/s: (Separate all possible answers with a comma ex. Answer1,Answer2,Answer3. Capitalization is automatically ignored.)</label>";
            questionHtml += "<input type=\"text\" id=\"answer-"+questionNumber+"\" name=\"answer-"+questionNumber+"\" placeholder=\"ANSWER\" required>";
        }else{
            questionHtml = "Invalid question type.";
        }
        questionHtml += "</div>";
        $("#addMockTestForm fieldset").append(questionHtml);
        $(".button").button();
        $("select").selectmenu();
        totalQuestions++;
        if(getDelIndex){
            questionNumber = totalQuestions;
        }
        $("#testQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
    });

    // DELETE QUESTION
    $("#addMockTestForm, #editMockTestForm").on("click",".deleteQuestionBtn", function(){
        deleteIndexBuffer.push($(this).closest(".question").attr("id"));
        $(this).closest(".question").remove();
        totalQuestions--;
        $("#testQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
    });

    // ADD MOCK TEST
    $("#addMockTestForm").on("submit", function(e){
        e.preventDefault();
        var isValid = true;

        var hasQuestion = true;
        for(var x=1;x<=totalQuestions;x++){
            while($.inArray(x.toString(),deleteIndexBuffer) !== -1){
                x++;
                totalQuestions++;
            }
            if(!$("#question-"+x+"").val().trim() && !$("#image-"+x+"").val()){
                hasQuestion = false;
            }
        }

        if(!$.isNumeric($("#testTotalItems").val().trim()) || $("#testTotalItems").val().trim() < 1){
            isValid = false;
            $("#errorDialog p").append("Total Items must be a positive number.");
        }else if($("#testTotalItems").val()>totalQuestions){
            isValid = false;
            $("#errorDialog p").append("Not enough questions for total items.");
        }else if(!hasQuestion){
            isValid = false;
            $("#errorDialog p").append("Question or Image is required.");
        }

        if(isValid){
            var formData = new FormData($("#addMockTestForm")[0]);
            formData.append("testTotalQuestions",totalQuestions);
            $.ajax({
                type: "post",
                url: "./php/addMockTest.php",
                data: formData,
                processData: false,
                contentType: false, 
                success: function (response) {
                    if(response.trim() == "Mock Test Already Exists!"){
                        $("#errorDialog p").append(response);
                        $("#errorDialog").dialog("open");
                    }else{
                        questionNumber = 0;
                        totalQuestions = 0;
                        deleteIndexBuffer = [];
                        getDelIndex = false;
                        $("#testQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
                        $("#addMockTestForm")[0].reset();
                        $(".question").remove();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");
                        $("#addMockTestForm").fadeOut(100, function(){
                            refreshMockTest();
                            $("#viewMockTest").fadeIn(100);
                        });
                    }
                }
            });
        }else{
            $("#errorDialog").dialog("open");
        }
    });

    // BACK TO VIEW MOCK TEST
    $("#cancelAddMockTestBtn").click(function () { 
        questionNumber = 0;
        totalQuestions = 0;
        deleteIndexBuffer = [];
        getDelIndex = false;
        $("#testQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
        $("#addMockTestForm")[0].reset();
        $(".question").remove();
        $("#addMockTestForm").fadeOut(100, function(){
            $("#viewMockTest").fadeIn(100);
        });
    });

    // DELETE MOCK TEST
    var mockTestToDelete = "";
    $("#mockTestTable").on("click",".deleteMockTestBtn",function () {
        //Get row details
        row = $(this).closest("tr");
        mockTestToDelete = row.find("td:first-child").text();
        $("#deleteMockTestDialog").html("<p><span class=\"ui-icon ui-icon-alert\" style=\"margin:12px 12px 15px 0\"></span> Are you sure you want to delete "+mockTestToDelete+" Mock Test?</p>");
        $("#deleteMockTestDialog").dialog("open");
    });

    // DELETE MOCK TEST MODAL
    $("#deleteMockTestDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Confirm: function(){
                //Get row details
                mockTestToDelete = row.find("td:first-child").text();

                $.ajax({
                    type: "POST",
                    url: "./php/deleteMockTest.php",
                    data: "mockTestDelete="+mockTestToDelete,
                    beforeSend: function (){
                        //Hide Mock Test Table
                        $("#mockTestTable").fadeOut(100);
                    },
                    success: function (response) {
                        if(response.trim() != "Mock Test Deleted Successfully!"){
                            $("#mockTestTable").fadeIn(100);
                            $("#errorDialog p").append(response);
                            $("#errorDialog").dialog("open");
                        }else{
                            //Update Mock Test Table
                            refreshMockTest();
                            $("#successDialog p").append(response);
                            $("#successDialog").dialog("open");
                            $("#mockTestTable").fadeIn(100);
                            mockTestToDelete = "";
                        }
                    }
                });
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                mockTestToDelete = "";
                $( this ).dialog( "close" );
            }
        }
    });

    // EDIT MOCK TEST
    var mockTestToEdit = "";
    $("#mockTestTable").on("click",".editMockTestBtn",function () {
        $(".button").button();
        $("select").selectmenu();
        //Get row details
        row = $(this).closest("tr"),
        mockTestToEdit = row.find("td:first-child").text();
        $.ajax({
            type: "post",
            url: "./php/getMockTest.php",
            data: "title="+mockTestToEdit,
            success: function (response) {
                const responseObj = JSON.parse(response);
                $("#editMockTestTitle").val(responseObj.title);
                $("#editTestTotalItems").val(responseObj.items);
                $("#editTestQuestionDatabank").text("Question Databank: "+responseObj.questionsCount+" Questions");
                totalQuestions = responseObj.questionsCount;
                questionNumber = responseObj.questionsCount;
                responseObj.questions.forEach(question => {
                    questionNumber = question.id;
                    var questionHtml = "<div class=\"question\" id='"+questionNumber+"'><button type=\"button\" class='deleteQuestionBtn button' title=\"delete\">DELETE</button>";
                    if(question.type == "multiple"){
                        questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"multiple\">";
                        questionHtml += "<h3>Multiple Choice</h3>";

                        questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                        questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\" value='"+question.text+"'>";
                        
                        questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                        questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                        
                        questionHtml += "<label for=\"choice-1-"+questionNumber+"\">Choice 1: </label>";
                        questionHtml += "<input type=\"text\" id=\"choice-1-"+questionNumber+"\" name=\"choice-1-"+questionNumber+"\" placeholder=\"CHOICE\" value='"+question.choices[0]+"' required>";
                        
                        questionHtml += "<label for=\"choice-2-"+questionNumber+"\">Choice 2: </label>";
                        questionHtml += "<input type=\"text\" id=\"choice-2-"+questionNumber+"\" name=\"choice-2-"+questionNumber+"\" placeholder=\"CHOICE\" value='"+question.choices[1]+"' required>";
                        
                        questionHtml += "<label for=\"choice-3-"+questionNumber+"\">Choice 3: </label>";
                        questionHtml += "<input type=\"text\" id=\"choice-3-"+questionNumber+"\" name=\"choice-3-"+questionNumber+"\" placeholder=\"CHOICE\" value='"+question.choices[2]+"' required>";
                        
                        questionHtml += "<label for=\"choice-4-"+questionNumber+"\">Choice 4: </label>";
                        questionHtml += "<input type=\"text\" id=\"choice-4-"+questionNumber+"\" name=\"choice-4-"+questionNumber+"\" placeholder=\"CHOICE\" value='"+question.choices[3]+"' required>";
                        
                        questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
                        questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";

                        if(question.answer == question.choices[0]){
                            questionHtml += "<option selected=\"selected\" value=\"1\">Choice 1</option>";
                            questionHtml += "<option value=\"2\">Choice 2</option>";
                            questionHtml += "<option value=\"3\">Choice 3</option>";
                            questionHtml += "<option value=\"4\">Choice 4</option>";
                        }else if(question.answer == question.choices[1]){
                            questionHtml += "<option value=\"1\">Choice 1</option>";
                            questionHtml += "<option selected=\"selected\" value=\"2\">Choice 2</option>";
                            questionHtml += "<option value=\"3\">Choice 3</option>";
                            questionHtml += "<option value=\"4\">Choice 4</option>";
                        }else if(question.answer == question.choices[2]){
                            questionHtml += "<option value=\"1\">Choice 1</option>";
                            questionHtml += "<option value=\"2\">Choice 2</option>";
                            questionHtml += "<option selected=\"selected\" value=\"3\">Choice 3</option>";
                            questionHtml += "<option value=\"4\">Choice 4</option>";
                        }else{
                            questionHtml += "<option value=\"1\">Choice 1</option>";
                            questionHtml += "<option value=\"2\">Choice 2</option>";
                            questionHtml += "<option value=\"3\">Choice 3</option>";
                            questionHtml += "<option selected=\"selected\" value=\"4\">Choice 4</option>";
                        }
                        questionHtml += "</select>";
                    }else if(question.type == "truefalse"){
                        questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"truefalse\">";
                        questionHtml += "<h3>True/False</h3>";
                        
                        questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                        questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\" value='"+question.text+"'>";
                        
                        questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                        questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                        
                        questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
                        questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
                        if(question.answer == "True"){
                            questionHtml += "<option selected=\"selected\">True</option>";
                            questionHtml += "<option>False</option>";
                        }else{
                            questionHtml += "<option>True</option>";
                            questionHtml += "<option selected=\"selected\">False</option>";
                        }
                        questionHtml += "</select>";
                    }else if(question.type == "identify"){
                        questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"identify\">";
                        questionHtml += "<h3>Identification</h3>";
                        
                        questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
                        questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\" value='"+question.text+"'>";
                        
                        questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
                        questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
                        
                        questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer/s: (Separate all possible answers with a comma ex. Answer1,Answer2,Answer3. Capitalization is automatically ignored.)</label>";
                        questionHtml += "<input type=\"text\" id=\"answer-"+questionNumber+"\" name=\"answer-"+questionNumber+"\" placeholder=\"ANSWER\" value='"+question.answer+"' required>";
                    }else{
                        questionHtml = "Invalid question type.";
                    }
                    questionHtml += "</div>";
                    $("#editMockTestForm fieldset").append(questionHtml);
                });

                $(".button").button();
                $("select").selectmenu();
                $("#viewMockTest").fadeOut(100, function(){
                    $("select").selectmenu();
                    $("#editTestTotalItems").spinner({
                        min: 1
                    });
                    $("#editMockTestForm").fadeIn(100);
                });
            }
        });
    });

    // ADD QUESTION IN EDIT MOCK TEST FORM
    var deleteIndexBuffer = [];
    var getDelIndex = false;
    $("#addNewEditTestQuestionBtn").click(function () {
        if(deleteIndexBuffer.length > 0){
            questionNumber = deleteIndexBuffer.shift();
            getDelIndex = true;
        }else{
            questionNumber++;
        }
        var questionHtml = "<div class=\"question\" id='"+questionNumber+"'><button type=\"button\" class='deleteQuestionBtn button' title=\"delete\">DELETE</button>";
        if($("#editTestQuestionType").val() == "Multiple Choice"){
            questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"multiple\">";
            questionHtml += "<h3>Multiple Choice</h3>";

            questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
            questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
            
            questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
            questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
            
            questionHtml += "<label for=\"choice-1-"+questionNumber+"\">Choice 1: </label>";
            questionHtml += "<input type=\"text\" id=\"choice-1-"+questionNumber+"\" name=\"choice-1-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
            
            questionHtml += "<label for=\"choice-2-"+questionNumber+"\">Choice 2: </label>";
            questionHtml += "<input type=\"text\" id=\"choice-2-"+questionNumber+"\" name=\"choice-2-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
            
            questionHtml += "<label for=\"choice-3-"+questionNumber+"\">Choice 3: </label>";
            questionHtml += "<input type=\"text\" id=\"choice-3-"+questionNumber+"\" name=\"choice-3-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
            
            questionHtml += "<label for=\"choice-4-"+questionNumber+"\">Choice 4: </label>";
            questionHtml += "<input type=\"text\" id=\"choice-4-"+questionNumber+"\" name=\"choice-4-"+questionNumber+"\" placeholder=\"CHOICE\" required>";
            
            questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
            questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
            questionHtml += "<option selected=\"selected\" value=\"1\">Choice 1</option>";
            questionHtml += "<option value=\"2\">Choice 2</option>";
            questionHtml += "<option value=\"3\">Choice 3</option>";
            questionHtml += "<option value=\"4\">Choice 4</option>";
            questionHtml += "</select>";
        }else if($("#editTestQuestionType").val() == "True/False"){
            questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"truefalse\">";
            questionHtml += "<h3>True/False</h3>";
            
            questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
            questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
            
            questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
            questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
            
            questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer: </label>";
            questionHtml += "<select name=\"answer-"+questionNumber+"\" id=\"answer-"+questionNumber+"\">";
            questionHtml += "<option selected=\"selected\">True</option>";
            questionHtml += "<option>False</option>";
            questionHtml += "</select>";
        }else if($("#editTestQuestionType").val() == "Identification"){
            questionHtml += "<input type=\"hidden\" id=\"type-"+questionNumber+"\" name=\"type-"+questionNumber+"\" value=\"identify\">";
            questionHtml += "<h3>Identification</h3>";
            
            questionHtml += "<label for=\"question-"+questionNumber+"\">Question: </label>";
            questionHtml += "<input type=\"text\" id=\"question-"+questionNumber+"\" name=\"question-"+questionNumber+"\" placeholder=\"QUESTION\">";
            
            questionHtml += "<label for=\"image-"+questionNumber+"\">Image: </label>";
            questionHtml += "<input type=\"file\" id=\"image-"+questionNumber+"\" name=\"image-"+questionNumber+"\" accept=\"image/*\">";
            
            questionHtml += "<label for=\"answer-"+questionNumber+"\">Answer/s: (Separate all possible answers with a comma ex. Answer1,Answer2,Answer3. Capitalization is automatically ignored.)</label>";
            questionHtml += "<input type=\"text\" id=\"answer-"+questionNumber+"\" name=\"answer-"+questionNumber+"\" placeholder=\"ANSWER\" required>";
        }else{
            questionHtml = "Invalid question type.";
        }
        questionHtml += "</div>";
        $("#editMockTestForm fieldset").append(questionHtml);
        $(".button").button();
        $("select").selectmenu();
        totalQuestions++;
        if(getDelIndex){
            questionNumber = totalQuestions;
        }
        $("#editTestQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
    });

    // EDIT MOCK TEST
    $("#editMockTestForm").on("submit", function(e){
        e.preventDefault();
        var isValid = true;

        var hasQuestion = true;
        for(var x=1;x<=totalQuestions;x++){
            while($.inArray(x.toString(),deleteIndexBuffer) !== -1){
                x++;
                totalQuestions++;
            }
            if(!$("#question-"+x+"").val().trim() && !$("#image-"+x+"").val()){
                hasQuestion = false;
            }
        }

        if(!$.isNumeric($("#editTestTotalItems").val().trim()) || $("#editTestTotalItems").val().trim() < 1){
            isValid = false;
            $("#errorDialog p").append("Total Items must be a positive number.");
        }else if($("#editTestTotalItems").val()>totalQuestions){
            isValid = false;
            $("#errorDialog p").append("Not enough questions for total items.");
        }else if(!hasQuestion){
            isValid = false;
            $("#errorDialog p").append("Question or Image is required.");
        }
        
        if(isValid){
            var formData = new FormData($("#editMockTestForm")[0]);
            formData.append("totalQuestions",totalQuestions);
            formData.append("oldTitle",mockTestToEdit); //----------------------------------------------------------------REMEMBER
            $.ajax({
                type: "post",
                url: "./php/editMockTest.php",
                data: formData,
                processData: false,
                contentType: false, 
                success: function (response) {
                    if(response.trim() == "Mock Test Already Exists!"){
                        $("#errorDialog p").append(response);
                        $("#errorDialog").dialog("open");
                    }else{
                        questionNumber = 0;
                        totalQuestions = 0;
                        deleteIndexBuffer = [];
                        getDelIndex = false;
                        $("#editTestQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
                        $("#editMockTestForm")[0].reset();
                        $(".question").remove();
                        $("#successDialog p").append(response);
                        $("#successDialog").dialog("open");
                        $("#editMockTestForm").fadeOut(100, function(){
                            refreshMockTest();
                            $("#viewMockTest").fadeIn(100);
                        });
                    }
                }
            });
        }else{
            $("#errorDialog").dialog("open");
        }
    });

    // CANCEL EDIT MOCK TEST
    $("#cancelEditMockTestBtn").click(function () { 
        questionNumber = 0;
        totalQuestions = 0;
        deleteIndexBuffer = [];
        getDelIndex = false;
        $("#editTestQuestionDatabank").text("Question Databank: "+totalQuestions+" Questions");
        $("#editMockTestForm")[0].reset();
        $(".question").remove();
        $("#editMockTestForm").fadeOut(100, function(){
            $("#viewMockTest").fadeIn(100);
        });
    });

// REPORTS PAGE ==================================================================================================================================================================

    $("#reportsBtn").click(function () { 
        $(".dateRange").datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: "-150Y",
            maxDate: "+0M +0D +0Y"
        });
        if(activeWindow != "#reportsPage"){
            $( ".checkRadio" ).checkboxradio({
                icon: false
            });
            $("select").selectmenu();
            if(activeWindow == ""){
                activeWindow = "#reportsPage";
                $("#reportsPage").fadeIn(100);
            }else{
                $(activeWindow).fadeOut(100, function(){
                    activeWindow = "#reportsPage";
                    $("#reportsPage").fadeIn(100);
                });
            }
        }
        
    });

    $("#generateReport").click(function () { 
        var reportData = $("#reportData").val(),
        reportFilter = $(".reportFilter:checked").val(),
        startDate = "", endDate="";
        var date = new Date();
        if(reportFilter == "DAY"){
            startDate = $.datepicker.formatDate('mm/dd/yy',date);
            endDate = startDate;
        }else if(reportFilter == "WEEK"){
            startDate = $.datepicker.formatDate('mm/dd/yy',new Date(date.getFullYear(), date.getMonth(), date.getDate() - 3));
            endDate = $.datepicker.formatDate('mm/dd/yy',new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3));
        }else if(reportFilter == "MONTH"){
            startDate = $.datepicker.formatDate('mm/dd/yy',new Date(date.getFullYear(), date.getMonth(), 1));
            endDate = $.datepicker.formatDate('mm/dd/yy',new Date(date.getFullYear(), date.getMonth() + 1, 0));
        }else{
            if($("#startDate").val() == ""){
                $("#errorDialog p").append("Start Date is required.");
                $("#errorDialog").dialog("open");   
            }else if($("#endDate").val() == ""){
                $("#errorDialog p").append("End Date is required.");
                $("#errorDialog").dialog("open");
            }else if($("#startDate").val() > $("#endDate").val()){
                $("#errorDialog p").append("Start Date cannot be greater than End Date.");
                $("#errorDialog").dialog("open");
            }else{
                startDate = $("#startDate").val();
                endDate = $("#endDate").val();
            }
        }

        $.ajax({
            type: "post",
            url: "./php/generateReport.php",
            data: {
                info: reportData,
                start: startDate,
                end: endDate
            },
            beforeSend: function(){
                $("#reportsTable").fadeOut(100);
            },
            success: function (response) {
                $("#reportsTable").html(response);
                $("#reportsTable").fadeIn(100);
            }
        });
    });


// SETTINGS PAGE ==================================================================================================================================================================
    //Populate admin details in profile page
    $("#settingsBtn").click(function () { 
        if(activeWindow != "#settingsPage"){
            //Get profile data via getUserProfile.php AJAX
            $.ajax({
                url: "./php/getUserProfile.php",
                success: function (response) {

                    //Parse JSON response from PHP AJAX
                    const obj = JSON.parse(response);
                    //Display profile data
                    $("#student_profile h2").html(obj.firstName + " " + obj.middleName + " " + obj.lastName);
                    $("#username").html("Username: " + obj.username);
                    $("#email").html("Email: " + obj.email);
                    $(".profile_icon").attr("src", "php/"+obj.image);
                    $("#address").html("Address: " + obj.address);
                    $("#school").html("School: " + obj.school);
                    $("#birthday").html("Birthday: " + obj.birthday);
                    $("#gender").html("Gender: " + obj.gender);
                }
            });

            if(activeWindow == ""){
                activeWindow = "#settingsPage";
                $("#settingsPage").fadeIn(100);
            }else{
                $(activeWindow).fadeOut(100, function(){
                    activeWindow = "#settingsPage";
                    $("#settingsPage").fadeIn(100);
                });
            }
        }
    });

    // EDIT ADMIN PROFILE
    //Transition from Admin Profile to Edit Admin Profile
    $("#toEditProfile").click(function(){
        $("#editBday").datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: "-150Y",
            maxDate: "+0M +0D +0Y"
        });
        $( ".checkRadio" ).checkboxradio({
            icon: false
        });
        $("#admin_profile").fadeOut(250, function(){
            $.ajax({
                url: "./php/getUserProfile.php",
                success: function (response) {

                    //Parse JSON response from getUserProfile.php AJAX
                    const obj = JSON.parse(response);

                    //Populate fields in student_profile_edit form
                    $("#editFname").val(obj.firstName);
                    $("#editMname").val(obj.middleName);
                    $("#editLname").val(obj.lastName);
                    $("#editUname").val(obj.username);
                    $("#editEmail").val(obj.email);
                    $("#editAddress").val(obj.address);
                    $("#editSchool").val(obj.school);
                    $("#editBday").val(obj.birthday);
                    if(obj.gender == "Male"){
                        $("#editMale").prop("checked", true);
                        $("#editFemale").prop("checked", false);
                    }else{
                        $("#editFemale").prop("checked", true);
                        $("#editMale").prop("checked", false);
                    }
                    $(".checkRadio").checkboxradio("refresh");
                }
            });
            $("#admin_profile_edit").fadeIn(250);
        });
    });

     //Transition from Edit Profile to Student's Profile
     $("#cancelBtn").click(function () { 
        $("#admin_profile_edit").fadeOut(250, function(){
            $("#admin_profile").fadeIn(250);
        });
    });

    //Update image on edit profile page to show new uploaded image
    $("#file").change(function (e) {
        $("#editImg").attr("src", URL.createObjectURL(e.target.files[0]));
    });

    //Regex for email validation from https://emailregex.com/
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    //Update profile
    var updateValid = false;
    $("#admin_profile_edit").on('submit', function (e) { 
        e.preventDefault();
        
        //Input Validation
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.avif|\.webp)$/i;
        var filePath = $("#file").val();
        if(!allowedExtensions.exec(filePath) && filePath != ""){
            $("#errorDialog p").append("Invalid file type.");
            $("#file").val("");
            updateValid = false;
        }else if(!$("#editFname").val().trim()){
            $("#errorDialog p").append("First Name is required.");
            updateValid = false;
        }else if(!$("#editLname").val().trim()){
            $("#errorDialog p").append("Last Name is required.");
            updateValid = false;
        }else if(!$("#editUname").val().trim()){
            $("#errorDialog p").append("Username is required.");
            updateValid = false;
        }else if(!$("#editEmail").val().trim()){
            $("#errorDialog p").append("Email Address is required.");
            updateValid = false;
        }else if(!regex.test($("#editEmail").val().trim())){
            $("#errorDialog p").append("Invalid Email Address.");
            updateValid = false;
        }else if(!$("#editBday").val()){
            $("#errorDialog p").append("Birthday is required.");
            updateValid = false;
        }else if(!$("#admin_profile_edit input[name='gender']:checked").val()){
            $("#errorDialog p").append("Gender is required.");
            updateValid = false;
        }else{
            updateValid = true;
        }
        //Display error message if form data are not valid.
        if(!updateValid){
            $("#errorDialog").dialog("open");
        }else{
            //Get Form details
            var updateformData = new FormData(this);

            //Send ajax request to updateUserProfile.php
            $.ajax({
                type: "post",
                url: "./php/updateUserProfile.php",
                data: updateformData,
                contentType: false,
                cache: false,
                processData: false,  
                success: function (updateResponse) {
                    
                    //Parse JSON response from PHP AJAX
                    const updateObj = JSON.parse(updateResponse);
                    
                    //Updating profile text values.
                    $("#admin_profile h2").html(updateObj.fname+" "+updateObj.mname+" "+updateObj.lname);
                    $("#username").html("Username: " + updateObj.uname);
                    $("#email").html("Email: " + updateObj.email);
                    $("#address").html("Address: " + updateObj.home);
                    $("#school").html("School: " + updateObj.school);
                    $("#birthday").html("Birthday: " + updateObj.bday);
                    $("#gender").html("Gender: " + updateObj.gender);
                    $(".profile_icon").attr("src", "php/"+updateObj.image);

                    //Display update success message
                    $("#successDialog p").append(updateObj.message);
                    $("#successDialog").dialog("open");

                    //Transition to student profile
                    $("#admin_profile_edit").fadeOut(250, function(){
                        $(".profile_icon").attr("src", "php/"+updateObj.image);
                        $("#admin_profile").fadeIn(250);
                    });
                }
            });
        }
    });

    //CHANGE PASSWORD

    function changePassword() {
        var valid = true;
        allFields.removeClass( "ui-state-error" );
        
        if(!checkLength( $("#oldPassword"), "Old Password", 5 )) valid = false;
        else if(!checkLength( $("#newPassword"), "New Password", 5 )) valid = false;
        else if($("#newPassword").val().trim() != $("#confPassword").val().trim()){
            errorResponse("New Password and Confirm Password does not match.");
            valid = false;
        }else{
            valid = true;
        }
        
        if ( valid ) {

            var changePassformData = changePasswordForm.serializeArray();
            //Send ajax request to updateUserProfile.php
            $.ajax({
                type: "post",
                url: "./php/updateUserProfile.php",
                data: $.param(changePassformData),
                success: function (changePassResponse) {
                    
                    //Parse JSON response from PHP AJAX
                    const changePassObj = JSON.parse(changePassResponse);

                    //If old password is incorrect
                    if(changePassObj.message == "Wrong Password"){
                        errorResponse(changePassObj.message);

                    //If user data is corrupted, go back to login page to refresh user data
                    }else if(changePassObj.message == "Account Not Found!"){
                        window.location.href="./";
                    
                    //Changed Password Successfully
                    }else{
                        $("#successDialog p").append(changePassObj.message);
                        $("#successDialog").dialog("open");
                        changePasswordDialog.dialog( "close" );
                    }
                }
            });
        }
        return valid;
    }

    var oldPasswordField = $("#oldPassword"),
    newPasswordField = $("#newPassword"),
    confPasswordField = $("#confPassword"),
    changePasswordDialog = $("#pass-dialog-form"),
    changePasswordForm = $("#pass-dialog-form form"),
    allFields = $( [] ).add( oldPasswordField ).add( newPasswordField ).add( confPasswordField ),
    successMessage = $("#updateSuccessMsg");

    changePasswordDialog.dialog({
        autoOpen: false,
        height: "auto",
        width: 400,
        modal: true,
        closeOnEscape: true,
        buttons: {
        "Change Password": changePassword,
        Cancel: function() {
            $(this).dialog( "close" );
        }
        },
        close: function() {
            changePasswordForm[0].reset();
            $(this).dialog( "close" );
            allFields.removeClass( "ui-state-error" );
        }
    });

    $( "#toChangePass" ).click(function() {
        errorMessage = $( "#passErrorMsg" );
        errorMessage.text("All fields required.");
        changePasswordDialog.dialog("open");
    });

    changePasswordForm.on( "submit", function( event ) {
        event.preventDefault();
        changePassword();
    });

    function errorResponse( message ) {
        errorMessage.text( message ).addClass( "ui-state-highlight" );
        errorMessage.delay(1500).removeClass("ui-state-highlight", 1500);
    }

    function checkLength( field, fieldName, min) {
        if ( field.val().length < min ) {
            field.addClass("ui-state-error");
            errorResponse(fieldName + " must be at least " + min + " characters.");
            return false;
        } else {
            return true;
        }
    }

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
    $("#homeBtn").click(function () { 
        $("html").fadeOut(200, function(){
            $("html").css("visibility", "hidden");
            window.location.href="home_page.html";
        });
    });

});