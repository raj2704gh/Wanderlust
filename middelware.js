const Listing=require("./MODELS/listing");
const Review=require("./MODELS/rieview");
const {listingSchema,reviewSchema}=require("./schema");
const ExpressError=require("./utils/ExpressError");


module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
      console.log("a2");
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be  logged in to create listing");
        console.log("a3")
        res.redirect("/login");
     }else{
      next();
     }
      
   
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  //console.log("1");
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    console.log(res.locals.redirectUrl);
  }
    next();

}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  console.log(`helo ${res.locals.currUser}`)
  let listing=await Listing.findById(id);
  
   if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.fless("error","you not access this functionality");
      res.redirect(`/listing/${id}`);
   }
   next();
}


//function
module.exports.validateListing=(req,res,next)=>{
  const {error}=listingSchema.validate(req.body);
 // console.log(error);
  if(error){
     // console.log("newwwwwwwwwww");
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(404,errMsg);
  }else{
    //console.log("error")
      next();
  }
}


module.exports.validateReview=(req,res,next)=>{
  const{error}= reviewSchema.validate(req.body);
  if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(404,errMsg);

  }else{
      next();
  }
}



module.exports.isreviewAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  console.log(`helo ${res.locals.currUser}`)
  console.log(`helo ${req.user}`)
  console.log(`helo ${req.session}`)
  let review=await Review.findById(reviewId);
  
   if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","you not delete this review");
      return res.redirect(`/listing/${id}`);
   }
    next();
   
 
}