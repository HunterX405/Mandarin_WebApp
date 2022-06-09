$(document).ready(function(){

    //Redirect user to login page if not yet logged in
    $.ajax({
        url: "./php/checkuser.php",
        success: function (checkResponse) {
            if(checkResponse == "Logged In" || checkResponse == "Admin"){
                if(checkResponse == "Admin"){
                    // To prevent access to edit user page.
                    $("#profileBtn").hide();
                    $("#profilePage").remove();
                    // Add button back to admin page
                    $("#adminBtn").show();
                }else{
                    $("#profileBtn").show();
                    $("#adminBtn").hide();
                }
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

    //Set active window variable
    var activeWindow = "#homePage";

    //Setup Loading Modal
    $body = $("body");
    $(document).on({
        ajaxStart: function() { $body.addClass("loading");},
        ajaxStop: function() { $body.removeClass("loading");}    
    });

    //Hide empty div upon load of document with screen width < 1220px
    if($(window).width() < 1220){
        $(".empty").hide();
    }
    
    //Hide icons upon load of document with screen width < 730px
    if($(window).width() < 730){
        $(".right_image").hide();
    }

    //Hide icons and empty div when screen width gets to small
    $(window).resize(function () { 
        if($(this).width() < 1220){
            $(".empty").hide();
        }else{
            $(".empty").show();
        }
        if($(this).width() < 730){
            $(".right_image").hide();
        }
        else{
            $(".right_image").show();
        }
    });
    
    //Transform buttons to jQuery UI button and radio button.
    $(".btn").button();

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

// VIEW PROFILE PAGE
    //Populate user details in profile page
    $("#profileBtn").click(function () { 
        if(activeWindow != "#profilePage"){
            $(activeWindow).fadeOut(100, function(){

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

                //Transition to profile page.
                activeWindow = "#profilePage";
                $("#profilePage").fadeIn(100);
            });
        }
    });

// EDIT PROFILE
    //Transition of Student's Profile to Edit Profile
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
        $(".updateErrorMsg").slideUp(100);
        $("#student_profile").fadeOut(250, function(){
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
            $("#student_profile_edit").fadeIn(250);
        });
    });

     //Transition from Edit Profile to Student's Profile
     $("#cancelBtn").click(function () { 
        $("#student_profile_edit").fadeOut(250, function(){
            $("#student_profile").fadeIn(250);
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
    $("#student_profile_edit").on('submit', function (e) { 
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
            $("#errorDialog p").append("Email Address is invalid.");
            updateValid = false;
        }else if(!$("#editBday").val()){
            $("#errorDialog p").append("Birthday is required.");
            updateValid = false;
        }else if(!$("#student_profile_edit input[name='gender']:checked").val()){
            $("#errorDialog p").append("Gender is required.");
            updateValid = false;
        }else{
            updateValid = true;
        }

        //Display error message if form data are not valid.
        if(updateValid == false){
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
                    if(updateObj.message == "Account Updated!"){
                        //Updating profile text values.
                        $("#student_profile h2").html(updateObj.fname+" "+updateObj.mname+" "+updateObj.lname);
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
                        $("#student_profile_edit").fadeOut(250, function(){
                            $(".profile_icon").attr("src", "php/"+updateObj.image);
                            $("#student_profile").fadeIn(250);
                        });
                    }else{
                        $("#errorDialog p").append(updateObj.message);
                        $("#errorDialog").dialog("open");
                    }
                }
            });
        }
    });

    //Transition back to home page.
    $("#homeBtn").click(function () {
        if(activeWindow != "#homePage"){
            $(activeWindow).fadeOut(100, function(){
                activeWindow = "#homePage";
                $("#homePage").fadeIn(100);
            });
        } 
    });

//CHANGE PASSWORD

    function changePassword() {
        var valid = true;
        allFields.removeClass( "ui-state-error" );
        
        if(!checkLength( $("#newPassword"), "New Password", 5 )) valid = false;
        else if($("#newPassword").val().trim() != $("#confPassword").val().trim()){
            errorResponse("New Password and Confirm Password does not match.");
            valid = false;
        }else if($("#newPassword").val().trim() == $("#oldPassword").val().trim()){
            errorResponse("Old Password and New Password is the same.");
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
    errorMessage = $( "#passErrorMsg" ),
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

//DELETE ACCOUNT
    function deleteAccount(){
        $.ajax({
            url: "./php/deleteUser.php",
            success: function (deleteAccountResponse) {
                if(deleteAccountResponse == "Account Deleted Successfully!"){
                    window.location.href="./";
                }else{
                    $("#profileError").text(deleteAccountResponse).show(200);
                }
            }
        });
    }

    $( "#delete-dialog-confirm" ).dialog({
    autoOpen: false,
    resizable: false,
    height: "auto",
    width: 450,
    modal: true,
    buttons: {
        "DELETE ACCOUNT": deleteAccount,
        Cancel: function() {
            $( this ).dialog( "close" );
        }
    }
    });

    $("#toDeleteAccount").click(function () { 
        $( "#delete-dialog-confirm" ).dialog("open");
    });

//LESSONS PAGE
    var sidebarState = false;
    $(".lessonBtn").click(function () { 
        if($("#sidebar").html() == ""){
            $.ajax({
                type: "POST",
                url: "./php/getLessons.php",
                data: "data=hometitle",
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
            $(activeWindow).fadeOut(100, function(){
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

    //VIEW LESSON
    var activeLesson = "";
    $("#sidebar").on("click","p.lessonView",function () {
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
                    const responseObj = JSON.parse(response);
                    if(responseObj.topicTitle != ""){
                        console.log(responseObj.topicTitle);
                        responseObj.topicTitle.forEach(function (item) {
                            var topic = toId(item);
                            $("#tabs ul").append("<li><a href=\"#"+topic+"\">"+item+"</a></li>");
                            $("#tabs").append("<div id='"+topic+"'></div>");
                        });
                        $("#"+toId(responseObj.topicTitle[0])).html(responseObj.content);
                    }else{
                        
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
                    $("#sidebar").css("margin-left", "calc(-170px + -3vw)");
                    $("#tabs").css("margin-left", "0");
                    sidebarState = false;
                }
            });
        }
    });

// DICTIONARY PAGE
    function refreshDictionary(filter){
        $("#dictionaryTable").html("<tr><th>Pinyin</th><th>Hanzi</th><th>Definition</th><th>Part of Speech</th><th>Sentence</th></tr>");
        $.ajax({
            type: "post",
            url: "./php/getDictionary.php",
            success: function (response) {
                var rowHtml = "";
                const responseObj = JSON.parse(response);
                responseObj.forEach(element => {
                    if(filter == ""){
                        rowHtml += "<tr>";
                        rowHtml += "<td>"+element.pinyin+"</td>";
                        rowHtml += "<td>"+element.hanzi+"</td>";
                        rowHtml += "<td>"+element.definition+"</td>";
                        rowHtml += "<td>"+element.speech+"</td>";
                        rowHtml += "<td>"+element.sentence+"</td>";
                        rowHtml += "</tr>";
                    }else{
                        filter = filter.toLowerCase();
                        var r = new RegExp("\\b" + filter + "\\b", 'i');
                        word = element.definition.split(', ').join(" ");
                        if(filter == element.pinyin.toLowerCase() || filter == element.hanzi.toLowerCase() || word.toLowerCase().search(r) >= 0 || filter == element.speech.toLowerCase() || element.sentence.toLowerCase().search(r) >= 0 ){
                            rowHtml += "<tr>";
                            rowHtml += "<td>"+element.pinyin+"</td>";
                            rowHtml += "<td>"+element.hanzi+"</td>";
                            rowHtml += "<td>"+element.definition+"</td>";
                            rowHtml += "<td>"+element.speech+"</td>";
                            rowHtml += "<td>"+element.sentence+"</td>";
                            rowHtml += "</tr>";
                        }
                    }
                });
                $("#dictionaryTable").append(rowHtml);
            }
        });
    }

    $(".dictionaryBtn").click(function () { 
        $("#searchText").val("");
        $(".button").button();
    // VIEW WORDS
        if(activeWindow != "#dictionaryPage"){
            refreshDictionary("");
            if(activeWindow == ""){
                activeWindow = "#dictionaryPage";
                $("#dictionaryPage").show(100);
            }else{
                $(activeWindow).fadeOut(100, function(){
                    activeWindow = "#dictionaryPage";
                    $("#dictionaryPage").show(100);
                });
            }
        }
    });

    $("#searchDictionaryBtn").click(function () { 
        var input = $("#searchText").val().trim();
        refreshDictionary(input);
    });

// ASSESSMENT PAGE

    function refreshAssessments(data){
        $("#assessmentTable").html("");
        var rowHtml = "";
        $.ajax({
            type: "post",
            url: "./php/getAssessments.php",
            data: "data=user",
            success: function (response) {
                const responseObj = JSON.parse(response);
                if(data.trim() == "PENDING"){
                    if(responseObj.pending.length==0){
                        rowHtml = "<h2>NO PENDING ASSESSMENTS</h2>";
                    }else{
                        rowHtml += "<tr><th>Assessment Title</th><th>No. of Items</th><th>Action</th></tr>";
                        responseObj.pending.forEach(element => {
                            rowHtml += "<tr>";
                            rowHtml += "<td>"+element.title+"</td>";
                            rowHtml += "<td>"+element.items+"</td>";
                            rowHtml += "<td><button type=\"button\" class='startAssessmentBtn btn'>START ASSESSMENT</button></td>";  
                            rowHtml += "</tr>";
                        });
                    }
                }else{
                    if(responseObj.completed.length==0){
                        rowHtml = "<h2>NO COMPLETED ASSESSMENTS</h2>";
                    }else{
                        rowHtml += "<tr><th>Assessment Title</th><th>Score</th><th>No. of Items</th></tr>";
                        responseObj.completed.forEach(element => {
                            rowHtml += "<tr>";
                            rowHtml += "<td>"+element.title+"</td>";
                            rowHtml += "<td>"+element.score+"</td>";
                            rowHtml += "<td>"+element.items+"</td>";  
                            rowHtml += "</tr>";
                        });
                    }
                }
                $("#assessmentTable").html(rowHtml);
                $(".btn").button();
            }
        });
    }

    // VIEW ASSESSMENTS
    var assessmentActive = false;
    $(".assessmentBtn").click(function () { 
        if(activeWindow != "#assessmentPage"){
            refreshAssessments("PENDING");
            $( ".checkRadio" ).checkboxradio({
                icon: false
            });
            if(activeWindow == ""){
                activeWindow = "#assessmentPage";
                $("#assessmentPage").show(100);
            }else{
                $(activeWindow).fadeOut(100, function(){
                    if(assessmentActive){
                        $("#assessmentForm").hide();
                        $("#viewAssessments").show();
                    }
                    activeWindow = "#assessmentPage";
                    $("#assessmentPage").show(100);
                });
            }
        }
    });

    // UPDATE ASSESSMENT TABLE
    $('input[type=radio][name=assessmentData]').change(function() {
        refreshAssessments(this.value);
    });

    // TO ASSESSMENT FORM
    var assessmentTitle = "";
    $("#assessmentTable").on("click",".startAssessmentBtn", function(e){
        e.preventDefault();
        var row = $(this).closest("tr");
        assessmentTitle = row.find("td:first-child").text();
        $("#assessmentForm fieldset").html("");
        $.ajax({
            type: "post",
            url: "./php/generateAssessment.php",
            data: "title="+assessmentTitle,
            success: function (response) {
                const responseObj = JSON.parse(response);
                responseObj.questions.forEach(question => {
                    qIndex = question.id;
                    var questionHtml = "<div class=\"question\" id='"+qIndex+"'>";
                    questionHtml += "<input type=\"hidden\" id=\"qid-"+qIndex+"\" name=\"qid-"+qIndex+"\" value='"+qIndex+"'>";
                    if(question.image != ""){
                        questionHtml += "<img src='/php/"+question.image+"' alt='Question Image'>";
                    }
                    questionHtml += "<p>Question: "+question.text+"</p>";
                    if(question.type == "multiple"){
                        questionHtml += "<label for='answer1-"+qIndex+"'>"+question.choices[0]+"</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answer1-"+qIndex+"' value='"+question.choices[0]+"' required>";
                        questionHtml += "<label for='answer2-"+qIndex+"'>"+question.choices[1]+"</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answer2-"+qIndex+"' value='"+question.choices[1]+"'>";
                        questionHtml += "<label for='answer3-"+qIndex+"'>"+question.choices[2]+"</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answer3-"+qIndex+"' value='"+question.choices[2]+"'>";
                        questionHtml += "<label for='answer4-"+qIndex+"'>"+question.choices[3]+"</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answer4-"+qIndex+"' value='"+question.choices[3]+"'>";
                    }else if(question.type == "truefalse"){
                        questionHtml += "<label for='answerT-"+qIndex+"'>True</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answerT-"+qIndex+"' value='True' required>";
                        questionHtml += "<label for='answerF-"+qIndex+"'>False</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answerF-"+qIndex+"' value='False'>";
                    }else if(question.type == "identify"){
                        questionHtml += "<label for='answer-"+qIndex+"'>Answer: </label>";
                        questionHtml += "<input type='text' name='answer-"+qIndex+"' id='answer-"+qIndex+"' required>";
                    }
                    $("#assessmentForm fieldset").append(questionHtml);
                    $("input[type='radio']").checkboxradio();
                });

            }
        });
        assessmentActive = true;
        $("#viewAssessments").fadeOut(100, function(){
            $("#assessmentHeader").text(assessmentTitle + " ASSESSMENT");
            $("#assessmentForm").fadeIn(100);
        });
    });

    // SUBMIT ASSESSMENT
    $("#assessmentForm").on("submit",function(e){
        e.preventDefault();
        var formData = new FormData(this);
        formData.append("title",assessmentTitle);
        $.ajax({
            type: "post",
            url: "./php/checkAssessment.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if(response.trim() == "All fields required!"){
                    $("#errorDialog p").append(response);
                    $("#errorDialog").dialog("open");
                }else{
                    refreshAssessments("PENDING");
                    $("#successDialog p").append(response);
                    $("#successDialog").dialog("open");

                    $("#assessmentForm")[0].reset();
                    $("#assessmentForm fieldset").html("");
                    $("#assessmentForm").fadeOut(100, function(){
                        $("#viewAssessments").fadeIn(100);
                    });
                }
            }
        });
    });

    // CANCEL ASSESSMENT
    $("#cancelAssessmentBtn").click(function () {
        $("#assessmentForm")[0].reset();
        $("#assessmentForm fieldset").html("");
        $("#assessmentForm").fadeOut(100, function(){
            $("#viewAssessments").fadeIn(100);
        });
    });


// MOCK TEST PAGE ==================================================================================================================================================================

    function refreshMockTest(data){
        $("#mockTestTable").html("");
        var rowHtml = "";
        $.ajax({
            type: "post",
            url: "./php/getMockTest.php",
            data: "data=user",
            success: function (response) {
                const responseObj = JSON.parse(response);
                if(data.trim() == "PENDING"){
                    if(responseObj.pending.length==0){
                        rowHtml = "<h2>NO PENDING MOCK TEST</h2>";
                    }else{
                        rowHtml += "<tr><th>HSK Level</th><th>No. of Items</th><th>Action</th></tr>";
                        responseObj.pending.forEach(element => {
                            rowHtml += "<tr>";
                            rowHtml += "<td>"+element.title+"</td>";
                            rowHtml += "<td>"+element.items+"</td>";
                            rowHtml += "<td><button type=\"button\" class='startMockTestBtn btn'>START MOCK TEST</button></td>";  
                            rowHtml += "</tr>";
                        });
                    }
                }else{
                    if(responseObj.completed.length==0){
                        rowHtml = "<h2>NO COMPLETED MOCK TEST</h2>";
                    }else{
                        rowHtml += "<tr><th>HSK Level</th><th>Score</th><th>No. of Items</th></tr>";
                        responseObj.completed.forEach(element => {
                            rowHtml += "<tr>";
                            rowHtml += "<td>"+element.title+"</td>";
                            rowHtml += "<td>"+element.score+"</td>";
                            rowHtml += "<td>"+element.items+"</td>";  
                            rowHtml += "</tr>";
                        });
                    }
                }
                $("#mockTestTable").html(rowHtml);
                $(".btn").button();
            }
        });
    }

    // VIEW MOCK TEST
    var testActive = false;
    $(".mockTestBtn").click(function () { 
        if(activeWindow != "#mockTestPage"){
            refreshMockTest("PENDING");
            $( ".checkRadio" ).checkboxradio({
                icon: false
            });
            if(activeWindow == ""){
                activeWindow = "#mockTestPage";
                $("#mockTestPage").show(100);
            }else{
                $(activeWindow).fadeOut(100, function(){
                    if(testActive){
                        $("#mockTestForm").hide();
                        $("#viewMockTest").show();
                    }
                    activeWindow = "#mockTestPage";
                    $("#mockTestPage").show(100);
                });
            }
        }
    });

    // UPDATE ASSESSMENT TABLE
    $('input[type=radio][name=mockTestData]').change(function() {
        refreshMockTest(this.value);
    });

    // TO MOCK TEST FORM
    var mockTestTitle = "";
    var questionArr = [];
    $("#mockTestTable").on("click",".startMockTestBtn", function(e){
        e.preventDefault();
        var row = $(this).closest("tr");
        mockTestTitle = row.find("td:first-child").text();
        $("#mockTestForm fieldset").html("");
        $.ajax({
            type: "post",
            url: "./php/generateMockTest.php",
            data: "title="+mockTestTitle,
            success: function (response) {
                const responseObj = JSON.parse(response);
                responseObj.questions.forEach(question => {
                    qIndex = question.id;
                    questionArr.push(qIndex);
                    var questionHtml = "<div class=\"question\" id='"+qIndex+"'>";
                    questionHtml += "<input type=\"hidden\" id=\"qid-"+qIndex+"\" name=\"qid-"+qIndex+"\" value='"+qIndex+"'>";
                    if(question.image != ""){
                        questionHtml += "<img src='/php/"+question.image+"' alt='Question Image'>";
                    }
                    questionHtml += "<p>Question: "+question.text+"</p>";
                    if(question.type == "multiple"){
                        questionHtml += "<label for='answer1-"+qIndex+"'>"+question.choices[0]+"</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answer1-"+qIndex+"' value='"+question.choices[0]+"' required/>";
                        questionHtml += "<label for='answer2-"+qIndex+"'>"+question.choices[1]+"</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answer2-"+qIndex+"' value='"+question.choices[1]+"'/>";
                        questionHtml += "<label for='answer3-"+qIndex+"'>"+question.choices[2]+"</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answer3-"+qIndex+"' value='"+question.choices[2]+"'/>";
                        questionHtml += "<label for='answer4-"+qIndex+"'>"+question.choices[3]+"</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answer4-"+qIndex+"' value='"+question.choices[3]+"'/>";
                    }else if(question.type == "truefalse"){
                        questionHtml += "<label for='answerT-"+qIndex+"'>True</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answerT-"+qIndex+"' value='True' required/>";
                        questionHtml += "<label for='answerF-"+qIndex+"'>False</label>";
                        questionHtml += "<input type='radio' name='answer-"+qIndex+"' id='answerF-"+qIndex+"' value='False'>";
                    }else if(question.type == "identify"){
                        questionHtml += "<label for='answer-"+qIndex+"'>Answer: </label>";
                        questionHtml += "<input type='text' name='answer-"+qIndex+"' id='answer-"+qIndex+"' required/>";
                    }
                    $("#mockTestForm fieldset").append(questionHtml);
                    $("input[type='radio']").checkboxradio();
                });
            }
        });
        testActive = true;
        $("#viewMockTest").fadeOut(100, function(){
            $("#mockTestHeader").text(mockTestTitle + " MOCK TEST");
            $("#mockTestForm").fadeIn(100);
        });
    });

    // SUBMIT ASSESSMENT
    $("#mockTestForm").on("submit",function(e){
        e.preventDefault();
        var questionLength = $(".question").length;
        // for(var i=1;i<questionLength;i++){
        //     if()
        // }
        var formData = new FormData(this);
        formData.append("title",mockTestTitle);
        $.ajax({
            type: "post",
            url: "./php/checkMockTest.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if(response.trim() == "All fields required!"){
                    $("#errorDialog p").append(response);
                    $("#errorDialog").dialog("open");
                }else{
                    refreshMockTest("PENDING");
                    $("#successDialog p").append(response);
                    $("#successDialog").dialog("open");

                    $("#mockTestForm")[0].reset();
                    $("#mockTestForm fieldset").html("");
                    $("#mockTestForm").fadeOut(100, function(){
                        $("#viewMockTest").fadeIn(100);
                    });
                }
            }
        });
    });

    // CANCEL ASSESSMENT
    $("#cancelMockTestBtn").click(function () {
        $("#mockTestForm")[0].reset();
        $("#mockTestForm fieldset").html("");
        $("#mockTestForm").fadeOut(100, function(){
            $("#viewMockTest").fadeIn(100);
        });
    });

// TO ADMIN PAGE
$("#adminBtn").click(function () { 
    $("html").fadeOut(200, function(){
        $("html").css("visibility", "hidden");
        window.location.href="admin.html";
    });
});

//LOGOUT ===================================================================================================================================================================
    $( "#logout-dialog-confirm" ).dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 450,
        modal: true,
        buttons: {
            Confirm: function(){
                //Destroy user Session
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
});

