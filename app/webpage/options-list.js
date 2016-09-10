//initiation of the webpage's values on webpage refresh
var initiate = function(tasks, task, user, num) {
  //***Some general resets
  task.id = null;
  task.title = '';
  task.description = '';
  task.weekday = '';
  task.position = null;
  
  $("#title").val('');
  $("#description").val('');
  $("#wkday-select").text("Day of the week:").append("<span class=\"caret\"></span>");
  
  $("#password").hide();
  $("#sign-up").hide();
  $("#option-help").hide();
  $("#newpswd").hide();
  $("#check-user").hide();
  $("#email").val("").select();
  $("#pswd").val("");
  $("#title").val("");
  $("#description").val("");
  $("#filler").val("");
  $("#err-msg-bar").text("");
  $("#err-login-bar").text("");
  
  //***Resets to be done based on saved user information
  if(num == 0) {
    $(".top").show();
    $("#login").show();
    $("#username").show();
    resetUser();
    tasks = {};
    $("#schedule").empty();
    $("#week-scheduler").hide();
  
    user.id = '';
    user.email = '';
    user.pswd = '';
  } else
    $("#week-scheduler").show();
}

/* plan-head-02-01 */
var enablePswdChange = function() {
  $("#tools").hide();
  $("#check-user").hide();
  $("#option-help").hide();
  $("#err-msg-bar").text("");
  $("#newpswd").show();
}

var disablePswdChange = function() {
  $("#tools").show();
  $("#check-user").hide();
  $("#option-help").hide();
  $("#err-msg-bar").text("");
  $("#newpswd").hide();
}

/* plan-head-02-01 */
var changePswd = function(user) {
  var old = $("#oldpswd");
  var new1 = $("#new-change");
  var takeback = $("#newconfirm");
  var error = $("#err-msg-bar");
  
  var oldpswd = sjcl.hash.sha256.hash(old.val()).toString();
  var newpswd = sjcl.hash.sha256.hash(new1.val()).toString();
  var check = sjcl.hash.sha256.hash(takeback.val()).toString();
  
  if(newpswd == "" || oldpswd == "" || oldpswd == "") {
    error.text("Please make sure to fill in all subject fields.");
    old.select();
  } else if(newpswd != check) {
    error.text("The new passwords do not match. Please try again.");
    new1.select();
  } else if(oldpswd != user.pswd) {
    error.text("Your previous password is incorrect. Please try again.");
    old.select();
  } else {
    user.pswd = newpswd;
    $.ajax({
      "method": "PUT",
      "crossDomain": true,
      "url": "http://"+window.location.host+"/api/user/change/",
      "data": {
        "id": user.id,
        "newpswd": user.pswd
      },
      "success": function(data) {
        if(data.message != "Password updated")
          error.text("Something went wrong. Please try again.");
        else {
          error.text("");
          old.val("");
          new1.val("");
          takeback.val("");
          $("#newpswd").hide();
          $("#tools").show();
          
          saveUser(user);
        }
      }
    });
  }
}

/* plan-head-02-02 */
var userOut = function(that) {
  var choice = $(that).find("p").text().toLowerCase();
  $("#filler").text(choice);
  
  $("#tools").hide();
  $("#check-user").show();
  $("#option-help").hide();
  $("#newpswd").hide();
}

/* plan-head-02-02 */
var action = function(user, task, tasks, initiate) {
  var choice = $("#filler").text().substring(0,6);
  
  if(choice == 'delete') {
   $.ajax({
     "method": "DELETE",
     "crossDomain": true,
     "url": "http://"+window.location.host+"/api/user/change/",
     "data": {
       "id": user.id
     },
     "success": function(data) {
       if(data.message != "User deleted")
         $("#err-msg-bar").text(data);
       else {
        $("#check-user").hide();
        $("#tools").show();
        initiate(tasks, task, user, 0);
       }
     }
   }); 
  }
  else if(choice == "logout") {
    $("#check-user").hide();
    $("#option-help").hide();
    $("#err-msg-bar").text("");
    $("#tools").show();
    initiate(tasks, task, user, 0);
  } else
    $("#err-msg-bar").text("There seems to be an error. Please refresh the page.");
}

/* plan-head-02-02 */
var negateAction = function() {
  $("#check-user").hide();
  $("#option-help").hide();
  $("#err-msg-bar").text("");
  $("#tools").show();
  
  $("#err-msg-bar").text("");
  $("#filler").val("");
}

var helpText = function(task) {
  $("#option-help").toggle();
}

/* nswb-stay, enables user cookie usage */
var saveUser = function(user) {
  document.cookie = "emailuser="+user.email;
  document.cookie = "pswduser="+user.pswd;
}

var resetUser = function() {
  document.cookie = "emailuser=;expires=Fri, 02 Jan 1970 00:00:01 GMT;";
  document.cookie = "pswduser=;expires=Fri, 02 Jan 1970 00:00:01 GMT;";
}