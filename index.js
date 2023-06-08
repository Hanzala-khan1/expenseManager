const express = require("express")
const app = express()
const pool = require("./connection/mysql.js")
const bodyParser = require("body-parser")
const path = require("path")
const data = require("dotenv")
const cors = require("cors")
data.config()

/////////// middle ware ////////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(formidable());
app.options('*', cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(cors());


//////////// routes ////////////////
app.use("/user", require("./Routes/user.js"))
app.use("/budget", require("./Routes/Budget.js"))
app.use("/profile", require("./Routes/profile.js"))
app.use("/categories", require("./Routes/Categories.js"))
app.use("/currency", require("./Routes/currencyType.js"))
app.use("/account", require("./Routes/account.js"))
app.use("/transaction", require("./Routes/transaction.js"))

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

////////// sending front end route ////////////
const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "Frontend/expense manager Admin/build")));

app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "Frontend", "expense manager Admin", "build", "index.html"))
);


////////// server setup /////////////
app.listen(process.env.PORT, () => {
    console.log("connected")
})