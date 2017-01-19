module.exports = {

/* lgin-npwd-02 */
  makeUser: function(res, req, con, crypto) {
  /* -01 */
    var pswd = crypto.createHash("md5").update(req.body.pswd).digest("hex");
  /* -02 */
    var email = req.body.email;
    
    con.query("INSERT INTO users(email, pswd) VALUES (?,?);", [email, pswd], function(err) {
      if(err) {
        if(err.message.substring(0,12) == "ER_DUP_ENTRY")
          res.send({ message: "This email seems to have an account already. Please navigate back to the email entry field." });
        else
          res.send(err);
      } else
        res.send({ message: "Success"});
      return;
    });
  },
  
/* plan-tlbr-03 */
  makeTask: function(res, req, con) {
    var user_id = req.body.user_id;
    var day = req.body.day;
    var title = req.body.title;
    var desc = req.body.description;
    
    con.query("INSERT INTO tasks(user_id, day, title, description) VALUES (?, ?, ?, ?);", [user_id, day, title, desc], function(err) {
      if(err)
        res.send(err);
      else
        res.send({ message: "Task created"});
      return;
    });
  }
  
}