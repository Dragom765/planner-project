//initiation of the webpage's values on webpage refresh
var initiate = function(task, user) {
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
  $("#week-scheduler").hide();
  $("#newpswd").hide();
  $("#check-user").hide();
  $("#login").show();
  $("#username").show();
  $("#email").val("").select();
  $("#pswd").val("");
  $("#title").val("");
  $("#description").val("");
  $("#filler").val("");
  $("#err-pswd-change").text("");
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
  var error = $("#err-pswd-change");
  
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
    $.ajax({
      "method": "PUT",
      "crossDomain": true,
      "url": "http://localhost:6143/api/user/change/",
      "data": {
        "id": user.id,
        "newpswd": newpswd
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
         $("#err-pswd-change").text(data);
       else {
        initiate(task, user);
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
    tasks = {};
    $("#schedule").empty();
  
    $("#check-user").hide();
    $("#tools").show();
  } else
    $("#err-pswd-change").text("There seems to be an error. Please refresh the page.");
}

/* plan-head-02-02 */
var negateAction = function() {
  $("#check-user").hide();
  $("#tools").show();
  
  $("#err-pswd-change").text("");
  $("#filler").val("");
}

var helpText = function(task) {
  $("#option-help").toggle();
}