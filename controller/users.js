const User=require("../MODELS/user")

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        let newUser= new User({username,email});
        let registerUser=await User.register(newUser,password); 
        req.login(registerUser,(err)=>{
            if(err){
                next(err);
            }else{
              req.flash("success","Welcom to Wanderlust");
              res.redirect("/listing");
            }
        })
        console.log(req.user);
    }catch(e){
        req.flash("error","your detail is wrong");
         res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm=(req,res)=>{
    console.log("byy");
    res.render("users/login");
}

module.exports.login=async(req,res)=>{
        req.flash("success","Welcome back to wanderlust");
        console.log(res.locals.redirectUrl);
        let redirectUrl=res.locals.redirectUrl || "/listing";
        return res.redirect(redirectUrl);
        
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success","you are log out");
            res.redirect("/listing");
        }
    })
}