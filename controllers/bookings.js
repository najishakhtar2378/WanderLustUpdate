const Booking = require("../models/booking");
const Listing = require("../models/listting");

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

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    checkIn,
    checkOut,
  });

  await booking.save();
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

  req.flash("success", "Booking cancelled successfully");
  res.redirect("/bookings/my");
};
