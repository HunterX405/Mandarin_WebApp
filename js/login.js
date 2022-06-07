$(document).ready(function(){
    //Check if user is not logged in
    $.ajax({
        url: "./php/checkuser.php",
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
    $("#formLogin").on('submit', function (e) { 
        e.preventDefault();
        $("#registerSuccessMsg").slideUp(100);
        $("#loginErrorMsg").slideUp(100);

        var loginFormData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "./php/login.php",
            data: loginFormData,
            contentType: false,
            cache: false,
            processData: false,  
            success: function (result){
                console.log(result);
                console.log(result == "Admin");
                if(result.trim() == "Login Success!"){
                    //Reset input values.
                    $("#formLogin")[0].reset();

                    //Hide Login page html to avoid loading login page via link access when already logged in
                    $("html").css("visibility", "hidden");

                    //Redirect to home page.
                    window.location.href="home_page.html";
                }else if(result.trim() == "Admin"){
                    //Reset input values.
                    $("#formLogin")[0].reset();

                    //Hide Login page html to avoid loading login page via link access when already logged in
                    $("html").css("visibility", "hidden");

                    //Redirect to admin page.
                    window.location.href="admin.html";
                }else{
                    //Display error response
                    $("#loginErrorMsg").text(result);
                    $("#loginErrorMsg").slideDown(100);
                }
            }
        });
    });

    //Transition to Register Form.
    $("#toRegister").click(function () { 
        $("#formLogin").fadeOut(500, function(){
            $("#bday").datepicker({
                changeMonth: true,
                changeYear: true,
                minDate: "-150Y",
                maxDate: "+0M +0D +0Y"
            });
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
    $("#formRegister").on("submit", function(e){
        e.preventDefault();
        var registerValid = true;

        if(!regex.test($("#email").val().trim())){
            $("#registerErrorMsg").text("Invalid Email Address.");
            registerValid = false;
        }else if($("#pass").val().trim().length < 5){
            $("#registerErrorMsg").text("Password must be at least 5 characters.");
            registerValid = false;
        }else if($("#passConf").val().trim() != $("#pass").val().trim()){
            $("#registerErrorMsg").text("Password is not the same.");
            registerValid = false;
        }else if(!$("#bday").val()){
            $("#registerErrorMsg").text("Birthday is required.");
            registerValid = false;
        }else{
            registerValid = true;
        }
        if(registerValid == false){
            $("#registerErrorMsg").slideDown(100);
        }else{
            $("#registerErrorMsg").slideUp(100);

            //Get Registration details
            var registerFormData = new FormData(this);
            
            //Send form data to register.php
            $.ajax({
                type: "post",
                url: "./php/register.php",
                data: registerFormData,
                contentType: false,
                cache: false,
                processData: false,  
                success: function (response) {
                    console.log(response);
                    if(response == "Registration Successfull!"){
                        //Reset input values.
                        $("#formRegister")[0].reset();

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