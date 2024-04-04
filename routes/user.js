const express=require("express");
const { model } = require("mongoose");
const User=require("../MODELS/user.js");
const {saveRedirectUrl, isLoggedIn}=require("../middelware");
const wrapAsyc=require("../utils/wrapAsyc.js");
const passport=require("passport");
const userController=require("../controller/users.js")
const router=express.Router();

//router for /signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsyc(userController.signup))


//router for /login
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
    //successRedirect: "/listing", // Redirect to dashboard on successful login
    failureRedirect: "/login", // Redirect back to login page on failure
    failureFlash: true // Enable flash messages for error handling
}
),wrapAsyc(userController.login));

router.get("/logout",userController.logout);

module.exports=router;