/* lgin-user-01 */
function eValidate(user) {
  var email = $("#email");
  user.email = email.val();
  var place = user.email.search("@");
  if(user.email == "" || user.email == undefined || place <= 0) {
// .search() throws -1 if not found, this makes sure '@' isn't missing or first.
    $("#err-login-bar").text("Please enter a valid email address.");
    $("#email").select();
  } else {
    custTitle(user.email);
    $("#err-login-bar").text("");
    
/* lgin-user-02 */
  $.ajax({
    "method": "GET",
    "crossDomain": true,
    "url": "http://localhost:6143/api/login/user/"+user.email,
  /* -01 */
    "success": function(data) {
      if(data == 1) {
        $("#username").hide();
        $("#password").show();
        $("#pswd").select();
      } else {
        $("#username").hide();
        $("#sign-up").show();
        $("#pswd-create").select();
      }
    }
  });
  } 
}

/* lgin-pswd-01 */
var pswdValidate = function(user, tasks) {
  var pswd = $("#pswd").val();
  
  if(pswd == "" && pswd == undefined){
    $("#err-login-bar").text("Please enter your password.");
  } else {
/* lgin-pswd-02 */
    user.pswd = sjcl.hash.sha256.hash(pswd).toString();
    
    $.ajax({
      "method": "GET",
      "crossDomain": true,
      "url": "http://localhost:6143/api/login/pswd/"+user.email+"&"+user.pswd,
      "success": function(data) {
        if(data != 1) {
          $("#err-login-bar").text("Password incorrect. Please try again.");
          $("#pswd").select();
        } else {
          solidifyUser(user, tasks);
          $("#err-login-bar").text("");
        }
      }
    });
  }
}

/* lgin-npwd-01 */
var signupValidate = function(user, tasks) {
  var newPswd = $("#pswd-create").val();
  var check = $("#confirm").val();
  
  if(newPswd == "") {
    $("#err-login-bar").text("Please make sure you have entered a password.");
    $("#pswd-create").select();
  } else if(newPswd != check) {
    $("#err-login-bar").text("Please make sure your passwords match");
    $("#pswd-create").select();
  } else {
    user.pswd = sjcl.hash.sha256.hash(newPswd).toString();
    
/* lgin-npwd-02 */
    $.ajax({
      "method": "POST",
      "crossDomain": true,
      "url": "http://localhost:6143/api/login/create-new",
      "data": {
        "email": user.email,
        "pswd": user.pswd,
        "name": user.name
        },
      "success": function(data) {
        if(data.message != "Success") {
          $("#err-login-bar").text(data.message);
          $("#pswd-create").select();
        } else {
          solidifyUser(user, tasks);
          $("#err-login-bar").text("");
        }
      
      }
    });
  }
}

/* plan-head-02-01 & plan-head-02-02 enabler */
var solidifyUser = function(user, tasks) {
  $.ajax({
    "method": "GET",
    "crossDomain": true,
    "url": "http://localhost:6143/api/solid/"+user.email+"&"+user.pswd,
    "success": function(data) {
      if(typeof data != "number") {
        $("#err-login-bar").text(data+"\nSomething went wrong. Please try again.");
        $("#pswd-create").select();
      } else {
        user.id = data;
        
        saveUser(user);
        
        taskMaster.create.get.start.listWeek(user, tasks);
        $("#err-login-bar").text("");
        $(".top").hide();
        $("#week-scheduler").show();
      }
    }
  });
}

/* plan-head-01 */
var custTitle = function(email) {
  var place = email.search("@");
  var name = email.substring(0, place);
  $("#header").text(name+"'s Task list");
}

//allows backtracking in case of typos/misclicks
var gotoEmail = function() {
  $("#pswd").val("");
  $("#pswd-create").val("");
  $("#confirm").val("");
  
  $("#password").hide();
  $("#sign-up").hide();
  $("#username").show();
  $("#email").select();
}