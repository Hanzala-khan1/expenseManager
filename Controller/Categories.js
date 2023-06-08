const moment = require("moment/moment")
const pool = require("../connection/mysql")

module.exports = {
    async createCategories(req, res, next) {
        const { categoryIconId, categoryName, isUserceatedCategory, type } = req.body
        try {
            const created_at = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
            const [result] = await pool.promise().query(
                "INSERT INTO morecategories (user_id,categoryIconId, categoryName, isUserceatedCategory, type,created_at) Values(?,?,?,?,?,?) ",
                [req.user.id, categoryIconId, categoryName, isUserceatedCategory, type, created_at])

            return res.status(200).json({
                status: 200,
                message: "secussfully created Category ",
                data: result,
                error: null
            });
        } catch (err) {
            next(err)
        }
    },
    async getCategories(req, res, next) {
        try {

            const user_id = req.params.user_id
            const [result] = await pool.promise().query(
                "SELECT * FROM morecategories WHERE user_id=? ",
                [user_id]
            );

            if (result.length == 0) {
                return res.status(200).json({
                    status: 200,
                    message: "No category to show ",
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
    async getCategoriesAll(req, res, next) {
        try {

            // const user_id = req.params.user_id
            const [result] = await pool.promise().query(
                "SELECT * FROM morecategories ",
                [user_id]
            );

            if (result.length == 0) {
                return res.status(200).json({
                    status: 200,
                    message: "No category to show ",
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

    async updateCategories(req, res, next) {
        const { categoryIconId, categoryName, isUserceatedCategory, type } = req.body
        try {
            let setValues = [];
            let query = "UPDATE morecategories SET ";
            if (req.body.categoryIconId) {
                query += "categoryIconId=?, ";
                setValues.push(req.body.categoryIconId);
            }
            if (req.body.categoryName) {
                query += "categoryName=?, ";
                setValues.push(req.body.categoryName);
            }
            if (req.body.isUserceatedCategory) {
                query += "isUserceatedCategory=?, ";
                setValues.push(req.body.isUserceatedCategory);
            }
            if (req.body.type) {
                query += "type=?, ";
                setValues.push(req.body.type);
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
                    message: "Category  has been updated.",
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
    async deletecategories(req, res, next) {
        try {

            const { id } = req.params
            const [result] = await pool.promise().query(
                "DELETE FROM morecategories WHERE id=? ",
                [id]
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