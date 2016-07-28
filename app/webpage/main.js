$(document).ready(function () {
  //object for easy manipulation of title, description, and day of week of task
  var task = {};
  var tasks = {};
  var user = {};
  
  initiate(task, tasks, user);
  
/* lgin-user-01, plan-head-01 */
  $("#log-email").click(function() { eValidate(user); });
  
/* lgin-pswd-01 */
  $("#log-pswd").click(function() { pswdValidate(user, tasks); });
  
/* lgin-npwd-01 */
  $("#log-create").click(function() { signupValidate(user, tasks); });

/* plan-head-02-01 */
  $("#pswd-change").click(togglePswdChange);
  
  $("#cancelChange").click(togglePswdChange);

/* plan-head-02-01 */
  $("#setPassword").click(function() { changePswd(user); });
  
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
    
    taskMaster.refresh.refreshDayTasks(day, tasks);  // 'refreshes' now that the offset is different
});
  
  $("#schedule").on("click", "button.scroll-down", function() {
    var day = $(this).val();
    var check = 10 + tasks[day].offset + tasks.increment;
    
    if(tasks[day].length >= check) 
      tasks[day].offset += tasks.increment;
    else if(tasks[day].length != tasks[day].offset)
      tasks[day].offset = tasks[day].length - 10;
    
    taskMaster.refresh.refreshDayTasks(day, tasks);  // 'refreshes' now that the offset is different
});
  
/* plan-wksl-02 */
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
  
  $("#task-add").click(function() { taskMaster.refresh.get.change.createTask(tasks, task, user); });
  
  $("#task-update").click(function() { taskMaster.refresh.get.change.updateTask(task, tasks, user); });
  
  $("#task-delete").click(function() { taskMaster.refresh.get.change.killTask(task, tasks, user); });
  
});

var initiate = function(task, tasks, user) {
  task.id = null;
  task.title = '';
  task.description = '';
  task.weekday = '';
  
  tasks.increment = 3,
  
  user.id = '';
  user.email = '';
  user.pswd = '';
  user.name = '';
  
  
  //initiation of the webpage's values on webpage refresh
  $("#password").hide();
  $("#sign-up").hide();
  $("#option-help").hide();
  $("#week-scheduler").hide();
  $("#newpswd").hide();
  $("#email").val("").select();
  $("#pswd").val("");
  $("#title").val("");
  $("#description").val("");
}

/* plan-head-02-01 */
var togglePswdChange = function() {
  $("#tools").toggle();
  $("#newpswd").toggle();
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
      "url": "http://localhost:6143/api/user/newpswd/",
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

/* plan-head-02-03 */
var helpText = function(task) {
  $("#option-help").toggle();
}