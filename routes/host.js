const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middileware");
const hostController = require("../controllers/host");
const catchAsync = require("../utils/catchAsync");

router.get("/dashboard", isLoggedIn, hostController.dashboard);
router.get("/host/bookings", isLoggedIn, catchAsync(hostController.hostBookings));

module.exports = router;
