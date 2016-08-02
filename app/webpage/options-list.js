//initiation of the webpage's values on webpage refresh
var initiate = function(task, user) {
  //***Some general resets
  task.id = null;
  task.title = '';
  task.description = '';
  task.weekday = '';
  
  user.id = '';
  user.email = '';
  user.pswd = '';
  user.name = '';
  
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
  
  //***Resets to be done if the user has no information saved
    $("#week-scheduler").hide();
    $("#login").show();
    $("#username").show();
}

/* plan-head-02-01 */
var togglePswdChange = function() {
  $("#tools").hide();
  $("#newpswd").show();
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
      "url": "http://localhost:6143/api/user/change/",
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
}

/* plan-head-02-02 */
var action = function(user, task, tasks, initiate) {
  var choice = $("#filler").text().substring(0,6);
  
  if(choice == 'delete') {
   $.ajax({
     "method": "DELETE",
     "crossDomain": true,
     "url": "http://localhost:6143/api/user/change/",
     "data": {
       "id": user.id
     },
     "success": function(data) {
       if(data.message != "User deleted")
         $("#err-msg-bar").text(data);
       else {
        initiate(task, user);
        resetUser();
        tasks = {};
        $("#schedule").empty();
  
        $("#check-user").hide();
        $("#tools").show();
       }
     }
   }); 
  }
  else if(choice == "logout") {
    initiate(task, user);
    resetUser();
    tasks = {};
    $("#schedule").empty();
  
    $("#check-user").hide();
    $("#tools").show();
  } else
    $("#err-msg-bar").text("There seems to be an error. Please refresh the page.");
}

/* plan-head-02-02 */
var negateAction = function() {
  $("#check-user").hide();
  $("#tools").show();
  
  $("#err-msg-bar").text("");
  $("#filler").val("");
}

var helpText = function(task) {
  $("#option-help").toggle();
}

/* enables user cookie usage */
var saveUser = function(user) {
  document.cookie = "emailuser="+user.email;
  document.cookie = "pswduser="+user.pswd;
}

var resetUser = function() {
  document.cookie = "emailuser=; expires=Monday, 18 Dec 12:00:00 UTC;";
  document.cookie = "pswduser=; expires=Monday, 18 Dec 12:00:00 UTC;";
}