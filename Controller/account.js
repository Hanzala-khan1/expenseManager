const moment = require("moment/moment")
const pool = require("../connection/mysql")

module.exports = {
    async createAccount(req, res, next) {
        const { account_name, Amount, icon_tittle } = req.body
        try {
            const created_at = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
            const [result] = await pool.promise().query(
                "INSERT INTO account (user_id,account_name, Amount, icon_tittle,created_at) Values(?,?,?,?,?) ", [req.user.id, account_name, Amount, icon_tittle, created_at])

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
    async getAccount(req, res, next) {
        try {

            const user_id = req.params.user_id
            const [result] = await pool.promise().query(
                "SELECT a.*,u.name as user_name,u.image as userimage FROM Account as a left join user as u on a.user_id=u.id WHERE user_id=? ",
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

    async updateAccount(req, res, next) {
        const { account_name, Amount, icon_tittle } = req.body
        try {
            let setValues = [];
            let query = "UPDATE account SET ";
            if (req.body.account_name) {
                query += "account_name=?, ";
                setValues.push(req.body.account_name);
            }
            if (req.body.Amount) {
                query += "Amount=?, ";
                setValues.push(req.body.Amount);
            }
            if (req.body.icon_tittle) {
                query += "icon_tittle=?, ";
                setValues.push(req.body.icon_tittle);
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
                    message: "Account  has been updated.",
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
    async deleteAccount(req, res, next) {
        try {

            const { id } = req.params;
            const user_id = req.user.id
            const [result] = await pool.promise().query(
                "DELETE FROM account WHERE id=? AND user_id=? ",
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