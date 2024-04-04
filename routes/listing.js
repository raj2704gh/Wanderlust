const express=require("express");
const wrapAsyc=require("../utils/wrapAsyc");
const Listing=require("../MODELS/listing");
const {isLoggedIn,isOwner,validateListing}=require("../middelware");
const router=express.Router();
// Configure multer to handle file uploads
const {storage}=require("../cloudConfig")
const multer = require('multer');
const upload = multer({ storage }); // Destination folder to store uploaded files

//controller
const listingController=require("../controller/listings");


// roter for "/"
router.route("/")
.get(wrapAsyc(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsyc(listingController.createListing))

//create new list
router.get("/new",isLoggedIn,listingController.renderNewForm)

//router for "/:id"
router.route("/:id")
.get(wrapAsyc(listingController.showListing))
.put(
    isLoggedIn,
    upload.single('listing[image]'),
    isOwner,
    validateListing,
    wrapAsyc(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsyc(listingController.destroy))

//Edit & update
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsyc(listingController.renderEditForm))


module.exports=router;