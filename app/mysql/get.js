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
  
}