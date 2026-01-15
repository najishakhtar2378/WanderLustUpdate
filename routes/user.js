const express= require("express");
const router = express.Router({mergeParams:true});
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middileware.js");
const userController = require("../controllers/users.js")
const { isLoggedIn } = require("../middileware.js");


router.route("/signup")
.get( userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get( userController.renderLoginForm )
.post(saveRedirectUrl,
    passport.authenticate("local", {failureRedirect:'/login', failureFlash: true}), userController.login)

router.get("/logout", userController.logout)
router.get("/profile", isLoggedIn, userController.profile);
module.exports = router
