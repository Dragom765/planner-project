module.exports = {
/* plan-tlbr-03-01 */
  updateTask: function(res, req, con) {
    var id = req.params.id;
    var email = req.params.email;
    var title = req.body.title;
    var desc = req.body.description;
    
    con.query("UPDATE tasks SET title = ?, description = ? WHERE id = ? AND email = ?", [title, desc, id, email], function(err) {
      if(err)
        res.send(err);
      else
        res.send({ message: "Task updated" });
      return;
    });
  }
}