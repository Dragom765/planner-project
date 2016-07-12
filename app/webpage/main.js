$(document).ready(function () {
  //object for easy manipulation of title, description, and day of week of task
  var task = {
    title: '',
    description: '',
    weekday: 0
  }
  
  //initiation of the webpage's first screen
  $("#password").hide();
  $("#sign-up").hide();
  $("#option-help").hide();
  $("#week-scheduler").hide();
  $("#email").val("");
  $("#pswd").val("");
  
/* lgin-user-01, plan-head-01 */
  $("#log-email").click(eValidate);
  
/* lgin-pswd-01 */
  $("#log-pswd").click(pswdValidate);
  
/* lgin-npwd-01 */
  $("#log-create").click(signupValidate);
  
/* plan-head-02-03 */
  $("#help").click(helpText);
  
  $(".wkday").click(function() { setDay($(this).text(), task); });
});

/* lgin-user-01 */
function eValidate() {
  var email = $("#email");
  if(email.val() == "" || email.val() == undefined) {
    alert("Please enter your email address.");
    custTitle(email.val() );
  } else {
  $(".signin").toggle();
  } 
}

/* lgin-pswd-01 */
var pswdValidate = function() {
  var pswd = $("#pswd").val();
  
  if(pswd != "" && pswd) != undefined){
    $(".top").hide();
    $("#week-scheduler").show();
  } else {
    alert("Please enter your password.");
  }
}

/* lgin-npwd-01 */
var signupValidate = function() {
  var newPswd = $("#pswd-create").val();
  var check = $("#confirm").val();
  
    if(newPswd == "") {
      alert("Please make sure you have entered a password.");
    } else if(newPswd != check) {
      alert("Please make sure your passwords match");
    } else {
      $(".top").hide();
      $("#week-scheduler").show();  
    }
}

/* plan-head-01 */
var custTitle = function(email) {
  $("#header").text(email+"'s Tasklist");
}

/* plan-head-02-03 */
var helpText = function(task) {
  $("#option-help").toggle();
}

var setDay = function(txt, task) {
  $("#wkday-select").text(txt+" ").append("<span class=\"caret\"></span>");
  
  if(txt == "Sunday")
    task.weekday = 7;
  else if(txt == "Monday")
    task.weekday = 1;
  else if(txt == "Tuesday")
    task.weekday = 2;
  else if(txt == "Wednesday")
    task.weekday = 3;
  else if(txt == "Thursday")
    task.weekday = 4;
  else if(txt == "Friday")
    task.weekday = 5;
  else if(txt == "Saturday")
    task.weekday = 6;
  else if(txt == "Day of the week:")
    task.weekday = undefined;
  else 
    alert("Background error. Unable to set day of the week.");
}


