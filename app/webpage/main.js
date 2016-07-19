$(document).ready(function () {
  //object for easy manipulation of title, description, and day of week of task
  var task = {
    title: '',
    description: '',
    weekday: 0
  };
  
  var user = {
    email: '',
    pswd: '',
    name: ''
  };
  
  
  //initiation of the webpage's first screen
  $("#password").hide();
  $("#sign-up").hide();
  $("#option-help").hide();
  $("#week-scheduler").hide();
  $("#email").val("");
  $("#pswd").val("");
  
/* lgin-user-01, plan-head-01 */
  $("#log-email").click(function() { eValidate(user); });
  
/* lgin-pswd-01 */
  $("#log-pswd").click(function() { pswdValidate(user); });
  
/* lgin-npwd-01 */
  $("#log-create").click(function() { signupValidate(user); });
  
/* plan-head-02-03 */
  $("#help").click(helpText);
  
  $(".wkday").click(function() { setDay($(this).text(), task); });
});

/* lgin-user-01 */
function eValidate(user) {
  var email = $("#email");
  user.email = email.val();
  var place = user.email.search("@");
  if(user.email == "" || user.email == undefined || place <= 0) {
// .search() throws -1 if not found, this makes sure '@' isn't missing or first.
    alert("Please enter your email address.");
  } else {
    user.name = user.email.substring(0,place);
    custTitle(user.name);
/* lgin-user-02 */
  $.ajax({
    "method": "GET",
    "crossDomain": true,
    "url": "http://localhost:6143/api/login/user/"+user.email,
  /* -01 */
    "success": function(data) {
      if(data == "not email")
        alert("Please enter a valid email address.");
      else if(data == 1) {
        $("#username").hide();
        $("#password").show();
      } else {
        $("#username").hide();
        $("#sign-up").show();
  
      }
    }
  });
  } 
}

/* lgin-pswd-01 */
var pswdValidate = function(user) {
  var pswd = $("#pswd").val();
  
  if(pswd == "" && pswd == undefined){
    alert("Please enter your password.");
  } else {
/* lgin-pswd-02 */
    user.pswd = sjcl.hash.sha256.hash(pswd).toString();
    
    $.ajax({
      "method": "GET",
      "crossDomain": true,
      "url": "http://localhost:6143/api/login/pswd/"+user.email+"&"+user.pswd,
      "success": function(data) {
        if(data == 1){
          taskMaster.taskBoard.listWeek(user);
          $(".top").hide();
          $("#week-scheduler").show();
        } else {
          alert("Password incorrect. Please try again.");
        }
      }
    });
  }
}

/* lgin-npwd-01 */
var signupValidate = function(user) {
  var newPswd = $("#pswd-create").val();
  var check = $("#confirm").val();
  
  if(newPswd == "") {
    alert("Please make sure you have entered a password.");
  } else if(newPswd != check) {
    alert("Please make sure your passwords match");
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
        if(data.message == "Success") {
          taskMaster.taskBoard.listWeek(user);
          $(".top").hide();
          $("#week-scheduler").show();
        } else {
          alert(data.message);
        }
      
      }
    });
  }
}

/* plan-head-01 */
var custTitle = function(email) {
  $("#header").text(email+"'s Task list");
}

/* plan-head-02-03 */
var helpText = function(task) {
  $("#option-help").toggle();
}

taskMaster = {
  showTask: function(day, title) {
    $("."+day).append("<div class=\"task\"><div>"+title+"</div></div>");
  },
  showDay: function(day, wkday, tasks, order) {
    $("#schedule").append("<div class=\"week "+wkday+"\" id=\""+day+"\">"
      + "<div class=\"day\">"+day+"</div>"
      + "<div class=\"list "+day+"\"></div>"
      + "</div>");
    $("."+day).css('order', order);
    $.each(tasks, function(i, task, order) {
      taskMaster.showTask(day, task.title);
    });
  },
  taskBoard: {
    listWeek: function(user) {
      $.ajax({
        "method": "GET",
        "crossDomain": true,
        "url": "http://localhost:6143/api/week",
        "success": function(week) {
          $.each(week, function(i, presday) {
            taskMaster.taskBoard.getDayTasks(user, presday, i);
          });
        }
      });
    },
    getDayTasks: function(user, presday, order) {
      $.ajax({
        "method": "GET",
        "crossDomain": true,
        "url": "http://localhost:6143/api/wkday/tasks/"+user.email+"&"+presday.day,
        "success": function(daytasks) {
          var size = daytasks.length;
          if(size < 10) {
            for(i = size; i < 10; i++) {
              daytasks[i] = {id: undefined, title: "", description: ""};
            }
          }
          taskMaster.showDay(presday.day, presday.weekday, daytasks, order);
        }
      });
    }
  }
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


