var mysql = require("mysql");
require("dotenv").config({path: "C:/Users/Ian/Documents/Github/planner-project/mydb.env"});

/* rest-conn */
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

/* rest-chek */
con.query("CREATE DATABASE IF NOT EXISTS plan", function(err) {
  if (err)
    throw err;

  con.query("USE plan", function(err) {
    if(err)
      throw err;
    con.query("CREATE TABLE IF NOT EXISTS users("
      + "id int NOT NULL AUTO_INCREMENT,"
      + "email varchar(50) NOT NULL,"
      + "pswd varchar(50) NOT NULL,"
      + "PRIMARY KEY(id)"
      + ")", function(err) {
        if(err)
          throw err;
      });
  });
});
/* end */

module.exports = con;