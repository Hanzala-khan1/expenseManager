const express = require("express");
const { createCurrency, updateCurrency } = require("../Controller/currencyType");
const router = express.Router()

router.post("/createCurrency/:userId", createCurrency);
router.put("/updateCurrency/:id", updateCurrency);


module.exports = router