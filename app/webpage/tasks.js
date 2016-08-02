/* plan-tlbr-02-01 */
var setDay = function(txt, task) {
  $("#wkday-select").text(txt+" ").append("<span class=\"caret\"></span>");
  
  if(txt == "Day of the week: ")
    task.weekday = '';
  else 
    task.weekday = txt;
}

/* plan-wksl-02 */
var showInfo = function(day, chosenTask) {
  $("#title").val(chosenTask.title);
  $("#description").val(chosenTask.description);
  $("#wkday-select").text(day).append("<span class=\"caret\"></span>");
}

/* plan-wksl-01-03 */
var scrollUp = function(that, tasks, task) {
  var day = $(that).val();
  var check = tasks[day].offset - task.increment;
  
  if(check >= 0) 
    tasks[day].offset -= task.increment;
  else if(tasks[day].offset != 0)
    tasks[day].offset = 0;
  
  taskMaster.refresh.refreshDayTasks(day, tasks);  // 'refreshes' now that the offset is different
}

var scrollDown = function(that, tasks, task, taskMaster) {
  var day = $(that).val();
  var check = 10 + tasks[day].offset + task.increment;
  
  if(tasks[day].length >= check) 
    tasks[day].offset += task.increment;
  else if(tasks[day].length != tasks[day].offset)
    tasks[day].offset = tasks[day].length - 10;
  
  taskMaster.refresh.refreshDayTasks(day, tasks);  // 'refreshes' now that the offset is different
}

/* plan-wksl-02 */
var prepInfo = function(that, tasks, task, taskMaster) {
    var label = $(that).attr("id");
    var day = label.slice(0, -6);
    var taskIndex = Number(label.slice(-1)) + tasks[day].offset;
    
    task.id = tasks[day][taskIndex].id;
    task.title = tasks[day][taskIndex].title;
    task.description = tasks[day][taskIndex].description;
    task.weekday = day;
    
    showInfo(day, tasks[day][taskIndex]);
}

