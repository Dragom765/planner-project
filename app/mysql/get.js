module.exports = {
  
/* lgin-user */
  checkUser: function(res, req, con) {
    var email = req.params.email;
    
    con.query("SELECT COUNT(*) AS occur FROM users WHERE email = ?;", email, function(err, count) {
      if(err)
        res.send(err.message);
    
      res.json(count["0"].occur);
      return;
    });
  },
  
/* lgin-pswd-02 */
  checkPswd: function(res, req, con, crypto) {
  /* -01 */
    var pswd = crypto.createHash("md5").update(req.params.pswd).digest("hex");
  /* -02 */
    var email = req.params.email;
    
    con.query("SELECT COUNT(*) AS occur FROM users WHERE email = ? AND pswd = ?;", [email, pswd], function(err, count) {
      if(err)
        res.send(err.message);

      res.json(count["0"].occur);
      return;
    });
  },
  
//made a default week table, just has week day names, and if they're a weekend or weekday
  getWeek: function(res, req, con) {
    con.query("SELECT day, weekday FROM week ORDER BY ordr;", function(err, week) {
      if(err)
        res.send(err.message);
      res.json(week);
      return;
    });
  },

  /* rest-get-01 */
  getDayTasks: function(res, req, con) {
    var email = req.params.email;
    var day = req.params.day;
    
    con.query("SELECT id, title, description FROM tasks WHERE email = ? AND day = ?;", [email, day], function(err, taskDay) {
      if(err)
        res.send(err.message);
      
      res.json(taskDay);
      return;
    });
  },
  
}