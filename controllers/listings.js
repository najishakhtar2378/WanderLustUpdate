const Listing = require("../models/listting")
const Booking = require("../models/booking");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) =>{
    const allListings = await Listing.find({});
    
    res.render("./listings/index.ejs", {allListings})
}


module.exports.renderNewForm =(req, res) =>{
    
    res.render("./listings/new.ejs")
    
}

module.exports.showListing = async (req, res) =>{
    let   {id} = req.params;
   const  listing = await Listing.findById(id).populate({path:"reviews",
      populate:{
          path:"author"
      },
  }
   ).populate("owner");
  
   if(!listing){
      req.flash("error", "Listing you requested for does not exist!")
      res.redirect("/listings")
   }
   res.render("./listings/show.ejs" , {listing})
  
  };

  module.exports.createListing = async(req,res, next) =>{

  let response =  await geocodingClient.forwardGeocode({
      query:  req.body.listing.location,
      limit: 1
    })
      .send()
      


    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}

newListing.geometry = response.body.features[0].geometry;

   let savedListing = await newListing.save();
   console.log(savedListing)
req.flash("success", "New Listing Created!")
res.redirect("/listings")


//let {title, description, image, price, country, location}= req.body;

};

module.exports.editListing = async (req, res)=>{
    let   {id} = req.params;
 const  listing = await Listing.findById(id);
 if(!listing){
    req.flash("error", "Listing you requested for does not exist!")
    res.redirect("/listings")
 }

 let orignalImageUrl = listing.image.url;
   orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/h_300,w_250")

 res.render("./listings/edit.ejs", {listing, orignalImageUrl})

}


module.exports.renderUpdateForm=async(req,res) =>{
    
    let {id } = req.params;
    
   
  let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
if( typeof req.file !== "undefined"){

  let url = req.file.path;
    let filename = req.file.filename;

    listing.image = {url, filename};
    await listing.save();
}
   req.flash("success", "Updated Listing!")
   res.redirect(`/listings/${id}`)
}

module.exports.renderDelete = async(req,res)=>{
    let {id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success", "Deleted Listing!")
   res.redirect("/listings")
}

module.exports.showListing = async (req, res) => {
  const {id}= req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" }
    });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // 🔑 ye line decide karegi book form dikhe ya nahi
  let alreadyBooked = false;
  let  alreadyWishlisted = false;

  if (req.user) {
    const booking = await Booking.findOne({
      listing: id,
      user: req.user._id
    });
    alreadyBooked = !!booking;
  }
     if (req.user) {
    alreadyWishlisted = req.user.wishlist.includes(listing._id);
  }

  // 👇 sirf listing page render hoga
  res.render("listings/show", { listing, alreadyBooked,alreadyWishlisted});
};
//calculate totalPrice 
module.exports.hostBookings = async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id });

  const bookings = await Booking.find({
    listing: { $in: listings.map(l => l._id) },
    status: "active"
  }).populate("listing");

  res.render("listings/hostBookings", { bookings });
};
