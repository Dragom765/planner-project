$(document).ready(function () {
  //object for easy manipulation of title, description, and day of week of task
  var task = {
    title: '',
    description: '',
    weekday: 0
  }
  
  var tasks = {
    increment: 3,
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
  $("#email").val("").select();
  $("#pswd").val("");
  
/* lgin-user-01, plan-head-01 */
  $("#log-email").click(function() { eValidate(user); });
  
/* lgin-pswd-01 */
  $("#log-pswd").click(function() { pswdValidate(user, tasks); });
  
/* lgin-npwd-01 */
  $("#log-create").click(function() { signupValidate(user, tasks); });
  
/* plan-head-02-03 */
  $("#help").click(helpText);

/* plan-wksl-01-03 */
  $("#schedule").on("click", "button.scroll-up", function() {
    var day = $(this).val();
    var check = tasks[day].offset - tasks.increment;
    
    if(check >= 0) 
      tasks[day].offset -= tasks.increment;
    else if(tasks[day].offset != 0)
      tasks[day].offset = 0;
    
    taskMaster.scrollDayTasks(day, tasks);
});
  
  $("#schedule").on("click", "button.scroll-down", function() {
    var day = $(this).val();
    var check = 10 + tasks[day].offset + tasks.increment;
    
    if(tasks[day].length >= check) 
      tasks[day].offset += tasks.increment;
    else if(tasks[day].length != tasks[day].offset + 10)
      tasks[day].offset = tasks[day].length - 10;
    
    taskMaster.scrollDayTasks(day, tasks);
});
  
  $(".wkday").click(function() { setDay($(this).text(), tasks); });
  
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
      if(data == "not email") {
        alert("Please enter a valid email address.");
        $("#email").select();
      } else if(data == 1) {
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
          taskMaster.taskBoard.listWeek(user, tasks);
          $(".top").hide();
          $("#week-scheduler").show();
        } else {
          alert("Password incorrect. Please try again.");
          $("#pswd").select();
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
    alert("Please make sure you have entered a password.");
    $("#pswd-create").select();
  } else if(newPswd != check) {
    alert("Please make sure your passwords match");
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
        if(data.message == "Success") {
          taskMaster.taskBoard.listWeek(user, tasks);
          $(".top").hide();
          $("#week-scheduler").show();
        } else {
          alert(data.message);
        $("#pswd-create").select();
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

/* plan-wksl-01 */
taskMaster = {
  taskBoard: {
  /* plan-wksl-01-01 */
    listWeek: function(user, tasks) {
      $.ajax({
        "method": "GET",
        "crossDomain": true,
        "url": "http://localhost:6143/api/week",
        "success": function(week) {
          $.each(week, function(i, presday) {
            taskMaster.taskBoard.getDayTasks(user, tasks, presday, i);
          });
        }
      });
    },
    getDayTasks: function(user, tasks, presday, order) {
      $.ajax({
        "method": "GET",
        "crossDomain": true,
        "url": "http://localhost:6143/api/wkday/tasks/"+user.email+"&"+presday.day,
        "success": function(daytasks) {
          var size = daytasks.length;
          if(size % 10 || size == 0) {
            var cap = (Math.floor(size / 10) + 1) * 10;
            for(i = size; i < cap; i++) {
              daytasks[i] = {id: undefined, title: "", description: ""};
            }
          }
          tasks[presday.day] = daytasks;
          tasks[presday.day].offset = 0;
          taskMaster.makeDay(presday.day, presday.weekday, tasks, order);
        }
      });
    }
  },
  /* plan-wksl-01-02 */
  makeDay: function(day, wkday, tasks, order) {
    var schedule = $("#schedule");
    schedule.append("<div class=\"week "+wkday+"\" id=\""+day+"\">"
        + "<div class=\"day\">"+day+"</div>"
        + "<div class=\"list "+day+"\"></div>"
        + "<div class=\"scroll-div\">"
          + "<button type=\"button\" value=\""+day+"\" class=\"scroll-up btn btn-secondary btn-sm\" id=\"scroll-up-"+day+"\">&#x25B2</button>"
          + "<button type=\"button\" value=\""+day+"\" class=\"scroll-down btn btn-secondary btn-sm\" id=\"scroll-down-"+day+"\">&#x25BC</button>"
        + "</div>"
      + "</div>");
    $("#"+day).css('order', order);
    
    var thisDay = $("."+day)
    for(i=0; i < 10; i++) {
      var index = i+tasks[day].offset;
      taskMaster.makeTask(thisDay, day, index);
      taskMaster.fillTask(day, tasks[day][index].title, index);
    }
    setButtons(day, tasks);
  },
  makeTask: function(thisDay, day, index) {
    thisDay.append("<div class=\"task\"><div id=\""+day+"-task"+index+"\"></div></div>");
  },
  fillTask: function(day, title, index) {
    $("#"+day+"-task"+index).text(title);
  },
  /* plan-wksl-01-03 */
  scrollDayTasks: function(day, tasks) {
    var index;
    for(i=0; i < 10; i++) {
      index = i+tasks[day].offset;
      taskMaster.fillTask(day, tasks[day][index].title, i);
    }
  
    setButtons(day, tasks);
  }
}
  /* plan-wksl-01-03 */
var setButtons = function(day, tasks) {
  var down = $("#scroll-down-"+day);
  var up = $("#scroll-up-"+day);
  
  if(tasks[day].length == 10+tasks[day].offset)
    down.prop("disabled", true);
  else
    down.prop("disabled", false);
  
  if(tasks[day].offset == 0)
    up.prop("disabled", true);
  else
    up.prop("disabled", false);
}
/* end */

var setDay = function(txt, tasks) {
  $("#wkday-select").text(txt).append("<span class=\"caret\"></span>");
  
  if(txt == "Day of the week:")
    task.weekday = undefined;
  else 
    tasks.weekday = txt;
}


