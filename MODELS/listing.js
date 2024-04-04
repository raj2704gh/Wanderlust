const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./rieview.js");

const listingSchema=new Schema({
    title:{
        type:String,
      // required:true
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
        
    },
    location:{
        type:String,
        //required:true
    },
    country:{
        type:String,
       // required:true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

//post middelware
listingSchema.post("findOneAndDelete",async(data)=>{
    await Review.deleteMany({_id:{$in:data.reviews}});
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;