module.exports = {

/* lgin-user */
  checkUser: function(res, req, con) {
    
    var email = req.body.email;
    var valid = email.search("@"); //returns index position of @ symbol, or -1 if not present
    
    if(valid <= 0) { //if there's no @ symbol, or it's the first character
      res.json("not email");
      throw err;
    } else {
      con.query("SELECT COUNT(*) AS occur FROM users WHERE email = ?;", email, function(err, count) {
        if(err)
          res.send(err.message);
      
        res.json(count["0"].occur);
        return;
      });
    }
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
  /* end */
    var email = req.body.email;
    var name = req.body.name;
    
  /* -02 */
    con.query("INSERT INTO users(email, pswd) VALUES (?,?);", [email, pswd], function(err) {
      if(err)
        res.send(err.message);
    });
    
  /* -03 */
    con.query("CREATE TABLE IF NOT EXISTS "+name+"("
      + "id int NOT NULL AUTO_INCREMENT,"
      + "title varchar(50) NOT NULL,"
      + "description varchar(255) NULL,"
      + "PRIMARY KEY(id)"
      + ")", function(err) {
        if(err) {
          res.json(err);
          throw err.message;
        } else
          res.json({ message: "Success" });
      }
    );
    
  }
  
}