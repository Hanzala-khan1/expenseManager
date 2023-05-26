const pool = require("../connection/mysql")

module.exports = {

    async getProfile(req, res, next) {
        try {
            const user_id = req.params.user_id;
            const [result] = await pool.promise().query(
                "SELECT profile.*, JSON_OBJECT('code', c.code, 'name', c.name, 'name_plural', c.name_plural,'decimalDigits', c.decimalDigits, 'rounding', c.rounding,'symbol',c.symbol,'symbol_native',c.symbol_native,'created_at',c.created_at,'updated_at',c.updated_at) AS currency_types, user.name AS user_name FROM profile JOIN currencytype AS c ON profile.currencyTypeId = c.id JOIN user ON profile.user_id = user.id WHERE profile.user_id = ?",
                [user_id]
            );


            const parsedResult = {
                ...result[0],
                currency_types: JSON.parse(result[0].currency_types)
            };

            return res.status(200).json({
                status: 200,
                message: "Successfully fetched profile",
                data: parsedResult,
                error: null
            });
        } catch (error) {
            next(error);
        }
    },


    async updateProfile(req, res, next) {
        const { feedbackStatus, lockStatus, securityPin, seenSecreen, Name } = req.body
        try {
            let setValues = [];
            let query = "UPDATE profile SET ";
            if (req.body.feedbackStatus) {
                query += "feedbackStatus=?, ";
                setValues.push(req.body.feedbackStatus);
            }
            if (req.body.lockStatus) {
                query += "lockStatus=?, ";
                setValues.push(req.body.lockStatus);
            }
            if (req.body.securityPin) {
                query += "securityPin=?, ";
                setValues.push(req.body.securityPin);
            }
            if (req.body.seenSecreen) {
                query += "seenSecreen=?, ";
                setValues.push(req.body.seenSecreen);
            }
            if (req.body.Name) {
                query += "Name=?, ";
                setValues.push(req.body.Name);
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
                    message: "Currency  has been updated.",
                    data: rows,
                    error: null
                });
            } else {
                return res.status(403).json({
                    status: 403,
                    message: "You can update only your category",
                    data: null,
                    error: null
                });
            }
        } catch (error) {
            next(error)
        };
    },
    async deleteProfile(req, res, next) {
        try {
            const { user_id, id } = req.params
            const [result] = await pool.promise().query(
                "DELETE FROM profile WHERE id=? AND user_id=? ",
                [id, user_id]
            );
            return res.status(200).json({
                status: 200,
                message: "Category Deleted secussfully",
                data: result,
                error: null
            });
        } catch (error) {
            next(error)
        }
    }
}