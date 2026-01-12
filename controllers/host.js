const Listing = require("../models/listting");
const Booking = require("../models/booking");

module.exports.dashboard = async (req, res) => {
  // host ki listings
  const listings = await Listing.find({ owner: req.user._id });

  // un listings ki bookings
  const bookings = await Booking.find({
    listing: { $in: listings.map(l => l._id) }
  })
    .populate("listing")
    .populate("user");
    // ✅ Total earnings calculate
  let totalEarnings = 0;
  for (let b of bookings) {
    totalEarnings += Number(b.totalPrice || 0);
   
  }

  res.render("host/dashboard", { bookings , totalEarnings});
};
