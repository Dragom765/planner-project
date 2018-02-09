module.exports = {

    /* lgin-npwd-02 */
    makeUser: function(res, req, db, crypto) {
        /* -01 */
        var pswd = crypto.createHash("md5").update(req.body.pswd).digest("hex");
        /* -02 */
        var email = req.body.email;

        db.run("INSERT INTO users(email, pswd) VALUES (?,?);", [email, pswd], function(err) {
            if (err) {
                if (err.message.substring(0, 12) == "ER_DUP_ENTRY")
                    res.send({ message: "This email seems to have an account already. Please navigate back to the email entry field." });
                else {
                    console.log("making user badly...");
                    console.log(err)
                    res.send(err);
                }
            } else {

                console.log("making user...");
                res.send({ message: "Success" });
            }
            return;
        });
    },

    /* plan-tlbr-03 */
    makeTask: function(res, req, db) {
        var user_id = req.body.user_id;
        var day = req.body.day;
        var title = req.body.title;
        var desc = req.body.description;

        db.run("INSERT INTO tasks(user_id, day, title, description) VALUES (?, ?, ?, ?);", [user_id, day, title, desc], function(err) {
            if (err)
                res.send(err);
            else
                res.send({ message: "Task created" });
            return;
        });
    }
}