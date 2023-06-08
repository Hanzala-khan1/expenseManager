const express = require("express");
const { createCategories, getCategories, updateCategories, deletecategories, getCategoriesAll } = require("../Controller/Categories");
const { verifyToken } = require("../middleware/varifyUser");
const router = express.Router()

router.post("/createCategory", verifyToken, createCategories);
router.get("/getCategory/:user_id", verifyToken, getCategories);
router.get("/getCategory", verifyToken, getCategoriesAll);
router.put("/updateCategory/:id", verifyToken, updateCategories);
router.delete("/deleteCategory/:id", verifyToken, deletecategories);

module.exports = router