var sqlite3 = require('sqlite3').verbose();

//http://www.sqlitetutorial.net/sqlite-nodejs/
//https://codeforgeek.com/2014/07/node-sqlite-tutorial/


var db = new sqlite3.Database('./app/db/project.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.run("CREATE TABLE IF NOT EXISTS users(" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "email varchar(50) NOT NULL," +
    "pswd varchar(50) NOT NULL," +
    "UNIQUE (email));",
    function(err) {
        if (err)
            throw err;
        console.log("Created users if it didn't exist already")
    });

db.run("CREATE TABLE IF NOT EXISTS tasks(" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "user_id int NOT NULL," +
    "day varchar(10) NOT NULL," +
    "title varchar(50) NOT NULL," +
    "description varchar(255) NULL," +
    "FOREIGN KEY (user_id) REFERENCES users (id)" +
    "ON DELETE CASCADE);",
    function(err) {
        if (err)
            throw err;
        console.log("Created tasks if it didn't exist already")
    });

db.run("CREATE TABLE IF NOT EXISTS week(" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "ordr int NOT NULL," +
    "day varchar(10) NOT NULL," +
    "weekday char(10) NOT NULL," +
    "UNIQUE (day));",
    function(err) {
        if (err)
            throw err;
        console.log("Created week if it didn't exist already")

        db.all("SELECT COUNT(*) AS occur FROM week;", function(err, count) {
            if (err)
                throw err;

            if (count["0"].occur != 7) {
                if (count["0"].occur != 0) {
                    db.run("DROP TABLE week;");
                    db.run("CREATE TABLE IF NOT EXISTS week(" +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                        "ordr int NOT NULL," +
                        "day varchar(10) NOT NULL," +
                        "weekday char(10) NOT NULL," +
                        "UNIQUE (day));",
                        function(err) {
                            if (err)
                                throw err;
                            console.log("Week filled incorrectly, deleting and retyring")
                        });
                }

                db.run("INSERT INTO week(id, ordr, day, weekday) VALUES " +
                    "(0,1,'Sunday','weekend'), " +
                    "(1,2,'Monday','weekday'), " +
                    "(2,3,'Tuesday','weekday'), " +
                    "(3,4,'Wednesday','weekday'), " +
                    "(4,5,'Thursday','weekday'), " +
                    "(5,6,'Friday','weekday'), " +
                    "(6,7,'Saturday','weekend');",
                    function(err) {
                        if (err)
                            throw (err);
                        console.log("Filled week if it wasn't properly filled already")
                    });
            }
        });
    });

db.serialize(() => {
    //console.log("Selecting all:")
    db.all("SELECT * FROM week;", (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
    });

    //console.log("Selecting each (better for memory on large queries):")
    db.each("SELECT * FROM week;", (err, row) => {
        if (err) {
            throw err;
        }
        console.log(row);
    });

    //console.log("Selecting the first matching element to the query")
    db.get("SELECT * FROM week;", (err, row) => {
        if (err) {
            throw err;
        }
        console.log(row);
    });
});

/*
    // Directly in the function arguments.
    db.run("UPDATE tbl SET name = ? WHERE id = ?", "bar", 2);

    // As an array.
    db.run("UPDATE tbl SET name = ? WHERE id = ?", [ "bar", 2 ]);

    // As an object with named parameters.
    db.run("UPDATE tbl SET name = $name WHERE id = $id", {
        $id: 2,
        $name: "bar"
    });
    
    // As an object with indexing from the ? elements
    // Note:    ? starts at 1, but arrays map correctly so the 0th element
    //          doesn't need to be empty
    db.run("UPDATE tbl SET name = ?5 WHERE id = ?", {
        1: 2,
        5: "bar"
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
*/

module.exports = db

/*
    Documentation:
    https://github.com/mapbox/node-sqlite3/wiki/API#new-sqlite3databasefilename-mode-callback
*/