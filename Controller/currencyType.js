const pool = require("../connection/mysql")
const moment = require("moment")

module.exports = {
    async createCurrency(req, res, next) {
        const { code, decimalDigits, name, name_plural, rounding, symbol, symbol_native } = req.body
        try {
            const created_at = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
            const [result] = await pool.promise().query(
                "INSERT INTO currencytype ( code, decimalDigits, name, name_plural, rounding, symbol, symbol_native,created_at) Values(?,?,?,?,?,?,?,?) ",
                [code, decimalDigits, name, name_plural, rounding, symbol, symbol_native, created_at])

            if (result.affectedRows > 0) {
                const { userId } = req.params
                const [resultProfile] = await pool.promise().query(
                    "INSERT INTO profile ( user_id, currencyTypeId,created_at) Values(?,?,?) ",
                    [userId, result.insertId, created_at])
            }
            return res.status(200).json({
                status: 200,
                message: "secussfully created Currency ",
                data: result,
                error: null
            });
        } catch (err) {
            next(err)
        }
    },
    async getCurrency(req, res, next) {

    },

    async updateCurrency(req, res, next) {
        const { code, decimalDigits, name, name_plural, rounding, symbol, symbol_native } = req.body
        try {
            let setValues = [];
            let query = "UPDATE currencytype SET ";
            if (req.body.code) {
                query += "code=?, ";
                setValues.push(req.body.code);
            }
            if (req.body.decimalDigits) {
                query += "decimalDigits=?, ";
                setValues.push(req.body.decimalDigits);
            }
            if (req.body.name) {
                query += "name=?, ";
                setValues.push(req.body.name);
            }
            if (req.body.name_plural) {
                query += "name_plural=?, ";
                setValues.push(req.body.name_plural);
            }
            if (req.body.rounding) {
                query += "rounding=?, ";
                setValues.push(req.body.rounding);
            }
            if (req.body.symbol) {
                query += "symbol=?, ";
                setValues.push(req.body.symbol);
            }
            if (req.body.symbol_native) {
                query += "symbol_native=?, ";
                setValues.push(req.body.symbol_native);
            }
            if (setValues.length === 0) {
                return res.status(400).json({ error: "Please send at least one field to update!" });
            }
            query += "updated_at=? WHERE Id=? ";
            setValues.push(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
            setValues.push(req.params.id);
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
    async deleteCurrency(req, res, next) {

    }
}