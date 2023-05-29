const express = require("express");
const { verifyToken } = require("../middleware/varifyUser");
const { createTransaction, getTransaction, updateTransaction, deleteTransaction } = require("../Controller/transaction");
const router = express.Router()

router.post("/createTransaction/:account_id", verifyToken, createTransaction);
router.get("/GetTransaction/:user_id", verifyToken, getTransaction);
router.put("/updateTransaction/:id", verifyToken, updateTransaction);
router.delete("/deleteTransaction/:id", verifyToken, deleteTransaction);

module.exports = router