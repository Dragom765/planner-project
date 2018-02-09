module.exports = {
    /* plan-tlbr-03 */
    killTask: function(res, req, db) {
        var id = req.params.id;

        db.run("DELETE FROM tasks WHERE id = ?", id, (err) => {
            if (err)
                res.send(err.message);
            else
                res.send({ message: "Task deleted" });
            return;
        });
    },

    deleteUser: function(res, req, db) {
        var id = req.body.id;

        db.run("DELETE FROM users WHERE id = ?", id, (err) => {
            if (err) {
                res.send(err.message);
            } else
                res.send({ message: "User deleted" });
            return;
        });
    }
}