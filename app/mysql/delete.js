module.exports = {
/* plan-tlbr-03 */
  killTask: function(res, req, con) {
    var id = req.params.id;
    var email = req.params.email;
    
    con.query("DELETE FROM tasks WHERE id = ? AND email = ?", [id, email], function(err) {
      if(err)
        res.send(err.message);
      else
        res.send({ message: "Task deleted" });
    });
  },
  
}