var taskMaster = {
  create: {
    get: {
      start: {
        /* plan-wksl-01-01 */
        listWeek: function(user, tasks) {
          $.ajax({
            "method": "GET",
            "crossDomain": true,
            "url": "http://localhost:6143/api/week",
            "success": function(week) {
              $.each(week, function(i, presday) {
                taskMaster.create.get.makeDayTasks(user, tasks, presday, i);
              });
            }
          });
        }
      },
      
      /* plan-wksl-01-01 */
      makeDayTasks: function(user, tasks, presday, order) {
        $.ajax({
          "method": "GET",
          "crossDomain": true,
          "url": "http://localhost:6143/api/wkday/tasks/"+user.id+"&"+presday.day,
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
            taskMaster.create.makeDay(presday.day, presday.weekday, tasks, order);
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
        taskMaster.tasks.makeTask(thisDay, day, index);
        taskMaster.tasks.fillTask(day, tasks[day][index].title, i, tasks[day][index].id);
      }
      
      taskMaster.setButtons(day, tasks);
    }
  },
  
  refresh: {
    get: {
      change: {
        /* plan-tlbr-03 */
        createTask:function(tasks, task, user) {
          task.title = $("#title").val();
          task.description = $("#description").val();
  
          if(task.title == "")
            $("#err-msg-bar").text("Please give the task a title");
          else if(task.weekday == "")
            $("#err-msg-bar").text("Please choose a day of the week");
          else {
            $.ajax({
              "method": "POST",
              "crossDomain": true,
              "url": "http://localhost:6143/api/tasks/add",
              "data": {
                "user_id": user.id,
                "day": task.weekday,
                "title": task.title,
                "description": task.description
              },
              "success": function(data) {
                if(data.message != "Task created")
                  $("#err-msg-bar").text(data.message);
                else {
                  taskMaster.refresh.get.refreshDay(user, tasks, task.weekday);
          
                  // resetting the fields against accidental miss-clicking
                  task.id = null;
                  task.title = '';
                  task.description = '';
                  task.weekday = '';
                    
                  $("#title").val('');
                  $("#description").val('');
                  $("#wkday-select").text("Day of the week:").append("<span class=\"caret\"></span>");
                  $("#err-msg-bar").text("");
                }
              }
            });
          }
        },
        
        /* plan-tlbr-03 */ 
        updateTask: function(task, tasks, user) {
          var titleBox = $("#title").val();
          var descBox = $("#description").val();
          
          if(task.id == null || task.title == '' || task.weekday == '')
            $("#err-msg-bar").text("Please make sure an existing task is selected, and a title is present");
          else {
            if(task.title == titleBox && task.description == descBox)
              $("#err-msg-bar").text("Change the title or the description of the task; you cannot change the weekday of a task as of yet.");
            else if(titleBox == "")
              $("#err-msg-bar").text("You must add some kind of title before you continue.");
            else {
              $.ajax({
                "method": "PUT",
                "crossDomain": true,
                "url": "http://localhost:6143/api/tasks/change/"+task.id,
                "data": {
                  "title": titleBox,
                  "description": descBox
                },
                "success": function(data) {
                  if(data.message != "Task updated")
                    $("#err-msg-bar").text(data.message);
                  else {
                    taskMaster.refresh.get.refreshDay(user, tasks, task.weekday);
                    $("#err-msg-bar").text("");
                  }
                }
              });
            }
          }
        },
        
        /* plan-tlbr-03 */
        killTask: function(task, tasks, user) {
          var titleBox = $("#title").val();
          var descBox = $("#description").val();
          var wkdaySelect = $("#wkday-select").text();
  
          if(task.id == null || task.title == '' || task.weekday == '')
            $("#err-msg-bar").text("Please select a task before deletion");
          else {
            if(task.title != titleBox || task.description != descBox || task.weekday != wkdaySelect)
              $("#err-msg-bar").text("Task information has been edited. Please refresh task information to delete.");
            else {
              $.ajax({
                "method": "DELETE",
                "crossDomain": true,
                "url": "http://localhost:6143/api/tasks/change/"+task.id,
                "success": function(data) {
                  if(data.message != "Task deleted")
                    $("#err-msg-bar").text(data.message);
                  else {
                    taskMaster.refresh.get.refreshDay(user, tasks, task.weekday);

                  // resetting the fields against accidental miss-clicking
                    task.id = null;
                    task.title = '';
                    task.description = '';
                    task.weekday = '';
                    
                    $("#title").val('');
                    $("#description").val('');
                    $("#wkday-select").text("Day of the week:").append("<span class=\"caret\"></span>");
                    $("#err-msg-bar").text("");
                  }
                }
              });
            }
          } 
        }
      },
      
      /* plan-tlbr-03-01 */
      refreshDay: function(user, tasks, day) {
        $.ajax({
          "method": "GET",
          "crossDomain": true,
          "url": "http://localhost:6143/api/wkday/tasks/"+user.id+"&"+day,
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
            taskMaster.refresh.refreshDayTasks(day, tasks);
          }
        });
      }
    },
    
    /* plan-wksl-01-02, plan-wksl-01-03 */
    refreshDayTasks: function(day, tasks) {
      var index;
      for(i=0; i < 10; i++) {
        index = i+tasks[day].offset;
        taskMaster.tasks.fillTask(day, tasks[day][index].title, i, tasks[day][index].id);
      }
  
      taskMaster.setButtons(day, tasks);
    }
  },
  
  tasks: {
    /* plan-wksl-01-02 */
    makeTask: function(thisDay, day, index) {
      thisDay.append("<div class=\"task\"><div id=\""+day+"-task"+index+"\"></div></div>");
    },
    
    /* plan-wksl-01-02 */
    fillTask: function(day, title, index, id) {
      var task = $("#"+day+"-task"+index);
      var hasId = task.hasClass("id");
    
      task.text(title);
    
      if(id != null && hasId == false)
        task.addClass("id");
      else if(id == null && hasId == true)
        task.removeClass("id");
      
    }
  },
  
  /* plan-wksl-01-03 */
  setButtons: function(day, tasks) {
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
}