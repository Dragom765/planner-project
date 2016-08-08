var mysql = require("mysql");
require("dotenv").config({path: "mydb.env"}); 
//this searches for a file in mysql_con.js's directory since it's called by it, not its own.

/* rest-conn */
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

/* rest-chek */
con.query("CREATE DATABASE IF NOT EXISTS plan;", function(err) {
  if (err)
    throw err;

  con.query("USE plan;", function(err) {
    if(err)
      throw err;
    con.query("CREATE TABLE IF NOT EXISTS users("
      + "id int NOT NULL AUTO_INCREMENT,"
      + "email varchar(50) NOT NULL,"
      + "pswd varchar(50) NOT NULL,"
      + "PRIMARY KEY(id),"
      + "UNIQUE (email));", 
      function(err) {
        if(err)
          throw err;
      });
      
/* rest-tabl */
    con.query("CREATE TABLE IF NOT EXISTS tasks("
      + "id int NOT NULL AUTO_INCREMENT,"
      + "user_id int NOT NULL,"
      + "day varchar(10) NOT NULL,"
      + "title varchar(50) NOT NULL,"
      + "description varchar(255) NULL,"
      + "PRIMARY KEY(id),"
      + "FOREIGN KEY (user_id) REFERENCES users (id)"
      + "ON DELETE CASCADE);",
      function(err) {
        if(err)
          throw err;
      });
      
    con.query("CREATE TABLE IF NOT EXISTS week("
      + "id int NOT NULL,"
      + "ordr int NOT NULL,"
      + "day varchar(10) NOT NULL,"
      + "weekday char(10) NOT NULL,"
      + "UNIQUE (day),"
      + "PRIMARY KEY(id));", 
      function(err) {
        if(err)
          throw err;
      });
    
    con.query("SELECT COUNT(*) AS occur FROM week;", function(err, count) {
      if (err)
        throw err;
      if (count["0"].occur != 7) {
        if (count["0"].occur != 0) {
          con.query("DROP TABLE week;");
          con.query("CREATE TABLE IF NOT EXISTS week("
            + "id int NOT NULL,"
            + "ordr int NOT NULL,"
            + "day varchar(10) NOT NULL,"
            + "weekday char(10) NOT NULL,"
            + "UNIQUE (day),"
            + "PRIMARY KEY(id));",
            function(err) {
              if(err)
                throw err;
            });
        }
          
        con.query("INSERT INTO week(id, ordr, day, weekday) VALUES "
          + "(0,1,'Sunday','weekend'), "
          + "(1,2,'Monday','weekday'), "
          + "(2,3,'Tuesday','weekday'), "
          + "(3,4,'Wednesday','weekday'), "
          + "(4,5,'Thursday','weekday'), "
          + "(5,6,'Friday','weekday'), "
          + "(6,7,'Saturday','weekend');",
          function(err) {
            if(err)
              throw(err);
          });
      }
    });

  });

});
/* end */

module.exports = con;