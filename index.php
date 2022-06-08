<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Mandarin E-Learning Website Login Page">
    <title>Learn Mandarin</title>

    <!-- For JQuery UI 1.12.1 Base Theme -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.min.css" integrity="sha512-okE4owXD0kfXzgVXBzCDIiSSlpXn3tJbNodngsTnIYPJWjuYhtJ+qMoc0+WUwLHeOwns0wm57Ka903FqQKM1sA==" crossorigin="anonymous" media="screen"/>
    
    <link rel="stylesheet" href="css/login.css" type="text/css" media="screen"><meta http-equiv="Cache-control" content="public">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@800&family=Inter:wght@300&family=Paytone+One&display=swap" rel="stylesheet" media="screen">
    
    <!-- For JQuery 3.6.0 -->
    <script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous" defer></script>
    <script src="js/login.js" defer></script>
    <!-- For JQuery UI 1.13.1 -->
    <script src="https://code.jquery.com/ui/1.13.1/jquery-ui.min.js" integrity="sha256-eTyxS0rkjpLEo16uXTS0uVCS4815lc40K2iVpWDvdSY=" crossorigin="anonymous" defer></script>
  </head>

  <body>
    <div class="container_left">
    <div class="logo"> <img id="logo_home" src="css/images/logo_variation1.avif" alt="Sui Academia Logo"> </div>

      <!-- Login Form -->
      <form id="formLogin">
          <div id="loginErrorMsg">Error</div>
          <div id="registerSuccessMsg">Success!</div>
          <input id="username" placeholder="Username or Email" name="username" autocomplete="on" required>
          <input id="password" type="password" name="password" placeholder="Password" autocomplete="on" required>
          <button id="loginBtn" type="submit">login</button>
          <p class="login_option" id="toRegister">Don't have an Account? 
            <em class="link"> Register here. </em>
          </p>          
      </form>

      <!-- Registration Form -->
      <form id="formRegister">
        <div id="registerErrorMsg">Error</div>
        <input type="text" id="fname" name="fname" placeholder="Enter First Name" required/>
        <input type="text" id="mname" name="mname" placeholder="Enter Middle Name(Optional)"/>
        <input type="text" id="lname" name="lname" placeholder="Enter Last Name" required/>
        <input type="text" id="uname" name="uname" placeholder="Enter Username" required/>
        <input type="email" id="email" name="email" placeholder="Email Address" required/>
        <input type="password" id="pass" name="pass" placeholder="Enter Password" autocomplete="on" required/>
        <input type="password" id="passConf" name="passConf" placeholder="Confirm Password" autocomplete="on" required/>

        <input type="text" id="address" name="home" placeholder="Home Address(Optional)"/>
        <input type="text" id="school" name="school" placeholder="School(Optional)"/>

        <table>
            <tr>
              <td> <label for="bday">Birthday:</label> </td>
              <td> <input class="bday_category" id="bday" type="text" name="bday" readonly="readonly" placeholder="mm/dd/yyyy" required/> </td>
            </tr>
            <tr> 
              <td> <label>Gender:</label> </td>						
            </tr>	
            <tr>
              <td> <input class="gender_category" id="male" type="radio" name="gender" value="Male" required> </td>	
              <td> <label for="male">Male</label> </td>     
            </tr>
            <tr>	    
              <td> <input class="gender_category" id="female" type="radio" name="gender" value="Female" required> </td>
              <td> <label for="female">Female</label> </td>
            </tr>
          </table>

          <button id="registerBtn" type="submit">Register</button>

          <p class="registration_option" id="toLogin">Already have an Account? 
            <em class="link"> Login here. </em>
          </p>
      </form>
    </div>
    
    <div class="container_right">
      <h1> WELCOME TO SUI ACADEMIA </h1>
      <h2 id="caption_sub"> Inspired by the Sui Dynasty in China, we provide quality and superior education for everyone. 
        In Sui Academia, you can learn Mandarin with accuracy and precision. We offer bite-sized lessons, detailed assessments, 
        a basic mandarin dictionary, and mock tests based on HSK 1 and 2.
      </h2>
    </div>
  </body>
</html>