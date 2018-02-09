var sqlite3 = require('sqlite3').verbose();

//http://www.sqlitetutorial.net/sqlite-nodejs/
//https://codeforgeek.com/2014/07/node-sqlite-tutorial/


var db = new sqlite3.Database('./app/db/project.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

//console.log("Selecting all:")
db.all("SELECT * FROM users;", (err, rows) => {
    if (err) {
        throw err;
    }
    console.log(rows);
});

db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});