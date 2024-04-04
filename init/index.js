const mongoose=require("mongoose");

const Listing=require("../MODELS/listing.js");
const initData=require("./data.js");




main()
.then(()=>{
    console.log("connection sucssesfuol");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDB =async ()=>{
    console.log("hiiiii");
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"65f838d05285dae5614ecd24"}));
    console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();