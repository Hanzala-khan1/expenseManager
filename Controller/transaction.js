const moment = require("moment/moment")
const pool = require("../connection/mysql")

module.exports = {
    async createTransaction(req, res, next) {
        const { amount, date, type, from_account_id, to_account_id, category_id } = req.body
        try {
            const user_id = req.user.id
            const { account_id } = req.params
            const created_at = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
            const [result] = await pool.promise().query(
                "INSERT INTO transaction (user_id,account_id,amount, date, type, from_account_id, to_account_id, category_id,created_at) Values(?,?,?,?,?,?,?,?,?) ", [user_id, account_id, amount, date, type, from_account_id, to_account_id, category_id, created_at])

            return res.status(200).json({
                status: 200,
                message: "secussfully created new Account",
                data: result,
                error: null
            });
        } catch (err) {
            next(err)
        }
    },
    async getTransaction(req, res, next) {
        try {

            const user_id = req.params.user_id
            const [result] = await pool.promise().query(
                `SELECT t.*,u.name as username,u.image as userimage,fa.account_name as from_account_name,ta.account_name as to_account_name,a.account_name as account_name FROM transaction as t  join user as u on t.user_id=u.id 
                join account as a on t.account_id = a.id
                join account as fa on t.from_account_id = fa.id
                join account as ta on t.to_account_id = ta.id
                WHERE t.user_id =?` ,
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

    async updateTransaction(req, res, next) {
        const { amount, date, type, from_account_id, to_account_id, category_id } = req.body
        try {
            let setValues = [];
            let query = "UPDATE transaction SET ";
            if (req.body.amount) {
                query += "amount=?, ";
                setValues.push(req.body.amount);
            }
            if (req.body.date) {
                query += "date=?, ";
                setValues.push(req.body.date);
            }
            if (req.body.from_account_id) {
                query += "from_account_id=?, ";
                setValues.push(req.body.from_account_id);
            }
            if (req.body.to_account_id) {
                query += "to_account_id=?, ";
                setValues.push(req.body.to_account_id);
            }
            if (req.body.category_id) {
                query += "category_id=?, ";
                setValues.push(req.body.category_id);
            }
            if (setValues.length === 0) {
                return res.status(400).json({ error: "Please send at least one field to update!" });
            }
            query += "updated_at=? WHERE id=? AND user_id=?";
            setValues.push(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
            setValues.push(req.params.id);
            setValues.push(req.user.id);
            const [rows] = await pool.promise().query(query, setValues);
            if (rows.affectedRows > 0) {
                return res.status(200).json({
                    status: 200,
                    message: "transaction  has been updated.",
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
    async deleteTransaction(req, res, next) {
        try {

            const { id } = req.params;
            const user_id = req.user.id
            const [result] = await pool.promise().query(
                "DELETE FROM transaction WHERE id=? AND user_id=? ",
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