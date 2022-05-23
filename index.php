<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Mandarin E-Learning Website Login Page">
    <title>Learn Mandarin</title>
    <link rel="stylesheet" href="css/login.css" type="text/css" media="screen"><meta http-equiv="Cache-control" content="public">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@800&family=Inter:wght@300&family=Paytone+One&display=swap" rel="stylesheet" media="screen">
    
    <!-- For JQuery 3.6.0 -->
    <script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous" defer></script>
    <script src="js/login.js" defer></script>
  </head>

  <body>
    <div class="container_left">
      <div class="logo">

      </div>

      <!-- Login Form -->
      <div class="form" id="formLogin">

          <div id="loginErrorMsg">Error</div>
          <div id="registerSuccessMsg">Success!</div>
          <input id="username" placeholder="Username or Email" required>
          <input id="password" type="password" name="password" placeholder="Password" required>
          <button id="loginBtn" type="button">login</button>
          <p class="login_option" id="toRegister">Don't have an Account? 
            <a> Register here. </a>
          </p>          
      </div>

      <!-- Registration Form -->
      <div class="form" id="formRegister">
        <form>
            <div id="registerErrorMsg">Error</div>
            <label for="fname"></label>
            <input type="text" id="fname" name="fname" placeholder="Enter First Name"/>
            <input type="text" id="mname" name="mname" placeholder="Enter Middle Name(Optional)"/>
            <input type="text" id="lname" name="lname" placeholder="Enter Last Name"/>
            <input type="text" id="uname" name="uname" placeholder="Enter Username"/>
            <input type="email" id="email" name="email" placeholder="Email Address"/>
            <input type="password" id="pass" name="pass" placeholder="Enter Password"/>
            <input type="password" id="passConf" name="passConf" placeholder="Confirm Password"/>

            <input type="text" id="address" name="home" placeholder="Home Address(Optional)"/>
            <input type="text" id="school" name="school" placeholder="School(Optional)"/>

            <table>
                <tr>
                  <td> <label for="bday">Birthday:</label> </td>
                  <td> <input class="bday_category" id="bday" type="date" name="bday"/> </td>
                </tr>
                <tr> 
                  <td> <label>Gender:</label> </td>						
                </tr>	
                <tr>
                  <td> <input class="gender_category" id="male" type="radio" name="gender" value="Male"> </td>	
                  <td> <label for="male">Male</label> </td>     
                </tr>
                <tr>	    
                  <td> <input class="gender_category" id="female" type="radio" name="gender" value="Female"> </td>
                  <td> <label for="female">Female</label> </td>
                </tr>
              </table>

              <button id="registerBtn" type="button">Register</button>

              <p class="registration_option" id="toLogin">Already have an Account? 
                <a> Login here. </a>
              </p>
        </form>
      </div>
    </div>
    
    <div class="container_right">
      <h1> LOREM IPSUM DOLOR SIT AMET </h1>
      <h2> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </h2>
    </div>
  </body>
</html>