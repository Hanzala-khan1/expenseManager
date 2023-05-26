const express = require("express")
const app = express()
const pool = require("./connection/mysql.js")
const bodyParser = require("body-parser")
const path = require("path")
const data = require("dotenv")
data.config()

/////////// middle ware ////////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


////////// sending front end route ////////////
app.get((req, res) =>
    res.send("Expense Manager Backend is running secussfully")
);

//////////// routes ////////////////
app.use("/user", require("./Routes/user.js"))
app.use("/budget", require("./Routes/Budget.js"))
app.use("/profile", require("./Routes/profile.js"))
app.use("/categories", require("./Routes/Categories.js"))
app.use("/currency", require("./Routes/currencyType.js"))

////////// image route //////////////
app.use('/profile/images', express.static("./upload/images/"));

///////// Error handling ////////////
app.use((error, req, res, next) => {
    const message = error.message || "invalid error";
    const status = error.status || 500;
    console.log({ "status": status })
    return res.status(status).json({
        success: false,
        message: message,
        status: status,
        error: error.stack,
    });
});

////////// server setup /////////////
app.listen(process.env.PORT, () => {
    console.log("connected")
})