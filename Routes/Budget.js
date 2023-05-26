const express = require("express");
const { createBudget, getBudget, updateBudget, deleteBudget } = require("../Controller/Budget");
const { verifyToken } = require("../middleware/varifyUser");
const router = express.Router()

router.post("/createBudget", verifyToken, createBudget);
router.get("/GetBudget/:user_id", verifyToken, getBudget);
router.put("/updateBudget/:id", verifyToken, updateBudget);
router.delete("/deleteBudget/:id", verifyToken, deleteBudget);

module.exports = router