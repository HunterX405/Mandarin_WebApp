$(document).ready(function(){
    //Check if user is not logged in
    $.ajax({
        url: "./php/checkUser.php",
        success: function (checkResponse) {
            if(checkResponse == "Not Logged In"){
                $("html").css("visibility", "visible");
            }else{
                window.location.href="home_page.html";
                console.log(checkResponse);
            }
        }
    });

    //Check if Login details are Valid.
    var loginValid = false;
    $("#formLogin").on('submit', function (e) { 
        e.preventDefault();
        $("#registerSuccessMsg").slideUp(100);
        if(!$("#username").val().trim()){
            $("#loginErrorMsg").text("Username or Email is required.");
            loginValid = false;
        }else if(!$("#password").val().trim()){
            $("#loginErrorMsg").text("Password is required.");
            loginValid = false;
        }else{
            loginValid = true;
        }

        if(loginValid == false){
            $("#loginErrorMsg").slideDown(100);
        }else{
            $("#loginErrorMsg").slideUp(100);

            var loginformData = new FormData(this);

            $.ajax({
                type: "POST",
                url: "./php/login.php",
                data: loginformData,
                contentType: false,
                cache: false,
                processData: false,  
                success: function (result){
                    if(result == "Login Success!"){
                       //Reset input values.
                        $("#username").val("");
                        $("#password").val("");

                        //Hide Login page html to avoid loading login page via link access when already logged in
                        $("html").css("visibility", "hidden");

                        //Redirect to home page.
                        window.location.href="home_page.html";
                    }else{
                        $("#loginErrorMsg").text(result);
                        $("#loginErrorMsg").slideDown(100);
                    }
                }
              });
        }
    });

    //Transition to Register Form.
    $("#toRegister").click(function () { 
        $("#formLogin").fadeOut(500, function(){
            $("#formRegister").fadeIn(500);
        });
    });

    //Transition to Login Form.
    $("#toLogin").click(function () { 
        $("#formRegister").fadeOut(500, function(){
            $("#formLogin").fadeIn(500);
        });
    });

    //Regex for email validation from https://emailregex.com/
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    //Check if Registration details are valid.
    var registerValid = false;
    $("#registerBtn").click(function(e){
        if(!$("#fname").val().trim()){
            $("#registerErrorMsg").text("First Name is required.");
            registerValid = false;
        }else if(!$("#lname").val().trim()){
            $("#registerErrorMsg").text("Last Name is required.");
            registerValid = false;
        }else if(!$("#uname").val().trim()){
            $("#registerErrorMsg").text("Username is required.");
            registerValid = false;
        }else if(!$("#email").val().trim()){
            $("#registerErrorMsg").text("Email Address is required.");
            registerValid = false;
        }else if(!regex.test($("#email").val().trim())){
            $("#registerErrorMsg").text("Email Address is invalid.");
            registerValid = false;
        }else if(!$("#pass").val().trim()){
            $("#registerErrorMsg").text("Password is required.");
            registerValid = false;
        }else if($("#passConf").val().trim() != $("#pass").val().trim()){
            $("#registerErrorMsg").text("Password is not the same.");
            registerValid = false;
        }else if(!$("#bday").val()){
            $("#registerErrorMsg").text("Birthday is required.");
            registerValid = false;
        }else if(!$("#male").is(':checked') && !$("#female").is(':checked')){
            $("#registerErrorMsg").text("Gender is required.");
            registerValid = false;
        }else{
            registerValid = true;
        }

        if(registerValid == false){
            e.preventDefault();
            $("#registerErrorMsg").slideDown(100);
        }else{
            $("#registerErrorMsg").slideUp(100);

            //Get Registration details
            var formData = $("#formRegister form").serialize();
            
            //Send form data to register.php
            $.ajax({
                type: "post",
                url: "./php/register.php",
                data: formData,
                contentType: false,
                cache: false,
                processData: false,  
                success: function (response) {
                    console.log(response);
                    if(response == "Registration Successfull!"){
                        //Reset input values.
                        $("#formRegister form")[0].reset();

                        //Show Registration Success message in Login.
                        $("#registerSuccessMsg").text(response);
                        $("#registerSuccessMsg").show(100).delay(5000).slideUp(200);

                        //Hide Login Error to prevent multiple messages.
                        $("#loginErrorMsg").slideUp(100);
                        
                        //Go to Login Page
                        $("#formRegister").fadeOut(500, function(){
                            $("#formLogin").fadeIn(500);
                        });
                    }else{
                        //Show error if user already exists.
                        $("#registerErrorMsg").text(response);
                        $("#registerErrorMsg").slideDown(100);
                    }
                }
            });
        }
    });
});