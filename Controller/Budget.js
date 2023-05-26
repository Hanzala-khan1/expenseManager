const moment = require("moment/moment")
const pool = require("../connection/mysql")

module.exports = {
    async createBudget(req, res, next) {
        const { amount, category, consumed } = req.body
        try {
            const created_at = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
            const [result] = await pool.promise().query(
                "INSERT INTO budget (amount , category,consumed,user_id,created_at) Values(?,?,?,?,?) ", [amount, category, consumed, req.user.id, created_at])

            return res.status(200).json({
                status: 200,
                message: "secussfully created new Budget ",
                data: result,
                error: null
            });
        } catch (err) {
            next(err)
        }
    },
    async getBudget(req, res, next) {
        try {

            const user_id = req.params.user_id
            const [result] = await pool.promise().query(
                "SELECT b.*,u.name as username FROM budget as b left join user as u on b.user_id=u.id WHERE user_id=? ",
                [user_id]
            );

            if (result.length == 0) {
                return res.status(200).json({
                    status: 200,
                    message: "Not Budget to show ",
                    data: result,
                    error: "",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "secussfully",
                data: result,
                error: null
            });


        } catch (error) {
            next(error)
        }
    },

    async updateBudget(req, res, next) {
        const { amount, category, consumed } = req.body
        try {
            let setValues = [];
            let query = "UPDATE budget SET ";
            if (req.body.amount) {
                query += "amount=?, ";
                setValues.push(req.body.amount);
            }
            if (req.body.category) {
                query += "category=?, ";
                setValues.push(req.body.category);
            }
            if (req.body.consumed) {
                query += "consumed=?, ";
                setValues.push(req.body.consumed);
            }
            if (setValues.length === 0) {
                return res.status(400).json({ error: "Please send at least one field to update!" });
            }
            query += "updated_at=? WHERE Id=? AND user_id=?";
            setValues.push(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
            setValues.push(req.params.id);
            setValues.push(req.user.id);
            const [rows] = await pool.promise().query(query, setValues);
            if (rows.affectedRows > 0) {
                return res.status(200).json({
                    status: 200,
                    message: "Budget  has been updated.",
                    data: rows,
                    error: null
                });
            } else {
                return res.status(403).json({
                    status: 403,
                    message: "You can update only your profile",
                    data: null,
                    error: null
                });
            }
        } catch (error) {
            next(error)
        };
    },
    async deleteBudget(req, res, next) {
        try {

            const { id } = req.params;
            const user_id = req.user.id
            const [result] = await pool.promise().query(
                "DELETE FROM budget WHERE id=? AND user_id=? ",
                [id, user_id]
            );
            if (result.affectedRows <= 0) {
                return res.status(200).json({
                    status: 200,
                    message: "you can only delete your budget",
                    data: result,
                    error: null
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Budget Deleted secussfully",
                data: result,
                error: null
            });
        } catch (error) {
            next(error)
        }
    }
}