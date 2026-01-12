const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middileware");
const hostController = require("../controllers/host");

router.get("/dashboard", isLoggedIn, hostController.dashboard);

module.exports = router;