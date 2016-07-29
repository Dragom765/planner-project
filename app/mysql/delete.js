module.exports = {
/* plan-tlbr-03 */
  killTask: function(res, req, con) {
    var id = req.params.id;
    
    con.query("DELETE FROM tasks WHERE id = ?", id, function(err) {
      if(err)
        res.send(err.message);
      else
        res.send({ message: "Task deleted" });
      return;
    });
  },
  
  deleteUser: function(res, req, con) {
    var id = req.body.id;
    
    con.query("DELETE FROM users WHERE id = ?", id, function(err) {
      if(err) {
        res.send(err.message);
      } else
        res.send({ message: "User deleted" });
      return;
    });
  }
  
}