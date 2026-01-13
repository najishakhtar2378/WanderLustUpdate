const User = require("../models/user");
module.exports.addToWishlist = async (req, res) => {
  const {id} =req.params;
   const user=await User.findById(req.user._id);

    // const listingId=req.params.id;
  const index = user.wishlist.indexOf(id);
    if(index===-1){
      user.wishlist.push(id);
      req.flash("success","Added to wishlist ❤️");
    }else{
      user.wishlist.splice(index,1);
      req.flash("success","Removed from wishlist 💔");
    };
    await user.save();
  res.redirect(`/listings/${id}`);
}
module.exports.showWishlist=async(req,res)=>{
  const user =await User.findById(req.user._id)
  .populate("wishlist");
  res.render("wishlist/index",{listings:user.wishlist});
};