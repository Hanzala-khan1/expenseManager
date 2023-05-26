const express = require("express");
const { getProfile, updateProfile, deleteProfile } = require("../Controller/profile");
const router = express.Router()


router.get("/getProfile/:user_id", getProfile);
router.put("/updateProfile/:id", updateProfile);
router.delete("/deleteProfile", deleteProfile);

module.exports = router