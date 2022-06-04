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
    var activeWindow = "";


//USE JQUERY UI BUTTONS
    $(".button").button();


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
            if(activeWindow == ""){
                activeWindow = "#lessonsPage";
                $("#lessonsPage").show(100);
                $("#sidebar").css("margin-left", "100px");
                $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true; 
            }else{
                $(activeWindow).fadeOut(500, function(){
                    activeWindow = "#lessonsPage";
                    $("#lessonsPage").show(100);
                    $("#sidebar").css("margin-left", "100px");
                    $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                    sidebarState = true; 
                });
            }
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
                    $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                    $("#viewLessons").css("margin-left", "0");
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

                        $("#addTopicForm").fadeOut(500, function(){
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
            errorMessage.text("");
            errorMessage.hide();
            //Display Sidebar
            $("#sidebar").css("margin-left", "100px");
            $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
            sidebarState = true; 
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
            $("#addTopicForm").fadeIn(100);
        });
    })


    //ADD TOPIC
    $("#addTopicForm").submit(function (e) { 
        e.preventDefault();
        if($("#topicTitle").val().trim() == ""){
            $("#errorDialog p").append("Topic Title is Required!");
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

                        $("#addTopicForm").fadeOut(500, function(){
                            //Display Sidebar
                            $("#sidebar").css("margin-left", "100px");
                            $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
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
        $("#addTopicForm").fadeOut(500, function(){
                //Display Sidebar
                $("p.lessonView").removeClass("active");
                $("#sidebar").css("margin-left", "100px");
                $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true; 
                //Reset form values
                $("#addTopicHeader").html("ADD TOPIC");
                $("#lessonsPage form")[0].reset();
                $("#textEditor").val("");
                $(".trumbowyg-editor").html("");
        });        
    });


    //EDIT TOPIC
    //TO ADD TOPIC
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

        $("#viewLessons").fadeOut(500, function(){
            //Reset Tabs
            $( "#tabs" ).fadeOut(100);
            activeLesson = "";
            //Hide Sidebar
            $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
            $("#viewLessons").css("margin-left", "0");
            sidebarState = false;
            $("#editTopicForm").fadeIn(100);
        });
    })


    //EDIT TOPIC
    $("#editTopicForm").submit(function (e) { 
        e.preventDefault();

        //GET OLD TOPIC TITLE
        var active = $("#tabs").tabs('option','active');
        var oldTopicTitle = $("#tabs ul>li a").eq(active).text();

        //Get Form details
        var editTopicFormData = new FormData(this);
        editTopicFormData.append("oldTopicTitle",oldTopicTitle);

        //Send ajax request to addLesson.php
        $.ajax({
            type: "post",
            url: "./php/editTopic.php",
            data: editTopicFormData,
            processData: false,
            contentType: false, 
            success: function (response) {
                
                //Update Lessons List in Sidebar
                refreshSidebar();
                $("#successDialog p").append(response);
                $("#successDialog").dialog("open");

                $("#editTopicForm").fadeOut(500, function(){
                    //Display Sidebar
                    $("#sidebar").css("margin-left", "100px");
                    $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                    sidebarState = true; 
                    //Reset form values
                    $("#editTopicHeader").html("EDIT");
                    $("#lessonsPage form")[0].reset();
                    $("#editTopicContent").val("");
                    $(".trumbowyg-editor").html("");
                });
            }
        });
    });

    //CANCEL EDIT TOPIC
    $("#cancelEditTopicBtn").click(function (e) { 
        e.preventDefault();
        $("#editTopicForm").fadeOut(500, function(){
                //Display Sidebar
                $("p.lessonView").removeClass("active");
                $("#sidebar").css("margin-left", "100px");
                $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
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
                    rowHtml += "<td><button type=\"button\" class='editWordBtn' title=\"edit\"></button><button type=\"button\" class='deleteWordBtn' title=\"delete\"></button></td>";  
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
                $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
                sidebarState = true; 
            }else{
                $(activeWindow).fadeOut(500, function(){
                    activeWindow = "#dictionaryPage";
                    $("#dictionaryPage").show(100);
                    $("#sidebar").css("margin-left", "100px");
                    $("#viewLessons").css("margin-left", "calc(170px + 3vw)");
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
        addWord();
    });

    // DELETE WORD
    var wordToDelete = "";
    var row = "";
    $("#dictionaryTable").on("click",".deleteWordBtn",function () {
        //Get row details
        row = $(this).closest("tr"),
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
                console.log(wordToDelete);

                $.ajax({
                    type: "POST",
                    url: "./php/deleteWord.php",
                    data: "wordDelete="+wordToDelete,
                    beforeSend: function (){
                        //Hide Dictionary Table
                        $("#dictionaryTable").fadeOut(100);
                    },
                    success: function (response) {
                        console.log(wordToDelete);
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

