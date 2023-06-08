const express = require("express");
const { getProfile, updateProfile, deleteProfile, getProfileAll } = require("../Controller/profile");
const router = express.Router()


router.get("/getProfile/:user_id", getProfile);
router.get("/getProfile", getProfileAll);
router.put("/updateProfile/:id", updateProfile);
router.delete("/deleteProfile", deleteProfile);

module.exports = router