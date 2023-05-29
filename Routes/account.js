const express = require("express");
const { verifyToken } = require("../middleware/varifyUser");
const { createAccount, getAccount, updateAccount, deleteAccount } = require("../Controller/account");
const router = express.Router()

router.post("/createAccount", verifyToken, createAccount);
router.get("/GetAccount/:user_id", verifyToken, getAccount);
router.put("/updateAccount/:id", verifyToken, updateAccount);
router.delete("/deleteAccount/:id", verifyToken, deleteAccount);

module.exports = router