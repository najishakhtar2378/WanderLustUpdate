const express = require("express");
const router = express.Router();
const bookingsController = require("../controllers/bookings");
const { isLoggedIn } = require("../middileware");

router.post(
  "/:id",
  isLoggedIn,
  bookingsController.createBooking
);

router.get(
  "/my",
  isLoggedIn,
  bookingsController.myBookings
);
module.exports = router;
