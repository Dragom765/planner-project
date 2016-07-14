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
    
    con.query("SELECT COUNT(*) AS occur FROM users WHERE email = ? AND pswd = ?;", [email, pswd], function(err, count) {
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
  /* end */
    var email = req.body.email;
    
  /* -02 */
    con.query("INSERT INTO users(email, pswd) VALUES (?,?);", [email, pswd], function(err) {
      if(err) {
        if(err.message.substring(0,12) == "ER_DUP_ENTRY")
          res.send({ message: "This email seems to have an account already. Please navigate back to the email entry field." });
        else
          res.send(err);
      } else
        res.send({ message: "Success"})
    });
  }
  
}