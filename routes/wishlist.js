const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist');
const { isLoggedIn } = require('../middileware');
router.post("/:id", isLoggedIn, wishlistController.addToWishlist);
router.get("/", isLoggedIn, wishlistController.showWishlist);
module.exports = router;
