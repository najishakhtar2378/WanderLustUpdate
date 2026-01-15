const Booking = require("../models/booking");
const Listing = require("../models/listting");
const Notification = require("../models/notification");

module.exports.createBooking = async (req, res) => {
  const { checkIn, checkOut} = req.body;
  if(!checkIn || !checkOut){
    req.flash("error", "Check-In and Check-Out dates are required");
    return res.redirect("/listings");
  }
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
   const nights =
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

  if (nights <= 0) {
    req.flash("error", "Invalid dates");
    return res.redirect(`/listings/${listing._id}`);
  }

  const totalPrice = nights * listing.price;

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    checkIn,
    checkOut,
    totalPrice
  });

  await booking.save();
  /* 🔔 NOTIFICATION */
  await Notification.create({
    user: req.user._id,
    message: "Your booking has been confirmed!",
    link: `/bookings/my`
  });
  req.flash("success", "Booking successful!");
  res.redirect("/bookings/my");
};

module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing");

  res.render("bookings/my", { bookings });
};
module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  // Safety check
  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/bookings/my");
  }

  // Authorization check
  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You are not allowed to cancel this booking");
    return res.redirect("/bookings/my");
  }

  await Booking.findByIdAndDelete(id);
  //canceled bokking notfication
  await Notification.create({
    user: req.user._id,
    message: "Your booking has been cancelled",
    link: "/bookings/my"
  });

  req.flash("success", "Booking cancelled successfully");
  res.redirect("/bookings/my");
};
