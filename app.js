if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
//console.log(process.env.SECREAT);


const express=require("express");
const app=express();
const Listing=require("./MODELS/listing");
const mongoose=require("mongoose");
var methodOverride = require('method-override');
const flash = require('connect-flash');
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema")
const ejsMate = require('ejs-mate');
const Review=require("./MODELS/rieview");
const listingsRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const ajaxRouter=require("./routes/ajax.js")
const session = require('express-session');
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require("./MODELS/user.js");

const path=require("path");
const { nextTick } = require("process");

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"VIEWS"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/PUBLIC")));

main()
.then(()=>{
    console.log("connection sucssesfuol");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const sessionOption={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
  }
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(async(req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    res.locals.listing=await Listing.find();
    next();
})


console.log("1");
app.use("/listing/ajax",ajaxRouter)
console.log("2");
app.use("/listing",listingsRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);



//Error handling
app.all("*",(req,res,next)=>{

    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{

    let {statusCode=500,message="somthing went wrong"}=err;
    //console.log(message);
    res.status(statusCode).render("error.ejs",{err})
})

app.get("/",(req,res)=>{
    res.send("i am root");
})
app.listen(3000,()=>{
    console.log("connection build");
    
})