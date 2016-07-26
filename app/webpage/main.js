$(document).ready(function () {
  //object for easy manipulation of title, description, and day of week of task
  var task = {
    id: null,
    title: '',
    description: '',
    weekday: ''
  }
  
  var tasks = {
    increment: 3,
  };
  
  var user = {
    email: '',
    pswd: '',
    name: ''
  };
  
  
  //initiation of the webpage's values on webpage refresh
  $("#password").hide();
  $("#sign-up").hide();
  $("#option-help").hide();
  $("#week-scheduler").hide();
  $("#email").val("").select();
  $("#pswd").val("");
  $("#title").val('');
  $("#description").val('');
  
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
    
    taskMaster.refreshDayTasks(day, tasks);
});
  
  $("#schedule").on("click", "button.scroll-down", function() {
    var day = $(this).val();
    var check = 10 + tasks[day].offset + tasks.increment;
    
    if(tasks[day].length >= check) 
      tasks[day].offset += tasks.increment;
    else if(tasks[day].length != tasks[day].offset + 10)
      tasks[day].offset = tasks[day].length - 10;
    
    taskMaster.refreshDayTasks(day, tasks);
});
  
  $("#schedule").on("click", "div.id", function() {
    var label = $(this).attr("id");
    var day = label.slice(0, -6);
    var taskIndex = Number(label.slice(-1)) + tasks[day].offset;
    
    task.id = tasks[day][taskIndex].id;
    task.title = tasks[day][taskIndex].title;
    task.description = tasks[day][taskIndex].description;
    task.weekday = day;
    
    showInfo(day, tasks[day][taskIndex]);
  });
  
  $(".wkday").click(function() { setDay($(this).text(), task); });
  
  $("#task-add").click(function() { createTask(tasks, task, user, taskMaster); });
  
  $("#task-delete").click(function() { killTask(task, tasks, user); });
  
});

/* lgin-user-01 */
function eValidate(user) {
  var email = $("#email");
  user.email = email.val();
  var place = user.email.search("@");
  if(user.email == "" || user.email == undefined || place <= 0) {
// .search() throws -1 if not found, this makes sure '@' isn't missing or first.
    alert("Please enter a valid email address.");
    $("#email").select();
  } else {
    user.name = user.email.substring(0, place);
    custTitle(user.name);
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
    alert("Please enter your password.");
  } else {
/* lgin-pswd-02 */
    user.pswd = sjcl.hash.sha256.hash(pswd).toString();
    
    $.ajax({
      "method": "GET",
      "crossDomain": true,
      "url": "http://localhost:6143/api/login/pswd/"+user.email+"&"+user.pswd,
      "success": function(data) {
        if(data == 1) {
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
            taskMaster.taskBoard.makeDayTasks(user, tasks, presday, i);
          });
        }
      });
    },
    
    makeDayTasks: function(user, tasks, presday, order) {
      $.ajax({
        "method": "GET",
        "crossDomain": true,
        "url": "http://localhost:6143/api/wkday/tasks/"+user.email+"&"+presday.day,
        "success": function(daytasks) {
          var size = daytasks.length;
          if(size % 10 || size == 0) {
            var cap = (Math.floor(size / 10) + 1) * 10;
            for(i = size; i < cap; i++) {
              daytasks[i] = {id: null, title: "", description: ""};
            }
          }
          tasks[presday.day] = daytasks;
          tasks[presday.day].offset = 0;
          taskMaster.makeDay(presday.day, presday.weekday, tasks, order);
        }
      });
    },
    
    refreshDay: function(user, tasks, day) {
      $.ajax({
        "method": "GET",
        "crossDomain": true,
        "url": "http://localhost:6143/api/wkday/tasks/"+user.email+"&"+day,
        "success": function(daytasks) {
          var size = daytasks.length;
          if(size % 10 || size == 0) {
            var cap = (Math.floor(size / 10) + 1) * 10;
            for(i = size; i < cap; i++) {
              daytasks[i] = {id: null, title: "", description: ""};
            }
          }
          tasks[day] = daytasks;
          tasks[day].offset = 0;
          taskMaster.refreshDayTasks(day, tasks);
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
    
    var thisDay = $("."+day);
    var index;
    for(i=0; i < 10; i++) {
      index = i+tasks[day].offset;
      taskMaster.makeTask(thisDay, day, index);
      taskMaster.fillTask(day, tasks[day][index].title, i, tasks[day][index].id);
    }
    setButtons(day, tasks);
  },
  
  makeTask: function(thisDay, day, index) {
    thisDay.append("<div class=\"task\"><div id=\""+day+"-task"+index+"\"></div></div>");
  },
  
  fillTask: function(day, title, index, id) {
    var task = $("#"+day+"-task"+index);
    var hasId = task.hasClass("id");
    
    task.text(title);
    
    if(id != null && hasId == false)
      task.addClass("id");
    else if(id == null && hasId == true)
      task.removeClass("id");
      
  },
  
  /* plan-wksl-01-03 */
  refreshDayTasks: function(day, tasks) {
    var index;
    for(i=0; i < 10; i++) {
      index = i+tasks[day].offset;
      taskMaster.fillTask(day, tasks[day][index].title, i, tasks[day][index].id);
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

var setDay = function(txt, task) {
  $("#wkday-select").text(txt).append("<span class=\"caret\"></span>");
  
  if(txt == "Day of the week:")
    task.weekday = '';
  else 
    task.weekday = txt;
}

var createTask = function(tasks, task, user, taskMaster) {
  task.title = $("#title").val();
  task.description = $("#description").val();
  
  if(task.title == "")
    alert("Please give the task a title");
  else if(task.weekday == "")
    alert("Please choose a day of the week");
  else
    $.ajax({
      "method": "POST",
      "crossDomain": true,
      "url": "http://localhost:6143/api/tasks/add/",
      "data": {
        "email": user.email,
        "day": task.weekday,
        "title": task.title,
        "description": task.description
      },
      "success": function(data) {
        if(data.message != "Task created")
          alert(data.message);
        else {
          taskMaster.taskBoard.refreshDay(user, tasks, task.weekday);
          
          // resetting the fields against accidental miss-clicking
          $("#title").val('');
          $("#description").val('');
          $("#wkday-select").text("Day of the week:").append("<span class=\"caret\"></span>");
          task.weekday = '';
        }
      }
  });
}

var killTask = function(task, tasks, user) {
  var titleBox = $("#title").val();
  var descBox = $("#description").val();
  var wkdaySelect = $("#wkday-select").text();
  
  if(task.id == null || task.title == '' || task.description == '' || task.weekday == '')
    alert("Please select a task before deletion");
  else {
    if(task.title != titleBox || task.description != descBox || task.weekday != wkdaySelect)
      alert("Task information has been edited. Please refresh task information to delete.");
    else {
      $.ajax({
        "method": "DELETE",
        "crossDomain": true,
        "url": "http://localhost:6143/api/tasks/delete/"+task.id+"&"+user.email,
        "success": function(data) {
          if(data.message != "Task deleted")
            alert(data.message+" yoo-hoo");
          else {
            taskMaster.taskBoard.refreshDay(user, tasks, task.weekday);
            
            task.id = null;
            task.title = '';
            task.description = '';
            task.weekday = '';
          }
        }
      });
    }
  } 
    
}

var showInfo = function(day, chosenTask) {
  $("#title").val(chosenTask.title);
  $("#description").val(chosenTask.description);
  $("#wkday-select").text(day).append("<span class=\"caret\"></span>");
}