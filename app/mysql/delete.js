module.exports = {
/* plan-tlbr-03 */
  killTask: function(res, req, con) {
    var id = req.params.id;
    
    con.query("DELETE FROM tasks WHERE id = ?", id, function(err) {
      if(err)
        res.send(err.message);
      else
        res.send({ message: "Task deleted" });
    });
  },
  
}