const pool = require("../connection/mysql");
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const moment = require("moment/moment");
const { APP_host } = require("../middleware/dataconfig");
const accountSid = 'AC8f4d65ec42300a877746f5deded4be70';
const authToken = 'fc2f9a80ece0f70c22154cb6917ee114';
const client = twilio(accountSid, authToken);

module.exports = {
    async createUser(req, res, next) {
        try {
            const otpCode = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            const fromPhoneNumber = '+13156182711';
            const toPhoneNumber = req.body.phone;

            const OtpVArification = await client.messages.create({
                body: `Your OTP code is: ${otpCode}`,
                from: fromPhoneNumber,
                to: toPhoneNumber
            })
            const [user] = await pool.promise().query(
                "INSERT INTO USER (phone,created_at) VALUES (?,?)",
                [req.body.phone, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")]
            )
            const OTP = await pool.promise().query(
                "INSERT INTO OtpVarification (user_id,otp) VALUES (?,?)",
                [user.insertId, otpCode]
            )

            return res.status(200).json({
                status: 200,
                message: "OTP is sent",
                data: {
                    user_id: user.insertId,
                },
                error: null
            });
        } catch (err) {
            next(err)
        }
    },
    async loginUser(req, res, next) {
        try {
            const [user] = await pool.promise().query(
                "select phone,id from user user where phone=?",
                [req.body.phone]
            )
            if (!user) {
                return res.status(400).json({
                    status: 200,
                    message: "user does not exit ",
                    data: {},
                    error: null
                });
            }
            const otpCode = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            const fromPhoneNumber = '+13156182711';
            const toPhoneNumber = req.body.phone;

            const OtpVArification = await client.messages.create({
                body: `Your OTP code is: ${otpCode}`,
                from: fromPhoneNumber,
                to: toPhoneNumber
            })

            return res.status(200).json({
                status: 200,
                message: OtpVArification.sid,
                data: {
                    user_id: user.id
                },
                error: null
            });
        } catch (err) {
            next(err)
        }
    },

    async varifyOTP(req, res, next) {
        try {
            const [userVarification] = await pool.promise().query(
                "select * from OtpVarification where user_id=? order by id desc",
                [req.body.user_id]
            )
            if (!userVarification) {
                return res.status(400).json({
                    status: 200,
                    message: "Otp does not exit send again",
                    data: [],
                    error: null
                });
            }
            const validotp = userVarification[0].otp

            if (validotp === req.body.otp) {
                const token = jwt.sign({ id: userVarification[0].user_id }, process.env.SECRET_KEY)
                return res.status(400).json({
                    status: 200,
                    message: "invalid otp",
                    data: {
                        user_id: userVarification,
                        token: token
                    },
                    error: null
                });
            } else {
                return res.status(400).json({
                    status: 200,
                    message: "invalid otp",
                    data: [],
                    error: null
                });
            }
        } catch (err) {
            next(err)
        }
    },
    ////////////////////////////////////////////////////
    async DeleteUser(req, res, next) {
        const { id } = req.params
        try {
            const user = await pool.promise().query(
                "Delete from user where id=?",
                [id]
            )
            return res.status(200).json({
                status: 200,
                message: "User deleted Secessfully",
                data: [],
                error: null
            });
        } catch (err) {

        }
    },
    ////////////////////////////////////////////////////
    async updateUser(req, res, next) {
        const { name, amount, icon_title } = req.body
        try {
            let setValues = [];
            let query = "UPDATE user SET ";
            if (req.body.name) {
                query += "name=?, ";
                setValues.push(req.body.name);
            }
            if (req.body.amount) {
                query += "amount=?, ";
                setValues.push(req.body.amount);
            }
            if (req.body.icon_title) {
                query += "icon_title=?, ";
                setValues.push(req.body.icon_title);
            }
            if (req.file.filename) {
                query += "image=?, ";
                setValues.push(`${APP_host}profile/images/${req.file.filename}`);
            }
            if (setValues.length === 0) {
                return res.status(400).json({ error: "Please send at least one field to update!" });
            }
            query += "updated_at=? WHERE Id=?";
            setValues.push(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
            setValues.push(req.params.id);
            const [rows] = await pool.promise().query(query, setValues);
            if (rows.affectedRows > 0) {
                return res.status(200).json({
                    status: 200,
                    message: "User has been updated",
                    data: req.file,
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

        } catch (err) {
            next(err)
        }
    },
    ////////////////////////////////////////////////////
    async getAllUser(req, res, next) {
        try {
            const [user] = await pool.promise().query(
                "select * from user user",
                [req.body.phone]
            )
            return res.status(403).json({
                status: 403,
                message: "list of all User",
                data: user,
                error: null
            });

        } catch (err) {

        }
    },
    ////////////////////////////////////////////////////
    async getOneUser(req, res, next) {
        try {
            const [user] = await pool.promise().query(
                "select * from user user where id=?",
                [req.params.id]
            )
            return res.status(403).json({
                status: 403,
                message: "list of all User",
                data: user,
                error: null
            });

        } catch (err) {

        }
    }
}