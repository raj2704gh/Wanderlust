const express=require("express");
const wrapAsyc=require("../utils/wrapAsyc");
const {validateReview,isLoggedIn,isreviewAuthor}=require("../middelware");
const Review=require("../MODELS/rieview");
const Listing=require("../MODELS/listing");
const router=express.Router({mergeParams:true});
const  reviewController=require("../controller/reviews")

//Reviews
//Post Rout
router.post("/",isLoggedIn,validateReview,wrapAsyc(reviewController.createReview))

//Delete review rout
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsyc(reviewController.destroyReview))


module.exports=router;

