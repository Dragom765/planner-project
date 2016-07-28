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
    else if(tasks[day].length != tasks[day].offset + 10)
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

//initiation of the webpage's values on webpage load or refresh
var initiate = function(task, tasks, user) {
  task.id = null;
  task.title = '';
  task.description = '';
  task.weekday = '';
  
  tasks.increment = 3;
  
  user.email = '';
  user.pswd = '';
  user.name = '';
  
  
  $("#password").hide();
  $("#sign-up").hide();
  $("#option-help").hide();
  $("#week-scheduler").hide();
  $("#email").val("").select();
  $("#pswd").val("");
  $("#title").val("");
  $("#description").val("");
}

/* plan-head-02-03 */
var helpText = function(task) {
  $("#option-help").toggle();
}