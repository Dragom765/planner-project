$(document).ready(function () {
  //object for easy manipulation of title, description, and day of week of task
  var task = { increment: 3 };
  var tasks = {};
  var user = {};
  
  initiate(task, user);
  
/* lgin-user-01, plan-head-01 */
  $("#log-email").click(function() { eValidate(user); });
  
/* lgin-pswd-01 */
  $("#log-pswd").click(function() { pswdValidate(user, tasks); });
  
/* lgin-npwd-01 */
  $("#log-create").click(function() { signupValidate(user, tasks); });
  
//return to email input from password fields
  $(".email-return").click(gotoEmail);

/* plan-head-02-01 */
  $("#pswd-change").click(togglePswdChange);
  
  $("#cancelChange").click(togglePswdChange);

//logging out
  $("#logout-user").click(function() { userOut(this); });
  
/* plan-head-02-02 */
  $("#end-user").click(function() { userOut(this); });
  
  $("#yes-action").click(function() { action(user, task, tasks, initiate); });
  
//canceling logout/delete user check
  $("#no-action").click(function() { negateAction(); });

/* plan-head-02-01 */
  $("#setPassword").click(function() { changePswd(user); });
  
/* plan-head-02-03 */
  $("#help").click(helpText);

/* plan-wksl-01-03 */
  $("#schedule").on("click", "button.scroll-up", function() { scrollUp(this, tasks, task, taskMaster); });
  
  $("#schedule").on("click", "button.scroll-down", function() { scrollDown(this, tasks, task, taskMaster); });
  
/* plan-wksl-02 */
  $("#schedule").on("click", "div.id", function() { prepInfo(this, tasks, task); });

/* helps enable plan-tlbr-03 */
  $(".wkday").click(function() { setDay($(this).text(), task); });
  
/* plan-tlbr-03 */
  $("#task-add").click(function() { taskMaster.refresh.get.change.createTask(tasks, task, user); });
  
  $("#task-update").click(function() { taskMaster.refresh.get.change.updateTask(task, tasks, user); });
  
  $("#task-delete").click(function() { taskMaster.refresh.get.change.killTask(task, tasks, user); });
/* end */
});