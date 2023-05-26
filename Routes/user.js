const express = require("express");
const { loginUser, createUser, DeleteUser, varifyOTP, updateUser, getAllUser, getOneUser } = require("../Controller/user");
const { upload } = require("../middleware/multer");
const router = express.Router()

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.post("/VarifyUser", varifyOTP);
router.put("/updateUser/:id", upload.single("file"), updateUser);
router.get("/getAllUser", getAllUser);
router.delete("/deleteUser", DeleteUser);
router.get("/getOneuser/:id", getOneUser);

module.exports = router