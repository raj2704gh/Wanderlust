const Listing=require("../MODELS/listing");


module.exports.index=async(req,res)=>{
    const allListing= await Listing.find();
    console.log("hii");
   res.render("listings/index.ejs",{allListing});
}
module.exports.renderNewForm=(req,res)=>{
    if(req.isAuthenticated()){
       res.render("listings/new.ejs"); 
    }
 }

 module.exports.showListing=async(req,res)=>{ 
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
       path:"reviews",
       populate:{
          path:"author",
       },
    }) .populate("owner");  
    console.log(listing);
     if(!listing){
       console.log("1");
       req.flash("error","your listing is not exist");
       //console.log("nnnn")
       res.redirect("/listing");
     }
     console.log("12");
     res.render("listings/show.ejs",{listing});   
    
    
 }

 module.exports.createListing=async(req,res,next)=>{   
   let url=req.file.path;
   let filename=req.file.filename;
   console.log(url,"..",filename)
    const lis =  new  Listing(req.body.listing);
    lis.owner=req.user._id;
    lis.image={url,filename};
   // console.log(`you are wrong ${req.user},next${lis.owner}`);
    await lis.save();
    req.flash("success","New listing created!!");
    res.redirect("/listing");  
 }

 module.exports.renderEditForm=async(req,res)=>{
   
   let {id}=req.params;
   const listing=await Listing.findById(id);
   if(!listing){
      res.send("hii1")
   const listing=await Listing.findById(id);
   res.redirect("/listing")
   }

   let orignalImageUrl=listing.image.url;
   
   orignalImageUrl=orignalImageUrl.replace("/upload","/upload/w_250")
   res.render("listings/edit.ejs",{listing,orignalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
  console.log(req.file);
 let {id}=req.params; 
let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true});

if(typeof req.file!=="undefined"){
let url=req.file.path;
let filename=req.file.filename;
listing.image={url,filename};
listing.save();
}
req.flash("success","Your listing updet successsful");
res.redirect(`/listing/${id}`)
}

module.exports.destroy=async(req,res)=>{
   console.log("ready");
   console.log(req.user.username);
   let {id}=req.params;
   let n=await Listing.findById(id).populate("owner");
   if(n.owner.username)
   await Listing.findByIdAndDelete(id);
   req.flash("success","Delete listing succeseefull");
   res.redirect("/listing");
}