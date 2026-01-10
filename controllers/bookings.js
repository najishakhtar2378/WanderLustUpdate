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