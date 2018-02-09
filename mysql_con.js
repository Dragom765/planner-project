var sqlite3 = require("sqlite3");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var crypto = require("crypto");
var gets = require("./app/db/get.js");
var posts = require("./app/db/post.js");
var deletes = require("./app/db/delete.js");
var puts = require("./app/db/put.js");

// http://www.sqlitetutorial.net/sqlite-nodejs/

/* rest-conn, rest-chek */
var db = require("./app/db/create.js");
/* end */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) { // request, response, next
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, cache-control");
    return next();
});

var port = process.env.PORT || 6143; // set our port

var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests ------------------------------------------
router.use(function(req, res, next) {
    // do logging
    console.log("Server in use");
    next(); // make sure we go to the next routes and don't stop here
});

app.use('/static', express.static(__dirname + '/app/webpage/'));

/* nswb-conn */
// accessing the webpage (GET http://localhost:6143/api) -----------------------
router.get("/", function(req, res) {
    res.sendFile(__dirname + "/app/webpage/homepage.html");
});

/* 
    router.get("/format.css", function(req, res) {
        console.log(__dirname);
        res.sendFile(__dirname + "/app/webpage/format.css");
    });

    router.get("/options-list.js", function(req, res) {
        res.sendFile(__dirname + "/app/webpage/options-list.js");
    });

    router.get("/tasks.js", function(req, res) {
        res.sendFile(__dirname + "/app/webpage/tasks.js");
    });

    router.get("/login.js", function(req, res) {
        res.sendFile(__dirname + "/app/webpage/login.js");
    });

    router.get("/main.js", function(req, res) {
        res.sendFile(__dirname + "/app/webpage/main.js");
    });
*/

/* lgin-user-02 */
// login requests --------------------------------------------------------------
router.route("/login/user/:email")

.get(function(req, res) { // determening if user exists
    gets.checkUser(res, req, db);
});

/* lgin-pswd-02-01, lgin-pswd-02-02 */
router.route("/login/pswd/:email&:pswd") // checking existing user's password

.get(function(req, res) {
    gets.checkPswd(res, req, db, crypto);
});

/* lgin-npwd-02-01, lgin-npwd-02-02 */
router.route("/login/create-new") // making a new user

.post(function(req, res) {
    posts.makeUser(res, req, db, crypto);
});

router.route("/solid/:email&:pswd") // checking existing user's password

.get(function(req, res) {
    gets.solidUser(res, req, db, crypto);
});

/* plan-wksl-01 */
// tasks setup -----------------------------------------------------------------
router.route("/week")

.get(function(req, res) {
    gets.getWeek(res, req, db);
})

router.route("/wkday/tasks/:user_id&:day")
    .get(function(req, res) {
        gets.getDayTasks(res, req, db);
    });

/* plan-tlbr-03 */
// task editing ----------------------------------------------------------------
router.route("/tasks/add")

.post(function(req, res) {
    posts.makeTask(res, req, db);
});

router.route("/tasks/change/:id")

.put(function(req, res) {
    puts.updateTask(res, req, db);
})

.delete(function(req, res) {
    deletes.killTask(res, req, db);
});

/* plan-head-02 */
// edit profile ----------------------------------------------------------------
router.route("/user/change")

.put(function(req, res) {
    puts.newPswd(res, req, db, crypto);
})

.delete(function(req, res) {
    deletes.deleteUser(res, req, db);
});

// -----------------------------------------------------------------------------
app.use("/api", router);

app.listen(port);
console.log("Express server listening on port %d in %s mode. ", port, app.settings.env);