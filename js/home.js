$(document).ready(function(){

    //Redirect user to login page if not yet logged in
    $.ajax({
        url: "./php/checkUser.php",
        success: function (checkResponse) {
            if(checkResponse == "Already Logged In"){
                console.log(checkResponse);
                $("html").css("visibility", "visible");
            }else{
                window.location.href="./";
                console.log(checkResponse);
            }
        }
    });

    //Set active window variable
    var activeWindow = "#homePage";

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

    //Populate user details in profile page
    $("#profileBtn").click(function () { 
        if(activeWindow != "#profilePage"){
            $(activeWindow).fadeOut(500, function(){

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
                $("#profilePage").fadeIn(500);
            });
        }
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
            $(".updateErrorMsg").text("Invalid file type.");
            $("#file").val("");
            updateValid = false;
        }else if(!$("#editFname").val().trim()){
            $(".updateErrorMsg").text("First Name is required.");
            updateValid = false;
        }else if(!$("#editLname").val().trim()){
            $(".updateErrorMsg").text("Last Name is required.");
            updateValid = false;
        }else if(!$("#editUname").val().trim()){
            $(".updateErrorMsg").text("Username is required.");
            updateValid = false;
        }else if(!$("#editEmail").val().trim()){
            $(".updateErrorMsg").text("Email Address is required.");
            updateValid = false;
        }else if(!regex.test($("#editEmail").val().trim())){
            $(".updateErrorMsg").text("Email Address is invalid.");
            updateValid = false;
        }else if(!$("#editBday").val()){
            $(".updateErrorMsg").text("Birthday is required.");
            updateValid = false;
        }else if(!$("#student_profile_edit input[name='gender']:checked").val()){
            $(".updateErrorMsg").text("Gender is required.");
            updateValid = false;
        }else{
            updateValid = true;
        }

        //Display error message if form data are not valid.
        if(updateValid == false){
            $(".updateErrorMsg").slideDown(100);
        }else{
            $(".updateErrorMsg").slideUp(100);

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
                    $("#student_profile h2").html(updateObj.fname+" "+updateObj.mname+" "+updateObj.lname);
                    $("#username").html("Username: " + updateObj.uname);
                    $("#email").html("Email: " + updateObj.email);
                    $("#address").html("Address: " + updateObj.home);
                    $("#school").html("School: " + updateObj.school);
                    $("#birthday").html("Birthday: " + updateObj.bday);
                    $("#gender").html("Gender: " + updateObj.gender);
                    $(".profile_icon").attr("src", "php/"+updateObj.image);

                    //Display update success message
                    $("#updateSuccessMsg").html(updateObj.message);
                    $("#updateSuccessMsg").show(100).delay(5000).slideUp(200);

                    //Transition to student profile
                    $("#student_profile_edit").fadeOut(250, function(){
                        $(".profile_icon").attr("src", "php/"+updateObj.image);
                        $("#student_profile").fadeIn(250);
                    });
                }
            });
        }
    });

    //Transition back to home page.
    $("#homeBtn").click(function () {
        if(activeWindow != "#homePage"){
            $(activeWindow).fadeOut(500, function(){
                activeWindow = "#homePage";
                $("#homePage").fadeIn(500);
            });
        } 
    });

//CHANGE PASSWORD
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
                        successMessage.text(changePassObj.message);
                        successMessage.slideDown(200).delay(5000).slideUp(200);
                        changePasswordDialog.dialog( "close" );
                    }
                }
            });
        }
        return valid;
    }

//DELETE ACCOUNT
    function deleteAccount(){
        $.ajax({
            url: "./php/deleteUser.php",
            success: function (deleteAccountResponse) {
                if(deleteAccountResponse == "Success!"){
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


function getLessons(){
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
}

//VIEW LESSONS
$(".lessonBtn").click(function (e) { 
    e.preventDefault();
    if(activeWindow != "#lessonsPage"){
        getLessons();
        $(activeWindow).fadeOut(500, function(){
            activeWindow = "#lessonsPage";
            $("#lessonsPage").fadeIn(500);
        });
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
                //Destroy user Session
                $.ajax({
                    type: "POST",
                    url: "./php/checkUser.php",
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

    //TEMPORARY!! TO ADMIN PAGE
    $("#settingsBtn").click(function () { 
        window.location.replace("admin.html");
    });

});

