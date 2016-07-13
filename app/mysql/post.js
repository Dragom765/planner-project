module.exports = {

/* lgin-user */
  checkUser: function(res, req, con) {
    
    var email = req.body.email;
    
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
    var pswd = crypto.createHash("md5").update(req.body.pswd).digest("hex");
  /* -02 */
    var email = req.body.email;
    
    con.query("SELECT COUNT(*) AS occur FROM users WHERE pswd = ? AND email = ?;", [pswd, email], function(err, count) {
      if(err)
        res.send(err.message);

      res.json(count["0"].occur);
      return;
    });
  },
  
/* lgin-npwd-02 */
  makeUser: function(res, req, con, crypto) {
  /* -01 */
    var pswd = crypto.createHash("md5").update(req.body.pswd).digest("hex");
  /* -02 */
    var email = req.body.email;
    
    con.query("INSERT INTO users(email, pswd) VALUES (?,?);", [email, pswd], function(err) {
      if(err)
        res.send(err.message);
      else
        res.json({ message: "Success" });
    });
    
  }
  
}