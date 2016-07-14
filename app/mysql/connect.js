var mysql = require("mysql");

/* rest-conn */
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dragom765"
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